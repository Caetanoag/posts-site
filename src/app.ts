import type { Request, Response, NextFunction } from "express";
import express from "express";
import postsRoutes from "./routes/posts.routes";
import userRoutes from "./routes/user.routes";
export const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
	if (req.method === "OPTIONS") {
		return res.sendStatus(204);
	}
	next();
});

app.use("/posts", postsRoutes);
app.use("/users", userRoutes);
export default app;
