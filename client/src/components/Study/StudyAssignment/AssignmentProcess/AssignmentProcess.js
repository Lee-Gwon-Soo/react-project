import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import compose from 'recompose/compose';
import Snackbar from "../../../CustomLayout/components/Snackbar/Snackbar";
import LinearLoading from '../../../Shared/LinearLoading/LinearLoading';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import Hidden from '@material-ui/core/Hidden';
import withWidth from '@material-ui/core/withWidth';
import QuizItem from './QuizItem';
import Zoom from '@material-ui/core/Zoom';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Clear';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import MobileSteps from './MobileSteps';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    activeStep: {
        borderRight: '4px solid rgb(97, 218, 251)',
        backgroundColor: '#f7f7f7',
        fontWeight: '700',
        color: 'rgb(26, 26, 26)',
    },
    fab: {
        position: 'absolute',
        right: '16px',
        bottom: '16px',
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
    report: {
        paddingTop: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        borderRadius: '4px',
        paddingBottom: '16px',
        whiteSpace: 'pre-line',
        backgroundColor: '#eeeeee',
    },
});



class AssignmentProcess extends React.Component {
    state = {
        isLoading: true,
        info:{},
        answer: '',
        activeIndex: 0,
        checkAnswer: false,
        showSnack: false,
        snackMessage: '',
        completed: [],
        processStatus: [],
    };

