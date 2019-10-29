import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

class DeleteCheckBoard extends React.Component {
  state = {
    open: this.props.open,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.onClosed();
  };

  onDelete = () => {
    this.props.onDeleteAgree();
    this.handleClose();
  }

  render() {
    const { fullScreen } = this.props;

    return (
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.props.content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              아니오
            </Button>
            <Button onClick={this.onDelete} color="primary" autoFocus>
              네
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

DeleteCheckBoard.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(DeleteCheckBoard);