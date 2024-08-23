import { app } from './app.js'
import { ConnectDB } from '../connection/db.connection.js'
import { configDotenv } from 'dotenv';


configDotenv('./.env')

ConnectDB()
 .then(() => {
     const PORT = process.env.PORT || 5000;
     app.listen(PORT,() => console.log(`Server Started at port ${PORT}`) )
 })
 .catch((error) => {
    console.log("An Error Occured while Starting the Server",error)
 })
 

