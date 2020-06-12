const authController = require('../controllers/auth.controller')
const validateToken = require('../middlewares/validateToken')
const router = require('express').Router();
  /* ==============
     Register Route
  ============== */
  router.post('/register', authController.register);

  /* ============================================================
     Route to check if user's email is available for registration
  ============================================================ */
  //router.get('/checkEmail/:email', authController.checkEmail);

  /* ===============================================================
     Route to check if user's username is available for registration
  =============================================================== */
  //router.get('/checkUsername/:username', authController.checkUsername);

  /* ========
  LOGIN ROUTE
  ======== */
  router.post('/login', authController.login);


  /* ===============================================================
     Route to get user's profile data
  =============================================================== */
  router.get('/profile', validateToken, authController.profile);

  /* ===============================================================
     Route to get user's public profile data
  =============================================================== */
//   router.get('/publicProfile/:username', validateToken, authController.publicProfile);

   
  /* ===============================================================
     Route to send mail
  =============================================================== */
  router.get('/sendmail', authController.sendmail);


module.exports = router;