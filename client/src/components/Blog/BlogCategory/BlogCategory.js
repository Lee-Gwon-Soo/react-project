import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import './BlogCategory.css';

import Aux from '../../../HOC/Aux';
import Toast from '../../Shared/Toast/Toast';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from "@material-ui/core/styles/withStyles";

const styles = {
    cardCategoryWhite: {
      color: "rgba(0,0,0,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    cardTitleWhite: {
      color: "#000000",
      marginTop: "0px",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none"
    }
  };

class BlogCategory extends React.Component {
    state = {
        imageUploaded: false,
        imagePath: null,
        title: '',
        detail_descrption: '',
        description: '',
        error: false,
        errorMessage: '',
    }

    componentDidMount() {
        if(this.props.match.params.mode === 'edit' ) {
            axios.get('/api/category/getCategoryInfo/'+this.props.match.params.categoryId)
                .then(response => {
                    const res = response.data;
                    if(res.status) {
                        const data = res.data;
                        this.setState(function(state,props) {
                            return {
                                imageUploaded: true,
                                imagePath: data.imagePath,
                                description: data.description,
                                title: data.title,
                            }
                        })
                    } else {
                        this.setState(function(state,props){
                            return {
                                error: true,
                                errorMessage: '카테고리 이름을 입력해 주세요.'
                            }
                        });
                        setTimeout(() => {
                            this.props.history.push('/dashboard/blog');
                        }, 1000)
                        
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
    
    imageUpload = () => {
        if( !this.state.imageUpload ){
            this.file.click();
        } else {
            window.open(this.state.imagePath)
        }
    }

    tryUploadImage = (event) => {
        let config = { 
            headers: { 'Content-Type': 'multipart/form-data' }
        }
        let formData = new FormData();
        formData.append("image", event.target.files[0]);

        axios.post('/api/blog/category/imageUpload/'+ this.props.auth.id, formData, config)
            .then((response) => {
                const data = response.data;
                if( data.status ) {
                    const awsResponse = data.data;
                    const url = awsResponse.Location;
                    this.insertImage(url);
                    this.file.value='';
                }
            })
            .catch(error => {
                console.log(error);
            })
        this.file.value = null;
    }

    insertImage = (url) => {
        this.setState(function(state, props){
            return {
                imagePath: url,
                imageUploaded: true
            }
        })
    }

    renderImageView = () => {
        if( this.state.imageUploaded ) {
            return <img src={this.state.imagePath} className="uploadedImage" alt=""/> ;
        } else {
           return ( 
           <Aux>
                <i className="material-icons">add</i>
                <section>
                    이미지 등록
                </section>
            </Aux>
            )
        }
    }

    handleTitleChange = (event) => {
        const value = event.target.value;

        this.setState(function(state,props){
            return {
                title: value
            }
        })
    }

    handleDescriptionChange = (event) => {
        const value = event.target.value;

        this.setState(function(state,props){
            return {
                description: value
            }
        })
    }

    handleDetailDescriptionChange = (event) => {
        const value = event.target.value;

        this.setState(function(state,props){
            return {
                detail_descrption: value
            }
        })
    }


    handleClose = (event) => {
        this.setState(function(state,props){
            return { error: false }
        });
    };


    saveCategory = () => {
        if( this.state.title === '') {
            this.setState(function(state,props){
                return {
                    error: true,
                    errorMessage: '카테고리 이름을 입력해 주세요.'
                }
            });
            return false;
        } else if ( this.state.imagePath === null) {
            this.setState(function(state,props){
                return {
                    error: true,
                    errorMessage: '카테고리 사진을 입력해 주세요.'
                }
            });

            return false;
        } else if ( this.state.description === '') {
            this.setState(function(state,props){
                return {
                    error: true,
                    errorMessage: '카테고리 설명을 입력해 주세요.'
                }
            });

            return false;
        }

        const body = {
            title: this.state.title,
            description: this.state.description,
            detail_descrption: this.state.detail_descrption,
            imagePath: this.state.imagePath,
            isOpen: false,
        }

        if(this.props.match.params.mode === 'edit') {
            axios.post('/api/blog/category/modifyCategory/'+ this.props.match.params.categoryId, body)
                .then((response) => {
                    const data = response.data;
                    if( data.status ) {
                        this.props.history.push('/dashboard/blog');
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        } else{
            axios.post('/api/blog/category/saveCategory/'+ this.props.auth.id, body)
                .then((response) => {
                    const data = response.data;
                    if( data.status ) {
                        this.props.history.push('/dashboard/blog');
                    }
                })
                .catch(error => {
                    console.log(error);
                })
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
                <Grid container spacing={8} justify="center">
                    <Grid item xm={12} sm={10}>
                        <Paper className="BlogCategory">
                            <Grid container spacing={8} justify="center" >
                                <Grid item xs={12} sm={8} style={{padding: '10px 0px', textAlign: 'center'}} >
                                    <Typography variant="h5" component="h3">
                                        새로운 카테고리 등록
                                    </Typography>
                                    <Typography component="p">
                                        인생을 즐겁게 해줄 새로운 도전을 등록해주세요.
                                    </Typography>

                                </Grid>
                                <div style={{ height: '1px', width: '60%', background: '#eeeeee'}}></div>
                            </Grid>
                            <Grid container spacing={16} justify="center" style={{marginTop: '15px'}}>
                                <Grid item xs={12} sm={5}>
                                    <input type="file" style={{display: 'none'}} ref={(ref) => this.file = ref} onChange={(event) => this.tryUploadImage(event)}/>
                                    <div className="imgBoard" onClick={this.imageUpload}>
                                        {this.renderImageView()}
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <div className="categoryInfo">
                                        <TextField
                                            fullWidth
                                            label="카테고리 이름"
                                            className="textField"
                                            value={this.state.title}
                                            onChange={(event) => this.handleTitleChange(event)}
                                            margin="normal"
                                            />
                                            <TextField
                                            fullWidth
                                            id="description"
                                            label="카테고리 설명"
                                            multiline
                                            className="textField"
                                            value={this.state.description}
                                            onChange={(event) => this.handleDescriptionChange(event)}
                                            margin="normal"
                                            />
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid container spacing={8} justify="center" className="cardBoard">
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                            id="detail_descrption"
                                            label="카테고리 상세 설명"
                                            multiline
                                            fullWidth
                                            className="textField"
                                            value={this.state.detail_descrption}
                                            onChange={(event) => this.handleDetailDescriptionChange(event)}
                                            margin="normal"
                                            />

                                    <div style={{width:'100%', padding:'10px 0px'}}>
                                        <Button variant="contained" color="primary" className="addButton" onClick={this.saveCategory}>
                                            카테고리 저장
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
                {errorMessage}
            </Aux>
        );
    }
}

function mapStateToProps({auth}) {
    return {auth}
}

export default connect(mapStateToProps)(withStyles(styles)(BlogCategory));