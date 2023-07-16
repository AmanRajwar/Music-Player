const User = require('../models/users')
module.exports.login = (req, res) => {
   // console.log(req.session);
   return res.render('login');
}


// create user if the user tries to signup 
module.exports.signup = async (req, res) => {

   // req.session.user_email= req.body.email;
   // return res.redirect('/');

   try {
  
      if (req.body.password != req.body.confirmPassword) {
         // req.flash('error', 'Passwords do not match');
         return res.redirect('back');
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
         await User.create(req.body);
         return res.redirect('/');
      } else {
         // req.flash('success', 'You have signed up, login to continue!');
         return res.redirect('back');
      }
   } catch (error) {
      //  req.flash('error', err); return 
      console.log(error);
   }
}