import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

function DatePicker(props) {
  const { classes } = props;
  
  return (
      <TextField
        id="date"
        label={props.label}
        type="date"
        value={props.value}
        onChange={props.onChange}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
  );
}

DatePicker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DatePicker);