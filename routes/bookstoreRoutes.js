const mongoose = require('mongoose');
const requiredLogin = require('../middlewares/requiredLogin');
const Bookstore = mongoose.model('Bookstore');
const Book = mongoose.model('Book');
const Bookreview = mongoose.model('BookReview');

module.exports = (app) => {
    app.get('/api/bookstore/:id', async (req, res) => {
        try {
            const userBookstore = await Bookstore.findOne({_user: req.params.id})
            
            if(!userBookstore) {
                return res.status(201).send({
                    status:false,
                    errorCd: 'no_bookstore',
                    message: 'No Bookstore Found'
                });
            }

            res.send({
                status: true,
                data: userBookstore
            });
          } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
          }
        
    });

    // Add more bookstore
    app.post('/api/bookstore/add/:id', requiredLogin, async (req, res) => {
        const data = req.body;
        const userId = req.params.id;

        let limit = 0;
        switch(data.plan) {
            case 'basic': 
                limit = 100;
                break;
            case 'pros':
                limit = 9999;
                break;
            default :
                limit = 100;
        }

        const checkbookstore = await Bookstore.findOne({bookstoreCode: data.storeCd});
        if(checkbookstore) {
            return res.status(500).send({
                status: false,
                message: '이미 존재하는 서재 코드입니다.'
            });
        }

        const bookstore = new Bookstore({
            _user: userId,
            bookcount: 0,
            nickname: data.nickname,
            bookstoreCode: data.storeCd,
            plan: data.plan,
            limit: limit,
            ins_dtime: Date.now()
        })

        try {
            const newBookstore = await bookstore.save();

            res.send({
                status: true,
                data: newBookstore
            });
          } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
          }
    });

    app.post('/api/bookstore/saveReview/:id', requiredLogin, async (req, res) => {
        const userId = req.params.id;
        const data = req.body;

        //save book first
        const book = new Book({
            title: data.bookInfo.title,
            author: data.bookInfo.author,
            reviewCount: 0,
            reviewId:[],
            publisher: data.bookInfo.publisher,
            ins_dtime: Date.now() 
        });

        try {
            const newBook = await book.save();
            if(newBook){
                const bookstore = await Bookstore.findOne({_user:userId});
                
                if(!bookstore._book){
                    bookstore._book = [];
                }

                bookstore._book.push(newBook._id);
                bookstore.bookcount = bookstore.bookcount+1;
                bookstore.save();

                const bookreview = new Bookreview({
                    _book: newBook.id,
                    _user: userId,
                    title: 'testFile',
                    content: data.content,
                    claps: 0,
                    ins_dtime: Date.now()
                })
                const newReview = await bookreview.save();

                if(!newReview.reviewId){
                    newReview.reviewId = [];
                }
                newBook.reviewId.push(newReview.id);
                newBook.save();

                if(newReview){
                    res.send({
                        status: true,
                        data: newReview
                    });
                }else{
                    res.status(500).send({
                        status: false,
                        message: '리뷰를 등록하는데 문제가 생겼습니다.'
                    });
                }
            }else{
                res.status(500).send({
                    status: false,
                    message: '새로운 책을 등록하는데 문제가 생겼습니다.'
                });
            }
          } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
          }

    });


    app.get('/api/bookstore/review/getInfo/:id', requiredLogin, async (req, res) => {
        const reviewId = req.params.id;
        const review = await Bookreview.findById(reviewId);

        try{
            if(!review) {
                return res.status(201).send({
                    status:false,
                    message: '해당하는 리뷰가 없습니다.'
                });
            }

            res.send({
                status: true,
                data: review
            });
        }catch(err){
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/bookstore/modifyReview/:id', requiredLogin, async (req, res) => {
        const id = req.params.id;
        const existingReview = await Bookreview.findOne({_id:id});
        
        if(existingReview) {
            existingReview.content = req.body.content;
            try{
                const review = await existingReview.save();
    
                res.send({
                    status: true,
                    data: review
                });
            }catch(err){
                res.status(500).send({
                    status: false,
                    message: '수정에 문제가 생겼습니다.'
                });
            }
        } else {
            res.status(500).send({
                status: false,
                message: '저장할 테이터가 올바르지 않습니다.'
            });
        }
    });

    app.get('/api/bookstore/getBookList/:id', requiredLogin, async (req, res) => {
        const userId = req.params.id;
        
        const bookstore = await Bookstore.findOne({_user:userId});

        try{
            const reviewList = await Bookreview.find({_bookstoreId: bookstore._id});

            res.send({
                status: true,
                data: reviewList
            });
        }catch(err){
            res.status(500).send({
                status: false,
                message: '수정에 문제가 생겼습니다.'
            });
        }
    });

    app.post('/api/bookstore/saveNewReview/:id', requiredLogin, async (req, res) => {
        const userId = req.params.id;
        const body = req.body;
        
        const bookstore = await Bookstore.findOne({_user:userId});

        try{
            const bookreview = new Bookreview({
                _user : userId,
                _bookstoreId : bookstore._id,
                bookTitle: body.bookTitle,
                author: body.author,
                publisher: body.publisher,
                img_path: body.img_path,
                ISBN: body.ISBN,
                title : body.title,
                content: body.content,
                is_shared: false,
                claps: 0,
                ins_dtime: Date.now()
            });

            const result = await bookreview.save();

            //현재 등록된 도서 수 증가
            bookstore.bookcount += 1;
            bookstore.save();

            res.send({
                status: true,
                data: result
            });
        }catch(err){
            res.status(500).send({
                status: false,
                message: '수정에 문제가 생겼습니다.'
            });
        }
    });

    app.post('/api/bookstore/saveEditBookReview/:id', requiredLogin, async (req, res) => {
        const reviewId = req.params.id;
        const body = req.body;

        try{
            const review = await Bookreview.findById(reviewId);
            review.bookTitle = body.bookTitle;
            review.author = body.author;
            review.publisher = body.publisher;
            review.img_path = body.img_path;
            review.ISBN = body.ISBN;
            review.title = body.title;
            review.content = body.content;
            review.is_shared = body.is_shared;
            review.upd_dtime = Date.now();

            const result = await review.save();

            res.send({
                status: true,
                data: result
            });
        }catch(err){
            res.status(500).send({
                status: false,
                message: '수정에 문제가 생겼습니다.'
            });
        }
    });

    app.post('/api/bookstore/generateStoreCode', requiredLogin, async (req, res) => {
        try{
            let newCode;
            while(true){
                newCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                
                const bookstore = await Bookstore.findOne({bookstoreCode: newCode});
                
                if(!bookstore) {
                    break;
                }
            }

            res.send({
                status: true,
                data: newCode
            });
        }catch(err){
            res.status(500).send({
                status: false,
                message: '수정에 문제가 생겼습니다.'
            });
        }
    });
}