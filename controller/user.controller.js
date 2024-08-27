import { Apierror } from "../utils/Apierror.utils.js"
import { Apiresponse } from "../utils/Apiresponse.util.js"
import { google } from "googleapis";
import crypto from 'crypto'
import { User } from '../model/user.model.js'

import path from "path";
import { fileURLToPath } from 'url'; //to get the directory name in es module


// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// request to get the Authorizational url form the google console api

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
     include_granted_scopes: false,
     prompt : 'consent',
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

// request to get the access token from the google api console

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
        // console.log('token received',token)

        const Accesstoken = token?.access_token
        console.log("Access-token",Accesstoken)

        // fetching the detail of the usr from the /get userinfo route of the googleapis

        async function getUserDetail(){
           try {
             const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo',{
                method : 'GET',
                 headers : {
                     'Content-Type': 'application/json',
                     'Authorization' : `Bearer ${Accesstoken}`
                 }
             })

             if(!response.ok){
                throw new Apierror(404,"Reposnse is not Valid from the goole api")
             }

             const userInfo = await response.json()

             if(!userInfo){
                throw new Apierror(500,'Error in convertting to the json')
             }
             
             console.log("User detail response form the googleApi",userInfo)

             // getting refresh token from the google api console
             const refresh_token = token?.refresh_token

             console.log("refresh token",refresh_token)

             //Creating the user in my db
             const user = await User.create({
                name : userInfo?.given_name,
                email : userInfo?.email,
                googleId : userInfo?.sub,
                refreshToken : refresh_token
             })

             const UserinfoIsPresentorNot = await User.findById(user?._id).select(" -password -refreshToken ")

             if(!UserinfoIsPresentorNot){
                throw new Apierror(404,"User not found in the Database maybe an issue occured while creating the user")
             }
             
             console.log("A new User Created in my db",UserinfoIsPresentorNot)

           } catch (error) {
             console.log("An error OCuured while getting the response from the user",error)
           }
        }
            

        // calling the function for getting the user details
        getUserDetail()


    })

    res.sendFile(path.join(__dirname,'../public','login.html'))
}


export { 
    AuthorisefromGoogleusingOauth,
    HandleCallbackFromTheGoogle
}