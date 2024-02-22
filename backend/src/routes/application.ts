import { Router, Request, Response } from "express";
import Application, { IApplication } from "../models/Application";
import multer from "multer";
import fs from "fs";
import path, { dirname } from "path";
import mongoose from "mongoose";

const router = Router();

interface IApplicationView extends IApplication {
	_id: string;
	resume: [{ name: string; type: string; sysfilename: string }];
	additional_doc: [{ name: string; type: string; sysfilename: string }];
}

// if directory not exists then create
const PUBLIC = "public";
const UPLOADS = "uploads";

if (!fs.existsSync(`${PUBLIC}/${UPLOADS}`))
	fs.mkdirSync(`${PUBLIC}/${UPLOADS}`);

//multer Config
const fileUploadStorage = multer.diskStorage({
	destination: (req, file, callBack) => {
		callBack(null, `${PUBLIC}/${UPLOADS}`);
	},
	filename: (req, file, callBack) => {
		callBack(
			null,
			`${new Date().getTime()}_${file.originalname.replace(/ |:/g, "_")}`,
		);
	},
});
const fileUpload = multer({ storage: fileUploadStorage });

// Add New Job Application
router.post(
	"/application",
	fileUpload.fields([{ name: "_files" }, { name: "_file", maxCount: 1 }]),
	async (req: Request, res: Response) => {
		try {
			// console.log(req.files);
			// console.log(req.body);
			const files: any = req.files;
			const body = {
				...req.body,
				resume: files["_file"],
				additional_doc: files["_files"],
			};
			const newApplication = new Application(body);
			// console.log(newApplication);
			const application = await newApplication.save();
			res.json(application as IApplication);
		} catch (error) {
			console.log(error);
			res.status(400).json({
				error: "Failed to submit the job application.",
			});
		}
	},
);

// Get All Job Applications
router.get(
	"/applications",
	async (req: Request, res: Response): Promise<void> => {
		try {
			const application = await Application.find({}).exec();
			const newApplications = application.map((a: any) => {
				let newResume = a.resume.map((f: any) => {
					return {
						name: f.originalname,
						type: f.mimetype,
						sysfilename: f.filename,
					};
				});
				let newAdditionalDoc = a.additional_doc.map((f: any) => {
					return {
						name: f.originalname,
						type: f.mimetype,
						sysfilename: f.filename,
					};
				});
				return {
					_id: a._id,
					name: a.name,
					dob: a.dob,
					city: a.city,
					phone_no: a.phone_no,
					description: a.description,
					resume: newResume,
					additional_doc: newAdditionalDoc,
				};
			});
			res.status(200).json(newApplications as IApplicationView[]);
		} catch (error) {
			console.log(error);
			res.status(400).json({
				error: "Failed to retrive job applications.",
			});
		}
	},
);

// Edit Specific Job Application
router.put(
	"/application/edit",
	fileUpload.fields([{ name: "_files" }, { name: "_file", maxCount: 1 }]),
	async (req: Request, res: Response) => {
		try {
			const { _id, ...rest } = req.body;
			const _filter = {
				_id: new mongoose.Types.ObjectId(_id),
			};
			const files: any = req.files;
			const body = {
				...rest,
				resume: files["_file"],
				additional_doc: files["_files"],
			};

			console.log(_filter, body);
			await Application.updateOne(_filter, { $set: body });
			console.log("After Update");
			res.status(200).send("Edited Successfully!!");
		} catch (error) {
			console.log(error);
			res.status(400).json({ error: "Failed to edit job application." });
		}
	},
);

router.get("/applicant/files/:filename", async (req, res) => {
	try {
		const filename = req.params.filename;

		console.log(path.sep);
		const pathSplitted = __dirname.split(path.sep);
		const newPathSplitted = pathSplitted.slice(0, -2);
		const newDirPath = newPathSplitted.join(path.sep);
		const filePath = path.join(newDirPath, PUBLIC, UPLOADS, filename);

		// Read the file content
		fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
			if (err) {
				res.status(500).send("File read related issue.");
			} else {
				console.log(filePath);
				res.setHeader(
					"Content-Disposition",
					`attachment; filename=${filename}`,
				);
				res.setHeader("Content-Type", "application/octet-stream");
				// res.setHeader("responseType", "blob");
				res.status(200).send(data);
			}
		});
	} catch (error) {
		console.error("Error reading file:", error);
		res.status(500).send("Internal Server Error");
	}
});

export default router;
