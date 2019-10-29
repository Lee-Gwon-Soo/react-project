import React from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';

import Aux from '../../../HOC/Aux';
import DataLoading from '../../Shared/DataLoading/DataLoading';
import Snackbar from "../../CustomLayout/components/Snackbar/Snackbar";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PostItem from '../StudyDetail/PostItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';

const styles = {
    studyInfo: {
        padding: '24px',
    },
    studySummary: {
        display: 'flex',
        paddingTop: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        borderRadius: '4px',
        paddingBottom: '16px',
        justifyContent: 'center',
        backgroundColor: '#eeeeee',
    },
    space : {
        marginTop: '40px'
    }
}
class StudyPage extends React.Component {
    state = {
        info: {},
        postList: [],
        isLoading: true,
        showSnack: false,
        snackMessage: '',
    };

    componentDidMount() {
        if(this.props.match.params.studyId) {
            axios.get('/api/study/front/getTotalInfo/'+this.props.match.params.studyId)
                .then(response => {
                    const res = response.data;
                    if(res.status) {
                        this.setState(function(state, props){
                            return {
                                info: {...res.data},
                                postList: [...res.list],
                                isLoading: false,
                            }
                        });
                        document.getElementById('title').innerHTML = this.state.info.name;
                    } else {
                        this.showAlarm("스터디 로딩에 문제가 생겼습니다.");
                    }
                })
                .catch(error => {
                    this.props.history.push('/login');
                })
        } else {
            this.props.history.push('/login');
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
        },5000);
    }

    renderView = () => {
        const {classes} = this.props;
        if(this.state.isLoading) {
            return <DataLoading />;
        } else {
            return (
                <Aux>
                    <Grid container justify="center">
                        <Grid item xs={12} sm={12} md={8}>
                            <Typography variant="h3" gutterBottom>
                                {this.state.info.name}
                            </Typography>
                            <p>
                                {this.state.info.intro}
                            </p>
                            <section className={classes.studySummary}>
                                <List>
                                    <ListItem>
                                    <Avatar>
                                        <ImageIcon />
                                    </Avatar>
                                        <ListItemText primary={this.state.info.field} secondary="분야" />
                                    </ListItem>
                                    <ListItem>
                                    <Avatar>
                                        <WorkIcon />
                                    </Avatar>                                        
                                        <ListItemText primary={`총 ${this.state.info.period} 주, 일주일에 ${this.state.info.sessionTime} 시간`} secondary="시간" />
                                    </ListItem>
                                    <ListItem>
                                    <Avatar>
                                        <BeachAccessIcon />
                                    </Avatar>
                                        <ListItemText primary={this.state.info.place} secondary="장소" />
                                    </ListItem>
                                </List>
                            </section>
                            <div className={classes.space}>
                            <Typography variant="h4" gutterBottom>회원들이 공유한 포스트를 확인해주세요.</Typography>
                                {this.state.postList.map((item, index)=> {
                                        return (
                                            <PostItem 
                                                key={item._id}
                                                element={item}
                                                onClick={() => this.props.history.push('/study/front/post/'+item._id)}
                                            />
                                        )
                                    })}
                            </div>
                        </Grid>
                    </Grid>
                    <Snackbar
                        place="br"
                        color="success"
                        message={this.state.snackMessage}
                        open={this.state.showSnack}
                        closeNotification={() => this.setState({ showSnack: false })}
                        close
                        />
                </Aux>
            )
        }
    }

    render() {
        return (
            <Aux>
                {this.renderView()}
            </Aux>
        )
    }
}

export default withStyles(styles)(StudyPage);