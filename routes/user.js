const express =require('express');
const router=express.Router();

const loginController = require('../controllers/login_controller');

router.post('/signup',loginController.signup);

module.exports=router;