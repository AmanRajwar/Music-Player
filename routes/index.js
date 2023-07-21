const express =require('express');
const router=express.Router();

const loginController = require('../controllers/login_controller');

router.get('/',loginController.login);
router.use('/users',require('./user'))
module.exports=router;