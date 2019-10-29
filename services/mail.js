//email helper
const mongoose = require('mongoose');
var helper = require('sendgrid').mail;
var keys = require('../config/keys');
var from_email = new helper.Email(keys.SENDER_MAIL);
var sg = require('sendgrid')(keys.SENDGRID_API_KEY);
const MailLog = mongoose.model('maillogs');


module.exports = {
    sendSimpleMail :  (to_email, subject, text) => {
        var content = new helper.Content('text/plain', text);
        var mail = new helper.Mail(from_email, subject, new helper.Email(to_email), content);
        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON(),
        });
        
        sg.API(request, function(error, response) {
            //email log
            const log =  new MailLog({
                from_email: keys.SENDER_MAIL,
                to_email: to_email,
                content: text,
                is_sent: true,
                sent_dtime: Date.now()
            });
            //Save Log
            log.save();
        });
    },
    sendRecommendEmail : (email, studyId, sender_nm) => {
        var request = sg.emptyRequest();
	    request.body = {
            "from": {
                "email": keys.SENDER_MAIL,
                "name": "M-KEYWORD"
            },
            "personalizations" : [
                {
                    "to": [
                        {
                            "email": email,
                        }
                    ],
                    "dynamic_template_data":{
                        "sender": sender_nm, 
                        "url": keys.host+"/study/signup/"+studyId+"/recommend" 
                    }
                }
            ],
            "subject": "새로운 스터디 추천이 들어왔습니다.",
            "template_id": "d-83d146fd157a4b6c81e170188192c05d",
        };
        request.method = 'POST';
        request.path = '/v3/mail/send';
        
        sg.API(request, function(error, response) {
            //email log
            const log =  new MailLog({
                from_email: keys.SENDER_MAIL,
                to_email: email,
                content: studyId,
                is_sent: true,
                sent_dtime: Date.now()
            });
            //Save Log
            log.save();
        });
    },

    sendNewAssignmentMail : (mailArray, studyName, assignmentTitle, author) => {
        var request = sg.emptyRequest();
	    request.body = {
            "from": {
                "email": keys.SENDER_MAIL,
                "name": "M-KEYWORD"
            },
            "personalizations" : [
                {
                    "to": mailArray,
                    "dynamic_template_data":{
                        "sender": author, 
                        "assignmentTitle": assignmentTitle,
                        "studyName": studyName,
                        "url": keys.host+"/login" 
                    }
                }
            ],
            "subject": "새로운 과제가 등록되었습니다.",
            "template_id": "d-6b7775a5ffd746f7a06e36d40c263680",
        };
        request.method = 'POST';
        request.path = '/v3/mail/send';
        
        sg.API(request, function(error, response) {
            //email log
            const log =  new MailLog({
                from_email: keys.SENDER_MAIL,
                to_email: JSON.stringify(mailArray),
                content: assignmentTitle,
                is_sent: true,
                sent_dtime: Date.now()
            });

            //Save Log
            log.save();
        });
    },

    sendNewPostAlarm : (mailArray, postTitle, studyName, postId, author) => {
        var request = sg.emptyRequest();
	    request.body = {
            "from": {
                "email": keys.SENDER_MAIL,
                "name": "M-KEYWORD"
            },
            "personalizations" : [
                {
                    "to": mailArray,
                    "dynamic_template_data":{
                        "sender": author, 
                        "postTitle": postTitle,
                        "studyName": studyName,
                        "url": keys.host+"/study/front/post/" +postId
                    }
                }
            ],
            "subject": "새로운 포스트가 올라왔습니다.",
            "template_id": "d-1ca93107c72e41e6ab742fbad5fd163b",
        };
        request.method = 'POST';
        request.path = '/v3/mail/send';
        
        sg.API(request, function(error, response) {
            //email log
            const log =  new MailLog({
                from_email: keys.SENDER_MAIL,
                to_email: JSON.stringify(mailArray),
                content: postTitle,
                is_sent: true,
                sent_dtime: Date.now()
            });

            //Save Log
            log.save();
        });
    },

    sendTesterCodeEmail : (receiveMail, testCode) => {
        var request = sg.emptyRequest();
        try{
            request.body = {
                "from": {
                    "email": keys.SENDER_MAIL,
                    "name": "M-KEYWORD"
                },
                "personalizations" : [
                    {
                        "to": receiveMail,
                        "dynamic_template_data":{
                            "testCode": testCode, 
                        }
                    }
                ],
                "subject": "Your test code is just arrived!",
                "template_id": "d-d58c2a6c427149ab8faa79675b31c830",
            };
            request.method = 'POST';
            request.path = '/v3/mail/send';
            
            sg.API(request, function(error, response) {
                //email log
                const log =  new MailLog({
                    from_email: keys.SENDER_MAIL,
                    to_email: receiveMail,
                    content: testCode,
                    is_sent: true,
                    sent_dtime: Date.now()
                });

                //Save Log
                log.save();
                return "testcode : " +testCode;
            });
        } catch (err) {
            return "err : " +err;;
        }
    }
}
