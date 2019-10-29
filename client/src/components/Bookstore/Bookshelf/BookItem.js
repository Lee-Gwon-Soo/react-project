import React from 'react';

import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridItem from "../../CustomLayout/components/Grid/GridItem.jsx";
import Card from "../../CustomLayout/components/Card/Card.jsx";
import CardBody from "../../CustomLayout/components/Card/CardBody.jsx";
import CardAvatar from "../../CustomLayout/components/Card/CardAvatar";
import Table from "../../CustomLayout/components/Table/Table.jsx";

import dashboardStyle from "../../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

const BookItem = (props) => {
    return (
        <GridItem xs={12} sm={12} md={4} style={{marginTop: '30px', cursor: 'pointer'}} onClick={props.editBookReview}>
            <Card book>
                <CardAvatar book>
                    <img src={props.element.img_path} style={{width: '100%', height:'100%'}} alt=""/>
                </CardAvatar>
                <CardBody book>
                    <h3>{props.element.title}</h3>
                    <Table
                    tableHeaderColor="primary"
                    tableData={[
                        ["도서 제목", props.element.bookTitle],
                        ["저자", props.element.author],
                        ["출판사", props.element.publisher],
                        ["ISBN", props.element.ISBN],
                    ]}
                    />
                </CardBody>
            </Card>
        </GridItem>
    )
}
export default withStyles(dashboardStyle)(BookItem);