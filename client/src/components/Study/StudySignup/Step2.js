import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FaceIcon from '@material-ui/icons/Face';
import HumanIcon from '../../Shared/HumanIcons/HumanIcon';

const Step2 = (props) => {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        회원 상세 정보
        <Button color="default" size="small" style={{float: 'right'}} onClick={props.handleClickOpen}>이모티콘 선택하기</Button>
      </Typography>
      <Grid container spacing={24}>
        <Grid item xs={12} style={{textAlign: 'center'}}>
            {props.form.img_path === '' ? 
            (<a onClick={props.startInsertImage} style={{cursor: 'pointer'}}>
                <Avatar style={{width:'100px', height:'100px', margin: '0 auto'}} alt="">
                    <FaceIcon style={{width:'100px', height:'100px'}}/>
                </Avatar>
                <br />사진을 등록해주세요.
            </a>) : (
                <a onClick={props.startInsertImage} style={{cursor: 'pointer'}}>
                    {props.form.isEmoticon ? 
                    <Avatar style={{width:'100px', height:'100px', margin: '0 auto'}} alt="">
                          <HumanIcon indexValue={props.form.img_path} />
                    </Avatar>:
                    <img src={props.form.img_path} width="100px" height="100px" alt="user image" />}
                </a>
            ) }
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            multiline
            id="intro"
            value={props.form.intro}
            onChange={props.handleTextArea}
            label="간단한 자기소개를 적어주세요."
            fullWidth
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Step2;