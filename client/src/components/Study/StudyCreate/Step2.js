import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';

const Step2 = (props) => {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        스터디 소개
      </Typography>
      <Grid container spacing={24}>
        <Grid item xs={12} style={{textAlign: 'center'}}>
            {props.form.img_path === '' ? 
            (<a onClick={props.startInsertImage} style={{cursor: 'pointer'}}>
                <Avatar style={{width:'100px', height:'100px', margin: '0 auto'}} alt="">
                    <FaceIcon style={{width:'100px', height:'100px'}}/>
                </Avatar>
                <br />스터디를 대표하는 사진을 등록해주세요.
            </a>) : (
                <a onClick={props.startInsertImage} style={{cursor: 'pointer'}}>
                    <img src={props.form.img_path} width="120px" height="120px" alt="study image" />
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
            label="스터디 소개를 적어주세요."
            fullWidth
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Step2;