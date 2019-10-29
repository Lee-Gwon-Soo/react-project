import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {connect} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Draft from '../../Shared/Draft/Draft';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import TextField from '@material-ui/core/TextField';
import {EditorState, convertToRaw, convertFromRaw} from 'draft-js';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Snackbar from "../../CustomLayout/components/Snackbar/Snackbar";
import LinearLoading from '../../Shared/LinearLoading/LinearLoading';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Aux from '../../../HOC/Aux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

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
    demo: {
        backgroundColor: theme.palette.background.paper,
        marginTop: theme.spacing.unit,
        padding: theme.spacing.unit,
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
    referenceBoard: {
        display: 'flex',
        paddingTop: '16px !important',
        paddingBottom: '16px !important',
        paddingLeft: '16px !important',
        paddingRight: '16px !important',
        borderRadius: '4px',
        backgroundColor: '#eeeeee',
    },

    formControl: {
        minWidth: 120,
        marginBottom: '15px'
    },
    uploadBoard: {
        paddingTop: '16px !important',
        paddingBottom: '16px !important',
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
});

class StudyPost extends React.Component {

    state = {
        editorState: EditorState.createEmpty(),
        form: {
            title: '',
            content: '',
            videoLink: '',
            imageLink: '',
            uploadList: [],
        },
        showSnack: false,
        snackMessage: '',
        isLoading: true,
        showImage: false,
        showVideo: false,
        embedSuccess: false,
        videoType: '',
        deleteDialog: false,
        deleteIndex: '',
    };

