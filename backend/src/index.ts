import { createServer } from "http";
import express, { Application, Request, Response } from "express";
import path from "path";
import cors from "cors";
import Controller from "./routes/application";
import connectDb from "./dbconnect";
import { config } from "dotenv";
config();

//db connection
connectDb();

// setup an express app
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("./public")));
app.use(cors());

// api routes
app.get("/", (req: Request, res: Response) => {
	res.status(200).send("Hello Express!");
});

app.use("/job", Controller);

// create a http server
const server = createServer(app);

const PORT = process.env.PORT;
server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`);
});
