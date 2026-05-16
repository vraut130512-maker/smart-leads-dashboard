import { Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { Parser } from "json2csv";
import Lead from "../models/Lead";
import { AuthRequest, LeadStatus, LeadSource } from "../types";
import mongoose from "mongoose";

export const leadValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("status").isIn(["New", "Contacted", "Qualified", "Lost"]).withMessage("Invalid status"),
  body("source").isIn(["Website", "Instagram", "Referral"]).withMessage("Invalid source"),
];

export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = "latest",
      page = 1,
      limit = 10,
    } = req.query as {
      status?: LeadStatus;
      source?: LeadSource;
      search?: string;
      sort?: "latest" | "oldest";
      page?: number;
      limit?: number;
    };

    // Build filter object
    const filter: mongoose.FilterQuery<typeof Lead> = {};

    // Admin sees all leads, sales sees only their own
    if (req.user?.role === "sales") {
      filter.createdBy = req.user.id;
    }

    if (status) filter.status = status;
    if (source) filter.source = source;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const sortOrder = sort === "oldest" ? 1 : -1;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate("createdBy", "name email")
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate("createdBy", "name email");
    if (!lead) {
      res.status(404).json({ success: false, error: "Lead not found" });
      return;
    }

    // Sales user can only see their own leads
    if (req.user?.role === "sales" && lead.createdBy.toString() !== req.user.id) {
      res.status(403).json({ success: false, error: "Access denied" });
      return;
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const lead = await Lead.create({ ...req.body, createdBy: req.user?.id });
    res.status(201).json({ success: true, message: "Lead created successfully", data: lead });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, error: "Lead not found" });
      return;
    }

    if (req.user?.role === "sales" && lead.createdBy.toString() !== req.user.id) {
      res.status(403).json({ success: false, error: "Access denied" });
      return;
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: "Lead updated successfully", data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, error: "Lead not found" });
      return;
    }

    if (req.user?.role === "sales" && lead.createdBy.toString() !== req.user.id) {
      res.status(403).json({ success: false, error: "Access denied" });
      return;
    }

    await lead.deleteOne();
    res.status(200).json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const exportLeadsCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filter: mongoose.FilterQuery<typeof Lead> = {};
    if (req.user?.role === "sales") {
      filter.createdBy = req.user.id;
    }

    const leads = await Lead.find(filter).populate("createdBy", "name email").lean();

    const fields = ["name", "email", "status", "source", "createdAt"];
    const parser = new Parser({ fields });
    const csv = parser.parse(leads);

    res.header("Content-Type", "text/csv");
    res.header("Content-Disposition", "attachment; filename=leads.csv");
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
