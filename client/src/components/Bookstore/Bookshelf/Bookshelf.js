import React, { Component } from 'react';
import axios from 'axios';

import './Bookshelf.css';
import Aux from '../../../HOC/Aux';
import DataLoading from '../../Shared/DataLoading/DataLoading';
import BookItem from './BookItem';

import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridItem from "../../CustomLayout/components/Grid/GridItem.jsx";
import GridContainer from "../../CustomLayout/components/Grid/GridContainer.jsx";
import Button from "../../CustomLayout/components/CustomButtons/Button.jsx";

import dashboardStyle from "../../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

class Bookshelf extends Component {
    state = {
        bookList:[],
        isLoading: true,
    }

    componentDidMount() {
        if(this.props.auth) {
            axios.get('/api/bookstore/getBookList/'+this.props.auth)
                .then(response => {
                    const res = response.data;
                    if(res.status){
                        //Fetch successfully
                        const data = res.data;
                        this.setState(function(state,props){
                            return {
                                bookList: data,
                                isLoading: false,
                            }
                        })
                    }
                });
        }
    }
    
    addNewBook = () => {
        this.props.history.push('/dashboard/book/add');
    }

    editBookReview = (reviewId) => {
        this.props.history.push('/dashboard/book/edit/'+reviewId);
    }

    renderView = () => {
        if(this.state.isLoading) {
            return <DataLoading />;
        } else {
            return (
                <div>
                    <GridContainer>
                        <GridItem xs={12}>
                            <Button color="warning" onClick={this.addNewBook}>새로운 도서 등록</Button>
                        </GridItem>
                    </GridContainer>
                    <GridContainer>
                        {this.state.bookList.map( (item, index) => {
                            return (
                                <BookItem 
                                    key={item._id}
                                    element={item}
                                    editBookReview={() => this.editBookReview(item._id)}
                                />
                            )
                        })}
                    </GridContainer>
                </div>
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

export default withStyles(dashboardStyle)(Bookshelf);