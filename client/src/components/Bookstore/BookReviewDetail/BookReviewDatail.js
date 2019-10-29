import React from "react";
import { connect } from 'react-redux';
import axios from 'axios';

import Aux from '../../../HOC/Aux';
import Toast from '../../Shared/Toast/Toast';
import DataLoading from '../../Shared/DataLoading/DataLoading';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Draft  from '../../Shared/Draft/Draft';
import {EditorState, convertToRaw, convertFromRaw} from 'draft-js';
import AddAlert from "@material-ui/icons/AddAlert";
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

class BookReviewDatail extends React.Component {
    state = {
        isLoading: false,
        readOnly: true,
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
            axios.get('/api/bookstore/review/getInfo/' + this.props.match.params.id)
                .then(response => {
                    if(response.data.status) {
                        const data = response.data.data;
                        const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(data.content)));
                        
                        const info = {
                            bookTitle: data.bookTitle,
                            author: data.author,
                            publisher: data.publisher,
                            img_path: data.img_path,
                            ISBN: data.ISBN,
                            title : data.title,
                            content:  data.content,
                            is_shared: data.is_shared,
                        }
                        this.setState(function(state, props) {
                            return {
                                isLoading: false,
                                editorState: editorState,
                                info: info,
                            }
                        });
                    } else {
                        this.props.history.push('/dashboard/bookstore');
                    }
                })
                .catch( err => {
                    this.showNotification("에러가 발생하였습니다.")
                    this.props.history.push('/dashboard/bookstore');
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
        if(!this.state.readOnly) {
            this.refs.bookImage.click();
        }
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

    wanttomodify = () => {
        this.setState(function(state, props){
            return {
                readOnly: false,
            }
        })
    }

    renderView = () => {
        if(this.state.isLoading) {
            return <DataLoading />;
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
                                    InputProps={{
                                        readOnly: this.state.readOnly,
                                      }}
                                    className={classes.textField}
                                    value={this.state.info.bookTitle}
                                    onChange={(event) => this.changeValue(event, 'bookTitle')}
                                />
                                <TextField
                                    id="author"
                                    label="저자"
                                    fullWidth
                                    InputProps={{
                                        readOnly: this.state.readOnly,
                                      }}
                                    className={classes.textField}
                                    value={this.state.info.author}
                                    onChange={(event) => this.changeValue(event, 'author')}
                                />
                                <TextField
                                    id="publisher"
                                    label="출판사"
                                    fullWidth
                                    className={classes.textField}
                                    InputProps={{
                                        readOnly: this.state.readOnly,
                                      }}
                                    value={this.state.info.publisher}
                                    onChange={(event) => this.changeValue(event, 'publisher')}
                                />
                                <TextField
                                    id="ISBN"
                                    label="ISBN 코드"
                                    fullWidth
                                    className={classes.textField}
                                    InputProps={{
                                        readOnly: this.state.readOnly,
                                      }}
                                    value={this.state.info.ISBN}
                                    onChange={(event) => this.changeValue(event, 'ISBN')}
                                />
                            </CardContent>
                            <CardActions className={classes.actions}>
                                {this.state.readOnly ? 
                                        <Button size="small" color="primary" className={classes.button} onClick={this.wanttomodify}>
                                            <SaveIcon className={classes.leftIcon} />
                                            수정하기
                                        </Button>
                                        :
                                    <Button size="small" color="secondary" className={classes.button} onClick={this.saveEditBookReview}>
                                        <SaveIcon className={classes.leftIcon} />
                                        저장하기
                                    </Button>}
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
                                title="도서 리뷰 정보 수정하기"
                                subheader="작성하신 리뷰를 더욱 다듬어주세요"
                            />
                            <CardContent>
                                <Grid container spacing={8}>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="title"
                                            label="리뷰 제목"
                                            InputProps={{
                                                readOnly: this.state.readOnly,
                                              }}
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
                                            readOnly={this.state.readOnly}
                                            />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                // <div>
                //     <GridContainer>
                //         <GridItem xs={12} sm={12}>
                //             <Button color="white" onClick={() => this.props.history.push('/dashboard/bookstore')}>이전</Button>
                //         </GridItem>
                //     </GridContainer>
                //     <GridContainer>
                //         <GridItem xs={12} sm={12} md={8}>
                //         <Card>
                //             <CardHeader color="success">
                //             { this.state.readOnly ? (<Aux>
                //                 <h4 className={classes.cardTitleWhite}>도서 리뷰 정보 수정하기</h4>
                //                 <p className={classes.cardCategoryWhite}>작성하신 리뷰를 더욱 다듬어주세요.</p>
                //             </Aux>
                //             ) : <h2 style={{marginTop: '8px', marginBottom: '8px'}}>수정 모드</h2>
                //             }
                //             </CardHeader>
                //             <CardBody>
                //                 <GridContainer>
                //                     <GridItem xs={12} sm={12} md={12}>
                                        // {this.state.readOnly ? 
                                        // <Button color="primary" onClick={this.wanttomodify}>수정하기</Button> :
                                        // <Button color="success" onClick={this.saveEditBookReview}>저장</Button>}
                //                     </GridItem>
                //                 </GridContainer>
                //                 <GridContainer>
                //                     <GridItem xs={12} sm={12} md={12}>
                //                     <CustomInput
                //                         labelText="리뷰 제목"
                //                         id="title"
                //                         formControlProps={{
                //                         fullWidth: true
                //                         }}
                //                         inputProps={{
                //                             value :this.state.info.title,
                //                             onChange: (event) => this.changeValue(event, 'title'),
                //                             readOnly: this.state.readOnly
                //                         }}
                //                     />
                //                     </GridItem>
                //                 </GridContainer>
                //                 <GridContainer>
                //                     <GridItem xs={12} sm={12}>
                //                         <Draft 
                //                             editorState={this.state.editorState} 
                //                             onChange={(editorState) => this.onChange(editorState)}
                //                             auth={this.props.auth.id}
                //                             autoSave={this.autoSave}
                //                             readOnly={this.state.readOnly}
                //                             />
                //                     </GridItem>
                //                 </GridContainer>
                //             </CardBody>
                //         </Card>
                //         </GridItem>
                //         <GridItem xs={12} sm={12} md={4}>
                //         <Card profile>
                //             <CardAvatar profile>
                //             <a href="#addNewFile" onClick={e => this.startInsertImage(e)}>
                //                 <img src={this.state.info.img_path === '' ? avatar : this.state.info.img_path} alt="..." style={{width:"130px",height:"130px"}}/>
                //             </a>
                //             <input type="file" style={{display: 'none'}} ref="bookImage" onChange = {(event) => this.uploadImage(event)} />
                //             </CardAvatar>
                //             <CardBody profile>
                //                 <GridContainer>
                //                     <GridItem xs={12} sm={12}>
                //                     <CustomInput
                //                         labelText="도서 제목"
                //                         id="bookTitle"
                //                         formControlProps={{
                //                             fullWidth: true
                //                         }}
                //                         inputProps={{
                //                             value :this.state.info.bookTitle,
                //                             onChange: (event) => this.changeValue(event, 'bookTitle'),
                //                             readOnly: this.state.readOnly
                //                         }}
                //                     />
                //                     </GridItem>
                //                     <GridItem xs={12} sm={12}>
                //                     <CustomInput
                //                         labelText="저자"
                //                         id="author"
                //                         formControlProps={{
                //                             fullWidth: true
                //                         }}
                //                         inputProps={{
                //                             value :this.state.info.author,
                //                             onChange: (event) => this.changeValue(event, 'author'),
                //                             readOnly: this.state.readOnly
                //                         }}
                //                     />
                //                     </GridItem>
                //                     <GridItem xs={12} sm={12}>
                //                     <CustomInput
                //                         labelText="출판사"
                //                         id="publisher"
                //                         formControlProps={{
                //                             fullWidth: true
                //                         }}
                //                         inputProps={{
                //                             value :this.state.info.publisher,
                //                             onChange: (event) => this.changeValue(event, 'publisher'),
                //                             readOnly: this.state.readOnly
                //                         }}
                //                     />
                //                     </GridItem>
                //                     <GridItem xs={12} sm={12}>
                //                     <CustomInput
                //                         labelText="ISBN 코드"
                //                         id="ISBN"
                //                         formControlProps={{
                //                             fullWidth: true
                //                         }}
                //                         inputProps={{
                //                             value :this.state.info.ISBN,
                //                             onChange: (event) => this.changeValue(event, 'ISBN'),
                //                             readOnly: this.state.readOnly
                //                         }}
                //                     />
                //                     </GridItem>
                //                 </GridContainer>
                //             {this.state.readOnly ? null :
                //             <Button color="primary" round onClick={this.findISBN}>
                //                 ISBN 번호 찾기
                //             </Button>
                //             }
                //             </CardBody>
                //         </Card>
                //         </GridItem>
                //     </GridContainer>
                // </div>
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
    };

    autoSave = () => {
        return false;
    }
    
    resetTimeout = (id, newID) => {
        clearTimeout(id);
        return newID;
    }
    
    saveEditBookReview = async () => {
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

        const editorState = this.state.editorState;
        var value = convertToRaw(editorState.getCurrentContent());

        const content = JSON.stringify(value);
        const data = {...this.state.info};
        data.content = content;

        const res = await axios.post('/api/bookstore/saveEditBookReview/'+this.props.match.params.id, data);

        if(res.data.status === true ) {
            this.showNotification("정상적으로 수정되었습니다.");
            this.setState(function(state, props){
                return {
                    readOnly: true,
                }
            });
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

export default connect(mapStateToProps)(withStyles(styles)(BookReviewDatail));
