const mongoose = require('mongoose');
const requiredLogin = require('../middlewares/requiredLogin');
const User = mongoose.model('User');
const Study = mongoose.model('Study');
const StudyPost = mongoose.model('StudyPost');
const StudyPostReply = mongoose.model('StudyPostReply');
const StudyAssignment = mongoose.model('StudyAssignment');
const PrivateMessage = mongoose.model('PrivateMessage');

module.exports = (app) => {
    app.post('/api/study/setStudyId', async (req,res) => {
        const studyId = req.body.studyId;
        let session = req.session.user;
        session.study_id = studyId;
        req.session.user = session;
        res.send(req.session.user);
    })

    app.get('/api/getcurrent_study', (req, res) => {
        res.send(req.session.study);
    });

    app.get('/api/study/getUserCountInformation/:userId', async (req,res)=>{
        const userId = req.params.userId;

        try{
            const user = await User.findById(userId);
            const unReadMessage = await PrivateMessage.find({receiver_id: userId ,isRead: false, isLast: true}).countDocuments();
            let unDone = [];

            user._assignments.map(item => {
                if(!item.isChecked){
                    unDone.push(item.assignmentId);
                }
                return item;
            });
            
            const assignments = await StudyAssignment.find({ _id: { "$in" : unDone} });
            res.send({
                status: true,
                assignments: assignments,
                unReadMessage: unReadMessage
            });
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    })


    app.post('/api/study/create/:id', requiredLogin, async (req, res) => {
        const data = req.body;
        const userId = req.params.id;
        try{

            const user = await User.findById(userId);
            data._user = [userId];
            data.creater_id = userId;
            data.ins_dtime = Date.now();
            const newStudy = new Study(data);
            const result = await newStudy.save();
            
            if(!user._studies){
                user._studies = [];
            }
            user._studies.push(result._id);
            user.save();

            if(result) {
                res.send({
                    status: true,
                    data: result
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '스터디 저장에 문제가 생겼습니다.'
                })
            }
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/study/modify/:id', requiredLogin, async (req, res) => {
        const data = req.body;
        const studyId = req.params.id;
        const keys = Object.keys(data);
        try{

            const study = await Study.findById(studyId);

            keys.map(key => {
                if(key.substring(0,1)  !== '_') {
                    study[key] = data[key];
                }
            });

            const result = await study.save();

            if(result) {
                res.send({
                    status: true,
                    data: result
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '스터디 저장에 문제가 생겼습니다.'
                })
            }
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.get('/api/study/getList/:userId', requiredLogin, async (req, res)=>{
        const userId = req.params.userId;
        try{
            
            const studyList = await User.findById(userId).populate('_studies');
            res.send({
                status: true,
                data: studyList
            });
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.get('/api/study/getStudyInfo/:studyId/:userId', async (req, res) => {
        const studyId = req.params.studyId;
        const userId = req.params.userId;

        try{
            const study = await Study.findById(studyId).populate('_user');
            let isMember = false;
            study._user.map((item, index) => {
                if(item.id.toString() == userId) {
                    isMember = true;
                }
                item.password = null;
                item._id = null;
            });
            
            let isCreator = false;
            if(study.creater_id.toString() === userId) {
                isCreator = true;
            }

            const postList = await StudyPost.find({_study: studyId}).sort({ins_dtime: -1});

            res.send({
                status: true,
                data: study,
                list:postList,
                isCreator:isCreator,
                isMember: isMember
            });
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/study/saveStudyPost/:studyId/:userId', requiredLogin, async (req, res) => {
        const data = req.body;
        const studyId = req.params.studyId;
        const userId = req.params.userId;

        try{
            const user = await User.findById(userId);

            data._study = studyId;
            data.author = user.name;
            data.ins_dtime = Date.now();
            const newStudyPost = new StudyPost(data);

            const result = await newStudyPost.save();

            if(result) {
                const studyInfo = await Study.findById(studyId).populate('_user');
                const emailArray=[];

                studyInfo._user.map((item, index) => {
                    emailArray.push({ "email" : item.email})
                });

                const mailer = require('../services/mail');
                mailer.sendNewPostAlarm(emailArray, data.title, studyInfo.name, result._id, user.name);

                res.send({
                    status: true,
                    data: result
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '포스트 저장에 문제가 생겼습니다.'
                })
            }
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/study/modifyStudyPost/:postId', requiredLogin, async (req, res) => {
        const data = req.body;
        const postId = req.params.postId;
        const keys = Object.keys(data);

        try{
            const studyPost = await StudyPost.findById(postId);

            keys.map(key => {
                if(key.substring(0,1)  !== '_') {
                    studyPost[key] = data[key];
                }
            });

            const result = await studyPost.save();
            if(result) {
                res.send({
                    status: true,
                    data: result
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '포스트 저장에 문제가 생겼습니다.'
                })
            }
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    //Get Total information of study.
    app.get('/api/study/front/getTotalInfo/:studyId', requiredLogin, async (req, res) => {
        const studyId = req.params.studyId;

        try{
            const study = await Study.findById(studyId);
            const postList = await StudyPost.find({_study: studyId});

            res.send({
                status: true,
                data: study,
                list:postList
            });
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.get('/api/study/front/getStudyPostInfo/:postId', requiredLogin, async (req, res) => {
        const postId = req.params.postId;

        try{
            const studypost = await StudyPost.findById(postId);
            let study = null;
            if(studypost){
                study = await Study.findById(studypost._study);
            }

            const replyList = await StudyPostReply.find({_post: postId, upper_reply_id: null});

            let replyChildArray = {};
            if(replyList.length > 0) {
                for (let i = 0 ; i< replyList.length ; i++ ){
                    const data = await StudyPostReply.find({_post: postId, upper_reply_id: replyList[i]._id});
                    replyChildArray[replyList[i]._id] = [...data];
                }
            }

            res.send({
                status: true,
                data: studypost,
                replyList: replyList,
                replyChildArray:replyChildArray,
                studyInfo: study,
            });
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/study/post/saveReply/:postId/:userId', requiredLogin, async (req, res) => {
        const content = req.body.content;
        const postId = req.params.postId;
        const userId = req.params.userId;

        try{
            const user = await User.findById(userId);
            
            const newReply = new StudyPostReply({
                _post: postId,
                img_path: user.img_path,
                author: user.name,
                content: content,
                ins_dtime: Date.now()
            })

            const result = await newReply.save();

            if(result){
                const post = await StudyPost.findById(postId);
                post.replyCount = (!post.replyCount ? 0 : post.replyCount) + 1;
                post.save();
            }

            if(result) {
                res.send({
                    status: true,
                    data: result
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '의견 게시에 문제가 생겼습니다.'
                })
            }
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/study/send/recommendMail/:userId', requiredLogin, async (req, res) => {
        const body = req.body;
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(500).send({
                status: false,
                message: '메일을 전송할 수 없습니다.'
            });
        }
        const mailer = require('../services/mail');
        mailer.sendRecommendEmail(body.email, body.studyId, user.name);

        res.send({
            status: true,
        });
    });

    app.post('/api/study/post/saveChildReply/:postId/:userId', requiredLogin, async (req, res) => {
        const data = req.body;
        const postId = req.params.postId;
        const userId = req.params.userId;

        try{
            const user = await User.findById(userId);
            
            const newReply = new StudyPostReply({
                _post: postId,
                img_path: user.img_path,
                author: user.name,
                content: data.content,
                upper_reply_id: data.upper_reply_id,
                ins_dtime: Date.now()
            })

            const result = await newReply.save();

            if(result) {
                res.send({
                    status: true,
                    data: result
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '의견 게시에 문제가 생겼습니다.'
                })
            }
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/study/saveAssignment/:studyId/:userId', requiredLogin, async (req, res) => {
        const questionList = req.body.data;
        const title = req.body.title
        
        const studyId = req.params.studyId;
        const userId = req.params.userId;

        try{
            //creator information
            const user = await User.findById(userId);
            
            const studyInfo = await Study.findById(studyId).populate('_user');
            
            const status = [];
            const emailArray=[];

            studyInfo._user.map((item, index) => {
                status.push({
                    _user: item._id,
                    isDone: false,
                });
                emailArray.push({ "email" : item.email})
            });

            const newAssignment = new StudyAssignment({
                _study: studyId,
                title: title,
                publisher: user.name,
                publisher_img: user.img_path,
                questionList: questionList,
                questionCount: questionList.length,
                status: status,
                ins_dtime: Date.now()
            })

            const result = await newAssignment.save();

            //user들에게 각각 넣어주어야함.
            const assignmentId = result._id;
            studyInfo._user.map( async (id, index) => {
                const singleUser = await User.findById(id);
                const newAssignCheck = { assignmentId: assignmentId, isChecked: false}
                singleUser._assignments.push(newAssignCheck);
                singleUser.save();
            });

            const mailer = require('../services/mail');
            mailer.sendNewAssignmentMail(emailArray, studyInfo.name, result.title, user.name);

            if(result) {
                res.send({
                    status: true,
                    data: result
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '과제 저장에 문제가 생겼습니다.'
                })
            }
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.get('/api/study/getAssignmentList/:studyId/:userId', requiredLogin, async (req, res) => {
        const studyId = req.params.studyId;
        const userId = req.params.userId;
        try{
            const assignmentList = await StudyAssignment.find({_study: studyId}).sort({ins_dtime: -1});
            
            let doneCount = 0;
            if(assignmentList.length>0 ) {
                assignmentList.map((assignment, index) => {
                    const status = assignment.status.filter(x => x._user.toString() === userId);
                    if(status[0].isDone) {
                        doneCount ++ ;
                    }
                })
            }
            res.send({
                status: true,
                data: assignmentList,
                doneCount: doneCount
            });

        }
        catch( err ) {
            res.status(422).send({
                status: false,
                err:err
            })
        }
    });

    app.get('/api/study/getAssignment/question/:assignmentId/:userId', requiredLogin, async (req, res) => {
        const assignmentId = req.params.assignmentId;
        const userId = req.params.userId;

        try{
            const assignmentInfo = await StudyAssignment.findById(assignmentId);

            //진행 중으로 변경
            assignmentInfo.status = assignmentInfo.status.map(item => {
                if(item._user.toString() === userId) {
                    item.isProcessing = true;
                }
                return item;
            });
            assignmentInfo.save();

            //체크 한것으로 변경
            const user = await User.findById(userId);
            user._assignments = user._assignments.map(item => {
                if(item.assignmentId.toString() === assignmentId){
                    item.isChecked = true;
                }
                return item;
            })
            user.save();

            const statusArray = assignmentInfo.status;
            const userStatus = statusArray.filter(item => item._user.toString() === userId);
            
            let startStep = 0;
            if(userStatus.isDone) {
                startStep = assignment.questionList.length;
            } 

            const completed = [];
            userStatus[0].processStatus.map(item => {
                if(item.result === true){
                    completed.push(parseInt(item.index));
                }
            });

            res.send({
                status: true,
                data: assignmentInfo,
                userStatus: userStatus,
                startStep: startStep,
                completed:completed
            });

        }
        catch( err ) {
            res.status(422).send({
                status: false,
                err: "문제가 생겼습니다."
            })
        }
    });

    app.post('/api/study/assignment/saveStatus/:userId/:assignmentId', requiredLogin, async (req, res) => {
        const status = req.body.data;
        
        const assignmentId = req.params.assignmentId;
        const userId = req.params.userId;

        try{
            //creator information
            const user = await User.findById(userId);
            
            const assignmentInfo = await StudyAssignment.findById(assignmentId);

            assignmentInfo.status = assignmentInfo.status.map(item => {
                if(item._user.toString() === userId) {
                    item.processStatus = [...status];
                    item.isProcessing = true;
                }
                return item;
            });
            const result = await assignmentInfo.save();

            if(result) {
                res.send({
                    status: true,
                    data: result
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '과제 상태 저장에 문제가 생겼습니다.'
                })
            }
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/study/completeAssignment/:userId/:assignmentId', requiredLogin, async (req, res) => {
        const assignmentId = req.params.assignmentId;
        const userId = req.params.userId;

        try{
            //creator information
            const user = await User.findById(userId);
            
            const assignmentInfo = await StudyAssignment.findById(assignmentId);

            assignmentInfo.status = assignmentInfo.status.map(item => {
                if(item._user.toString() === userId) {
                    item.isProcessing = false;
                    item.isDone = true;
                    item.complete_dtime = Date.now();
                }
                return item;
            });

            const result = await assignmentInfo.save();

            if(result) {
                res.send({
                    status: true,
                    data: result
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '과제 상태 저장에 문제가 생겼습니다.'
                })
            }
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/study/giveLikes/:replyId', requiredLogin, async (req, res) => {
        const replyId = req.params.replyId;

        try{
            const reply = await StudyPostReply.findById(replyId);
            reply.likes += 1;
            reply.save();

            res.send({
                status: true,
            });
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/study/joinStudy',  requiredLogin, async (req, res) => {
        const studyId = req.body.studyId;
        const userId = req.body.userId;

        try{
            if(studyId) {
                const study = await Study.findById(studyId);
                if( study.currentMemberCount === study.memCount) {
                    return res.send({
                        status: false,
                        message: '스터디 인원 제한을 초과하였습니다.'
                    })
                }
                const newUser = await User.findById(userId);
                study._user.push(newUser._id);
                study.currentMemberCount = study.currentMemberCount+1;
                study.save();

                const studyAssignment = await StudyAssignment.find({_study: studyId});

                const obj ={ _user: newUser._id, isDone: false };
                studyAssignment.map((assignment, index) => {

                    const newAssignCheck = { assignmentId: assignment._id, isChecked: false}
                    newUser._assignments.push(newAssignCheck);

                    assignment.status.push(obj);
                    assignment.save();
                });

                newUser._studies.push(studyId);
                newUser.save();


                res.send({
                    status: true,
                });
            } else {
                return res.status(500).send({
                    status: false,
                    message: '스터디를 찾을 수 없습니다. 관리자에게 문의 바랍니다.'
                })
            }
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });
    
}