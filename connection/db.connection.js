import mongoose from "mongoose";
import { Apierror } from "../utils/Apierror.utils.js"

const ConnectDB = async() => {
    try {

        const dbname = process.env.DB_NAME;
        const mongodbConnectionResponse = await mongoose.connect(process.env.MONGODB_URI/dbname)

        if(!mongodbConnectionResponse){
            throw new Apierror(404,"Mongodb connection Occur")
        }
        
    } catch (error) {
        throw new Apierror(400,"An error Ocuured While Connecting to the DB")
    }
}

export { ConnectDB }