var express = require('express');
var router = express.Router();
var checkUser = require('../middleWare/checkUser');
var {
  getHomePage,
  getLoginPage,
  getRegisterPage,
  doRegister,
  doLogin,
  getMyOrder,
  getlogout
} = require('../controllers/userController')

/* GET home page. */
router.get('/', getHomePage);
/* GET LOGIN PAGE. */
router.get('/login', getLoginPage);
/* GET REGISTER PAGE. */
router.get('/logout',getlogout);
router.get('/registers', getRegisterPage);
router.get('/myOrder',checkUser,getMyOrder);
router.post('/register', doRegister);
router.post('/login', doLogin);


module.exports = router;
