import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class DeleteConfirmDialog extends React.Component {
  state = {
    open: true,
  };

  deleteFile = () => {
      this.props.deleteFile();
      this.props.handleClose();
  }

  render() {
    return (
        <Dialog
          open={this.props.open}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"주의!!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              첨부파일을 삭제하시겠습니까?<br/>
              삭제하시면 해당 파일을 다시 복구하실 수 없습니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
              아니오
            </Button>
            <Button onClick={this.deleteFile} color="primary">
              네, 삭제하겠습니다
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

export default DeleteConfirmDialog;