    componentDidMount() {
        if(this.props.match.params.assignmentId) {
            axios.get('/api/study/getAssignment/question/'+this.props.match.params.assignmentId+'/'+this.props.auth.id)
                .then(response => {
                    const res = response.data;

                    if(res.status) {
                        this.setState(function(state, props) {
                            return {
                                info: res.data,
                                isLoading: false,   
                                processStatus: res.userStatus[0].processStatus,
                                activeIndex: res.startStep,    
                                completed:res.completed,                     
                            }
                        });
                        //처음에 서술형이면 정답 채워주어야함.
                        const index = this.state.activeIndex;
                        if(this.state.processStatus && 
                            this.state.processStatus[index] &&
                            this.state.processStatus[index].result && this.state.info.questionList[index].type ==='논술형') {
                            this.initializeAnswer(index);
                        } 
                    }
                })
        } else {

        }
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

    chooseAnswer = (event, option) => {
        let content = option;
        if(!event.target.checked) {
            //When Off
            content='';
        } 

        this.setState(function(state, props) {
            return {
                answer: content                        
            }
        });
    }

    completeAssignment = () => {
        this.setState(function(state,props){
            return {
                activeIndex: state.info.questionList.length
            }
        })
    }

    checkNextQuestion = (index) => {
        index++;
        if(this.state.processStatus[index] && this.state.processStatus[index].result && this.state.info.questionList[index].type ==='논술형') {
            this.initializeAnswer(index);
        }
    }
    
    checkAnswer = () => {
        if(this.state.processStatus[this.state.activeIndex] && this.state.processStatus[this.state.activeIndex].result ) {
            if(this.state.info.questionList[this.state.activeIndex].type !=='논술형'){
                this.showAlarm("이미 정답을 맞추셨습니다.");
            } else {
                this.saveStatus();
            }
            const prevIndex = this.state.activeIndex;
            this.checkNextQuestion(this.state.activeIndex);
            this.setState(function(state, props) {
                return {
                    activeIndex: prevIndex +1               
                }
            });
            return false;
        }
        this.setState(function(state, props) {
            return {
                checkAnswer: true,
                isLoading: true,                        
            }
        });

        if(this.state.activeIndex === this.state.info.questionList.length ) {
            axios.post('/api/study/completeAssignment/'+this.props.auth.id+'/'+this.props.match.params.assignmentId)
                .then(response => {
                    const res = response.data;
                    if(res.status) {
                        this.props.history.push('/study/assignment/front/'+this.props.match.params.studyId);
                    }
                })
            return false;
        }

        if( this.state.answer === '') {
            this.showAlarm("정답을 선택 또는 작성해주세요.");
            this.setState(function(state, props) {
                return {
                    checkAnswer: false,      
                    isLoading: false,        
                }
            });
            return false;
        } 
        
        setTimeout( () => {
           if (this.state.info.questionList[this.state.activeIndex].type !== '논술형' 
                    && this.state.info.questionList[this.state.activeIndex].answer !== this.state.answer) {
                this.showAlarm("정답이 아닙니다.");

                const processStatus = [...this.state.processStatus];
                processStatus[this.state.activeIndex] = {index: this.state.activeIndex, answer: this.state.answer, result: false};
                this.setState(function(state, props) {
                    return {
                        checkAnswer: false,      
                        isLoading: false,     
                        processStatus:processStatus
                    }
                });
                this.saveStatus();
                return false;
            }
            
            const completed = [...this.state.completed];
            completed.push(this.state.activeIndex);

            //정답 내용 저장
            const processStatus = [...this.state.processStatus];
            processStatus[this.state.activeIndex] = {index: this.state.activeIndex, answer: this.state.answer, result: true};
            this.setState(function(state, props) {
                return {
                    checkAnswer: false,      
                    isLoading: false,
                    completed:completed,
                    processStatus:processStatus,
                    answer: '',      
                    activeIndex: state.activeIndex +1               
                }
            });
            this.saveStatus();
        }, 2000);
    }

    handleNext = () => {
        this.setState(function(state, props) {
            return {
                checkAnswer: false,      
                answer: '',      
                activeIndex: state.activeIndex +1               
            }
        });
    }

    handleBack = () => {
        this.setState(function(state, props) {
            return {
                checkAnswer: false,      
                answer: '',      
                activeIndex: state.activeIndex -1               
            }
        });
    }

    saveStatus = () => {
        const data = [...this.state.processStatus];
        axios.post('/api/study/assignment/saveStatus/'+this.props.auth.id+'/'+this.props.match.params.assignmentId, {data : data})
            .then(response => {
                const res = response.data;
                if(res.status) {
                    this.showAlarm("현재까지의 답변이 저장되었습니다.");
                    return true;
                } else {
                    this.showAlarm("답변을 저장하는데 문제가 생겼습니다.");
                    return false;
                }
            })
    }

    gotoQuestion = (index) => {
        if(index === this.state.activeIndex) {
            return false;
        }

        if(this.state.processStatus && 
            this.state.processStatus[index] &&
            this.state.processStatus[index].result && this.state.info.questionList[index].type ==='논술형') {
            this.initializeAnswer(index);
        } else{
            this.setState(function(state, props){
                return {
                    activeIndex: index,
                    answer: '',
                }
            });
        }
    }

    handleAnswer = (event) => {
        const content = event.target.value;
        this.setState(function(state, props){
            return {
                answer: content
            }
        });
    }

    initializeAnswer = (index) => {
        const answer = this.state.processStatus[index].answer;
        this.setState(function(state, props){
            return {
                activeIndex: index,
                answer: answer
            }
        });
    }

    render(){
        const { classes } = this.props;
        return (
            <div className={classes.root}>
            <LinearLoading open={this.state.isLoading} color="secondary"/>
            <CssBaseline />
            <AppBar position="fixed" style={{backgroundColor: '#81D4FA'}}>
                <Toolbar>
                    <Hidden smUp>
                    {this.state.info.questionList ? 
                        <MobileSteps 
                            activeIndex={this.state.activeIndex}
                            totalStep={this.state.info.questionList.length+1}
                            handleNext={this.handleNext}
                            handleBack={this.handleBack}
                        /> : null}
                    </Hidden>
                </Toolbar>
            </AppBar>
            <Hidden smDown>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                    paper: classes.drawerPaper,
                    }}
                    anchor="left"
                >
                    <div className={classes.toolbar} />
                    <Divider />
                    {this.state.info.questionList ? 
                    <List>
                        {this.state.info.questionList.map((question, index) => {
                            return (
                            <ListItem key={question._id} className={this.state.activeIndex === index ? classes.activeStep : ""} button onClick={() => this.gotoQuestion(index)}>
                                {this.state.completed.includes(index) ? 
                                <Chip color="primary" avatar={<Avatar><CheckIcon /></Avatar>} /> :
                                this.state.processStatus[index] && !this.state.processStatus[index].result 
                                ? <Chip color="secondary" avatar={<Avatar><DeleteIcon /></Avatar>} />
                                : <Chip variant="outlined" label={index+1}/> }
                                <ListItemText primary={question.type}/>
                            </ListItem>)
                        })} 
                        <Divider />
                        <ListItem button onClick={this.completeAssignment}>
                            <ListItemText primary={"과제 완료"} style={{textAlign: 'center'}}/>
                        </ListItem>
                    </List>
                    : "과제를 로드중입니다."}
                </Drawer>
            </Hidden>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                    {this.state.info.questionList && this.state.activeIndex === this.state.info.questionList.length ?
                    <Grid container justify="center">
                        <Grid item xs={12} sm={6} >
                            <section className={classes.report}>
                                <Typography variant="h5" gutterBottom>
                                    과제 결과 보기
                                </Typography>
                                <div>
                                    <List>
                                        <ListItem>
                                        <Avatar>
                                            <ImageIcon />
                                        </Avatar>
                                            <ListItemText primary={this.state.info.questionList.length} secondary="총 문항" />
                                        </ListItem>
                                        <ListItem>
                                        <Avatar>
                                            <WorkIcon />
                                        </Avatar>                                        
                                            <ListItemText primary={this.state.completed.length} secondary="완료 문항" />
                                        </ListItem>
                                        <ListItem>
                                        <Avatar>
                                            <BeachAccessIcon />
                                        </Avatar>
                                            <ListItemText primary={this.state.info.questionList.length - this.state.completed.length} secondary="미완료 문항" />
                                        </ListItem>
                                    </List>
                                </div>
                            </section>
                        </Grid>
                    </Grid>
                        
                    : this.state.info.questionList? 
                        <QuizItem 
                            question={this.state.info.questionList[this.state.activeIndex]}
                            chooseAnswer={(event, option) => this.chooseAnswer(event, option)}
                            answer={this.state.answer}
                            handleAnswer={this.handleAnswer}
                            initializeAnswer={this.initializeAnswer}
                            processStatus={this.state.processStatus[this.state.activeIndex]}
                        /> 
                : null }
                <Zoom
                    in={!this.state.checkAnswer}
                    timeout={{enter: 500, exit: 500}}
                    style={{
                        transitionDelay: `${!this.state.checkAnswer ? 0 : 0}ms`,
                    }}
                    unmountOnExit
                >
                    <Button variant="fab" className={classes.fab} color={'primary'} onClick={this.checkAnswer}>
                        <CheckIcon />
                    </Button>
                </Zoom>
                <Zoom
                    in={this.state.checkAnswer}
                    timeout={{enter: 500, exit: 500}}
                    style={{
                        transitionDelay: `${this.state.checkAnswer ? 0 : 0}ms`,
                    }}
                    unmountOnExit
                >
                    <Button variant="fab" className={classes.fab} color={'secondary'}>
                        <MoreHoriz />
                    </Button>
                </Zoom>
            </main>
                <Snackbar
                    place="bl"
                    color="danger"
                    message={this.state.snackMessage}
                    open={this.state.showSnack}
                    closeNotification={() => this.setState({ showSnack: false })}
                    close
                />
            </div>
        );
    }
}

AssignmentProcess.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({ auth }) {
    return {auth};
}

export default connect(mapStateToProps)(compose(
    withStyles(styles),
    withWidth(),
  )(AssignmentProcess));