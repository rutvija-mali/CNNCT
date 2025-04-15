import express, { response } from 'express'
import {errorLogger} from '../middlewares/logs.js'
import { authMiddleware } from '../middlewares/auth.js'
import dotenv from 'dotenv'
import multer from 'multer'
import User from '../models/User.js';
import Participants from '../models/Participents.js';
import Meetings from '../models/Meetings.js'
import mongoose from 'mongoose'
import fs from 'fs'
import { log } from 'console'
import Participents from '../models/Participents.js'
import { resolve } from 'path/posix'


dotenv.config()
const MeettingRouter = express.Router()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });



MeettingRouter.post('/',authMiddleware,upload.single('file'),async(req,res)=>{
try {
    const {
        topic, password,hostId, hostName, description, startTime, timeZone, 
        duration, link, emails, bannerColor, bannerText
    } = req.body;

    const bannerImg = req.file ? req.file.path : '';

   const emailArray = Array.isArray(emails) ? emails : (emails ? emails.split(",").map(email => email.trim()) : []);
   
   const meeting = new Meetings({
    topic, 
    password,
    hostId, 
    hostName, 
    description, 
    startTime, 
    timeZone, 
    duration, 
    link, 
    emails:emailArray, 
    bannerColor, 
    bannerText,
    bannerImg
   })
   await meeting.save(); 
   let participantIds = [];
    for(const email of emailArray){
        const user = await User.findOne({email:email})
        if(!user){
           return res.status(404).json({message:'Participant not found'})
        }

        const participant = new Participants({
         user:user._id,
         meeting:meeting._id,
         status:'Pending'
        })

        await participant.save()

        participantIds.push(participant._id);

    }
    meeting.participants =participantIds;
    
   
    await meeting.save()

   return res.status(201).json({meeting:'Meetting craeted successfuly'})
    
} catch (error) {
    errorLogger(error,req,res)
}
})

// MeettingRouter.get('/',async(req,res)=>{
    
//     try {
//         const hostId = req.query.hostId||null
//         const userId = req.query.userId||null
//         const startTime = req.query.startTime|| ''
//         const participantsStatus= req.query.participantsStatus

//         let query ={}

       
//         if (hostId && !mongoose.isValidObjectId(hostId)) {
//             return res.status(400).json({ error: 'Invalid hostId' });
//           }
//         if(hostId){
//             query.hostId = hostId;
//         }
//         if(startTime){
//             const now = new Date()
//             if(startTime == 'Upcoming'||startTime == 'Pending'){
//                 query.startTime = {$gte : now.toISOString()}

//             }else if(startTime == 'Past'){
                
//                 query.startTime = {$lt:now.toISOString()}
//             }
//         }

//         if(userId){
            
//             let participantQuery = { user: userId };
//             if (participantsStatus) {
//                 participantQuery.status = participantsStatus; 
            
//             }
//             const participants = await Participants.find(participantQuery).select("_id");
//             const participantIds = participants.map(p => p._id);

//             if (participantIds.length > 0) {
//                 query.participants = { $in: participantIds };
//             } else {
//                 return res.status(200).json([]); 
//             }
//         }

//         let meetings = await Meetings.find(query).populate({
//             path: 'participants',
//             populate: {
//               path: 'user',
//               model: 'User',
//               select: 'firstName lastName' 
//             }
//           });

//         return res.status(200).json(meetings);

//     } catch (error) {
//         errorLogger(error,req,res)
//     }

// })

