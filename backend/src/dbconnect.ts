import mongoose, { ConnectOptions } from "mongoose";
import { config } from "dotenv";
config();

const dbUrl: string = process.env.DB_CONNECT_STRING as string;

let options: ConnectOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
} as ConnectOptions;

async function connectDb() {
	try {
		await mongoose.connect(dbUrl, options);
		console.log("DB connection is successfull.");
	} catch (error) {
		console.log("Database connection failed, Error: " + error);
		process.exit(1);
	}
}

export default connectDb;
