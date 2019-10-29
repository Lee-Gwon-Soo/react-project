import React, { Component } from 'react';
import Aux from '../../HOC/Aux';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
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

});


class AllEmptyLayout extends Component {
  render() {
    const {classes} = this.props;
    return (
      <div className={classes.content}>
        {this.props.children}
      </div>
    );
  }
}
export default withStyles(styles)(AllEmptyLayout);