import express from 'express';



// local imports
import { login, logout, onboard, signup } from '../Controllers/authController.js';
import { protectedRoute } from '../middleware/auth.middleware.js';


const authRouter = express.Router();

authRouter.post("/signup",signup)
authRouter.post("/login",login)
authRouter.post("/logout",logout)


authRouter.post("/onboarding",protectedRoute, onboard);

// check if user is logged in and get user data
authRouter.get("/me",protectedRoute, (req,res)=>{
  return res.status(200).json({success:true, user: req.user});
});


export default authRouter;