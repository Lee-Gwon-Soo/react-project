import React from 'react';
import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import './MessageDialog.css';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const MessageDialog =(props) => {
    const { fullScreen } = props;

    return (
        <Dialog
            fullScreen={fullScreen}
          open={props.open}
          onClose={props.handleClose}
          aria-labelledby="form-dialog-title"
          style={{minWidth: '600px'}}
        >
          <div className="messageContainer">
            <div className="">
              <table className="titleBoard">
                <tbody>
                    <tr>
                      <td width="100%">
                        <div className="titleContent">
                          메세지 전송
                        </div>
                      </td>
                      <td>
                          <Tooltip title="작성 취소">
                            <IconButton aria-label="작성 취소" onClick={props.handleClose}>
                              <CloseIcon style={{color: 'white'}}/>
                            </IconButton>
                          </Tooltip>
                      </td>
                    </tr>
                </tbody>
              </table>
            </div>
            <DialogContent style={{ padding: '10px',  maxWidth: '100vw'}}>
              <table className="contentTable">
                  <tbody>
                    <tr>
                      <td>
                        <div className="topForm">
                          <table className="formTable">
                            <tbody>
                              <tr>
                                <td style={{ color : '#777', width: 'max-content', minWidth: '80px'}}>
                                  수신자
                                </td>
                                <td style={{ textAlign : 'left' , width: '100%'}}>
                                  <div>
                                  {props.element.receiverName}
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ color : '#777', paddingTop: '10px', width: 'max-content', minWidth: '80px'}}>
                                  제목
                                </td>
                                <td style={{ textAlign : 'left' ,paddingTop: '10px', width: '100%'}}>
                                  <div>
                                    <input type="text" 
                                          className="messageInput"
                                          onChange={props.changeMessageTitle}/>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </tbody>
              </table>
              <textarea 
                className="contentArea" 
                id="content" 
                placeholder="보내고 싶은 내용을 적어주세요." 
                onChange={props.changeMessageContent}></textarea>
              {/* <TextField
                autoFocus
                multiline
                id="content"
                value={props.element.content}
                onChange={props.changeMessageContent}
                label="보내고 싶은 내용을 적어주세요."
                type="text"
                fullWidth
              /> */}
              <div className="buttonPart">
                <Button onClick={props.sendMessage} variant="contained" color="primary">
                  보내기
                </Button>
              </div>
            </DialogContent>
          </div>
        </Dialog>
    );
}

export default withMobileDialog()(MessageDialog);