import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URI,{dbName: "Mega_Project"})
        .then(()=>{
            console.log("DB Connected Successfully");
        })
        .catch((err)=>{
            console.log("Error in connecting the DB", err);
        });
}