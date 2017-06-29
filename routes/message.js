require('babel-register')
const Wechat = require('wechat4u')
var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {

    if (req.body.msgtype == 'text') {
        global.waitMsgUser = '';
        eventCenter.emit('sendtext', req.body);
        eventCenter.on('restext', function (content) {
            res.contentType('json');
            res.send(JSON.stringify({ status: 'success', 'msgtype': 'text', content: content }));
            res.end();
        });
    } else {
        next();
    }
});

module.exports = router;