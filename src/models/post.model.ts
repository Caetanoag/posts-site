export interface Post {
	author: string;
	likes: number;
	title: string;
	content: string;
	timestamp: Date;
	user_id: number;
	id: number;
}
export interface CreatePostsInput {
	title: string;
	content: string;
	user_id: number;
}
