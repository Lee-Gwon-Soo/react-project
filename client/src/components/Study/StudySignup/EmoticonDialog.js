import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Grid from '@material-ui/core/Grid';
import HumanIcon from '../../Shared/HumanIcons/HumanIcon';

const humanIcon = {
    Man: [0,1],
    Woman: [0,1],
}
const EmoticonDialog = (props) => { 
    const { fullScreen } = props;
    const keys = Object.keys(humanIcon);
    let renderArray = [];
    for(let i = 0 ; i< keys.length; i++) {
        const keyValue = keys[i];
        humanIcon[keyValue].map((index) => {
            const keyString = String(keyValue+index);
            renderArray.push(
                <Grid item sm={3} key={keyValue+'_'+index} style={{cursor: 'pointer'}} onClick={()=>props.chooseEmoticon(keyString)}>
                    <HumanIcon indexValue={keyString}/>
                </Grid>
            );
        })
    }

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={props.open}
          onClose={props.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{"원하시는 이모티콘을 선택해주세요."}</DialogTitle>
          <DialogContent>
              <Grid container spacing={16}>
                    {renderArray}
              </Grid>
            <DialogContentText>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={props.handleClose} color="primary">
              취소
            </Button>]
          </DialogActions>
        </Dialog>
      </div>
    );
}


EmoticonDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(EmoticonDialog);