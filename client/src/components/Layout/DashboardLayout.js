import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import CustomSidebar from './CustomSidebar';
import Header from "../CustomLayout/components/Header/Header.jsx";
import dashboardStyle from "../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import dashboardRoutes from "./DashboardRoutes";

import image from "../../assets/img/sidebar-2.jpg";
import logo from "../../assets/img/reactlogo.png";

class DashboardLayout extends React.Component {
  state = {
    open: false,
    mobileOpen: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  render() {
    const { classes, history, ...rest } = this.props;
    return (
      <div className={classes.wrapper}>
        <CustomSidebar 
          location={history.location}
          routes={dashboardRoutes}
          logoText={"m Keyword"}
          logo={logo}
          image={image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color="blue"
          {...rest}
        />
        <div className={classes.mainPanel} ref="mainPanel">
          <Header
            location={history.location}
            routes={dashboardRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          <div className={classes.content}>
            <div className={classes.container}>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DashboardLayout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(DashboardLayout);