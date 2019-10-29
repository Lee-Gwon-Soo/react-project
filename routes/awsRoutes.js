const mongoose = require('mongoose');
const requiredLogin = require('../middlewares/requiredLogin');
const keys = require('../config/keys');
var multer  = require('multer');
var upload = multer();

//AWS setting
const BUCKET_NAME = keys.bucket_name_blog;
const IAM_USER_KEY = keys.aws_access_key_id;
const IAM_USER_SECRET = keys.aws_secret_access_key;

var AWS = require('aws-sdk');
var s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
  });


module.exports = (app) => {
    app.post('/api/blog/post/imageUpload/:id', requiredLogin, upload.single('image'), async (req, res) => {
        const file = req.file;
        const userId = req.params.id

        var myKey = userId+'/'+file.originalname;

            var params = {
                Bucket: BUCKET_NAME, 
                Key: myKey, 
                Body: file.buffer, 
                ACL: 'public-read'
               };

            s3bucket.upload(params, function (err, data) {
                if (err) {
                    console.log(err);
                    res.status(500).send({
                        status: false,
                        err: err
                    });
                }
                res.send({
                    status: true,
                    data: data
                });
            });
    });

    app.post('/api/blog/category/imageUpload/:id', requiredLogin, upload.single('image'), async (req, res) => {
        const file = req.file;
        const userId = req.params.id
        var myBucket = 'voidimpact-category';

        var myKey = userId+'/'+file.originalname;

            var params = {
                Bucket: myBucket, 
                Key: myKey, 
                Body: file.buffer, 
                ACL: 'public-read'
               };

            s3bucket.upload(params, function (err, data) {
                if (err) {
                    res.status(500).send({
                        status: false,
                        err: err
                    });
                }
                res.send({
                    status: true,
                    data: data
                });
            });
    });
    

    app.post('/api/book/review/imageUpload/:id', requiredLogin, upload.single('image'), async (req, res) => {
        const file = req.file;
        const userId = req.params.id

        var myKey = userId+'/'+file.originalname;

            var params = {
                Bucket: 'voidimpact-book', 
                Key: myKey, 
                Body: file.buffer, 
                ACL: 'public-read'
               };

            s3bucket.upload(params, function (err, data) {
                if (err) {
                    res.status(500).send({
                        status: false,
                        err: err
                    });
                }
                res.send({
                    status: true,
                    data: data
                });
            });
    });
    
    app.post('/api/study/imageUpload/:id', requiredLogin, upload.single('image'), async (req, res) => {
        const file = req.file;
        const userId = req.params.id

        var myKey = userId+'/'+file.originalname;

            var params = {
                Bucket: 'mkeyword-study', 
                Key: myKey, 
                Body: file.buffer, 
                ACL: 'public-read'
               };

            s3bucket.upload(params, function (err, data) {
                if (err) {
                    res.status(500).send({
                        status: false,
                        err: err
                    });
                }
                res.send({
                    status: true,
                    data: data
                });
            });
    });

    app.post('/api/study/postImage/:id', requiredLogin, upload.single('image'), async (req, res) => {
        const file = req.file;
        const userId = req.params.id

        var myKey = userId+'/'+file.originalname;

            var params = {
                Bucket: 'mkeyword-study', 
                Key: myKey, 
                Body: file.buffer, 
                ACL: 'public-read'
               };

            s3bucket.upload(params, function (err, data) {
                if (err) {
                    res.status(500).send({
                        status: false,
                        err: err
                    });
                }
                res.send({
                    status: true,
                    data: data
                });
            });
    });

    app.post('/api/study/uploadFile/:id', requiredLogin, upload.single('file'), async (req, res) => {
        const file = req.file;
        const userId = req.params.id

        var myKey = userId+'/'+file.originalname;

            var params = {
                Bucket: 'mkeyword-study', 
                Key: myKey, 
                Body: file.buffer, 
                ACL: 'public-read'
               };

            s3bucket.upload(params, function (err, data) {
                if (err) {
                    res.status(500).send({
                        status: false,
                        err: err
                    });
                }
                res.send({
                    status: true,
                    data: data
                });
            });
    });

    app.post('/api/aws/uploadUserImage', upload.single('image'), async (req, res) => {
        const file = req.file;

        var myKey = file.originalname;

        var params = {
            Bucket: 'voidimpact-user', 
            Key: myKey, 
            Body: file.buffer, 
            ACL: 'public-read'
            };

        s3bucket.upload(params, function (err, data) {
            if (err) {
                console.log(err)
                res.status(500).send({
                    status: false,
                    err: err
                });
            }
            res.send({
                status: true,
                data: data
            });
        });
    });

    app.post('/api/study/assignment/questImage/:studyId', requiredLogin, upload.single('image'), async (req, res) => {
        const file = req.file;
        const studyId = req.params.studyId

        var myKey = 'Assignment_'+studyId+'/'+file.originalname;

            var params = {
                Bucket: 'mkeyword-study', 
                Key: myKey, 
                Body: file.buffer, 
                ACL: 'public-read'
               };

            s3bucket.upload(params, function (err, data) {
                if (err) {
                    res.status(500).send({
                        status: false,
                        err: err
                    });
                }
                res.send({
                    status: true,
                    data: data
                });
            });
    });
}