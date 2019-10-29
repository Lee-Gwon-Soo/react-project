import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

import { Header, Sidebar } from "../CustomLayout/study_components";

import dashboardRoutes from "./StudyDashbaordRoutes";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../assets/study/scss/now-ui-dashboard.css";
import "../../assets/study/css/demo.css";


var ps;

class StudyDashboard extends React.Component {
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.mainPanel);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {
      this.refs.mainPanel.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }
  render() {
    const { history} = this.props;
    return (
      <div className="wrapper">
        <Sidebar {...this.props} routes={dashboardRoutes} 
          location={history.location}/>
        <div className="main-panel" ref="mainPanel">
          <Header {...this.props} location={history.location}/>
                {this.props.children}
        </div>
      </div>
    );
  }
}

export default StudyDashboard;
