import mongoose, { Document, Schema, model } from "mongoose";

export interface IApplication {
	name: string;
	dob: string;
	city: string;
	resume: object[];
	additional_doc: object[];
	phone_no: string;
	description: string;
}

interface DApplication extends IApplication, Document {}

const applicationSchema = new Schema<DApplication>({
	name: { type: String, required: true },
	dob: { type: String, required: true },
	city: { type: String, required: true },
	resume: { type: [mongoose.Schema.Types.Mixed], required: true },
	additional_doc: { type: [mongoose.Schema.Types.Mixed], required: true },
	phone_no: { type: String, required: true },
	description: { type: String },
});

export default model<DApplication>("application", applicationSchema);
