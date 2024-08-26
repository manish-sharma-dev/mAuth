import { Apierror } from "../utils/Apierror.utils.js"
import { Apiresponse } from "../utils/Apiresponse.util.js"
import { google } from "googleapis";
import crypto from 'crypto'

import path from "path";
import { fileURLToPath } from 'url'; //to get the directory name in es module


// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const AuthorisefromGoogleusingOauth = async(req,res) => {
    
   try {

     // oAuth Client info 
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        process.env.REDIRECT_URI
    );
    
     console.log('oauthclient Connection successfull')
 
     const scopes = 'profile email openid'
     const responseType = 'code';

     console.log('Scope set done')
 
     const state = crypto.randomBytes(32).toString('hex');
 
     // Generate a url that asks permissions for the Drive activity scope
 
     const authorizationUrl = oauth2Client.generateAuthUrl({
     // 'online' (default) or 'offline' (gets refresh_token)
     access_type: 'offline',
     response_type : responseType,
     scope: scopes,
     include_granted_scopes: true,
     // Include the state parameter to reduce the risk of CSRF attacks.
     state: state
    });
 
    if(!authorizationUrl){
     throw new Apierror(500,'Failed to Get AUthorization Url')
    }
 
    // console.log("Got AUthorizational url",authorizationUrl)
 
    return res.status(200).json(
     new Apiresponse(200,"got he Authorization Token from google oauth api",authorizationUrl)
    )
   } catch (error) {
    console.log("An error Occurred while getting Authorization token",error)
   }
}


const HandleCallbackFromTheGoogle = async(req,res) => {

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        process.env.REDIRECT_URI
    );
    
    const codeResponse = req?.query?.code

    if(!codeResponse){
        throw new Apierror(404,"didn't get the permission from the user")
    }

    console.log('getting the reposne code form the google api console after granting permission by the user',codeResponse)

    oauth2Client.getToken(codeResponse,(err,token) => {
        if(err){
            console.log("an error Ocuured while generating the token for the client",err)
            return
        }

        oauth2Client.setCredentials(token)
        console.log('token received',token)
        console.log("Access-token",token?.access_token)
        console.log("Refresh-token",token?.refresh_token)
    })

    res.sendFile(path.join(__dirname,'../public','login.html'))
}

export { 
    AuthorisefromGoogleusingOauth,
    HandleCallbackFromTheGoogle
}