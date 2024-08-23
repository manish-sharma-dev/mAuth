import mongoose from "mongoose";
import { Apierror } from "../utils/Apierror.utils.js"

const ConnectDB = async() => {
    try {

        const dbname = "mAuth";
        const mongodbConnectionResponse = await mongoose.connect(`${process.env.MONGODB_URI}/${dbname}`)

        // if(!mongodbConnectionResponse){
        //     throw new Apierror(404,"Mongodb connection Occur")
        // }

        console.log("MongoDB connected")
        
    } catch (error) {
        throw new Apierror(400,"An error Ocuured While Connecting to the DB",error)
    }
}

export { ConnectDB }