import express from 'express'
import dotenv from 'dotenv'
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

import {errorLogger} from '../middlewares/logs.js'
import { authMiddleware } from '../middlewares/auth.js'

dotenv.config();

const UserRouter = express.Router()

UserRouter.post('/register',async (req,res)=>{
    try {
        const {firstName,lastName,username,email,password,toc} = req.body;
        const existingUser = await User.findOne({email:email});
        if(existingUser){
            return res.status(400).json('User already exist')
        }else{
            const hashedPassword = await bcrypt.hash(password,10)

            const newUser = new User({
                firstName,
                lastName,
                username,
                email,
                password:hashedPassword,
                toc
            })
            await newUser.save()

            return res.status(201).json({message:'User created successfuly'})
        }
    } catch (error) {
        errorLogger(error,req,res)
    }
})

UserRouter.post('/login',errorLogger,async(req,res)=>{
    try {
        const {username,password}= req.body;
        const existingUser = await User.findOne({username:username});
    
        if(!existingUser){
          return  res.status(400).json({message:'Invalid credentials'})
        }else{
            const isPasswordCorrect = await bcrypt.compare(password,existingUser.password)
            if(!isPasswordCorrect){
              return res.status(400).json({message:'Invalid credentials'})
            }
            const token = jwt.sign({
                id:existingUser._id,
                email : existingUser.email,
                firstName:existingUser.firstName,
                lastName:existingUser.lastName,
                timeZone:existingUser.timeZone
            },process.env.JWT_SECRET,{expiresIn:'3hr'})
            res.cookie('token',token, {
              httpOnly: true,
              secure: true,     // Ensures cookie is only sent over HTTPS
              sameSite: 'none', // Allows cross-origin cookies     
              maxAge: 3 * 60 * 60 * 1000  
          })
          return  res.status(200).json({message:'User logged in successfully',token:token})
        } 
    } catch (error) {
        errorLogger(error,req,res)
    }
})

UserRouter.put('/preference',async(req,res)=>{
    try {
        const {username,preference} = req.body;
        const existingUser = await User.findOne({username:username});
        if(!existingUser){
           return res.status(404).json({message:'User not found'})
        }else{
            
           
            const updatedUser = await User.findOneAndUpdate({username:username},{preference:preference},{new:true})
            return res.status(200).json({message:"User updated successfuly",updatedUser})
        }
    } catch (error) {
        errorLogger(error,req,res)
    }
})
UserRouter.get('/me',authMiddleware,async(req,res)=>{
    try {
     
     res.status(200).json(req.user)
    } catch (error) {
     errorLogger(error,req,res)
    }
 })

UserRouter.put('/user/:id',async(req,res)=>{
    try {
        const {firstName,lastName,email,password} = req.body;
        const existingUser = await User.findOne({email});
        if(!existingUser){
           return res.status(404).json({message:'User not found'})
        }else{
            
            let newPassword = password;
            if (password && password !== existingUser.password) {
                newPassword = await bcrypt.hash(password, 10);
            }
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{firstName,lastName,email,password:newPassword},{new:true})
            return res.status(200).json({message:"User updated successfuly",updatedUser})
        }
    } catch (error) {
        errorLogger(error,req,res)
    }
})


UserRouter.get('/:id',async(req,res)=>{
    try {
        const {id} = req.params
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message:'User does not exist'})
        }else{
            return res.status(200).json(user)
        }
    } catch (error) {
        errorLogger(error,req,res)
    }
})



UserRouter.post('/logout', async(req,res)=>{
  res.clearCookie('token',{
   httpOnly:true,
   sameSite:'none',
   secure:true
  })
  res.status(200).json({ message: 'User logged out successfully' });
})

UserRouter.patch('/:id', async (req,res)=>{
    try {
        const id = req.params.id
        const {availability,timeZone} = req.body
        
        const updatedUser = await User.findByIdAndUpdate(id,{availability:availability,timeZone:timeZone},{new:true})
        if(!updatedUser){
            return res.status(404).json({message:'User not found'})
        }

        return res.status(200).json(updatedUser)
    } catch (error) {
        errorLogger(error,req,res)
    }
})
export default UserRouter;