    componentDidMount() {
        if(this.props.match.params.postId) {
            axios.get('/api/study/front/getStudyPostInfo/'+this.props.match.params.postId)
                .then(response => {
                    const res = response.data;
                    if(res.status) {
                        const data = res.data;
                        const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(data.content)));
                        let videoType = '';
                        let embedSuccess = false;
                        if(data.videoLink.indexOf('youtube.com/embed') > -1) {
                            videoType = 'Youtube';
                            embedSuccess = true;
                        } else if (data.videoLink.indexOf('embed.ted.com') > -1) {
                            videoType = 'TED';
                            embedSuccess= true;
                        }
                        const form = {
                            title: data.title,
                            content: data.content,
                            videoLink: data.videoLink,
                            imageLink: data.imageLink,
                            uploadList: data.uploadList,
                        }
                        let showImage = false;
                        if(form.imageLink) {
                            showImage = true;
                        }

                        let showVideo = false;
                        if(form.videoLink) {
                            showVideo = true;
                        }

                        this.setState(function(state, props){
                            return {
                                form: form,
                                editorState: editorState,
                                showImage: showImage,
                                showVideo: showVideo,
                                isLoading: false,
                                videoType: videoType,
                                embedSuccess:embedSuccess
                            }
                        });
                    } else {
                        this.showAlarm("스터디 포스트 로딩에 문제가 생겼습니다.");
                    }
                })
        } else {
            this.setState(function(state, props){
                return {
                    isLoading: false,
                }
            });
        }
    }

    onChange = (editorState) => {
        this.setState({editorState});
    };
    

    handlerInput = (event, identifier) => {
        const form = {...this.state.form};
        form[identifier] = event.target.value;
        this.setState(function(state, props) {
            return {
                form : form
            }
        })
    }

    toggleVideo = (event) => {
        const form = {...this.state.form};
        if(event.target.checked){
            form.videoLink = '';
        }
        this.setState(function(state, props) {
            return {
                showVideo: !state.showVideo,
                videoType: '',
                form: form
            }
        })
    }

    toggleImage = (event) => {
        const form = {...this.state.form};
        if(event.target.checked){
            form.imageLink = '';
        }
        this.setState(function(state, props) {
            return {
                showImage: !state.showImage,
                form:form
            }
        })
    }

    savePost = () => {
        this.setState(function(state, props) {
            return {
                isLoading: true
            }
        });

        const editorState = this.state.editorState;
        var value = convertToRaw(editorState.getCurrentContent());

        const content = JSON.stringify(value);
        const form = {...this.state.form};
        form.content = content;
        
        let url = null;
        if(this.props.match.params.postId) {
            url = '/api/study/modifyStudyPost/'+this.props.match.params.postId;
        }else{
            url = '/api/study/saveStudyPost/'+this.props.match.params.study_id+"/"+this.props.auth.id;
        }
        axios.post(url, form)
            .then(response => {
                const res = response.data;
                if(res.status) {
                    this.props.history.push('/study/front/post/'+res.data._id);
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

    startUploadFile = (e) => {
        this.refs.uploadFile.click();
        e.preventDefault();
    }

    uploadFile = (event) => {
        this.setState(function(state, props) {
            return {
                isLoading: true
            }
        });
        
        let config = { 
            headers: { 'Content-Type': 'multipart/form-data' }
        }
        let formData = new FormData();
        formData.append("file", event.target.files[0]);

        axios.post('/api/study/uploadFile/'+this.props.auth.id, formData, config)
            .then((response) => {
                const data = response.data;
                if( data.status ) {
                    const awsResponse = data.data;
                    const url = awsResponse.Location;
                    const form = {...this.state.form};
                    form.uploadList.push(url);
                    this.setState(function(state,props){
                        return {
                            form:form,
                            isLoading: false,
                        }
                    });
                    this.showAlarm('파일 업로드에 성공했습니다.');
                    this.refs.uploadFile.value='';
                }
            })
            .catch(error => {
                this.setState(function(state, props) {
                    return {
                        isLoading: false
                    }
                });
                this.showAlarm('파일 업로드에 문제가 생겼습니다.');
            })
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
                this.showAlarm('사진 업로드에 문제가 생겼습니다.');
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
        this.showAlarm('사진 업로드에 성공했습니다.');
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
        if(this.state.videoType === 'Youtube') {
            //Youtube Link
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
        } else if (this.state.videoType === 'TED') {
            //TED Link
            if(link.indexOf('https://www.ted.com') > -1 ) {
                const embedLink = link.replace('www.ted.com','embed.ted.com');
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
                this.showAlarm("TED 링크를 입력해주세요.");
                return false;
            }
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

    handleVideoType = event => {
        const form = {...this.state.form};
        form.videoLink = '';
        this.setState(function(state,props){
            return { 
                [event.target.name]: event.target.value,
                form:form,
                embedSuccess: false,
            }
        });
    };

    renderVideo = () => {
        const {classes} = this.props;
        return (
            <Grid item xs={12} sm={6} >
                <FormControl className={classes.formControl}>
                <InputLabel htmlFor="type-helper">영상 타입</InputLabel>
                <Select
                    value={this.state.videoType}
                    onChange={this.handleVideoType}
                    input={<Input name="videoType" id="type-helper" />}
                >
                    <MenuItem value={'Youtube'}>유튜브</MenuItem>
                    <MenuItem value={'TED'}>TED</MenuItem>
                </Select>
                <FormHelperText>어떤 사이트의 영상을 첨부하고 싶으세요?</FormHelperText>
                </FormControl>
                {this.state.videoType === '' ? null : 
                <Aux>
                    <TextField
                            required
                            id="title"
                            name="title"
                            label={`${this.state.videoType} 동영상 링크`}
                            placeholder={`${this.state.videoType} 동영상 링크를 적어주세요.`}
                            value={this.state.form.videoLink}
                            onChange={(event) => this.handlerInput(event, 'videoLink')}
                            fullWidth
                        />
                    
                    {this.state.embedSuccess === false ? null : (
                    <iframe 
                        width="100%" 
                        height="315" 
                        style={{marginTop: '15px'}}
                        src={this.state.form.videoLink} 
                        frameBorder="0" 
                        title="첨부 비디오"
                        allow="autoplay; encrypted-media" 
                        allowFullScreen></iframe>)
                    }
                    <div style={{marginTop:'10px'}}>
                        {this.state.embedSuccess ? 
                        <Button color="default" variant="contained" onClick={this.cancelEmbed} >첨부 취소</Button>
                        :
                        <Button color="secondary" variant="contained" onClick={this.embedVideo} >첨부하기</Button>
                        }
                    </div>
                </Aux>
                }
            </Grid>
        );
    }

    renderImage = () => {
        return (
            <Grid item xs={12} sm={6} >
                <TextField
                        required
                        id="title"
                        name="title"
                        label="사진 파일 경로"
                        placeholder="첨부파일을 선택해 주세요."
                        readOnly={true}
                        value={this.state.form.imageLink}
                        onClick={this.startInsertImage}
                        onChange={(event) => this.handlerInput(event, 'imageLink')}
                        fullWidth
                    />
                    <input type="file" style={{display: 'none'}} ref="postImage" onChange = {(event) => this.uploadImage(event)} />
                {this.state.form.imageLink === '' ? null : (
                    <div style={{marginTop: '15px'}}>
                        <img src={this.state.form.imageLink} width="100%" alt="첨부사진" height="315" /> 
                    </div>
                   )
                }
            </Grid>
        );
    }

    onCancel = () => {
        let url = null;
        if(this.props.match.params.postId) {
            url = '/study/front/post/'+this.props.match.params.postId;
        }else{
            url = '/study/dashboard/detail/'+this.props.match.params.study_id;
        }
        this.props.history.push(url)
    }

    tryDeletingLink = (index) => {
        this.setState(function(state, props) {
            return {
                deleteDialog: true,
                deleteIndex: index,
            }
        })
    }

    handleClose = () => {
        this.setState(function(state, props) {
            return {
                deleteDialog: false,
            }
        })
    }

    deleteFile = () => {
        let form = {...this.state.form};
        const list = form.uploadList.filter((element, i) => i !== this.state.deleteIndex);
        form.uploadList = list;
        this.setState(function(state, props) {
            return {
                form:form,
                deleteDialog: false,
                deleteIndex: ''
            }
        })
        this.showAlarm("첨부파일이 삭제되었습니다.");
    }

    render(){
        const { classes } = this.props;
        if(this.state.isLoading) {
            return <LinearLoading open={this.state.isLoading} />
        } else {
            return (
                <Grid container spacing={8} justify="center" style={{marginTop: '15px'}}>
                    <Grid item xs={12} sm={10} >
                        <TextField
                            required
                            id="title"
                            name="title"
                            label="타이틀"
                            value={this.state.form.title}
                            onChange={(event) => this.handlerInput(event, 'title')}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={10} className={classes.uploadBoard}>
                        <input type="file" style={{display: 'none'}} ref="uploadFile" onChange = {(event) => this.uploadFile(event)} />
                        <div className={classes.demo}>
                            <Button variant="contained" color="default" size="small" className={classes.button} onClick={this.startUploadFile}>
                                첨부파일 업로드
                                <CloudUploadIcon className={classes.rightIcon} />
                            </Button>
                            <List dense>
                                {this.state.form.uploadList.map((list, index) => {
                                    return (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <FolderIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={list.substring(0,100)+"..."}
                                            />
                                            <ListItemSecondaryAction onClick={() => this.tryDeletingLink(index)}>
                                            <IconButton aria-label="Delete">
                                                <DeleteIcon />
                                            </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={10} className={classes.referenceBoard} style={{marginTop: '15px'}}>
                        <Grid container spacing={8} >
                            <Grid item xs={12}>
                                <FormControlLabel
                                control={
                                    <Checkbox
                                    checked={this.state.showVideo}
                                    onChange={this.toggleVideo}
                                    value="video"
                                    />
                                }
                                label="동영상 첨부"
                                />
                                <FormControlLabel
                                control={
                                    <Checkbox
                                    checked={this.state.showImage}
                                    onChange={this.toggleImage}
                                    value="image"
                                    />
                                }
                                label="사진 첨부"
                                />
                            </Grid>
                            {this.state.showVideo ? this.renderVideo() : null }
                            {this.state.showImage ? this.renderImage() : null }
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={10} style={{marginTop: '15px'}}>
                        <Draft 
                            editorState={this.state.editorState}
                            onChange={this.onChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={10} style={{marginTop: '15px'}}>
                        <Button color="primary" variant="contained" onClick={this.savePost} >글 저장</Button>
                        <Button color="secondary" onClick={this.onCancel}>취소</Button>
                    </Grid>
                    <Snackbar
                        place="br"
                        color="success"
                        message={this.state.snackMessage}
                        open={this.state.showSnack}
                        closeNotification={() => this.setState({ showSnack: false })}
                        close
                        />
                        <DeleteConfirmDialog 
                            open={this.state.deleteDialog}
                            deleteFile={this.deleteFile}
                            handleClose={this.handleClose}
                        />}
                </Grid>
            );
        }
    }
}

StudyPost.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps)(withStyles(styles)(StudyPost));