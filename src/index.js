import { app } from './app.js'
import { ConnectDB } from '../connection/db.connection.js'
import { Apierror } from '../utils/Apierror.utils.js';

ConnectDB()
 .then(() => {
     const PORT = process.env.PORT || 5000;
     app.listen(PORT,() => console.log(`Server Started at port ${PORT}`) )
 })
 .catch((error) => {
    throw new Apierror(500,"An Error Occured while Starting the Server",error)
 })
 

