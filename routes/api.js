/**
 * @author 作者: laynezhou
 * @copyright laynezhou@tencent.com
 * @version 版本 2017/5/10
 */

var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;