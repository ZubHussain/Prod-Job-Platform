import { Router } from "express";
import multer from "multer";
import { extractSkills, matchResumeToJob, careerFields } from "../controllers/aiController.js";
const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 6 * 1024 * 1024 } });
router.post("/extract-skills", upload.single("resume"), extractSkills);
router.post("/match", matchResumeToJob);
router.post("/career-fields", careerFields);
export default router;
