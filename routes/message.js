require('babel-register')
const Wechat = require('wechat4u')
var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {

    res.contentType('json');
    res.send(JSON.stringify({status:'success','msg-type':'string', content:'hello boy!'}));
    res.end();
});

module.exports = router;