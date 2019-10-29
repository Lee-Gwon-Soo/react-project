import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const StudyRecommendDialog = (props) => {
    return (
      <div>
        <Dialog
          open={props.open}
          onClose={props.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">추천 메일 보내기</DialogTitle>
          <DialogContent>
            <DialogContentText>
               스터디에 초대하고 싶은 분에게 초대 메일을 보내주세요.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="recommend_email"
              label="추천인 이메일"
              type="email"
              value={props.recommendEmail}
              onChange={props.handleInput}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={props.handleClose} color="primary">
              취소
            </Button>
            <Button onClick={props.sendRecommendMail} color="primary">
              보내기
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}

export default StudyRecommendDialog;