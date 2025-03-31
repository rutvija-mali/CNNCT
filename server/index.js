import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express from 'express'
import UserRouter from "./routes/User.js";
import MeettingRouter from './routes/Meeting.js'




dotenv.config()
const port = process.env.PORT||5000
const app = express()

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = ['https://cnnct-olive.vercel.app', 'https://cnnct-tmfc.onrender.com'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.urlencoded({extended:true}))
app.use('/api/users',UserRouter)
app.use('/api/meetings',MeettingRouter)

const connectToMongoDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to mongodb");
        
    } catch (error) {
       console.log(error);
        
    }
}

connectToMongoDb();

app.listen(port,()=>{
  console.log(`App is listening to port ${port}`);
  
})