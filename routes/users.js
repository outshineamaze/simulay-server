var express = require('express');
var router = express.Router();
var interface = require('../services/model').interface;


/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send(interface.insertUser());
});

/* GET users listing. */
router.get('/test', function(req, res, next) {
  res.send('tesy');
});


router.get('/info/:id', function(req, res, next) {
  let userInfo = {
    name : req.query.name,
      id : req.params.id,
      email : req.query.email
  }
  res.json(interface.getUserInfo());
});


module.exports = router;
