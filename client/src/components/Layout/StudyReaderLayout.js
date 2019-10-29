import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExploreIcon from '@material-ui/icons/Explore';
import InboxIcon from '@material-ui/icons/Inbox';
import EjectIcon from '@material-ui/icons/EjectSharp';
import ArchiveIcon from '@material-ui/icons/Archive';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PortraitIcon from '@material-ui/icons/Portrait';
import { fade } from '@material-ui/core/styles/colorManipulator';
import StudyReaderAppBar from './StudyReaderAppBar';
import { Link, Redirect } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AddCircleOutlined from '@material-ui/icons/AddCircleOutline';
import AddBoxOutlined from '@material-ui/icons/AddBoxOutlined';
import AddToQueue from '@material-ui/icons/AddToQueueTwoTone';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import BookSharpIcon from '@material-ui/icons/BookSharp';


const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
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
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing.unit * 3,
    },
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down('sm')]: {
        margin: '0 auto',
        maxWidth: '568px',
        padding: '0 16px'
    },
  },
  contentShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },

  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
});

class StudyReaderLayout extends React.Component {
    state = {
      open: true,
      redirected: false,
      directPath: '',
    };

    handleDrawerOpen = () => {
      this.setState({ open: true });
    };

    toggleDrawer = (open) => () => {
      this.setState({
        open: open,
      });
    };
  
    handleDrawerClose = () => {
      this.setState({ open: false });
    };

    handleRedirect = (path) => {
      this.setState(function(state, props){
        return {
          redirected: true,
          directPath: path
        }
      })
    }

    renderRedirect = () => {
      if(this.state.redirected) {
        return <Redirect to={this.state.directPath} />;
      } else {
        return null;
      }
    }
    
