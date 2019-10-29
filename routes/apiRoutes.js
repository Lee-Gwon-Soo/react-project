const mongoose = require('mongoose');

module.exports = (app) => {
    app.post('/outsidePost/mkeywordtester/sendmail', async (req, res) => {
        const data = req.body;

        const mailer = require('../services/mail');
        mailer.sendSimpleMail('tempguan@gmail.com',"mKeyword에 로그인하셨습니다.", "이용해주셔서 감사합니다.");
        res.send({
            data: data['receiveMail']
        });
    })
}