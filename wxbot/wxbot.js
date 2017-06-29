require('babel-register')
const Wechat = require('wechat4u')
const handleMessage = require('./handleMessage')
const nodemailer = require("nodemailer")

module.exports = function () {

    let bot
    /**
     * 尝试获取本地登录数据，免扫码
     * 这里演示从本地文件中获取数据
     */
    try {
        bot = new Wechat(require('./sync-data.json'))
    } catch (e) {
        bot = new Wechat()
    }
    /**
     * 启动机器人
     */
    if (bot.PROP.uin) {
        // 存在登录数据时，可以随时调用restart进行重启
        bot.restart()
    } else {
        bot.start()
    }
    /**
     * uuid事件，参数为uuid，根据uuid生成二维码
     */
    bot.on('uuid', uuid => {
        qrcode.generate('https://login.weixin.qq.com/l/' + uuid, {
            small: true
        })
        console.log('二维码链接：', 'https://login.weixin.qq.com/qrcode/' + uuid)
        sendEmail('https://login.weixin.qq.com/qrcode/' + uuid)
    })
    /**
     * 登录用户头像事件，手机扫描后可以得到登录用户头像的Data URL
     */
    bot.on('user-avatar', avatar => {
        //console.log('登录用户头像Data URL：', avatar)
    })
    /**
     * 登录成功事件
     */
    bot.on('login', () => {
        console.log('登录成功')
        // 保存数据，将数据序列化之后保存到任意位置
        fs.writeFileSync('./sync-data.json', JSON.stringify(bot.botData))
    })
    /**
     * 登出成功事件
     */
    bot.on('logout', () => {
        console.log('登出成功')
        // 清除数据
        fs.unlinkSync('./sync-data.json')
        //todo 事务处理完后才能退出
        process.exit();
    })
    /**
     * 联系人更新事件，参数为被更新的联系人列表
     */
    bot.on('contacts-updated', contacts => {
        //console.log(contacts)
        console.log('联系人数量：', Object.keys(bot.contacts).length)
    })
    /**
     * 错误事件，参数一般为Error对象
     */
    bot.on('error', err => {
        console.error('错误：', err)
    })

    handleMessage(bot);

    function sendEmail(content) {

        var text;
        if (content.length != 0) {
            text = `微信Robot登录地址:${content}`;//"本次总共采集到" + content.length + "篇文章,具体标题如下:\n" + content.join('\n');
        } else {
            text = "本次采集失败,请检查原因";
        }
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
            service: 'QQ',
            auth: {
                user: '124561376@qq.com',
                pass: 'kagfjaiaacmebgjf'
            }
        });
        var mailOptions = {
            from: '124561376@qq.com ', // sender address
            to: '124561376@qq.com', // list of receivers
            subject: '微信Robot登录地址', // Subject line
            //text: text, // plaintext body
            html: `微信扫描登录<br/><img src="${content}">`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
    }
}