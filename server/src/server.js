import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import path from 'path';


// local imports
import authRouter from './Routes/authRouter.js';
import userRouter from './Routes/userRouter.js';
import chatRouter from './Routes/chatRouter.js';
import connectDB from './config/mongodb.js';



dotenv.config(); 


const app = express();

const originList = ['http://localhost:5173'];
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: originList,
  credentials: true, // Allow cookies to be sent
}))




app.use('/api/auth',authRouter);
app.use('/api/users',userRouter);
app.use('/api/chat',chatRouter);

console.log("__dirname =", __dirname);


if (process.env.NODE_ENV === "production") {

  const distPath = path.join(__dirname, "../client/dist");

  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}else{
  app.get("/",(req,res)=>{
  res.send("API is running...");
})
}

app.listen(PORT,()=>{
    console.log(`Server is running on : http://localhost:${PORT}`);
    connectDB(); 
})