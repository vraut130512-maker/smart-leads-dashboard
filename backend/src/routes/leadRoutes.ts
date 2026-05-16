import { Router } from "express";
import {
  getLeads, getLeadById, createLead, updateLead, deleteLead,
  exportLeadsCSV, leadValidation,
} from "../controllers/leadController";
import { protect, restrictTo } from "../middleware/authMiddleware";

const router = Router();

router.use(protect); // All lead routes require auth

router.get("/export/csv", exportLeadsCSV);
router.get("/", getLeads);
router.get("/:id", getLeadById);
router.post("/", leadValidation, createLead);
router.put("/:id", leadValidation, updateLead);
router.delete("/:id", restrictTo("admin"), deleteLead); // Only admin can delete

export default router;
