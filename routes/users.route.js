import { Router } from "express";
import { AuthorisefromGoogleusingOauth, HandleCallbackFromTheGoogle } from '../controller/user.controller.js'

const router = Router();

router.route('/loginfromGoogle').get(AuthorisefromGoogleusingOauth)
router.route('/callback').get(HandleCallbackFromTheGoogle)

export { 
    router
}