import React from 'react';
import { connect } from 'react-redux';
import './Blog.css';
import BlogBoard from './BlogBoard/BlogBoard';
import Typography from '@material-ui/core/Typography';

class Blog extends React.Component {
    render(){
        return (
            <div>
                {/* <BlogHeader 
                    auth={this.props.auth.id}
                    to={`/dashboard`}
                    label={'대시보드'}
                /> */}
                <div className="Blog container">
                    <div className="titleText">
                        <Typography gutterBottom variant="headline" component="h2">
                            원하는 카테고리를 선택해 주세요.
                        </Typography>
                    </div>
                    <BlogBoard auth={this.props.auth.id} history={this.props.history}/>
                </div>
            </div>
        )
    }
}


function mapStateToProps( { auth }) {
    return {auth}
}

export default connect(mapStateToProps)(Blog);