import { generateStreamToken } from "../config/stream.js"

export const getStreamToken = async (req, res)=>{
  try{
    const token = generateStreamToken(req.user._id);

    return res.status(200).json({token});
  }catch(err){
    console.log("Error in getStreamToken controller:", err);
    res.status(500).json({message: "Internal Server Error in getStreamToken"});
  }
}