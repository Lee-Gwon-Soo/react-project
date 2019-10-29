import React from 'react';
import { Switch, withRouter } from 'react-router-dom';

import Aux from '../../HOC/Aux';
import Loading from '../Shared/Loading/Loading';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';

import AppRoute from './AppRoute';
import DashboardLayout from './DashboardLayout';
import EmptyLayout from './EmptyLayout';
import AllEmptyLayout from './AllEmptyLayout';

// import StudyDashboard from './StudyDashboard';
import StudyReaderLayout from './StudyReaderLayout';

//Front Main
import Main from '../Main/Main';
import About from '../Main/About';
import BlogReader from '../BlogReader/BlogReader';
import BookReader from '../BookReader/BookReader';
import CategoryList from '../CategoryList/CategoryList';


//Bookstore
import Bookstore from '../Bookstore/Bookstore';
import NewBookstore from '../Bookstore/NewBookstore/NewBookstore';
import NewBookReview from '../Bookstore/Bookshelf/NewBookReview';
import BookReviewDatail from '../Bookstore/BookReviewDetail/BookReviewDatail';

//Summary DashBoard
import SummaryBoard from '../Summary/SummaryBoard';

//Blog
import Blog from '../Blog/Blog';
import NewBlog from '../Blog/NewBlog/NewBlog';
import PostPage from '../Blog/BlogBoard/PostPage/PostPage';
import EditBlog from '../Blog/EditBlog/EditBlog';
import BlogCategory from '../Blog/BlogCategory/BlogCategory';
import EditBlogCategory from '../Blog/BlogCategory/EditBlogCategory';
import BlogDetail from '../Blog/BlogDetail/BlogDetail';

//Grit
// import GritList from '../Grit/GritList/GritList';
// import GritDetail from '../Grit/GritDetail/GritDetail';

//User
// import UserProfile from '../User/UserProfile';
import UserMessage from '../User/UserMessage';
import UserMessageDetail from '../User/UserMessageDetail';
import UserIntro from '../User/UserIntro';

//StudyDashboard
import StudyList from '../Study/StudyList/StudyList';
//import StudyCreate from '../Study/StudyCreate/StudyCreate';
import StudyCreateM from '../Study/StudyCreate/StudyCreateM';
import StudyUser from '../Study/StudyUser/StudyUser';
import StudyDetail from '../Study/StudyDetail/StudyDetail';
import StudyPost from '../Study/StudyPost/StudyPost';
import StudyPage from '../Study/StudyPage/StudyPage';
import StudyPostView from '../Study/StudyPostView/StudyPostView';
import StudySignup from '../Study/StudySignup/StudySignup';
import StudyAssignment from '../Study/StudyAssignment/StudyAssignment';
import NewAssignment from '../Study/StudyAssignment/NewAssignment';
import AssignmentProcess from '../Study/StudyAssignment/AssignmentProcess/AssignmentProcess';

