import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const Step1 = (props) => {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        스터디 기본 정보
      </Typography>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <TextField
            required
            id="name"
            name="name"
            label="스터디 이름"
            value={props.form.name}
            onChange={(event) => props.handleInput(event, 'name')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="email"
            name="email"
            label="대표자 이메일"
            value={props.form.email}
            onChange={(event) => props.handleInput(event, 'email')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="place"
            name="place"
            label="장소"
            type="text"
            value={props.form.place}
            onChange={(event) => props.handleInput(event, 'place')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="field"
            name="field"
            label="분야"
            value={props.form.field}
            onChange={(event) => props.handleInput(event, 'field')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            required
            id="memCount" 
            name="memCount" 
            label="수용 인원" 
            type="number"
            value={props.form.memCount}
            onChange={(event) => props.handleInput(event, 'memCount')}
            fullWidth />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Step1;