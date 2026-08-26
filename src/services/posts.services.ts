import { pool } from "../config/database.ts";
import { redis } from "../config/redis.ts";
import type { CreatePostsInput, Post } from "../models/post.model";
export const getPosts = async (): Promise<Array<Post>> => {
	const cacheKey = "posts:list";
	try {
		const cached = await redis.get(cacheKey);
		if (cached) {
			return JSON.parse(cached);
		}
	} catch (err) {
		console.warn("Redis get error (list):", err);
	}
	const result = await pool.query(
		`SELECT posts.id as id, posts.timestamp as timestamp, 
              users.name as author, posts.likes as likes, 
              posts.title as title, posts.content as content 
       FROM posts 
       JOIN users ON users.id = posts.user_id
       ORDER BY posts.timestamp DESC`,
	);

	const data = result.rows;
	try {
		await redis.setex(cacheKey, 30, JSON.stringify(data));
	} catch (err) {
		console.warn("Redis set error (list):", err);
	}
	return data;
};
export const getPostById = async (id: number): Promise<Post | null> => {
	const cacheKey = `post:${id}`;
	try {
		const cached = await redis.get(cacheKey);
		if (cached) {
			return JSON.parse(cached);
		}
	} catch (err) {
		console.warn("Redis get error (post individual):", err);
	}

	const result = await pool.query(
		`SELECT users.name as author, posts.id as id, posts.likes as likes, 
              posts.title as title, posts.content as content, 
              posts.timestamp as timestamp
       FROM posts
       JOIN users ON users.id = posts.user_id
       WHERE posts.id = $1`,
		[id],
	);

	if (result.rowCount === 0) {
		return null;
	}
	const response: Post = result.rows[0];
	try {
		await redis.setex(cacheKey, 60, JSON.stringify(response));
	} catch (err) {
		console.warn("Redis set error (post individual):", err);
	}
	return response;
};
export const likePostById = async (id: number): Promise<number | null> => {
	const result = await pool.query(
		"UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING likes",
		[id],
	);

	if (result.rowCount === 0) {
		return null;
	}

	const newLikes = result.rows[0].likes;

	try {
		await redis.del(`post:${id}`, "posts:list");
	} catch (err) {
		console.warn("Redis del error (like invalidation):", err);
	}

	return newLikes;
};

export const createNewPost = async (post: CreatePostsInput): Promise<Post> => {
	const result = await pool.query(
		`INSERT INTO posts (title, content, user_id)
       VALUES ($1, $2, $3)
       RETURNING id, title, content, likes, timestamp`,
		[post.title, post.content, post.user_id],
	);
	try {
		await redis.del("posts:list");
	} catch (err) {
		console.warn("Redis del error (list when creating):", err);
	}
	return result.rows[0];
};
