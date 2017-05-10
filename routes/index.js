var express = require('express');
var dockerAPI = require('../docker/docker');
var router = express.Router();
var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile(__dirname + '../public/index.html');
});


router.get('/wetty', function(req, res) {
  res.sendfile(__dirname + '../public/wetty/index.html');
});


router.get('/docker/list', function(req, res, next) {
  docker.listContainers(function (err, containers) {
    res.send(JSON.stringify(containers));
  });
});

router.get('/docker/create', function(req, res, next) {
  let name  = req.query.name || 'ubuntu-' + Math.random();
  console.log(req.query)
  docker.createContainer({Image: 'ubuntu', Cmd: ['/bin/bash'], name: name}, function (err, container) {
    container.start(function (err, data) {
      console.log('start run container', data);
      res.send(JSON.stringify(data));
    });

  });
});

router.post('/simulation/code/run',function (req, res, next) {
  let runCodeStruct = {
    stdin: req.body.stdin,
    cmd: req.body.cmd,
    files: {
      name: req.body.files_name,
      content: req.body.files_content
    }
  }
  dockerAPI.runCode(runCodeStruct,res)
});




module.exports = router;
