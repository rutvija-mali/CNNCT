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
app.use(cors({
  origin:"http://localhost:5173",
  methods:['GET','POST','PUT','DELETE','PATCH'],
  credentials:true,
  allowedHeaders:['Content-Type', 'Authorization']
}))
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