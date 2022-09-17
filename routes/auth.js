const express = require('express')
const authController = require('../controllers/auth')
const mobileAuthController = require('../controllers/mobileAuth')
const router = express.Router();

// definicja które metody autoryzacja będą uruchmione w zależności od 
//    metody POST wysłanej przez przeglądarke

router.post('/register', authController.register )
router.post('/userPanel', authController.verification)
router.post('/verification', authController.login )
router.post('/logout', authController.logout )
router.post('/userPanel/changeUsername', authController.changeUsername)
router.post('/userPanel/changeEmail', authController.changeEmail)
router.post('/userPanel/changePassword', authController.changePassword)
router.post('/mobileLogin', mobileAuthController.mobileLogin)

module.exports = router;