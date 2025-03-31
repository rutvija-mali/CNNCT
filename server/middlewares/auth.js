import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config()
export const authMiddleware = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            error:{
                message:'Authorization token is missing',
                status:401
            }
        })
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        console.log("decoded"+decoded);
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            error:{
                message:'Invalid authorization token',
                status:401
            }
        })
    }
}
