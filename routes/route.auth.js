const express = require("express")
const router = express.Router()

router.route('/register')
router.route('/login').post(sendOtp)
router.route('/logout').post(verifyOtp)

module.exports = router