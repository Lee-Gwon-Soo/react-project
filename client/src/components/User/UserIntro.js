import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Snackbar from "../CustomLayout/components/Snackbar/Snackbar";
import LinearLoading from '../Shared/LinearLoading/LinearLoading';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    [theme.breakpoints.up(700 + theme.spacing.unit * 2 * 2)]: {
      width: 700,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3,
    },
  },
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
  },
  carrerContainer: {
      backgroundColor: '#eeeeee'
  }
});
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 100,
    },
  },
};

class UserIntro extends React.Component {
    state = {
        isLoading: true,
        info: null,
        showSnack: false,
        snackMessage: '',
        carrers: [],
        intro : {
            email: '',
            name: '',
            belongto: '',
            job: '',
            interest: '',
            profile_img: '',
        },
        carrerForm: {
            year: '',
            month: '',
            period: '',
            content: '',
        }
    };

    componentDidMount() {
        if(this.props.auth.id) {
            axios.get('/api/main/getUserInfo/'+this.props.auth.id)
                .then(response => {
                    let carrers = [];
                    const data = response.data;
                    const intro = {...this.state.intro};
                    intro.name = data.data.name;
                    intro.email = data.data.email;
                    intro.belongto = data.data.belongto;
                    if(data.intro){
                        intro.profile_img = data.intro.profile_img;
                        intro.interest = data.intro.interest;
                        intro.job = data.intro.job;

                        if(data.intro._carrer) {
                            carrers = [...data.intro._carrer];
                        }
                    }

                    if(data.status) {
                        this.setState(function(state, props){
                            return {
                                intro:intro,
                                isLoading: false,
                                carrers: carrers,
                            }
                        });
                    }
                })
        } else {
            this.props.history.push('/login');
        }
    }

    handleInput = (event, identifier) => {
        const intro = {...this.state.intro};
        intro[identifier] = event.target.value;
        this.setState(function(state, props){
            return {
                intro: intro
            }
        });
    }

    completeIntroForm = () => {
        this.setState(function(state, props){
            return {
                isLoading: true,
            }
        });

        const body = {...this.state.intro};
        body._carrer = [...this.state.carrers];
        
        axios.post('/api/main/saveUserIntro/'+this.props.auth.id, body)
            .then(response => {
                const res = response.data;
                if(res.status) {
                    this.showAlarm("회원 소개 정보가 정상적으로 수정되었습니다.");
                    this.setState(function(state, props){
                        return {
                            isLoading: false,
                            password: '',
                            password_confirm: '',
                            passwordError: false,
                        }
                    });
                } else {
                    this.showAlarm(res.message);
                    this.setState(function(state, props){
                        return {
                            isLoading: false,
                        }
                    });
                }
            });
    }
    
    startInsertImage = (e) => {
        this.refs.userImage.click();
        e.preventDefault();
    }

    uploadImage = (event) => {
        let config = { 
            headers: { 'Content-Type': 'multipart/form-data' }
        }
        let formData = new FormData();
        formData.append("image", event.target.files[0]);

        axios.post('/api/aws/uploadUserImage', formData, config)
            .then((response) => {
                const data = response.data;
                if( data.status ) {
                    const awsResponse = data.data;
                    const url = awsResponse.Location;
                    this.insertImage(url);
                    this.refs.userImage.value='';
                }
            })
            .catch(error => {
                this.showAlarm('개인 사진 업로드에 문제가 생겼습니다.');
            })
    }

    insertImage = (url) => {
        const intro = {...this.state.intro};
        intro.profile_img = url;
        this.setState(function(state,props){
            return {
                intro:intro
            }
        });
        this.showAlarm('프로필 사진이 성공적으로 변경되었습니다.');
    }

    showAlarm = (msg) => {
        this.setState(function(state,props){
            return {
                showSnack: true,
                snackMessage: msg
            }
        });
        setTimeout( () => {
            this.setState(function(state,props){
                return {
                    showSnack: false,
                    snackMessage: ''
                }
            });
        },2000);
    }

