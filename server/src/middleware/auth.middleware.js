import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const protectedRoute = async (req,res,next)=>{
  try{
    const token = req.cookies.jwt;
    if(!token){
      return res.status(401).json({success:false, message: "Unauthorized. No token provided."});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(!decoded){
      return res.status(401).json({success:false, message: "Unauthorized. Invalid token."});
    }
    const user = await User.findById(decoded.userId).select('-password');
    if(!user){
      return res.status(401).json({success:false, message: "Unauthorized. User not found."});
    }

    req.user = user; // attach user to request object
    next();
  }catch(err){
    console.error("Error in protected route middleware:", err);
    return res.status(500).json({success:false, message: "Server error"});
  }
}
