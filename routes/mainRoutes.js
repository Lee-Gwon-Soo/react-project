const mongoose = require('mongoose');
const requiredLogin = require('../middlewares/requiredLogin');
const BlogPost = mongoose.model('BlogPost');
const BlogCategory = mongoose.model('BlogCategory');
const Bookreview = mongoose.model('BookReview');
const User = mongoose.model('User');
const UserProfile = mongoose.model('UserProfile');
const PrivateMessage = mongoose.model('PrivateMessage');

//const mailer = require('../services/mail');
//mailer.sendSimpleMail('tempguan@gmail.com',"mKeyword에 로그인하셨습니다.", "이용해주셔서 감사합니다.");

module.exports = (app) => {
    app.get('/api/main/getFrontPost/:email', async (req, res) => {
        const email = req.params.email;

        try{
            const user = await User.findOne({email: email});

            if(!user){
                return res.status(201).send({
                    status:false,
                    errorCd: 'no_user',
                    message: '이메일이 잘못되었습니다.'
                });
            }

            const userId = user._id;

            //Get Recent Stories.
            const recentStories = await BlogPost.find({isUse: true, _user:user})
                .sort({ ins_dtime: -1})
                .limit(3);

            // Get Main Story
            const mainStory = await BlogPost.findOne({isMain:true, _user:userId});

            //Get Cateogries
            const categoryList = await BlogCategory.find({isOpen: true, _user:userId});

            //Get bookReviewList
            const bookReviewList = await Bookreview.find({_user: userId})
                .sort({ins_dtime: -1})
                .limit(5);
            
            const profile = await UserProfile.findOne({_user:userId});

            const data = {
                recent : recentStories,
                categoryList: categoryList,
                bookReviewList: bookReviewList,
                profile: profile,
                main:mainStory,
            }
            
            res.send({
                status: true,
                data: data
            });
        }
        catch(err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.get('/api/main/getBlogItem/:categoryId/:postId', async (req, res) => {
        const categoryId = req.params.categoryId;
        const postId = req.params.postId;

        try{
            const existingPost = await BlogPost.findOne({_id: postId, _category: categoryId});

            if(existingPost) {
                const userId = existingPost._user;

                const author = await User.findById(userId);

                res.send({
                    status: true,
                    data: existingPost,
                    author: author
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '블로그가 존재하지 않습니다.'
                })
            }
        }
        catch(err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.get('/api/book/review/getInfo/:id', async (req, res) => {
        const reviewId = req.params.id;
        const review = await Bookreview.findById(reviewId);

        try{
            if(!review) {
                return res.status(201).send({
                    status:false,
                    message: '해당하는 리뷰를 찾을 수 없습니다.'
                });
            }
            const userId = review._user;
            const author = await User.findById(userId);

            res.send({
                status: true,
                data: review,
                author: author
            });
        }catch(err){
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.get('/api/category/post/:categoryId', async (req, res) => {
        const categoryId = req.params.categoryId;

        try {
            const categoryInfo = await BlogCategory.findById(categoryId);
            const list = await BlogPost.find({_category: categoryId, isUse: true});
            
            if(list && categoryInfo) {
                res.send({
                    status: true,
                    categoryInfo: categoryInfo,
                    list:list
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: "해당 카테고리를 찾을 수 없습니다."
                })
            }
        } 
        catch(err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });
    
    app.post('/api/sendPrivateMessage/:userId', requiredLogin, async (req, res) => {
        const userId = req.params.userId;
        const data = req.body;

        try{
            const sender = await User.findById(userId);
            const receiver = await User.findOne({email: data.email});
            const message = new PrivateMessage({
                upper_message_id: null,
                sender_id: userId,
                receiver_id: receiver._id,
                receiverName: data.receiverName,
                receiverEmail: data.email,
                title: data.title,
                senderName: sender.name,
                content: data.content,
                ins_dtime: Date.now()
            })
            
            const result = await message.save();

            res.send({
                status: true,
                data:result,
            });
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/sendReplyMessage', requiredLogin, async (req, res) => {
        const target_email = req.body.target_email;
        const senderId = req.body.senderId;
        const ori_msg_id = req.body.ori_msg_id;
        const content = req.body.content;

        try{
            const sender = await User.findById(senderId);
            const receiver = await User.findOne({email: target_email});
            
            const message = new PrivateMessage({
                upper_message_id: ori_msg_id,
                sender_id: senderId,
                receiver_id: receiver._id,
                receiverName: receiver.name,
                receiverEmail: receiver.email,
                senderName: sender.name,
                content: content,
                isLast: true,
                ins_dtime: Date.now()
            });

            //last message update
            const original = await PrivateMessage.findOne({$or: [{_id: ori_msg_id}, {upper_message_id: ori_msg_id}]}).sort({ins_dtime: -1});
            original.isLast = false;
            const a = await original.save();
            
            const result = await message.save();

            result.isOwn = true;
            result.sender_id = null;
            result.receiver_id = null;

            res.send({
                status: true,
                data:result,
            });
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.get('/api/getPrivateMessage/:userId', requiredLogin, async (req, res) => {
        const userId = req.params.userId;

        try{
            let messageList = await PrivateMessage.find({ isLast: true, $or: [{receiver_id: userId}, {sender_id: userId, upper_message_id: { $ne: null }}]})
                    .sort({ins_dtime: -1}).select('_id upper_message_id title receiverEmail senderName receiverName isRead content ins_dtime');
            
            const list = [];
            for(let i = 0 ; i < messageList.length; i ++ ){
                const message = messageList[i];
                if(!message.title && message.upper_message_id) {
                    const original = await PrivateMessage.findById(message.upper_message_id);
                    const title = original.title;
                    message.title = title;
                }
                list.push(message);
            };
            
            res.send({
                status: true,
                data:list,
            });
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.get('/api/getMessageItem/:messageId/:userId', requiredLogin, async (req, res) => {
        let messageId = req.params.messageId; //root MessageId;
        let userId = req.params.userId;

        try{
            //get messages which I didn't read  --> make it status to "read"
            const messages = await PrivateMessage.find({upper_message_id: messageId, receiver_id: userId, isRead: false});
            messages.map(item => {
                item.isRead = true;
                item.save();
            })

            //get Root message
            let message = await PrivateMessage.findById(messageId);
            
            if(message.isRead === false) {
                message.isRead = true;
                message = await message.save();
            }

            let receiverId;
            if(message.sender_id.toString() === userId) {
                // I sent root message and I am watching it.
                // sender 나
                // receiver 상대방
                receiverId = message.receiver_id;
                message.isOwn = true;
            } else {
                // sender 상대방
                // receiver 나
                receiverId = message.sender_id;
                message.isOwn = false;
            }
            message.sender_id = null;
            message.receiver_id = null;

            //sender and receiver of root message
            const senderInfo = await User.findById(userId).select('email img_path name'); // 나
            const receiverInfo = await User.findById(receiverId).select('email img_path name'); // 상대방 

            let childList = await PrivateMessage.find({upper_message_id: messageId});

            childList = childList.map((item)=> {
                if(item.sender_id.toString() === userId) {
                    item.isOwn = true;
                } else {
                    item.isOwn = false;
                }
                item.sender_id = null;
                item.receiver_id = null;
                return item;
            });
            
            res.send({
                status: true,
                message:message,
                childList:childList,
                senderInfo: senderInfo,
                receiverInfo: receiverInfo,
            });
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.get('/api/main/getUserInfo/:userId', requiredLogin, async (req, res) => {
        const userId = req.params.userId;

        try {
            const existingUser = await User.findById(userId);
            const userProfile = await UserProfile.findOne({_user: userId});

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
                data: existingUser,
                intro :userProfile,
            });

        } catch (err) {
            res.status(422).send({
                status: false,
                err: err,
                message: 'Internal Error'
            });
          }
    });

    app.post('/api/main/saveUserIntro/:userId', requiredLogin, async (req, res) => {
        const userId = req.params.userId;
        const body = req.body;
        const keys = Object.keys(body);
       
        try {

            let profile = await UserProfile.findOne({_user: userId});
            if(profile) {
                keys.map(key => {
                    if(key.substring(0,1)  !== '_' || key === '_carrer') {
                        profile[key] = body[key];
                    }
                });
            } else {
                profile = new UserProfile({
                    _user: userId,
                    profile_img: body.profile_img,
                    name: body.name,
                    email: body.email,
                    belongto: body.belongto,
                    job: body.job,
                    interest: body.interest,
                    _carrer: [...body._carrer],
                    ins_dtime: Date.now()
                });
            }

            const result = await profile.save();
            res.send({
                status: true,
                data: result,
            });
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    
}