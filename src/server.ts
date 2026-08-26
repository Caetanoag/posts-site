import { app } from "./app";

const PORT = process.env.APP_PORT || 6767;
app.listen(PORT, () => {
	console.log(`Server running at port ${PORT}`);
});
