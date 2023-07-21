const User = require('../models/users')
// const fetch = require('node-fetch');
module.exports.login = (req, res) => {
   // console.log(req.session);
   if (req.isAuthenticated())
      return res.redirect('/users/home');

   return res.render('login');
}


// create user if the user tries to signup 
module.exports.signup = async (req, res) => {
   try {

      if (req.body.password != req.body.confirmPassword) {
         // req.flash('error', 'Passwords do not match');
         return res.redirect('back');
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
         await User.create(req.body);
         return res.redirect('/users/home');
      } else {
         // req.flash('success', 'You have signed up, login to continue!');
         return res.redirect('back');
      }
   } catch (error) {
      //  req.flash('error', err); return 
      console.log(error);
   }
}


module.exports.signin = async (req, res) => {
   if (!req.isAuthenticated()) {
      return  res.redirect('/')
   }

   return res.redirect('/users/home')

}


module.exports.destroySession = async function (req, res) {

   req.logout(function (err) {
       if (err) {
           console.log("rserror in sign out")
       }
   });
   return res.redirect('/')
}