MeettingRouter.get('/', async (req, res) => {
    try {
      const hostId = req.query.hostId || null;
      const userId = req.query.userId || null;
      const startTime = req.query.startTime || '';
      const participantsStatus = req.query.participantsStatus;
  
      let query = {};
  
      if (hostId && !mongoose.isValidObjectId(hostId)) {
        return res.status(400).json({ error: 'Invalid hostId' });
      }
  
      if (hostId) {
        query.hostId = hostId;
      }
  
      if (startTime) {
        const now = new Date();
        if (startTime === 'Upcoming' || startTime === 'Pending') {
          query.startTime = { $gte: now.toISOString() };
        } else if (startTime === 'Past') {
          query.startTime = { $lt: now.toISOString() };
        }
      }
  
      if (userId) {
        let participantQuery = { user: userId };
        if (participantsStatus) {
          participantQuery.status = participantsStatus;
        }
        const participants = await Participants.find(participantQuery).select('_id');
        const participantIds = participants.map((p) => p._id);
  
        if (participantIds.length > 0) {
          query.participants = { $in: participantIds };
        } else {
          return res.status(200).json([]); // No meetings
        }
      }
  
      let meetings = await Meetings.find(query)
        .sort({ startTime: 1 }) // sorting helps with conflict check
        .populate({
          path: 'participants',
          populate: {
            path: 'user',
            model: 'User',
            select: 'firstName lastName',
          },
        });
  
        if(hostId){
            const participantEntries = await Participants.find({user:hostId}).select('meeting')
            console.log(participantEntries);
            const participantMeetingId = participantEntries.map(p => p.meeting)
            const  participantMeetings = await Meetings.find({
                _id:{$in:participantMeetingId}
            })

            meetings = meetings.map((meeting,index) =>{
                let Start = new Date(meeting.startTime)
                let End = new Date(Start.getTime()+meeting.duration *60000)
                let isConflict = participantMeetings.some(p => {
                    let pStart = new Date(p.startTime)
                    let pEnd = new Date(pStart.getTime() + p.duration * 60000)
                  
                    const conflict = Start < pEnd && End > pStart;
                    return conflict;
                  });
                return {
                    ...meeting.toObject(), 
                    isConflict
                }
            })
        }
      return res.status(200).json(meetings);
    } catch (error) {
      errorLogger(error, req, res);
    }
  });
  



MeettingRouter.get('/all/',async(req,res)=>{
    
    try {
        const userId = req.query.userId|| null
        const rangeStart = req.query.rangeStart||null
        const rangeEnd = req.query.rangeEnd||null
        const nameOfMeeting = req.query.nameOfMeeting||null

        let query ={}

       
        if (userId && !mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid hostId' });
          }

        if(rangeStart && rangeEnd){
           const startDate = new Date(rangeStart)
           startDate.setHours(0,0,0,0)

           const endDate = new Date(rangeEnd)
           endDate.setHours(23,59,59,999)

                query.startTime = {
                    $gte:startDate,
                    $lt:endDate

                }
                console.log("query start and end date "+query.startDate);
                
                
        }

        if(nameOfMeeting){
            const searchRegex = new RegExp(nameOfMeeting,'i')
            query.topic = searchRegex
        }


        if(userId){  

            const participantDocs = await Participants.find({user:userId}).select('meeting')
            const participantsMeetingId = participantDocs.map((doc)=>  new mongoose.Types.ObjectId(doc.meeting))

          query.$or = [
            {hostId:userId},
            {_id:{$in:participantsMeetingId}}
          ]

        }

        const meetings = await Meetings.find(query)
          console.log("meetings found  ");
          console.log(meetings);
          
          
        return res.status(200).json(meetings);

    } catch (error) {
        errorLogger(error,req,res)
    }

})

 MeettingRouter.get('/:id',async(req,res)=>{
    try {
        const {id} =  req.params;
        const meeting = await Meetings.findById(id)
        if (!meeting) {
            return res.status(404).json({
              error: {
                message: 'meeting not found',
                status: 404
              }
            });
        }
        res.status(200).json(meeting)
    } catch (error) {
        errorLogger(error,req,res)
    }
})

