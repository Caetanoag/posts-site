import type { Request, Response } from "express";
import type { CreatePostsInput, Post } from "../models/post.model";
import * as postService from "../services/posts.services";

export const getPosts = async (req: Request, res: Response) => {
	try {
		const posts = await postService.getPosts();
		if (posts === null) {
			return res.status(404).json({ error: "No posts found" });
		}
		return res.json(posts);
	} catch (err) {
		console.error("Error fetching posts", err);
		return res.status(500).json({ error: "Error fetching posts" });
	}
};
export const getPostById = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id as string, 10);
	if (!Number.isFinite(id)) {
		return res.status(400).json({ error: "Invalid ID" });
	}
	try {
		const post = await postService.getPostById(id);
		if (post === null) {
			return res.status(404).json({ error: "Post not found" });
		}
		return res.json(post);
	} catch (err) {
		console.error("Error fetching post:", err);
		return res.status(500).json({ error: "Error fetching post" });
	}
};
export const likePostById = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id as string, 10);
	if (!Number.isFinite(id)) {
		return res.status(400).json({ error: "Invalid ID" });
	}

	try {
		const newLikes = await postService.likePostById(id);
		if (newLikes === null) {
			return res.status(404).json({ error: "Post not found" });
		}
		return res.json({ likes: newLikes });
	} catch (err) {
		console.error("Error liking post:", err);
		return res.status(500).json({ error: "Failed to like post" });
	}
};
export const createNewPost = async (req: Request, res: Response) => {
	const { title, content, user_id } = req.body as CreatePostsInput;

	if (!title?.trim() || !content?.trim() || !user_id) {
		return res
			.status(400)
			.json({ error: "Content, Title and User_id must exist" });
	}
	try {
		const post: Post = await postService.createNewPost({
			title: title.trim(),
			content: content.trim(),
			user_id,
		});
		return res.status(201).json(post);
	} catch (err) {
		console.error("Failed to create post:", err);
		return res.status(500).json({ error: "Failed to create post" });
	}
};
