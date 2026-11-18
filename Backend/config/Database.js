import mongoose from "mongoose";

export const ConnectDB = async()=>{
    const uri = process.env.MONGO_URL;
     if(!uri){
        console.log("MONGO_URL is not defined in enviroment Variable");
    }
    mongoose.set("strictQuery",true);
    const connectionn = await mongoose.connect(uri);

    console.log(`MongoDB connected: ${connectionn.connection.host}/${connectionn.connection.name}`        
    )
    return connectionn
}