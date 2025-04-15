import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express from 'express'
import UserRouter from "./routes/User.js";
import MeettingRouter from './routes/Meeting.js'
import ParticipantsRouter from "./routes/Participants.js";
import path from 'path'
import { fileURLToPath } from "url"; 


dotenv.config({ path: "./.env.development" });

const port = process.env.PORT||5000
const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = ['https://cnnct-olive.vercel.app', 'https://cnnct-tmfc.onrender.com','http://localhost:5173'];

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({extended:true}))
app.use('/api/users',UserRouter)
app.use('/api/meetings',MeettingRouter)
app.use('/api/participants',ParticipantsRouter)

const connectToMongoDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to mongodb");
        
    } catch (error) {
       console.log(error);
        
    }
}

console.log("MONGODB_URI:", process.env.MONGODB_URI);
connectToMongoDb();

app.listen(port,()=>{
  console.log(`App is listening to port ${port}`);
  
})
app.get("/", (req, res) => {
  res.send("Server is working!");
});