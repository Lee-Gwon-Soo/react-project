const mongoose = require('mongoose');
const requiredLogin = require('../middlewares/requiredLogin');
const Grit = mongoose.model('grits');

module.exports = (app) => {

    app.get('/api/grit/getGritList/:userId', requiredLogin, async (req, res) => {
        const userId = req.params.userId;

        try{
            const gritList = await Grit.find({_user: userId});

            res.send({
                status: true,
                data: gritList
            });

        } catch( err ) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/grit/addNewGrit/:userId', requiredLogin, async (req, res) => {
        const userId = req.params.userId;

        const data = req.body;

        const grit = new Grit({
            _user: userId,
            title: data.title,
            type: data.type,
            startDate: data.startDate,
            checkList: data.checkList,
            dueDate: data.dueDate,
            completed: data.completed,
            ins_dtime: Date.now()
        });

        try{
            const saveData = await grit.save();

            if(saveData) {
                res.send({
                    status: true,
                    data: saveData
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: 'Grit 리스트를 저장하는데 문제가 생겼습니다.'
                })
            }
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.get('/api/grit/detail/:gritId', requiredLogin, async (req, res) => {
        const gritId = req.params.gritId;

        try {
            const existingGrit = await Grit.findById(gritId);
            if(existingGrit) {
                res.send({
                    status: true,
                    data: existingGrit
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '해당 Grit 항목을 가져올 수 없습니다.'
                })
            }

        } catch ( err ){
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/grit/changeGritStatus/:gritId', requiredLogin, async (req, res) => {
        const gritId = req.params.gritId;
        const data = req.body;

        let count = 0;

        data.map(element => {
            if(element.checked) {
                count++;
            }
        });
        
        const total = data.length;
        const completed = count/total * 100;

        try {
            const existingGrit = await Grit.findById(gritId);
            if(existingGrit) {
                existingGrit.checkList = [...data];
                existingGrit.completed = completed;
                const modifiedInfo = await existingGrit.save();

                if(modifiedInfo) {
                    res.send({
                        status: true,
                        data: modifiedInfo
                    });
                } else {
                    res.status(500).send({
                        status: false,
                        message: 'Grit 항목을 수정하는데 문제가 생겼습니다.'
                    })
                }
                
            } else {
                res.status(500).send({
                    status: false,
                    message: '해당 Grit 항목을 가져올 수 없습니다.'
                });
            }

        } catch ( err ){
            res.status(422).send({
                status: false,
                err: err
            });
        }
    })
}
