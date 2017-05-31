/**
 * @author 作者: laynezhou
 * @copyright laynezhou@tencent.com
 * @version 版本 2017/5/10
 */
var express = require('express');
var dockerAPI = require('../docker/docker');
var crypto = require('crypto');
var router = express.Router();
var interface = require('../services/model').interface;

router.post('/code/run',function (req, res, next) {
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

router.post('/test', function(req, res, next) {
    res.json(req.body);
});


router.get('/list/all', function (req, res, next) {
    interface.getCodeList({}, res);
});

router.get('/history', function (req, res, next) {
    interface.getCodeList({}, res);
});
router.get('/recom/all', function (req, res, next) {
    interface.getCodeList(req.query, res);
});
router.get('/ide/getcode', function (req, res, next) {
    let query = {
        _id: req.query.id
    };
    interface.getCode(query, res);
});

router.post('/ide/runcode', function (req, res, next) {
    let runCodeStruct = {
        stdin: req.body.stdin,
        cmd: req.body.cmd,
        name: req.body.name,
        content: req.body.content
    }
    console.log(runCodeStruct);
    let secret = runCodeStruct.name || '';
    let hash = crypto.createHmac('md5', secret)
        .update(runCodeStruct.content)
        .digest('hex');
    console.log(hash);
    runCodeStruct.hash = hash;
    dockerAPI.runCode(runCodeStruct, res, interface.updateCode);
});

router.post('/ide/savecode', function (req, res, next) {
    let runCodeStruct = {
        stdin: req.body.stdin,
        cmd: req.body.cmd,
        name: req.body.name,
        content: req.body.content
    }
    console.log(runCodeStruct);
    let secret = runCodeStruct.name || '';
    let hash = crypto.createHmac('md5', secret)
        .update(runCodeStruct.content)
        .digest('hex');
    console.log(hash);
    runCodeStruct.hash = hash;
    interface.addCode(runCodeStruct, res);
});


module.exports = router;
