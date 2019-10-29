import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const StoreFormField = (props) => {
    return (
            <Grid container spacing={8}>
                <Grid item xs={12} style={{ marginTop: '25px'}}>
                    <TextField
                        label="서재 이름"
                        id="nickname"
                        error={!props.registerForm.nickname.valid && props.registerForm.nickname.touched}
                        fullWidth
                        value={props.registerForm.nickname.value}
                        onChange={(event) => props.changeValue(event, 'nickname')}
                    />
                </Grid>
                <Grid item xs={12} style={{ marginTop: '25px'}}>
                    <TextField
                        label="서재 고유 코드"
                        id="storeCd"
                        error={!props.registerForm.storeCd.valid && props.registerForm.storeCd.touched}
                        fullWidth
                        value={props.registerForm.storeCd.value}
                        onChange={(event) => props.changeValue(event, 'storeCd')}
                    />
                    <span style={{ color: 'rgba(66,133,244,0.749)', cursor:'pointer', marginTop: '10px', fontSize: '14px' }} onClick={props.generateStoreCode}>서재코드 생성하기</span>
                </Grid>
                <Grid item xs={12} style={{ marginTop: '25px'}}>
                    <TextField
                        label="서재에 대한 간단하게 소개를 적어주세요."
                        id="intro"
                        error={!props.registerForm.intro.valid && props.registerForm.intro.touched}
                        fullWidth
                        multiline
                        rows="8"
                        value={props.registerForm.intro.value}
                        onChange={(event) => props.changeValue(event, 'intro')}
                    />
                </Grid>
                <Grid item xs={12} style={{ marginTop: '25px'}}>
                    <Button color="primary" variant="contained" onClick={props.saveBookstore} >다음</Button>
                </Grid>
            </Grid>
    )
}

export default StoreFormField;