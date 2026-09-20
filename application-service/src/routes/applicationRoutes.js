import { Router } from "express";
import { apply, candidateApplications, recruiterApplications, updateStatus, withdraw } from "../controllers/applicationController.js";
const router = Router();
router.post("/", apply);
router.get("/me", candidateApplications);
router.get("/recruiter", recruiterApplications);
router.patch("/:id/status", updateStatus);
router.patch("/:id/withdraw", withdraw);
export default router;
