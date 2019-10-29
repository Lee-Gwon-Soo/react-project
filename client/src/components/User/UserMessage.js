import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import  { connect } from 'react-redux';
import classNames from 'classnames';
import Aux from '../../HOC/Aux';
import { withStyles } from '@material-ui/core/styles';
import LinearLoading from '../Shared/LinearLoading/LinearLoading';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
    handleFirstPageButtonClick = event => {
        this.props.onChangePage(event, 0);
    };

    handleBackButtonClick = event => {
        this.props.onChangePage(event, this.props.page - 1);
    };

    handleNextButtonClick = event => {
        this.props.onChangePage(event, this.props.page + 1);
    };

    handleLastPageButtonClick = event => {
        this.props.onChangePage(
        event,
        Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
        );
    };

    render() {
        const { classes, count, page, rowsPerPage, theme } = this.props;

        return (
        <div className={classes.root}>
            <IconButton
            onClick={this.handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="First Page"
            >
            {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
            onClick={this.handleBackButtonClick}
            disabled={page === 0}
            aria-label="Previous Page"
            >
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
            onClick={this.handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="Next Page"
            >
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
            onClick={this.handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="Last Page"
            >
            {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
        );
    }
}

TablePaginationActions.propTypes = {
    classes: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
    TablePaginationActions,
);

const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
    },
    table: {
      minWidth: 500,
      [theme.breakpoints.down('sm')]: {
          display: 'none'
      }
    },
    mobileTable: {
        [theme.breakpoints.up('sm')]: {
            display: 'none'
        }
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    item : {
        '&:hover': {
            boxShadow: 'inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0, 0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
            zIndex: 30,
            cursor: 'pointer'
        }
    },
    alreadRead: {
        background: 'rgba(242,245,245,0.8)',
    }
});
  
const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
    });

    let EnhancedTableToolbar = props => {
        const { numSelected, classes } = props;

        return (
            <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
            >
            <div className={classes.title}>
                {numSelected > 0 ? (
                <Typography color="inherit" variant="subtitle1">
                    {numSelected} selected
                </Typography>
                ) : (
                <Typography variant="h6" id="tableTitle">
                    받은 편지함
                </Typography>
                )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="Delete">
                    <DeleteIcon />
                    </IconButton>
                </Tooltip>
                ) : (
                <Tooltip title="Filter list">
                    <IconButton aria-label="Filter list">
                    <FilterListIcon />
                    </IconButton>
                </Tooltip>
                )}
            </div>
            </Toolbar>
        );
    };

EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);
  
  
class UserMessage extends React.Component {
    state = {
        messageList: [],
        isLoading: true,
        page: 0,
        rowsPerPage: 5,
        selected: [],
    };

    componentDidMount() {
        if(this.props.auth.id) {
            axios.get('/api/getPrivateMessage/'+this.props.auth.id)
                .then(response => {
                    const res = response.data;
                    if(res.status) {
                        this.setState(function(state){
                            return {
                                messageList: [...res.data],
                                isLoading: false,
                            }
                        })
                    }
                })
        } else{
            this.props.history.push('/login');
        }
    }

    handleSelectAllClick = event => {
        if (event.target.checked) {
          this.setState(state => ({ selected: state.messageList.map(n => n._id) }));
          return;
        }
        this.setState({ selected: [] });
      };
    
      handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
    
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
          );
        }
    
        this.setState(function(state,props){ 
            return {
                selected: newSelected }
        });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;
    
    handleChangePage = (event, page) => {
        this.setState({ page });
    };
    
    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    render(){
        const { classes } = this.props;
        const { messageList, rowsPerPage, page, numSelected, selected } = this.state;
        const pageTotal = Math.min(rowsPerPage, messageList.length - page * rowsPerPage);
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, messageList.length - page * rowsPerPage);
        return (
            <Grid container justify="center">
                <Grid item xs={12} sm={10} >
                <LinearLoading open={this.state.isLoading} />
                    <Paper className={classes.root}>
                        <EnhancedTableToolbar numSelected={selected.length} />
                        <Table className={classes.table}>
                            <colgroup>
                                <col width="20%"/>
                                <col width="20%"/>
                                <col width="*"/>
                            </colgroup>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                        indeterminate={numSelected > 0 && numSelected < pageTotal}
                                        checked={selected.length === pageTotal}
                                        onChange={this.handleSelectAllClick}
                                        />
                                    </TableCell>
                                    <TableCell>송/수신자</TableCell>
                                    <TableCell>내용</TableCell>
                                    <TableCell>날짜</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {messageList.length > 0 ?
                            <Aux>
                            {messageList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                                const original_id = row.upper_message_id ? row.upper_message_id : row._id;
                                const isSelected = this.isSelected(row._id);
                                const date = new Date(row.ins_dtime);
                                return (
                                <TableRow 
                                    key={row._id} 
                                    selected={isSelected}
                                    className={classNames((row.isRead || row.receiverEmail !==this.props.auth.email) && classes.alreadRead, classes.item)}>
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={isSelected}  onClick={event => this.handleClick(event, row._id)} />
                                    </TableCell>
                                    <TableCell onClick={()=>this.props.history.push('/dashboard/message/detail/'+original_id)}>{row.senderName}{" / "}{row.receiverName}</TableCell>
                                    <TableCell onClick={()=>this.props.history.push('/dashboard/message/detail/'+original_id)} component="th" scope="row">{row.title}</TableCell>
                                    <TableCell >
                                    {date.getMonth()+1}월{" "}{date.getDate()}일
                                    </TableCell>
                                </TableRow>
                                );
                            })}{emptyRows > 0 && (
                                <TableRow style={{ height: 48 * emptyRows }}>
                                <TableCell colSpan={6} />
                                </TableRow>
                            )}</Aux>
                            :
                                <TableRow>
                                    <TableCell colSpan="3">받은 메시지가 없습니다.</TableCell>
                                </TableRow>
                            }</TableBody> 
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                    colSpan={3}
                                    count={messageList.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActionsWrapped}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                        <div className={classes.mobileTable}>
                            <Table>
                                <colgroup>
                                    <col width="50%"/>
                                    <col width="*"/>
                                </colgroup>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>송/수신자</TableCell>
                                        <TableCell>내용</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {messageList.length > 0 ?
                                <Aux>
                                {messageList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                                    // const original_id = row.upper_message_id ? row.upper_message_id : row._id;
                                    return (
                                    <TableRow key={row._id} className={classNames((row.isRead || row.receiverEmail !==this.props.auth.email) && classes.alreadRead, classes.item)} >
                                        <TableCell>{row.senderName}{" / "}{row.receiverName}</TableCell>
                                        <TableCell component="th" scope="row">{row.content.substring(0, 7)+ '...'}</TableCell>
                                    </TableRow>
                                    );
                                })}{emptyRows > 0 && (
                                    <TableRow style={{ height: 48 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                    </TableRow>
                                )}</Aux>
                                :
                                    <TableRow>
                                        <TableCell colSpan="3">받은 메시지가 없습니다.</TableCell>
                                    </TableRow>
                                }</TableBody> 
                            </Table>
                            <TablePagination
                                colSpan={3}
                                count={messageList.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                component="div"
                                />
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        );
        }
}

UserMessage.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps)(withStyles(styles)(UserMessage));