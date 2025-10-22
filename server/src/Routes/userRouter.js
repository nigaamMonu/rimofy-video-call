import express from "express";


import { protectedRoute } from "../middleware/auth.middleware.js";
import { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutgoingFriendRequests } from "../Controllers/userController.js"; 


const userRouter = express.Router();

userRouter.use(protectedRoute); // Apply the middleware to all routes in this router

userRouter.get("/",getRecommendedUsers);
userRouter.get("/friends",getMyFriends);

userRouter.post('/friend-request/:id', sendFriendRequest);
userRouter.put('/friend-request/:id/accept', acceptFriendRequest);
userRouter.get('/friend-requests', getFriendRequests);
userRouter.get('/outgoing-friend-requests', getOutgoingFriendRequests);



export default userRouter;