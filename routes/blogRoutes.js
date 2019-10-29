const mongoose = require('mongoose');
const requiredLogin = require('../middlewares/requiredLogin');
const BlogPost = mongoose.model('BlogPost');
const BlogCategory = mongoose.model('BlogCategory');
const PostReply = mongoose.model('BlogReply');

module.exports = (app) => {
    app.post('/api/blog/saveBlog/:id', requiredLogin, async (req, res) => {
        const userId = req.params.id;
        const data = req.body;

        const blogPost = new BlogPost({
            _user : userId,
            title : data.title,
            content: data.content,
            basicImage: data.basicImage,
            isMain: data.isMain,
            isPublish: data.isPublish,
            publish_name: data.publish_name,
            ins_dtime: Date.now(),
        });

        if(data.category !== '') {
            const blogCategory = await BlogCategory.findById(data.category);
            blogPost._category = blogCategory._id;
            blogPost._categoryTitle = blogCategory.title;
        }

        try{
            // Set Previous one to false.
            if(data.isMain === true ) {
                const existingMain = await BlogPost.findOne({isMain: true});
                if(existingMain) {
                    existingMain.isMain = false;
                    existingMain.save();
                }
            }
            const saveData = await blogPost.save();

            if(saveData) {
                res.send({
                    status: true,
                    data: saveData
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '블로그를 저장하는데 문제가 생겼습니다.'
                })
            }
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/blog/modifyBlog/:id', requiredLogin, async (req, res) => {
        const postId = req.params.id;
        const data = req.body;

        const blogPost = await BlogPost.findById(postId);

        if(!blogPost) {
            res.status(500).send({
                status: false,
                message: '포스트 데이터가 없습니다.'
            })
        }

        blogPost.title = data.title;
        blogPost.content = data.content;
        blogPost.basicImage = data.basicImage;
        blogPost.isPublish = data.isPublish;
        blogPost.publish_name = data.publish_name;
        blogPost.upd_dtime = Date.now();


        if(data.category !== '') {
            const blogCategory = await BlogCategory.findById(data.category);
            blogPost._category = data.category;
            blogPost._categoryTitle = blogCategory.title;
        }

        try{
            const modifiedData = await blogPost.save();

            if(modifiedData) {
                res.send({
                    status: true,
                    data: modifiedData
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '블로그를 수정하는데 문제가 생겼습니다.'
                })
            }
        } catch (err) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.get('/api/blog/getBlogList/:id/:user_id', requiredLogin, async (req, res) => {
        const categoryId = req.params.id;
        const userId = req.params.user_id;
        try{
            
            let blogList;
            if(categoryId === 'undefined'){
                blogList = await BlogPost.find({_category: null});
            } else {
                blogList = await BlogPost.find({_category: categoryId});
            }

            const currentTopItem = await BlogPost.findOne({_user: userId, isMain:true});
            
            // console.log(currentTopItem);
            res.send({
                status: true,
                data: blogList,
                topItem:currentTopItem
            });
        } catch( err ) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.get('/api/blog/post/getInfo/:id', requiredLogin, async (req, res)=> {
        const postId = req.params.id;

        try{
            const blog = await BlogPost.findById(postId);

            if(blog) {

                const categoryList = await BlogCategory.find({_user: blog._user});

                res.send({
                    status: true,
                    data: blog,
                    categoryList: categoryList
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '블로그를 가져오는데 문제가 생겼습니다.'
                })
            }
        } catch( err ) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.get('/api/blog/getCategoryList/:id', requiredLogin, async (req, res) => {
        const userId = req.params.id;

        try{
            const categoryList = await BlogCategory.find({_user: userId});

            res.send({
                status: true,
                data: categoryList
            });
        } catch( err ) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.get('/api/category/getCategoryInfo/:id', requiredLogin, async (req, res) => {
        const categoryId = req.params.id;
        try{
            const blogCategory = await BlogCategory.findOne({_id: categoryId});

            if(blogCategory) {
                res.send({
                    status: true,
                    data: blogCategory
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '카테고리가 존재하지 않습니다.'
                })
            }
        } catch( err ) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/blog/category/modifyCategory/:id', requiredLogin, async (req, res) => {
        const category_id = req.params.id;
        const data = req.body;

        try{
            const blogCategory = await BlogCategory.findOne({_id: category_id});
            blogCategory.title = data.title;
            blogCategory.description = data.description;
            blogCategory.imagePath = data.imagePath;
            blogCategory.detail_descrption = data.detail_descrption;
            blogCategory.upd_dtime = Date.now();

            const result = await blogCategory.save();

            if(result) {
                BlogPost.update({_category : category_id}, {_categoryTitle: data.title}, {'multi':true} ,function(err, result){});
                res.send({
                    status: true,
                    data: result
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '카테고리를 수정하는데 문제가 생겼습니다.'
                })
            }
        } catch( err ) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/blog/category/saveCategory/:id', requiredLogin, async (req, res) => {
        const userId = req.params.id;
        const data = req.body;

        try{
            const blogCategory = new BlogCategory({
                _user: userId,
                title: data.title,  
                description: data.description,
                detail_descrption: data.detail_descrption,
                isOpen: false,
                imagePath: data.imagePath,
                ins_dtime: Date.now()
            });

            const newCategory = await blogCategory.save();

            if(newCategory) {
                res.send({
                    status: true,
                    data: newCategory
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '카테고리를 저장하는데 문제가 생겼습니다.'
                })
            }
        } catch( err ) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.delete('/api/blog/deleteBlog/:id', requiredLogin, async (req, res) => {
        const postId = req.params.id;
        
        const response = await BlogPost.deleteOne({_id: postId});

        res.send({
            status: true,
            data: response
        });
    });

    app.post('/api/blog/selectTopItem', requiredLogin, async (req, res) => {
        const data = req.body;

        try{
            const prevPost = await BlogPost.findOne({_category: data.category, isTopItem: true});
            if(prevPost) {
                prevPost.isTopItem = false;
                const sample = await prevPost.save();
                prevId = prevPost._id;
            } else {
                prevId = null;
            }

            const newPost = await BlogPost.findById(data.selectedId);
            newPost.isTopItem = true;

            const responseData = await newPost.save();
            
            if(responseData) {
                res.send({
                    status: true,
                    data: responseData,
                    prevId: prevId
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '인기 스토리를 저장하는데 문제가 생겼습니다.'
                })
            }
        } catch( err ) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/blog/selectAsMainTopPost', requiredLogin, async (req, res) => {
        const data = req.body;

        try{
            const newPost = await BlogPost.findById(data.selectedId);
            if(!newPost.basicImage) {
                return res.send({
                    status: false,
                    message: '대표 사진이 있는 포스트만 메인 포스트로 지정할 수 있습니다.'
                });
            }

            if( newPost.isMain ) {
                return res.send({
                    status: false,
                    message: '현재 대표 글로 지정 되어 있습니다.'
                });
            }
            
            const prevPost = await BlogPost.findOne({_id: data.selectedId, isMain: true});
            if(prevPost) {
                prevPost.isMain = false;
                const result = await prevPost.save();
            } 

            newPost.isMain = true;
            const responseData = await newPost.save();
            
            if(responseData) {
                res.send({
                    status: true,
                    data: responseData,
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '블로그 메인 블로그를 저장하는데 문제가 생겼습니다.'
                })
            }
        } catch( err ) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/blog/modifyCategory/open/:id', requiredLogin, async (req, res) => {
        const id = req.params.id;
        
        try {
            const existingCategory = await BlogCategory.findOne({_id: id});
            if(!existingCategory) {
                return res.status(500).send({
                    status: false,
                    message: '카테고리가 존재하지 않습니다.'
                })
            }
            existingCategory.isOpen = !existingCategory.isOpen;

            const responseData = await existingCategory.save();
            
            if(responseData) {
                res.send({
                    status: true,
                    data: responseData
                });
            } else {
                res.status(500).send({
                    status: false,
                    message: '카테고리 공개 설정에 문제가 생겼습니다.'
                })
            }
        }catch( err ) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.delete('/api/blog/deleteCategory/:id', requiredLogin, async (req, res) => {
        const id = req.params.id;
        try {
            const response = await BlogCategory.deleteOne({_id: id});
            if(!response) {
                return res.status(500).send({
                    status: false,
                    message: '카테고리가 존재하지 않습니다.'
                })
            } else {
                res.send({
                    status: true,
                    data: response
                });
            }
        }catch( err ) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    //save blog reply
    app.post('/api/post/reply/save/:postId', async (req,res) => {
        const postId = req.params.postId;

        const reply = new PostReply({
            _postId: postId,
            content: req.body.content,
            author: req.body.author,
            reg_dtime: Date.now(),
            likes: 0,
            hates: 0,
            is_deleted: 0,
        });

        try{
            const response = await reply.save();
            if(!response) {
                return res.status(500).send({
                    status: false,
                    message: '댓글을 저장하는데 문제가 생겼습니다.'
                })
            } else {
                res.send({
                    status: true,
                    data: response
                });
            }
        }catch( err ) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.get('/api/post/reply/getpostReply/:postId', async (req, res) => {
        const postId = req.params.postId;

        const replyList = await PostReply.find({_postId: postId});
        res.send({
            status: true,
            data: replyList
        });
    });

    app.post('/api/post/reply/hate/:replyId', async (req, res) => {
        const replyId = req.params.replyId;

        try{
            const reply = await PostReply.findById(replyId);

            reply.hates = reply.hates + 1;

            const result = await reply.save();
            res.send({
                status: true,
                data: result
            });
        }catch( err ) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/post/reply/like/:replyId', async (req, res) => {
        const replyId = req.params.replyId;

        try{
            const reply = await PostReply.findById(replyId);

            reply.likes = reply.likes + 1;

            const result = await reply.save();
            res.send({
                status: true,
                data: result
            });
        }catch( err ) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    });

    app.post('/api/blog/changeUsage', requiredLogin, async (req, res) => {
        const postIds = req.body.postIds;
        const state = req.body.state;

        try{
            const posts = await BlogPost.find({ _id: { "$in" : postIds} });
            const revised = posts.map( post => {
                post.isUse = state;
                return post;
            });

            revised.map( async post=> {
                const sub = await post.save();
                return sub;
            });

            res.send({
                status: true,
                data: revised
            });
        }catch( err ) {
            res.status(422).send({
                status: false,
                err: err
            });
        }
    })
}