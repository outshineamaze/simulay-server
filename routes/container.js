/**
 * @author 作者: laynezhou
 * @copyright laynezhou@tencent.com
 * @version 版本 2017/5/10
 */

var express = require('express');
var router = express.Router();
var docker = require('../docker/docker').docker;

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


router.get('/list', function(req, res, next) {
    docker.listContainers(function (err, containers) {
        res.send(JSON.stringify(containers));
    });
});

router.get('/create', function(req, res, next) {
    let name  = req.query.name || 'ubuntu-' + Math.random();
    console.log(req.query)
    docker.createContainer({Image: 'ubuntu', Cmd: ['/bin/bash'], name: name}, function (err, container) {
        container.start(function (err, data) {
            console.log('start run container', data);
            res.send(JSON.stringify(data));
        });

    });
});
module.exports = router;