import express from 'express'
import dotenv from 'dotenv'
import Participants from '../models/Participents.js';
import { authMiddleware } from '../middlewares/auth.js'
import { errorLogger } from '../middlewares/logs.js';
import mongoose from 'mongoose';

dotenv.config()

const ParticipantRouter = express.Router();

ParticipantRouter.put('/',authMiddleware,async(req,res)=>{
   try {
       const {status,meeting,user} = req.body
       const userObjectId = new mongoose.Types.ObjectId(user);

       
        
       const participant = await Participants.findOne({$and: [{meeting:meeting},{user:userObjectId}]})
       

        if(!participant){
            return res.status(404).json({message:'Participant does not exist'})
        }
        if(user.toString() !== participant.user.toString()){
            return res.status(401).json({message:'Unauthorized'})
        }
        
        const newParticipants = await Participants.findOneAndUpdate(
            {user:user,meeting:meeting},
            {$set:{status:status}},
            {new:true}
        )

        return res.status(200).json(newParticipants);
   } catch (error) {
    errorLogger(error,req,res)
   }
})

ParticipantRouter.get('/',authMiddleware,async(req,res)=>{
    try {
        const user = req.query.user || null;
        const meeting = req.query.meeting||null;

        const userId = new mongoose.Types.ObjectId(user)
        const participant = await Participants.findOne({$and: [{meeting:meeting},{user:userId}]})

         if(!participant){
             return res.status(404).json({message:'Participant does not exist'})
         }

         return res.status(200).json(participant);
    } catch (error) {
     errorLogger(error,req,res)
    }
 })

 
ParticipantRouter.get('/all/',authMiddleware,async(req,res)=>{
    try {
        const meeting = req.query.meeting||null;
        const participants = await Participants.findOne({meeting})

         if(!participants){
             return res.status(404).json({message:'Participants does not exist'})
         }

         return res.status(200).json(participants);
    } catch (error) {
     errorLogger(error,req,res)
    }
 })
export default ParticipantRouter;