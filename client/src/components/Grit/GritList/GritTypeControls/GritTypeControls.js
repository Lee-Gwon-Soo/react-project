import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import DatePicker from '../../../form/DatePicker/DatePicker';
import MaterialInput from '../../../form/Input/MaterialInput';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    marginTop: '20px',
    minWidth: 200,
    width: '100%'
  },
  openDialogButton: {
    color: '#f00',
    fontSize: '1.5rem',
  }
});

class GritTypeControls extends React.Component {

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button onClick={this.props.handleClickOpen} className={classes.openDialogButton}>Grit 옵션을 선택해주세요.</Button>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.props.open}
          onClose={this.props.handleClose}
        >
          <DialogContent style={{'paddingBottom': '0px'}}>
            <DialogContentText style={{'paddingBottom': '10px'}}>
              새로운 목표에 도전하세요. <br />
              목표를 신중하게 정해주세요.
            </DialogContentText>
            <MaterialInput 
                  type="text" 
                  label="제목" 
                  required 
                  value={this.props.element.title} 
                  onChange={this.props.handleChange('title')}
                  style={{'color': '#000', width:'100%'}}
                  />
          </DialogContent>
          <DialogContent>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-simple">Type</InputLabel>
                <Select
                  value={this.props.element.type}
                  onChange={this.props.handleChange('type')}
                  input={<Input id="age-simple" />}
                >
                  <MenuItem value='every'>EveryDay Checkup</MenuItem>
                  <MenuItem value='sometimes'>Sometimes Checkup</MenuItem>
                </Select>
              </FormControl>
          </DialogContent>
          <DialogContent>
              <DatePicker 
                    value={this.props.element.startDate}
                    onChange={this.props.handleChange('startDate')}
                    label="Start Date"
              />
              <DatePicker 
                    value={this.props.element.dueDate}
                    onChange={this.props.handleChange('dueDate')}
                    label="Due Date"
              />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.props.handleFinishSelect} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

GritTypeControls.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GritTypeControls);