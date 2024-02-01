import express from "express";
import { userLogin, userRegister } from "../Controllers/authController.js";

const router = express.Router()

router.get('/', async(req, res) => {
    res.send(`<h2>Social media server started...<h2>`)
})


// register
router.post('/register',userRegister)

// login
router.post('/login', userLogin)


export default router   