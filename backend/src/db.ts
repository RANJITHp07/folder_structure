import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

export const db=async()=>{
    try{
        const mongo_uri=process.env.MONGO_URL;
        if(mongo_uri){
            await mongoose.connect(mongo_uri)
            console.log("Connected to database")
        }
    }catch(err){
        throw new Error("Error to establish database connection:"+err)
    }
}