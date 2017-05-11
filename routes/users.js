var express = require('express');
var router = express.Router();
var interface = require('../services/model').interface;


/* GET users listing. */
router.post('/add', function(req, res, next) {
  let userInfo = {
    nickname: req.body.nickname,
    email: req.body.email,
    phonenum: req.body.phonenum
  }
  res.send(interface.insertUser(userInfo));
});

/* GET users listing. */
router.get('/test', function(req, res, next) {
  res.send('test');
});


router.get('/info', function(req, res, next) {
  let userInfo = req.query
  interface.getUserInfo(userInfo, res);
});


router.get('/all',function (req, res, next) {
  interface.getUserInfo({}, res)
})

module.exports = router;
