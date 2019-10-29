import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import LinearLoading from '../../Shared/LinearLoading/LinearLoading';

import Aux from '../../../HOC/Aux';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import HomeIcon from '@material-ui/icons/Home';
import AssignmentItem from './AssignmentItem';
import { Button } from '@material-ui/core';

const styles = theme => ({
    root: {
      width: '100%',
    },
    sumamry: {
        display: 'flex',
        paddingTop: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        borderRadius: '4px',
        paddingBottom: '16px',
        backgroundColor: '#eeeeee',
    },
    buttonArea: {
        justifyContent: "center",
        alignItems: 'center',
        display: 'flex',
    }
  });


class StudyAssignment extends React.Component {
    state = {
        assignmentList: [],
        isLoading: true,
        doneCount: 0,
    }

    componentDidMount() {
        if(this.props.match.params.study_id) {
            axios.get('/api/study/getAssignmentList/' + this.props.match.params.study_id+ '/'+this.props.auth.id)
                .then(response => {
                    const res = response.data;
                    this.setState(function(state, props){
                        return {
                            assignmentList: res.data,
                            isLoading: false,
                            doneCount: res.doneCount
                        }
                    })
                })
        } else {
            this.props.history.push('/study/dashboard/list');
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Aux>
                <LinearLoading open={this.state.isLoading} />
                <Grid container justify="center" style={{marginTop: '20px'}}> 
                    <Grid item xs={12} sm={12} md={8} >
                        <HomeIcon style={{cursor: 'pointer'}} onClick={() => this.props.history.push('/study/dashboard/detail/'+this.props.match.params.study_id)}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} style={{marginTop: '20px'}}>
                        <Typography variant="h3" gutterBottom>
                            스터디 과제란
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                            스터디의 효과 증진을 위해서 회원들에게 주어진 과제를 완료해주세요.<br />
                            과제를 하다가 궁금한 점이 생기면 스터디원끼리 함께 해결해 나가면서 서로를 채워주세요.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} style={{marginTop: '20px'}}>
                            <Grid container justify="center" className={classes.sumamry}> 
                                <Grid item xs={12} sm={6}>
                                    <List>
                                        <ListItem>
                                        <Avatar>
                                            <ImageIcon />
                                        </Avatar>
                                            <ListItemText primary={this.state.assignmentList.length > 0 ? this.state.assignmentList.length+" 개": "현재 등록된 과제가 없습니다."} secondary="총 과제 수" />
                                        </ListItem>
                                        <ListItem>
                                        <Avatar>
                                            <WorkIcon />
                                        </Avatar>                                        
                                            <ListItemText primary={this.state.doneCount+" 개"} secondary="완료된 과제" />
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid item xs={12} sm={6} className={classes.buttonArea}>
                                    <Button variant="contained" color="primary" size="large" onClick={() => this.props.history.push('/study/assignment/new/'+this.props.match.params.study_id)}>새로운 과제 등록</Button>
                                </Grid>
                            </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} style={{marginTop: '20px'}}>
                        {this.state.assignmentList.length > 0 ? 
                        <div className={classes.root}>
                            {this.state.assignmentList.map((assignment, index) => {
                                return (
                                    <AssignmentItem 
                                        key={assignment._id}
                                        element={assignment}
                                        userId={this.props.auth.id}
                                        onStartAssign={()=> this.props.history.push('/study/assignment/'+this.props.match.params.study_id+'/start/'+assignment._id)}
                                    />
                                )
                            })}
                        </div>
                        :  "현재 등록된 과제가 없습니다."}

                    </Grid>
                </Grid>
            </Aux>
        )
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(withStyles(styles)(StudyAssignment));