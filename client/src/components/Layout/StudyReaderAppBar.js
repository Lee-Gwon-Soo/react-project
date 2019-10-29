import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import EjectIcon from '@material-ui/icons/Eject';
import MailOutline from '@material-ui/icons/MailOutline';
import MoreIcon from '@material-ui/icons/MoreVert';

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    paddingLeft: theme.spacing.unit,
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    paddingRight: theme.spacing.unit,
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    paddingRight: theme.spacing.unit,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

class StudyReaderAppBar extends React.Component {
    state = {
        anchorEl: null,
        mobileMoreAnchorEl: null,
        assignments: [],
        unReadMessage: 0,
        isUpdated : false,
    };

    componentDidMount() {
        if(this.props.auth.id) {
          this.fetchUserInformation();
        }
    }

    fetchUserInformation() {
        axios.get('/api/study/getUserCountInformation/'+this.props.auth.id)
          .then(response => {
            const res = response.data;
            if(res.status) {
                this.setState(function(state, props){
                  return {
                    assignments:res.assignments,
                    unReadMessage: res.unReadMessage,
                    isUpdated: true,
                  }
                })
            }
          })
    }

    componentDidUpdate() {
        if(this.props.auth.id && !this.state.isUpdated) {
            this.fetchUserInformation();
        }
    }

    handleProfileMenuOpen = event => {
      this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuClose = () => {
      this.setState({ anchorEl: null });
      this.handleMobileMenuClose();
    };

    handleMobileMenuOpen = event => {
      this.setState({ mobileMoreAnchorEl: event.currentTarget });
    };

    handleMobileMenuClose = () => {
      this.setState({ mobileMoreAnchorEl: null });
    };

    render() {
      const { anchorEl, mobileMoreAnchorEl } = this.state;
      const { classes } = this.props;
      const isMenuOpen = Boolean(anchorEl);
      const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
      
      const renderMenu = (
        
          <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={this.handleMenuClose}
        >
        {this.state.assignments.length > 0 ? 
           this.state.assignments.map((assignment, index) => {
              return (
                <Link to={'/study/assignment/'+assignment._study+'/start/'+assignment._id } key={assignment._id}>
                  <MenuItem >{assignment.title}</MenuItem>
                </Link>
              )
           })
           :<MenuItem>
              미완료된 과제가 없습니다.
            </MenuItem>
          }
        </Menu>
      );

      const renderMobileMenu = (
        <Menu
          anchorEl={mobileMoreAnchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMobileMenuOpen}
          onClose={this.handleMobileMenuClose}
        >
          <MenuItem onClick={this.handleProfileMenuOpen}>
            <IconButton color="inherit">
            {this.state.assignments.length > 0 ?
              <Badge badgeContent={this.state.assignments.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            : <NotificationsIcon />}
            </IconButton>
            <p>미완료 과제</p>
          </MenuItem>
        </Menu>
      );

      return (
        <div>
          <AppBar position="fixed"
            className={this.props.appbarClass}
            color="primary"
          >
            <CssBaseline />
            <Toolbar disableGutters={!this.state.open}>
              <IconButton className={this.props.IconButtonClass} color="inherit" aria-label="Open drawer" onClick={this.props.openDrawer}>
                <MenuIcon />
              </IconButton>
              <Link to={'/study/dashboard/list'}>
              <Typography className={classes.title} variant="h6" noWrap id="title">M KEYWORD</Typography>
              </Link>
              <div className={classes.grow} />
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                />
              </div>
              <div className={classes.sectionDesktop}>
                <a href="/api/logout" style={{color: 'white'}}>
                  <IconButton color="inherit">
                      <EjectIcon />
                  </IconButton>
                </a>
                <Link to={'/dashboard/message/inbox'}>
                  <IconButton  style={{color: 'white'}}>
                    <Badge badgeContent={this.state.unReadMessage} color="secondary">
                      <MailOutline />
                    </Badge>
                  </IconButton>
                </Link>
                <IconButton 
                  color="inherit"
                  aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleProfileMenuOpen}
                  
                  >
                  {this.state.assignments.length > 0 ?
                    <Badge badgeContent={this.state.assignments.length} color="secondary">
                      <NotificationsIcon />
                    </Badge>
                  : <NotificationsIcon />}
                  </IconButton>
              </div>
              <div className={classes.sectionMobile}>
                <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                  <MoreIcon />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
          {renderMenu}
          {renderMobileMenu}
        </div>
      );
    }
}

StudyReaderAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({auth}) {
  return {auth};
}

export default connect(mapStateToProps)(withStyles(styles)(StudyReaderAppBar));