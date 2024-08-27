import express from "express";
import { router } from '../routes/users.route.js'
import path from "path"
import { fileURLToPath } from 'url'; //to get the directory name in es module

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

//built in middlewares
app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(express.static(path.join(__dirname, '../public')));

// router middleware 
app.use('/auth',router)


// routes for login page
app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
})

// route for login success page
app.get('/loginSuccess',(req,res) => {
    res.sendFile(path.join(__dirname,'../public','loginSuccess.html'))
})


export { app }