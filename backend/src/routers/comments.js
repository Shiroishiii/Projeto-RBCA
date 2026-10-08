import { Router } from "express";

import {
    createComment,
    getComments,
    getCommentsByMaterial,
    getCommentById,
    updateComment,
    deleteComment
} from "../controllers/comments.js";

import {
    authenticate,
    requireRole
} from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, createComment);

router.get("/", getComments);

router.get("/material/:materialId", getCommentsByMaterial);

router.get("/:id", getCommentById);

router.put("/:id", authenticate, updateComment);

router.delete("/:id", authenticate, deleteComment);

export default router;