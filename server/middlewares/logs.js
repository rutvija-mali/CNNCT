import fs from 'fs'
export function errorLogger (err,req,res,next){
    const date = new Date()
    const logFile =`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}.log`
    const errorLog =`[${date.toISOString()}] ${err.stack||err.message}\n`
    fs.appendFile(`./logs/${logFile}`,errorLog,(writeErr)=>{
     if(writeErr) console.error('Error writing to error log:',writeErr)
    })
 
    res.status(err.status||500).json({
     error:{
        message:err.message||'Enternal server error',
        status: err.status||500
     }
    })
 }