MeettingRouter.put('/:id',authMiddleware,async(req,res,next)=>{
   try {
    if(req.headers['content-type']?.includes('multipart/form-data')){
        upload.single('file')(req,res,(err)=>{
            if(err) res.status(400).json({message:'File upload failed'})
                next()
        })
     }else{
        next();
     }
   } catch (error) {
    next(error)
   }
},async(req,res)=>{
    try {
         const {id} = req.params;
         const userId = req.user.id;
         
         const existingMeeting = await Meetings.findById(id)
         if(!existingMeeting){
            return res.status(404).json({message:'Meeting not found'});
         }
         
         if(userId.toString() !== existingMeeting.hostId.toString()){
            return res.status(403).json({message:'Unauthorized'})
         }

         if(req.file){
            if(existingMeeting.bannerImg){
                fs.unlink(existingMeeting.bannerImg,(err)=>{
                    if(err) console.error('Error deleting old file:', err)
                })
            }
            existingMeeting.bannerImg = req.file.path
         }

        const {
            topic, password,hostId, hostName, description, startTime, timeZone, 
            duration, link, emails, bannerColor, bannerText
        } = req.body;
    
       const newEmailArray = Array.isArray(emails) ? emails : (emails ? emails.split(",").map(email => email.trim()) : []);
       const existingEmails = existingMeeting.emails||[]    
       const emailsToAdd = newEmailArray.filter(email => !existingEmails.includes(email));  
       const emailsToRemove = existingEmails.filter(email => !newEmailArray.includes(email));


      if(emailsToRemove.length > 0){
        await Participants.deleteMany({ meeting: existingMeeting._id, email: { $in: emailsToRemove } });
      }

       let participantIds = existingMeeting.participants.filter(p => p != null).map(p => p._id);
    
       
       for (const email of emailsToAdd) {
           const user = await User.findOne({ email });
           if (!user) continue; 

           const participant = new Participants({
               user: user._id,
               meeting: existingMeeting._id,
               status: 'Pending'
           });
           
           await participant.save();
           participantIds.push(participant._id);
       }

       
       existingMeeting.topic = topic||existingMeeting.topic
       existingMeeting.password = password||existingMeeting.password
       existingMeeting.hostId = hostId || existingMeeting.hostId
       existingMeeting.hostName = hostName|| existingMeeting.hostName
       existingMeeting.description = description || existingMeeting.description
       existingMeeting.startTime = startTime || existingMeeting.startTime
       existingMeeting.timeZone= timeZone||existingMeeting.timeZone
       existingMeeting.duration  = duration|| existingMeeting.duration
       existingMeeting.link  = link|| existingMeeting.link
       existingMeeting.emails = newEmailArray;
       existingMeeting.bannerColor  = bannerColor|| existingMeeting.bannerColor
       existingMeeting.bannerText  = bannerText || existingMeeting.bannerText
       existingMeeting.participants = participantIds;

       await existingMeeting.save()
       return res.status(200).json({ message: 'Meeting updated successfully'});
    } catch (error) {
        errorLogger(error,req,res)
    }
})

MeettingRouter.delete('/:id',authMiddleware,async(req,res)=>{
   try {
    
    const {id} = req.params;
    const userId = req.user.id;

    const existingMeeting = await Meetings.findById(id);
    if(!existingMeeting){
        return res.status(404).json({message:'Meeting not found'})
    }
    console.log("userid "+userId);
    console.log("hostid "+existingMeeting.hostId)
    
    if(userId.toString() !== existingMeeting.hostId.toString()){
        return res.status(403).json({message:'Unauthorize'})
    }
    fs.unlink(existingMeeting.bannerImg,(err)=>{
        console.log(err)
    })

    await Meetings.findByIdAndDelete(id)
    return res.status(200).json({message:'Meeting deleted successfuly'})
   } catch (error) {
    errorLogger(error,req,res)
   }


})

MeettingRouter.patch('/:id',async(req,res)=>{
   try {
     const id = req.params.id
     const {status} = req.body 
     const updatedMeeting = await Meetings.findByIdAndUpdate(id,{status:status},{new:true})
     if(!updatedMeeting){
        return res.status(404).json({message:'Meeting not found'})

     }
     return res.status(200).json(updatedMeeting)
   } catch (error) {
     errorLogger(error,req,res)
   }

})
export default MeettingRouter;