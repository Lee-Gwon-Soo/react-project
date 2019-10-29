import React from "react";
import axios from 'axios';
import { connect } from 'react-redux';
import { Card, CardHeader, CardBody, Row, Col, Button } from "reactstrap";
import { withStyles } from '@material-ui/core/styles';

import { FormInputs, Checkbox } from "../../CustomLayout/study_components";
import Snackbar from "../../CustomLayout/components/Snackbar/Snackbar";
import LinearLoading from '../../Shared/LinearLoading/LinearLoading';
import Aux from '../../../HOC/Aux';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Hidden from '@material-ui/core/Hidden';
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

class StudyPostOld extends React.Component {
    state = {
        form: {
            title: '',
            content: '',
            videoLink: '',
            imageLink: '',
        },
        showSnack: false,
        snackMessage: '',
        isLoading: false,
        showImage: false,
        showVideo: false,
        embedSuccess: false,
    }

    handlerInput = (event, identifier) => {
        const form = {...this.state.form};
        form[identifier] = event.target.value;
        this.setState(function(state, props) {
            return {
                form : form
            }
        })
    }

    toggleVideo = () => {
        this.setState(function(state, props) {
            return {
                showVideo: !state.showVideo,
            }
        })
    }

    toggleImage = () => {
        this.setState(function(state, props) {
            return {
                showImage: !state.showImage,
            }
        })
    }

    createPost = () => {
        this.setState(function(state, props) {
            return {
                isLoading: true
            }
        });

        axios.post('/api/study/saveStudyPost/'+this.props.match.params.study_id+"/"+this.props.auth.id, this.state.form)
            .then(response => {
                const res = response.data;
                if(res.status) {
                    this.props.history.push('/study/dashboard/detail/'+this.props.match.params.study_id);
                } else {
                    this.setState(function(state, props) {
                        return {
                            isLoading: false
                        }
                    });
                    this.showAlarm('포스트 사진 저장에 문제가 생겼습니다.');
                }
            })
    }

    startInsertImage = (e) => {
        this.refs.postImage.click();
        e.preventDefault();
    }

    uploadImage = (event) => {
        let config = { 
            headers: { 'Content-Type': 'multipart/form-data' }
        }
        let formData = new FormData();
        formData.append("image", event.target.files[0]);

        axios.post('/api/study/postImage/'+this.props.auth.id, formData, config)
            .then((response) => {
                const data = response.data;
                if( data.status ) {
                    const awsResponse = data.data;
                    const url = awsResponse.Location;
                    this.insertImage(url);
                    this.refs.postImage.value='';
                }
            })
            .catch(error => {
                this.showAlarm('포스트 사진 업로드에 문제가 생겼습니다.');
            })
    }

