import StudyList from "../Study/StudyList/StudyList";
var dashRoutes = [
  {
    path: "/study/dashboard/list",
    name: "스터디 리스트",
    icon: "design_app",
    component: StudyList
  },
  {
    path: "/study/dashboard/create",
    name: "스터디 개설",
    icon: "arrows-1_share-66",
    component: StudyList
  },
  { redirect: true, path: "/", pathTo: "/dashboard", name: "Dashboard" }
];
export default dashRoutes;
