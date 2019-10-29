import React from "react";
import { connect } from 'react-redux';
import axios from 'axios';

import Aux from '../../../HOC/Aux';
import Toast from '../../Shared/Toast/Toast';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions'
import BookIcon from '@material-ui/icons/Book';
import SearchIcon from '@material-ui/icons/Search';


import Draft  from '../../Shared/Draft/Draft';
import {EditorState, convertToRaw, convertFromRaw} from 'draft-js';
import AddAlert from "@material-ui/icons/AddAlert";

import Snackbar from "../../CustomLayout/components/Snackbar/Snackbar";

import avatar from "../../../assets/img/faces/marc.jpg";

const styles = (theme) => ({
    card: {
        borderRadius: '0 !important',
    },
    actions: {
        display: 'flex',
      },
    cardHeader: {
        backgroundColor: "#2196f3",
        height: '5.6rem',
        whiteSpace: 'nowrap'
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
    },
    media: {
        height: 140,
        [theme.breakpoints.up('sm')]: {
            height: 250
        }
      },
    textField: {
        marginBottom : '15px'
    },
    button: {
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
});

class NewBookReview extends React.Component {
    state = {
        isLoading: false,
        info: {
            bookTitle: '',
            author: '',
            publisher: '',
            img_path: '',
            ISBN:'',
            title :'',
            content: '',
            is_shared: false,
        },
        showSnack: false,
        snackMessage: '',
        editorState: EditorState.createEmpty(),
        error: false,
        errorMessage: '',
        timeout: null,
        isSaving: false,
        saved: false,
    }
    componentDidMount() {
        if( this.props.match.params.id ) {
            axios.get('/api/blog/post/getInfo/' + this.props.match.params.id)
                .then(response => {
                    if(response.data.status) {
                        const data = response.data.data;
                        const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(data.content)));
                        const tempList = [...response.data.categoryList];
                        
                        this.setState(function(state, props) {
                            return {
                                isLoading: false,
                                editorState: editorState,
                                _user: data._user,
                                title: data.title,
                                isPublish: data.isPublish,
                                isMain: data.isMain,
                                publish_name: data.publish_name,
                                category: data._category || '',
                                CategoryList: tempList
                            }
                        });
                    } else {
                        this.props.history.push('/blog/'+this.props.auth.id);
                    }
                })
                .catch( err => {
                    this.props.history.push('/blog/'+this.props.auth.id);
                });
        } 
    }

    changeValue = (event, initiator) => {
        const value = event.target.value;
        const info = {...this.state.info};
        info[initiator] = value;
        this.setState(function(state,props){
            return {
                info:info
            }
        })
    }

    updateProfile = () => {
        axios.post('/api/auth/modifyUser', this.state.info)
            .then(response => {
                const data = response.data;
                if(data.status) {
                    this.showNotification("개인정보가 정상적으로 수정되었습니다.");
                }
            })
    }

    handleClose = (event) => {
        this.setState(function(state,props){
            return { error: false }
        });
    };

    showNotification(msg) {
        this.setState(function(state, props){
            return {
                snackMessage:msg,
                showSnack: true,
            }
        });
        this.alertTimeout = setTimeout(
          function() {
            this.setState(function(state, props){
                return {
                    showSnack: false,
                }
            });
          }.bind(this),
          6000
        );
      }

    startInsertImage = (e) => {
        this.refs.bookImage.click();
        e.preventDefault();
    }

    uploadImage = (event) => {
        let config = { 
            headers: { 'Content-Type': 'multipart/form-data' }
        }
        let formData = new FormData();
        formData.append("image", event.target.files[0]);

        axios.post('/api/book/review/imageUpload/'+this.props.auth.id, formData, config)
            .then((response) => {
                const data = response.data;
                if( data.status ) {
                    const awsResponse = data.data;
                    const url = awsResponse.Location;
                    this.insertImage(url);
                    this.refs.bookImage.value='';
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    insertImage = (url) => {
        const info = {...this.state.info};
        info.img_path = url;
        this.setState(function(state,props){
            return {
                info:info
            }
        });
    }

    findISBN = () => {
        if(this.state.info.bookTitle === '') {
            this.showNotification("책 제목을 입력해주세요.");
            return false;
        }

        window.open('https://search.naver.com/search.naver?query='+this.state.info.bookTitle.replace(' ','+')+'+ISBN', '_blank');
    }

    renderView = () => {
        if(this.state.isLoading) {
            return null;
        } else {
            const { classes } = this.props;
            return (
                <Grid container spacing={8} direction="row-reverse">
                    <Grid item xs={12} sm={12} md={4}>
                        <Card className={classes.card}>
                            <CardMedia
                                onClick={e => this.startInsertImage(e)}
                                className={classes.media}
                                image={this.state.info.img_path === '' ? avatar : this.state.info.img_path}
                                title="이미지"
                            />
                            <input type="file" style={{display: 'none'}} ref="bookImage" onChange = {(event) => this.uploadImage(event)} />
                            <CardContent>
                                <TextField
                                    id="bookTitle"
                                    label="도서 제목"
                                    fullWidth
                                    className={classes.textField}
                                    value={this.state.info.bookTitle}
                                    onChange={(event) => this.changeValue(event, 'bookTitle')}
                                />
                                <TextField
                                    id="author"
                                    label="저자"
                                    fullWidth
                                    className={classes.textField}
                                    value={this.state.info.author}
                                    onChange={(event) => this.changeValue(event, 'author')}
                                />
                                <TextField
                                    id="publisher"
                                    label="출판사"
                                    fullWidth
                                    className={classes.textField}
                                    value={this.state.info.publisher}
                                    onChange={(event) => this.changeValue(event, 'publisher')}
                                />
                                <TextField
                                    id="ISBN"
                                    label="ISBN 코드"
                                    fullWidth
                                    className={classes.textField}
                                    value={this.state.info.ISBN}
                                    onChange={(event) => this.changeValue(event, 'ISBN')}
                                />
                            </CardContent>
                            <CardActions className={classes.actions}>
                                <Button size="small" color="primary" className={classes.button} onClick={this.saveNewBookReview}>
                                    <SaveIcon className={classes.leftIcon} />
                                    리뷰 저장
                                </Button>
                                <Button size="small" color="default" className={classes.button} onClick={this.findISBN} >
                                    <SearchIcon className={classes.leftIcon} />
                                    ISBN 번호 찾기
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8}>
                        <Card className={classes.card}>
                            <CardHeader
                                avatar={<BookIcon className={classes.avatar}/>}
                                className={classes.cardHeader}
                                title="새로운 책 등록"
                                subheader="새로운 책을 통해서 어떤 걸 얻으셨나요~?"
                            />
                            <CardContent>
                                <Grid container spacing={8}>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="title"
                                            label="리뷰 제목"
                                            fullWidth
                                            className={classes.textField}
                                            value={this.state.info.title}
                                            onChange={(event) => this.changeValue(event, 'title')}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Draft 
                                            editorState={this.state.editorState} 
                                            onChange={(editorState) => this.onChange(editorState)}
                                            auth={this.props.auth.id}
                                            autoSave={this.autoSave}
                                            />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )
        }
    }

    render(){
        let errorMessage = null;
        if(this.state.error) {
            errorMessage = (
                <Toast error={true} errorMessage={this.state.errorMessage} handleClose={this.handleClose}/>
            )
        } else {
            errorMessage = null;
        }
        return (
            <Aux>
                {this.renderView()}
                <Snackbar
                    place="br"
                    color="success"
                    icon={AddAlert}
                    message={this.state.snackMessage}
                    open={this.state.showSnack}
                    closeNotification={() => this.setState({ showSnack: false })}
                    close
                  />
                  {errorMessage}
            </Aux>
        );
    }

    onChange = (editorState) => {
        this.setState({editorState});
        
        // if(this.state.saved === false) {
        //     this.setState(function(state,props){
        //         return {
        //                 timeout: this.resetTimeout(this.state.timeout, setTimeout(this.autoSave, 180000))
        //             }
        //     });
        // }
    };

    autoSave = () => {
        return false;
        //this.modifyData('auto');
    }
    
    resetTimeout = (id, newID) => {
        clearTimeout(id);
        return newID;
    }
    
    saveNewBookReview = async () => {
        if (this.state.info.title === '') {
            this.setState(function(state, props){
                return {
                    error: true,
                    errorMessage: '제목을 입력해 주세요.'
                };
            });
            document.querySelector('#title').focus();
            return false;
        }

        if (this.state.info.bookTitle === '') {
            this.setState(function(state, props){
                return {
                    error: true,
                    errorMessage: '도서 제목을 입력해 주세요.'
                };
            });
            document.querySelector('#bookTitle').focus();
            return false;
        }

        if (this.state.info.author === '') {
            this.setState(function(state, props){
                return {
                    error: true,
                    errorMessage: '저자명을 입력해 주세요.'
                };
            });
            document.querySelector('#author').focus();
            return false;
        }

        if (this.state.info.img_path === '') {
            this.setState(function(state, props){
                return {
                    error: true,
                    errorMessage: '도서 사진을 넣어주세요.'
                };
            });
            return false;
        }

        this.setState(function(state, props){
            return {
                isLoading: true
            }
        });

        const editorState = this.state.editorState;
        var value = convertToRaw(editorState.getCurrentContent());

        const content = JSON.stringify(value);
        const data = {...this.state.info};
        data.content = content;

        const res = await axios.post('/api/bookstore/saveNewReview/'+this.props.auth.id, data);
        
        if(res.data.status === true ) {
            this.props.history.push("/dashboard/bookstore");
        } else {
            this.setState(function(state, props){
                return {
                    error: true,
                    errorMessage: res.data.message
                };
            })
        }
    }
}

function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps)(withStyles(styles)(NewBookReview));
