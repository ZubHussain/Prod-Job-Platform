import { Router } from "express";
import multer from "multer";
import { getMe, updateMe, uploadResume, getPublicProfile } from "../controllers/profileController.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.mimetype))
});
router.get("/me", getMe);
router.put("/me", updateMe);
router.post("/me/resume", upload.single("resume"), uploadResume);
router.get("/:userId", getPublicProfile);
export default router;
