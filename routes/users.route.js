import { Router } from "express";
import { AuthorisefromGoogleusingOauth } from '../controller/user.controller.js'

const router = Router();

router.route('/loginfromGoogle').get(AuthorisefromGoogleusingOauth)

export { 
    router
}