import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import './Main.css';
import DataLoading from '../Shared/DataLoading/DataLoading';
import Grid from '@material-ui/core/Grid';
import Aux from '../../HOC/Aux';
import Header from '../Layout/Header';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import WorkIcon from '@material-ui/icons/Work';
import EmailIcon from '@material-ui/icons/Email';
import Avatar from '@material-ui/core/Avatar';

class Main extends React.Component {
    state = {
        topStories: [],
        categoryList: [],
        bookReviewList: [],
        prfile: {},
        mainStory: null,
        isLoading: true,
    }

    componentDidMount() {
        if(this.props.match.params.email) {
            axios.get("/api/main/getFrontPost/"+this.props.match.params.email)
                .then((response) => {
                    const res =response.data;
                    if( res.status ) {
                        const data = res.data;
                        this.setState(function(state, props){
                            return {
                                topStories: data.recent,
                                categoryList: data.categoryList,
                                bookReviewList: data.bookReviewList,
                                mainStory: data.main,
                                profile: data.profile,
                                isLoading: false,
                            }
                        });
                    } 
                })
                .catch(err => {
                    this.props.history.replace('/login');
                });
        } else {
            this.props.history.replace('/login');
        }
    }

    renderView = () => {
        if( this.state.isLoading) {
            return <DataLoading />;
        } else {
            return (
                <Aux>
                    <Header 
                        email={this.props.match.params.email}
                        name= {this.state.profile.name}
                    />
                    <div className="container" style={{margin: '0 auto'}}>
                        <Grid container className="BlogReaderHeader">
                            <Grid item xs={12} sm={8} className="category auto-margin">
                                이름
                            </Grid>
                            <Grid item xs={12} sm={8} className="title auto-margin">
                                {this.state.profile.name}
                            </Grid>
                        </Grid>
                        <Grid className="mainReadingBoard">
                            <Grid container >
                                <Grid item xs={12} sm={8} className="auto-margin authorInfo">
                                    <Grid container >
                                        <Grid item xs={12} sm={4} className="profileAuthor">
                                            <Avatar 
                                                alt={this.state.profile.email} src={this.state.profile.profile_img} 
                                                className="profileAvatar"
                                                />
                                                <section>
                                                    <span><strong>{this.state.profile.email}</strong></span>
                                                    <span>{this.state.profile.belongto}</span>
                                                    <span>
                                                        <a href={"mailto:"+this.state.profile.email}><EmailIcon /></a>
                                                    </span>
                                                </section>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={8} style={{marginLeft: 'auto', padding:'0px 10px'}}>
                                    <Grid container >
                                        <Grid item xs={12}  className="draft" style={{marginTop: '15px'}}>
                                            <section className="aboutTitle">
                                                간단한 소개
                                            </section>
                                            <section className="classBoard" style={{whiteSpace: 'pre-line'}}>
                                                {this.state.profile.job}
                                            </section>
                                        </Grid>
                                        <Grid item xs={12}  className="draft" style={{marginTop: '15px'}}>
                                            <section className="aboutTitle">
                                                관심사
                                            </section>
                                            <section className="classBoard" style={{whiteSpace: 'pre-line'}}>
                                                {this.state.profile.interest}
                                            </section>
                                        </Grid>
                                        <div className="divider"></div>
                                        <Grid item xs={12} style={{marginTop: '15px'}}>
                                            <section className="aboutTitle">
                                                나의 경력사항
                                            </section>
                                            <section className="classBoard">
                                                {this.state.profile._carrer ? 
                                                    (<List dense>
                                                {this.state.profile._carrer.map((carrer, index) => {
                                                    const dateContent = `${carrer.year}년 ${carrer.month}월에 시작해서 ${carrer.period} 동안 진행.`;
                                                    return (
                                                            <ListItem key={carrer._id}>
                                                                <ListItemIcon>
                                                                    <WorkIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary={carrer.content} secondary={dateContent} />
                                                            </ListItem>
                                                    )
                                                })}
                                                </List>
                                                )
                                                : null }
                                            </section>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid> 
                        </Grid>
                    </div>
                </Aux>
            )
        }
    }
    render() {
        return ( 
            <Aux>{this.renderView()}</Aux>
        )
    }
}

function mapStateToProps({auth}){
    return {auth};
}
export default connect(mapStateToProps)(Main);