import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../Controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.get('/token', protectedRoute, getStreamToken);

export default chatRouter;