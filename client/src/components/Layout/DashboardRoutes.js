// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import AddBox from '@material-ui/icons/AddBox';
import EditIcon from '@material-ui/icons/Edit';
import FaceIcon from '@material-ui/icons/Face';
import BookIcon from '@material-ui/icons/Book';

import Blog from '../Blog/Blog';
import NewBlog from '../Blog/NewBlog/NewBlog';
import BlogCategory from '../Blog/BlogCategory/BlogCategory';
import UserProfile from '../User/UserProfile';
import BookStore from '../Bookstore/Bookstore';

const dashboardRoutes = [
  {
    path: "/dashboard/summary",
    sidebarName: "대시 보드",
    navbarName: "대시 보드",
    icon: Dashboard,
    component: Dashboard
  },
  {
    path: "/dashboard/user",
    sidebarName: "나의 정보",
    navbarName: "나의 정보",
    icon: FaceIcon,
    component: UserProfile
  },
  {
    path: "/dashboard/blog",
    sidebarName: "나의 블로그",
    navbarName: "나의 블로그",
    icon: 'content_paste',
    component: Blog
  },
  {
    path: "/dashboard/new/blog",
    sidebarName: "새로운 글 작성",
    navbarName: "새로운 스토리 ...",
    icon: EditIcon,
    component: NewBlog
  },
  {
    path: "/dashboard/category/new",
    sidebarName: "카테고리 추가",
    navbarName: "새로운 카테고리",
    icon: AddBox,
    component: BlogCategory
  },
  { divide: true, path: "/", to: "/dashboard", navbarName: "Redirect"},
  {
    path: "/dashboard/bookstore",
    sidebarName: "나의 서재",
    navbarName: "나의 서재",
    icon: BookIcon,
    component: BookStore
  },
  {
    path: "/dashboard/book/add",
    sidebarName: "새로운 도서 등록",
    navbarName: "새로운 도서 등록",
    icon: BookIcon,
    component: BookStore
  },
  { divide: true, path: "/", to: "/dashboard", navbarName: "Redirect"},
  {
    path: "/study/dashboard/list",
    sidebarName: "나의 스터디",
    navbarName: "나의 스터디",
    icon: BookIcon,
    component: BookStore
  },
  
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;