const Layout = (props) => {
    let pageLayout = null;
    if(props.authenticated===null){
        pageLayout = <Loading />
    }
    else{
        pageLayout = (
            <div className="main_site">
                <Switch>
                    <AppRoute path='/login/:studyId' layout={AllEmptyLayout}  component={Login} />
                    <AppRoute path='/login' layout={AllEmptyLayout}  component={Login} />
                    <AppRoute path='/signup' layout={EmptyLayout}  component={Signup} />


                    {/* 메인 레이아웃 파트 */}
                    <AppRoute path='/user/intro' layout={StudyReaderLayout}  component={UserIntro} />
                    <AppRoute path='/dashboard/message/inbox' layout={StudyReaderLayout}  component={UserMessage} />
                    <AppRoute path='/dashboard/message/detail/:messageId' layout={StudyReaderLayout}  component={UserMessageDetail} />

                    <AppRoute path='/dashboard/blog' layout={StudyReaderLayout}  component={Blog} />
                    <AppRoute path='/dashboard/new/blog' layout={StudyReaderLayout}  component={NewBlog} />
                    <AppRoute path='/dashboard/category/new' layout={StudyReaderLayout}  component={BlogCategory} />
                    <AppRoute path='/dashboard/category/:mode/:categoryId' layout={StudyReaderLayout}  component={EditBlogCategory} />
                    {/* <AppRoute path='/dashboard/user' layout={StudyReaderLayout}  component={UserProfile} /> */}
                    <AppRoute path='/dashboard/summary' layout={StudyReaderLayout}  component={SummaryBoard} />
                    
                    <AppRoute path='/dashboard/bookstore/new' layout={AllEmptyLayout}  component={NewBookstore} />
                    <AppRoute path='/dashboard/book/edit/:id' layout={StudyReaderLayout}  component={BookReviewDatail} />
                    <AppRoute path='/dashboard/book/add' layout={StudyReaderLayout}  component={NewBookReview} />
                    <AppRoute path='/dashboard/bookstore' layout={StudyReaderLayout}  component={Bookstore} />

                    <AppRoute path='/dashboard' layout={StudyReaderLayout}  component={SummaryBoard} />
                    <AppRoute path='/blog/post/:id/edit' layout={StudyReaderLayout}  component={EditBlog} />
                    <AppRoute path='/blog/post/:id' layout={StudyReaderLayout}  component={PostPage}  auth={props.authenticated.id}/>
                    <AppRoute path='/blog/detail/:id' layout={StudyReaderLayout}  component={BlogDetail} />
                    {/* <AppRoute path='/grit/detail/:id' layout={DashboardLayout}  component={GritDetail} />
                    <AppRoute path='/grit/:id' layout={DashboardLayout}  component={GritDetail} /> */}


                    {/* 스터디 레이아웃 파트 */}
                    <AppRoute path='/study/dashboard/list' layout={StudyReaderLayout}  component={StudyList} />
                    <AppRoute path='/study/dashboard/user' layout={StudyReaderLayout}  component={StudyUser} />
                    <AppRoute path='/study/dashboard/create' layout={StudyReaderLayout}  component={StudyCreateM} />
                    <AppRoute path='/study/dashboard/edit/:studyId' layout={StudyReaderLayout}  component={StudyCreateM} />
                    <AppRoute path='/study/dashboard/detail/:study_id' layout={StudyReaderLayout}  component={StudyDetail} />
                    <AppRoute path='/study/dashboard/post/edit/:postId' layout={StudyReaderLayout}  component={StudyPost} />
                    <AppRoute path='/study/dashboard/post/:study_id' layout={StudyReaderLayout}  component={StudyPost} />
                    <AppRoute path='/study/signup/:studyId/recommend' layout={AllEmptyLayout}  component={StudySignup} />
                    <AppRoute path='/study/signup' layout={AllEmptyLayout}  component={StudySignup} />
                    <AppRoute path='/study/front/post/:postId' layout={StudyReaderLayout}  component={StudyPostView} />
                    <AppRoute path='/study/front/:studyId' layout={StudyReaderLayout}  component={StudyPage} />
                    <AppRoute path='/study/assignment/front/:study_id' layout={StudyReaderLayout}  component={StudyAssignment} />
                    <AppRoute path='/study/assignment/new/:studyId' layout={AllEmptyLayout}  component={NewAssignment} />
                    <AppRoute path='/study/assignment/:studyId/start/:assignmentId' layout={AllEmptyLayout}  component={AssignmentProcess} />
                    

                    <AppRoute path='/page/:email/about' layout={EmptyLayout}  component={About} />
                    <AppRoute path='/page/:email/post/:categoryId/:postId' layout={EmptyLayout}  component={BlogReader} />
                    <AppRoute path='/page/:email/book/review/:bookreviewId' layout={EmptyLayout}  component={BookReader} />
                    <AppRoute path='/page/:email/category/:categoryId' layout={EmptyLayout}  component={CategoryList} />
                    <AppRoute path='/page/:email' layout={EmptyLayout}  component={Main} />
                    
                
                    <AppRoute path='/' layout={EmptyLayout}  component={Login} />
                </Switch>
            </div>
        )
    }

    return (
            <Aux>
                {pageLayout}
                {props.children}
                {/* <Footer /> */}
            </Aux>
    )
}


export default withRouter(Layout);