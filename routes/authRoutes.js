const passport = require('passport');
const mongoose = require('mongoose');
const requiredLogin = require('../middlewares/requiredLogin');
const keys = require('../config/keys');
const User = mongoose.model('User');
const Study = mongoose.model('Study');
const StudyAssignment = mongoose.model('StudyAssignment');
const crypto = require('crypto');

const ENCRYPTION_KEY = keys.ENCRYPTION_KEY; // Must be 256 bytes (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
   
function decrypt(text) {
    let textParts = text.split(':');
    let iv = new Buffer.from(textParts.shift(), 'hex');
    let encryptedText = new Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

module.exports = (app) => {
    //Starting auth from Google
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    //callback from google
    app.get('/auth/google/callback', passport.authenticate('google'), 
        //after authentication..
        (req,res) => {
            res.redirect('/surveys');
    });

    app.get('/api/logout', (req, res) => {
        req.session = null;
        res.redirect('/');
    });

    app.get('/api/current_user', (req, res) => {
        res.send(req.session.user);
    });

    //Signup post
    app.post('/api/auth/signup', async (req, res) => {
        const email = req.body.email;

        const existingUser = await User.findOne({'email': email});

        if(existingUser){
            return res.status(201).send({
                status: false,
                errorCd : 'dup',
                msg: 'This email is already used'
            });
        }
        const hashPassword = encrypt(req.body.password);
        
        req.body.password = hashPassword;
        req.body.status_cd = 'A';
        const user = new User(req.body);
        try {
            const newUser = await user.save();

            res.send({
                status: true,
                data: newUser
            });
          } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
          }
    });

    //Login
    app.post('/api/auth/login', async (req, res) => {
        const email = req.body.email;

        const existingUser = await User.findOne({'email': email});

        if(!existingUser){
            return res.status(201).send({
                status:false,
                errorCd: 'no_user',
                message: 'No User Found'
            });
        }
        try {
            const decryptedpassword = decrypt(existingUser.password);

            if(decryptedpassword !== req.body.password) {
                return res.status(201).send({
                    status:false,
                    errorCd: 'authentication failed',
                    message: 'Password is incorrect'
                });
            }
            
            req.session.user = { email:existingUser.email, id: existingUser._id, status_cd: existingUser.status_cd };
        
            res.send({
                status: true,
                data: existingUser
            });
          } catch (err) {
                res.status(422).send({
                    status: false,
                    err: err,
                    message: 'Internal Error'
                });
          }
    });

    app.get('/api/auth/getUserInfo/:userId', requiredLogin, async (req, res) => {
        const userId = req.params.userId;

        try {
            const existingUser = await User.findById(userId);

            if(!existingUser){
                return res.status(201).send({
                    status:false,
                    errorCd: 'no_user',
                    message: 'No User Found'
                });
            }
            //password should be secret
            existingUser.password = null;
            res.send({
                status: true,
                data: existingUser
            });

        } catch (err) {
            res.status(422).send({
                status: false,
                err: err,
                message: 'Internal Error'
            });
          }
    });

    app.get('/api/auth/getInfoByEmail/:email', requiredLogin, async (req, res) => {
        const email = req.params.email;

        try {
            const existingUser = await User.findOne({ email:email});

            if(!existingUser){
                return res.status(201).send({
                    status:false,
                    errorCd: 'no_user',
                    message: 'No User Found'
                });
            }
            //password should be secret
            existingUser.password = null;
            existingUser._id = null;
            res.send({
                status: true,
                data: existingUser
            });

        } catch (err) {
            res.status(422).send({
                status: false,
                err: err,
                message: 'Internal Error'
            });
          }
    });

    app.post('/api/auth/modifyUser', requiredLogin, async (req, res) => {
        const body = req.body;
        const keys = Object.keys(body);
       
        try {
            const existingUser = await User.findById(body._id);

            if(!existingUser){
                return res.status(201).send({
                    status:false,
                    errorCd: 'no_user',
                    message: 'No User Found'
                });
            }

            keys.map(key => {
                if(key.substring(0,1)  !== '_') {
                    existingUser[key] = body[key];
                }
            });
            const response = await existingUser.save();
            
            res.send({
                status: true,
                data: response
            });

        } catch (err) {
                res.status(422).send({
                    status: false,
                    err: err,
                    message: 'Internal Error'
                });
          }
    });

    app.post('/api/auth/editMember',  requiredLogin, async (req, res) => {
        const body = req.body;
        const keys = Object.keys(body);
       
        try {
            const existingUser = await User.findById(body._id);

            if(!existingUser){
                return res.status(201).send({
                    status:false,
                    errorCd: 'no_user',
                    message: 'No User Found'
                });
            }

            keys.map(key => {
                
                if(key.substring(0,1)  !== '_' && !(key ==='password' && !body[key])) {
                    existingUser[key] = body[key];
                }
            });

            if(body.password){
                const hashPassword = encrypt(body.password);
        
                existingUser.password = hashPassword;
            }
            const response = await existingUser.save();
            
            res.send({
                status: true,
                data: response
            });

        } catch (err) {
                res.status(422).send({
                    status: false,
                    err: err,
                    message: 'Internal Error'
                });
          }
    });

    app.post('/api/auth/studySignup', async (req, res) => {
        const body = req.body;
        const existingUser = await User.findOne({'email': body.email});

        if(existingUser){
            return res.status(201).send({
                status: false,
                errorCd : 'dup',
                message: '이메일이 이미 사용중입니다.'
            });
        }

        const arr = [];
        if(body.studyId) {
            arr.push(body.studyId);
        }

        const user = new User({
            email: body.email,
            password: body.password,
            name: body.name,
            status_cd: 'S',
            tel_no: body.tel_no,
            belongto: body.belongto,
            position: body.position,
            job: body.job,
            _studies: arr,
            address: body.address,
            img_path: body.img_path,
            isEmoticon: body.isEmoticon === undefined ? false : body.isEmoticon,
            intro: body.intro,
            isAgreed: true,
            regTime: Date.now(),    
        });

        const hashPassword = encrypt(body.password);
        
        user.password = hashPassword;
        
        try {
            const newUser = await user.save();


            if(body.studyId) {
                const study = await Study.findById(body.studyId);
                if( study.currentMemberCount === study.memCount) {
                    return res.send({
                        status: false,
                        message: '스터디 인원 제한을 초과하였습니다.'
                    })
                }
                study._user.push(newUser._id);
                study.currentMemberCount = study.currentMemberCount+1;
                study.save();

                const studyAssignment = await StudyAssignment.find({_study: body.studyId});

                const assignmentArray = [];
                const obj ={ _user: newUser._id, isDone: false };
                studyAssignment.map((assignment, index) => {

                    const newAssignCheck = { assignmentId: assignment._id, isChecked: false}
                    assignmentArray.push(newAssignCheck);

                    assignment.status.push(obj);
                    assignment.save();
                });

                newUser._assignments = assignmentArray;
                newUser.save();
            }

            res.send({
                status: true,
                data: newUser
            });
          } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
          }
    });
};