    insertImage = (url) => {
        const form = {...this.state.form};
        form.imageLink = url;
        this.setState(function(state,props){
            return {
                form:form
            }
        });
        this.showAlarm('포스트 사진 업로드에 성공했습니다.');
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

    embedVideo = () => {
        if(this.state.form.videoLink ==='') {
            this.showAlarm("링크를 입력해주세요.");
            return false;
        }
        const link = this.state.form.videoLink;
        if(link.indexOf('https://youtu.be') > -1 ) {
            const embedLink = link.replace('youtu.be','youtube.com/embed');
            const form = {...this.state.form};
            form.videoLink = embedLink;
            this.setState(function(state, props){
                return {
                    form:form,
                    embedSuccess: true,
                }
            })
            this.showAlarm("동영상 업로드에 성공했습니다.");
        } else if (link.indexOf('www.youtube.com/watch?v=') > -1 ){
            const embedLink = link.replace('watch?v=','embed/');
            const form = {...this.state.form};
            form.videoLink = embedLink;
            this.setState(function(state, props){
                return {
                    form:form,
                    embedSuccess: true,
                }
            })
            this.showAlarm("동영상 업로드에 성공했습니다.");
        } else {
            this.showAlarm("유튜브 링크를 입력해주세요.");
            return false;
        }
    }

    cancelEmbed = () => {
        const form = {...this.state.form};
        form.videoLink = '';
        this.setState(function(state, props){
            return {
                form:form,
                embedSuccess: false,
            }
        });
    }

    renderVideo = () => {
        return (
            <div className="videoPost">
                <FormInputs
                ncols={["col-md-12"]}
                proprieties={[
                    {
                    inputProps: {
                        type: "text",
                        placeholder: "동영상 링크를 적어주세요.",
                        readOnly: this.state.embedSuccess,
                        value: this.state.form.videoLink,
                        onChange: (event) =>this.handlerInput(event, 'videoLink')
                    }
                    }
                ]}
                />
                <div>
                    {this.state.embedSuccess ? 
                    <Button color="secondary" onClick={this.cancelEmbed} >첨부 취소</Button>
                    :
                    <Button color="secondary" onClick={this.embedVideo} >첨부하기</Button>
                    }
                </div>

                {this.state.embedSuccess === false ? null : (
                <iframe 
                    width="100%" 
                    height="315" 
                    src={this.state.form.videoLink} 
                    frameBorder="0" 
                    title="첨부 비디오"
                    allow="autoplay; encrypted-media" 
                    allowFullScreen></iframe>)
                }
            </div>
        );
    }

    renderImage = () => {
        return (
            <div className="videoPost">
                <FormInputs
                ncols={["col-md-12"]}
                proprieties={[
                    {
                    inputProps: {
                        type: "text",
                        placeholder: "첨부파일을 선택해 주세요.",
                        readOnly: true,
                        value: this.state.form.imageLink,
                        onChange: (event) =>this.handlerInput(event, 'imageLink'),
                        onClick: this.startInsertImage
                    }
                    }
                ]}
                />
                {this.state.form.imageLink === '' ? null : (
                    <div>
                        <img src={this.state.form.imageLink} width="100%" alt="첨부사진"/> 
                    </div>
                   )
                }
            </div>
        );
    }

    renderView = () => {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <LinearLoading open={this.state.isLoading} />
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
                        <List>
                            <ListItem button onClick={this.completeAssignment}>
                                <ListItemText primary={"과제 완료"} style={{textAlign: 'center'}}/>
                            </ListItem>
                        </List>
                    </Drawer>
                </Hidden>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                        <Row>
                            <Col md={8} xs={12}>
                            <Card>
                                <CardHeader>
                                <h5 className="title">스터디를 위해서 소중한 글을 남겨주세요.</h5>
                                <span>남들과 공유하면 가치는 배가 됩니다.</span>
                                </CardHeader>
                                <CardBody>
                                <form>
                                    <FormInputs
                                    ncols={["col-md-12"]}
                                    proprieties={[
                                        {
                                        label: "포스트 제목",
                                        inputProps: {
                                            type: "text",
                                            placeholder: "제목을 입력해주세요.",
                                            value: this.state.form.title,
                                            onChange: (event) =>this.handlerInput(event, 'title')
                                        }
                                        }
                                    ]}
                                    />
                                    <input type="file" style={{display: 'none'}} ref="postImage" onChange = {(event) => this.uploadImage(event)} />
                                    
                                    <FormInputs
                                    ncols={["col-md-12"]}
                                    proprieties={[
                                        {
                                        label: "내용",
                                        inputProps: {
                                            type: "textarea",
                                            rows: "20",
                                            style:{maxHeight: '999px', height:'auto'},
                                            cols: "80",
                                            placeholder: "글을 작성해주세요",
                                            value: this.state.form.content,
                                            onChange: (event) =>this.handlerInput(event, 'content')
                                        }
                                        }
                                    ]}
                                    />
                                </form>
                                <Button color="primary" onClick={this.createPost}>글 저장</Button>
                                <Button color="secondary" onClick={() => this.props.history.push('/study/dashboard/detail/'+this.props.match.params.study_id)}>취소</Button>
                                </CardBody>
                            </Card>
                            </Col>
                            <Col md={4} xs={12}>
                            <Card className="card-user">
                                <CardBody>
                                    <div>
                                        <section style={{display: 'inline-block'}}>
                                            <Checkbox
                                                inputProps={{
                                                    value: 'video',
                                                    onChange: this.toggleVideo,
                                                    checked: this.state.showVideo
                                                }}
                                                label={"Youtube 동영상 첨부"}
                                            />
                                        </section>
                                        <section style={{display: 'inline-block'}}>
                                            <Checkbox
                                                inputProps={{
                                                    value: 'image',
                                                    onChange: this.toggleImage,
                                                    checked: this.state.showImage
                                                }}
                                                label={"사진 첨부"}
                                            />
                                        </section>
                                    </div>
                                    {this.state.showVideo ? this.renderVideo() : null }
                                    {this.state.showImage ? this.renderImage() : null }
                                </CardBody>
                            </Card>
                            </Col>
                        </Row>
                </main>
                <Snackbar
                    place="br"
                    color="success"
                    message={this.state.snackMessage}
                    open={this.state.showSnack}
                    closeNotification={() => this.setState({ showSnack: false })}
                    close
                    />
            </div>
        )
    }
    render() {
        return (
        <Aux>
            {this.renderView()}
        </Aux>
        );
    }
}

function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps)(withStyles(styles)(StudyPostOld));
