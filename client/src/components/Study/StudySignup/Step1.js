import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const Step1 = (props) => {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        회원 기본 정보
      </Typography>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="name"
            name="name"
            label="한국 이름"
            value={props.form.name}
            onChange={(event) => props.handleInput(event, 'name')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="name_en"
            name="name_en"
            label="영문 이름(영어 이름)"
            value={props.form.name_en}
            onChange={(event) => props.handleInput(event, 'name_en')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="email"
            name="email"
            label="이메일"
            value={props.form.email}
            onChange={(event) => props.handleInput(event, 'email')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="password"
            name="password"
            label="패스워드"
            type="password"
            value={props.form.password}
            onChange={(event) => props.handleInput(event, 'password')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="password_confirm"
            name="password_confirm"
            label="패스워드 확인"
            type="password"
            value={props.form.password_confirm}
            onChange={(event) => props.handleInput(event, 'password_confirm')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            required
            id="belongto" 
            name="belongto" 
            label="소속/대학" 
            value={props.form.belongto}
            onChange={(event) => props.handleInput(event, 'belongto')}
            fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            id="tel_no" 
            name="tel_no" 
            label="연락처" 
            value={props.form.tel_no}
            onChange={(event) => props.handleInput(event, 'tel_no')}
            fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="job"
            name="job"
            label="직업"
            fullWidth
            value={props.form.job}
            onChange={(event) => props.handleInput(event, 'job')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="position"
            name="position"
            label="직책"
            fullWidth
            value={props.form.position}
            onChange={(event) => props.handleInput(event, 'position')}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Step1;