    handleCarrerForm = (event, identifier) => {
        const content = event.target.value;
        const form = {...this.state.carrerForm}
        form[identifier] = content;
        this.setState(function(state, props){
            return {
                carrerForm: form
            }
        })
    }

    addCarrer = () => {
        const carrerForm = {...this.state.carrerForm};
        const carrers = [...this.state.carrers];
        carrers.push(carrerForm);
        this.setState(function(state, props){
            return {
                carrers: carrers,
                carrerForm: {
                    year: '',
                    month: '',
                    period: '',
                    content: '',
                }
            }
        });
        this.showAlarm('경력이 추가 되었습니다.');
    }

    deleteCarrer = (index) => {
        let carrers = [...this.state.carrers];
        carrers = carrers.filter( (carrer, i) => i !== index);
        this.setState(function(state, props){
            return {
                carrers: carrers,
            }
        });
        this.showAlarm('경력이 삭제되었습니다.');
    }

    render() {
        const { classes } = this.props;

        const year = [];
        const date = new Date();
        for(let i = date.getFullYear(); i > 2000  ; i--) {
            year.push(i);
        }

        return (
        <React.Fragment>
            <div className={classes.layout}>
            <LinearLoading open={this.state.isLoading}/>
            {!this.state.intro ? null : 
            <div className={classes.layout}>
                <Paper className={classes.paper}>
                    <React.Fragment>
                        <Typography variant="h6" gutterBottom>
                            나의 기본 정보
                            <Button variant="contained" color="secondary" onClick={this.completeIntroForm} style={{float: 'right'}}>저장하기</Button>
                        </Typography>
                        <Grid container spacing={24} style={{marginTop: '15px'}}>
                            <Grid item xs={12} sm={6} style={{textAlign: 'center'}}>
                                {!this.state.intro.profile_img || this.state.intro.profile_img === '' ? 
                                (<a onClick={this.startInsertImage} style={{cursor: 'pointer'}}>
                                    <Avatar style={{width:'250px', height:'250px', margin: '0 auto'}} alt="">
                                        <FaceIcon style={{width:'250px', height:'250px'}}/>
                                    </Avatar>
                                    <br />사진을 등록해주세요.
                                </a>) : (
                                    <a onClick={this.startInsertImage} style={{cursor: 'pointer'}}>
                                        <img src={this.state.intro.profile_img} width="250px" height="250px" alt="user image" />
                                    </a>
                                ) }
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Grid container spacing={24} style={{marginTop: '10px'}}>
                                    <Grid item xs={12}  >
                                        <TextField
                                            id="name"
                                            name="name"
                                            label="이름"
                                            InputProps={{
                                                readOnly: true,
                                              }}
                                            onChange={(event) => this.handleInput(event, 'name')}
                                            value={this.state.intro.name}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}  >
                                        <TextField
                                            id="email"
                                            name="email"
                                            label="이메일"
                                            InputProps={{
                                                readOnly: true,
                                              }}
                                            value={this.state.intro.email}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}  >
                                        <TextField 
                                            id="belongto" 
                                            name="belongto" 
                                            label="소속/대학" 
                                            value={this.state.intro.belongto}
                                            InputProps={{
                                                readOnly: true,
                                              }}
                                            fullWidth 
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                            <TextField
                                InputLabelProps={{ shrink: this.state.intro.job ? true : false }}
                                id="job"
                                name="job"
                                label="자신이 하는 일에 대해 간단히 소개해주세요."
                                fullWidth
                                multiline
                                value={this.state.intro.job}
                                onChange={(event) => this.handleInput(event, 'job')}
                            />
                            </Grid>
                            <Grid item xs={12}>
                            <TextField
                                InputLabelProps={{ shrink: this.state.intro.interest ? true : false }}
                                id="interest"
                                name="interest"
                                label="자신의 관심 분야에 대해서 간단히 소개해주세요."
                                fullWidth
                                multiline
                                value={this.state.intro.interest}
                                onChange={(event) => this.handleInput(event, 'interest')}
                            />
                            </Grid>
                        </Grid>
                    </React.Fragment>
                    <input type="file" style={{display: 'none'}} ref="userImage" onChange = {(event) => this.uploadImage(event)} />
                </Paper>
                <Paper className={classes.paper}>
                    <React.Fragment>
                        <Typography variant="h6" gutterBottom>
                            나의 경력 정보
                        </Typography>
                        <Grid container spacing={24}>
                            <Grid item xs={12}>
                                <p>
                                    나의 경력을 자유롭게 입력해주세요.
                                </p>
                                <Grid container spacing={16}>
                                    <Grid item xs={4} >
                                        <FormControl className={classes.formControl} fullWidth>
                                            <InputLabel htmlFor="select-multiple">시작 연도</InputLabel>
                                            <Select
                                                value={this.state.carrerForm.year}
                                                onChange={(event) => this.handleCarrerForm(event, 'year')}
                                                MenuProps={MenuProps}
                                            >
                                                {year.map(year => (
                                                <MenuItem key={year} value={year}>
                                                    {year + ' 년'}
                                                </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4} >
                                        <FormControl className={classes.formControl} fullWidth>
                                            <InputLabel htmlFor="select-multiple">시작 월</InputLabel>
                                            <Select
                                                value={this.state.carrerForm.month}
                                                onChange={(event) => this.handleCarrerForm(event, 'month')}
                                                MenuProps={MenuProps}
                                            >
                                                {[1,2,3,4,5,6,7,8,9,10,11,12].map(month => (
                                                <MenuItem key={month} value={month}>
                                                    {month+' 월'}
                                                </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4} >
                                        <TextField
                                            InputLabelProps={{ shrink: true }}
                                            id="period"
                                            name="period"
                                            label="얼마나 일하셨나요?"
                                            fullWidth                                            
                                            value={this.state.carrerForm.period}
                                            placeholder={'1년 / 3개월 / 1년 6개월'}
                                            onChange={(event) => this.handleCarrerForm(event, 'period')}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={16} style={{marginTop: '15px'}} >
                                    <Grid item xs={12} >
                                        <FormControl
                                                fullWidth
                                                className={classes.margin}
                                            >
                                                <InputLabel htmlFor="input-with-icon-adornment">경력 사항</InputLabel>
                                                <Input
                                                id="input-with-icon-adornment"
                                                value={this.state.carrerForm.content}
                                                onChange={(event) => this.handleCarrerForm(event, 'content')}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <AccountCircle />
                                                    </InputAdornment>
                                                }
                                                />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                
                                <p><Button variant="contained" color="primary" onClick={this.addCarrer}>경력 추가</Button></p>
                            </Grid>
                            {this.state.carrers.length > 0 ?
                            <Grid item xs={12}>
                                <div className={classes.carrerContainer}>
                                <List>
                                    {this.state.carrers.map((carrer, index) => {
                                        const dateContent = `${carrer.year}년 ${carrer.month}월에 시작해서 ${carrer.period} 동안 진행.`;
                                        return(
                                            <ListItem key={index} role={undefined} dense button>
                                            <ListItemText 
                                                primary={carrer.content} 
                                                secondary={dateContent}/>
                                            <ListItemSecondaryAction>
                                                <IconButton aria-label="Delete" onClick={() => this.deleteCarrer(index)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                            </ListItem>
                                        )
                                    })}
                                    </List>
                                </div>
                            </Grid>
                            : null }
                        </Grid>
                    </React.Fragment>
                </Paper>
            </div>
            }
            <Snackbar
                place="br"
                color="danger"
                message={this.state.snackMessage}
                open={this.state.showSnack}
                closeNotification={() => this.setState({ showSnack: false })}
                close
                />
            </div>
        </React.Fragment>
    );
  }
}

UserIntro.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps)(withStyles(styles)(UserIntro));