import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  root: {
    flexGrow: 1,
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.3)',
    zIndex: '1000'
  },
};

function LinearLoading(props) {
  const { classes } = props;
  
  return (
        <div className={classes.root} style={{ display: props.open ? "block" : "none", top: window.innerWidth > 600 ? '64px' : '56px' }}>
            <LinearProgress variant="query"  />
        </div>
  );
}

LinearLoading.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LinearLoading);