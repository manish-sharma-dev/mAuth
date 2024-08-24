import { Apierror } from "../utils/Apierror.utils.js"
import { Apiresponse } from "../utils/Apiresponse.util.js"
import { google } from "googleapis";
import crypto from 'crypto'

const AuthorisefromGoogleusingOauth = async() => {
    
    // oAuth Client info 
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        process.env.REDIRECT_URI
    );

    console.log('oauthclient Connection successfull')

    const scopes = [
        'https://www.googleapis.com/auth/drive.metadata.readonly'
    ];

    console.log('Scope set done')

    const state = crypto.randomBytes(32).toString('hex');

    // Generate a url that asks permissions for the Drive activity scope

    const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
    // Include the state parameter to reduce the risk of CSRF attacks.
    state: state
   });

   if(!authorizationUrl){
    throw new Apierror(500,'Failed to Get AUthorization Url')
   }

   console.log("Got AUthorizational url",authorizationUrl)
}

export { 
    AuthorisefromGoogleusingOauth
}