    render() {
      const { classes, theme } = this.props;
      const { open } = this.state;

      return (
        <div className={classes.root}>
          <CssBaseline />
          {this.renderRedirect()}
          <StudyReaderAppBar 
            appbarClass={classNames(classes.appBar, {
              [classes.appBarShift]: open,
            })}
            openDrawer={this.handleDrawerOpen}
            IconButtonClass={classNames(classes.menuButton, open && classes.hide)}
          />
          <Drawer
          variant="permanent"
          className={classNames(classes.drawer, {
            [classes.drawerOpen]: this.state.open,
            [classes.drawerClose]: !this.state.open,
          })}
          classes={{
            paper: classNames({
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open,
            }),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
              <Link to={'/study/dashboard/user'}>
                <ListItem button>
                    <ListItemIcon><AccountCircle /></ListItemIcon>
                    <ListItemText primary={"기본 정보"} />
                </ListItem>
              </Link>
              <Link to={'/user/intro'}>
                <ListItem button>
                    <ListItemIcon><PortraitIcon /></ListItemIcon>
                    <ListItemText primary={"회원 소개 수정"} />
                </ListItem>
              </Link>
              <Link to={'/dashboard/message/inbox'}>
                <ListItem button>
                    <ListItemIcon><InboxIcon /></ListItemIcon>
                    <ListItemText primary={"받은 메시지"} />
                </ListItem>
              </Link>
          </List>
          <Divider />
          <List>
              <Link to={'/study/dashboard/list'}>
                <ListItem button>
                    <ListItemIcon><ArchiveIcon /></ListItemIcon>
                    <ListItemText primary={"스터디 리스트"} />
                </ListItem>
              </Link>
              <Link to={'/study/dashboard/create'}>
                <ListItem button>
                  <ListItemIcon><AddCircleOutlined /></ListItemIcon>
                  <ListItemText primary={"새로운 스터디 생성"} />
                </ListItem>
              </Link>
          </List>
          <Divider />
          <List>
              <Link to={'/dashboard/blog'}>
                <ListItem button>
                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                    <ListItemText primary={"블로그 리스트"} />
                </ListItem>
              </Link>
              <Link to={'/dashboard/new/blog'}>
                <ListItem button>
                  <ListItemIcon><AddBoxOutlined /></ListItemIcon>
                  <ListItemText primary={"새로운 포스트 작성"} />
                </ListItem>
              </Link>
              <Link to={'/dashboard/category/new'}>
                <ListItem button>
                  <ListItemIcon><AddToQueue /></ListItemIcon>
                  <ListItemText primary={"새로운 카테고리"} />
                </ListItem>
              </Link>
          </List>
          <Divider />
          <List>
              <Link to={'/dashboard/bookstore'}>
                <ListItem button>
                    <ListItemIcon><LocalLibraryIcon /></ListItemIcon>
                    <ListItemText primary={"나의 도서관"} />
                </ListItem>
              </Link>
              <Link to={'/dashboard/book/add'}>
                <ListItem button>
                  <ListItemIcon><BookSharpIcon /></ListItemIcon>
                  <ListItemText primary={"새로운 독서 리뷰"} />
                </ListItem>
              </Link>
          </List>
          <Divider />
          <List>
            <Link to={'/page/'+this.props.auth.email}>
              <ListItem button>
                  <ListItemIcon><ExploreIcon /></ListItemIcon>
                  <ListItemText primary={"나의 블로그 보기"} />
              </ListItem>
            </Link>
              <a href='/api/logout'>
                <ListItem button>
                    <ListItemIcon><EjectIcon /></ListItemIcon>
                    <ListItemText primary={"로그아웃"} />
                </ListItem>
              </a>
          </List>
        </Drawer>
          {/* <SwipeableDrawer
            className={classNames(classes.drawer, {
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open,
            })}
            classes={{
              paper: classNames({
                [classes.drawerOpen]: this.state.open,
                [classes.drawerClose]: !this.state.open,
              }),
            }}
            anchor="left"
            open={open}
            onClose={this.toggleDrawer(false)}
            onOpen={this.toggleDrawer(true)}
          >
          <div tabIndex={0} role="button" onClick={this.toggleDrawer(false)} onKeyDown={this.toggleDrawer(false)}>
              <div className={classes.drawerHeader} >
                <IconButton onClick={this.handleDrawerClose}>
                  {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
              </div>
              <Divider />
              <List>
                  <Link to={'/study/dashboard/list'}>
                    <ListItem button>
                        <ListItemIcon><ArchiveIcon /></ListItemIcon>
                        <ListItemText primary={"대시보드"} />
                    </ListItem>
                  </Link>
                  
                  <Link to={'/study/dashboard/user'}>
                    <ListItem button>
                        <ListItemIcon><AccountCircle /></ListItemIcon>
                        <ListItemText primary={"나의 정보"} />
                    </ListItem>
                  </Link>
                  <Link to={'/dashboard/message/inbox'}>
                    <ListItem button>
                        <ListItemIcon><InboxIcon /></ListItemIcon>
                        <ListItemText primary={"받은 메시지"} />
                    </ListItem>
                  </Link>
              </List>
              <Divider />
              <List>
                  <Link to={'/study/dashboard/create'}>
                    <ListItem button>
                      <ListItemIcon><Assginment /></ListItemIcon>
                      <ListItemText primary={"새로운 스터디 생성"} />
                    </ListItem>
                  </Link>
              </List>
              <Divider />
              <List>
                  <a href='/api/logout'>
                    <ListItem button>
                        <ListItemIcon><EjectIcon /></ListItemIcon>
                        <ListItemText primary={"로그아웃"} />
                    </ListItem>
                  </a>
              </List>
          </div>
          </SwipeableDrawer> */}
          <main
            className={classNames(classes.content, {
              [classes.contentShift]: open,
            })}
          >
            <div className={classes.drawerHeader} />
            {this.props.children}
          </main>
          <div style={{marginTop:'20px'}}></div>
        </div>
      );
    }
}

StudyReaderLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(StudyReaderLayout));

