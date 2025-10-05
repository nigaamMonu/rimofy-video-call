import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';


// local imports
import authRouter from './Routes/authRouter.js';
import userRouter from './Routes/userRouter.js';
import chatRouter from './Routes/chatRouter.js';
import connectDB from './config/mongodb.js';



dotenv.config(); 

const app = express();

const originList = ['http://localhost:5173'];
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: originList,
  credentials: true, // Allow cookies to be sent
}))

app.get("/",(req,res)=>{
  res.send("API is running...");
})


app.use('/api/auth',authRouter);
app.use('/api/users',userRouter);
app.use('/api/chat',chatRouter);


app.listen(PORT,()=>{
    console.log(`Server is running on : http://localhost:${PORT}`);
    connectDB(); 
})