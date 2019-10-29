import React from 'react';
import axios from 'axios';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import LabelIcon from '@material-ui/icons/Label';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import LinearLoading from '../../Shared/LinearLoading/LinearLoading';
import Aux from '../../../HOC/Aux';


let counter = 0;
function createData(data) {
  counter += 1;
  data.id = counter;
  if(data.isUse === true) {
    data.usage = 'YES';
  }else{
    data.usage = 'NO';
  }
  return data;
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'title', numeric: false, disablePadding: true, label: '제목' },
  { id: 'type', numeric: false, disablePadding: false, label: '타입' },
  { id: 'Usage', numeric: false, disablePadding: false, label: '사용여부' },
  { id: 'ins_dtime', numeric: false, disablePadding: false, label: '작성 날짜' },
];

class BlogListTable extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

BlogListTable.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

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
    flex: '1 1 60%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let BlogTableToolbar = props => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit">
            {numSelected}개 선택됨
          </Typography>
        ) : (
          <Typography id="tableTitle">
            전체 블로그 포스트
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Aux>
            {(numSelected > 1) ? null : (
            <Aux>
              <Tooltip title="메인 포스트">
                <IconButton aria-label="메인 포스트" onClick={props.selectAsMainTopPost}>
                  <i className="material-icons">touch_app</i>
                </IconButton>
              </Tooltip>
              {/* <Tooltip title="Select as Main Post">
                <IconButton aria-label="Select as Main Post" onClick={props.saveSelectedItem}>
                  <i className="material-icons">check</i>
                </IconButton>
              </Tooltip> */}
            </Aux>
            )}
            <Tooltip title="공개">
              <IconButton aria-label="공개" onClick={props.saveUsageToTrue}>
                <i className="material-icons">add_circle_outline</i>
              </IconButton>
            </Tooltip>
            <Tooltip title="비공개">
              <IconButton aria-label="비공개" onClick={props.saveUsageToFalse}>
                <i className="material-icons">block</i>
              </IconButton>
            </Tooltip>
          </Aux>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
              <i className="material-icons">filter_list</i>
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

BlogTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

BlogTableToolbar = withStyles(toolbarStyles)(BlogTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
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
  },
  item : {
    '&:hover': {
        boxShadow: 'inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0, 0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
        zIndex: 30,
        cursor: 'pointer'
    }
  }
});

class BlogTable extends React.Component {
  state = {
    order: 'desc',
    orderBy: 'ins_dtime',
    selected: [],
    data: [],
    topItem:{},
    page: 0,
    rowsPerPage: 5,
    isLoading: true,
  };

  componentDidMount() {
    //category 아이디
    if(this.props.categoryId) {
        axios.get('/api/blog/getBlogList/'+this.props.categoryId+'/'+this.props.auth)
            .then((response) => {
                const data = response.data;
                if(data.status) {
                    const tempList = [...data.data];

                    // using list
                    let usageList = [];
                    for(let i in tempList) {
                          const jsonData = createData(tempList[i]);
                          usageList.push(jsonData);
                    }
                    console.log(data.topItem);

                    //set state
                    this.setState(function(state, props){
                        return {
                            isLoading: false,
                            data : usageList,
                            topItem:data.topItem,
                        }
                    });
                } else {
                    this.props.history.replace('/dashboard');
                }
                })
            .catch(error => {
                console.log(error);
            })
    }
  }

  selectAsMainTopPost = () => {
      let postId = [];
      const selected = [...this.state.selected];

      this.state.data.map(item => {
          if(selected.includes(item.id)){
            postId = item._id;
          }
      });

      const body = {
          category: this.props.categoryId,
          selectedId: postId
      };
      axios.post('/api/blog/selectAsMainTopPost', body)
      .then(response => {
          if(response.data.status) {
            this.setState(function(state, props) {
              return {
                topItem: response.data.data
              }
            })
            this.props.showError('메인 블로그 저장이 완료되었습니다.');
          } else {
            this.props.showError(response.data.message);
          }
      })
      .catch(error => {
          this.props.showError('저장에 문제가 생겼습니다.');
      });
  }

  saveSelectedItem = () => {
      let postId = [];
      const selected = [...this.state.selected];

      this.state.data.map(item => {
          if(selected.includes(item.id)){
            postId = item._id;
          }
      });

      const body = {
          category: this.props.categoryId,
          selectedId: postId
      };
      axios.post('/api/blog/selectTopItem', body)
      .then(response => {
          if(response.data.status) {
              this.state.data.map((data, index) => {
                  if(data._id === response.data.data._id) {
                      return data.isTopItem = response.data.data.isTopItem;
                  } else {
                      return data.isTopItem = false;
                  }
              })
            this.props.showError('카테고리 대표 블로그 저장이 완료되었습니다.');
          }
      })
      .catch(error => {
          this.props.showError('저장에 문제가 생겼습니다.');
          this.setState(function(state, props){
              return {
                  isLoading: false
              }
          });
      });
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
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

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  saveUsage = (state) => {
      const postId_array = [];
      const selected = [...this.state.selected];

      this.state.data.map(item => {
          if(selected.includes(item.id)){
            postId_array.push(item._id);
          }
      })

      const body = {
          postIds: postId_array,
          state: state
      };

      axios.post('/api/blog/changeUsage', body)
      .then(response => {
          if(response.data.status) {
              const current = [...this.state.data];
              const tmp = [];
              current.map(x => {
                if(selected.includes(x.id)){
                  x.isUse = state;
                  x.usage = state ? "YES" : "NO";
                }
                tmp.push(x);
              });
              
              this.setState(function(state, props){
                return {
                    data: tmp
                }
            });
              //this.selectedToUse(postId_array, state);
              this.props.showError('사용여부가 변경되었습니다.');
          }
      })
      .catch(error => {
          this.props.showError('사용여부 저장에 문제가 생겼습니다.');
      });
  }
  
  selectedToUse = (postIds, state) => {
    const data = [...this.state.data];
    const newData = [];
    const selected = [];
    data.map((post, index) => {
        const jsonData = createData(post);
        if(postIds.includes(post._id)) {
          jsonData.isUse = state;
          selected.push(jsonData.id);
        }

        newData.push(jsonData);
    });

    this.setState(function(state, props){
        return {
            data: newData,
            selected: selected
        }
    });

}

  renderView = () => {
      let renderView = null;
      if(this.state.isLoading) {
          renderView = <LinearLoading open={this.state.isLoading}/>;
      } else {
          const { classes } = this.props;
          const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
          const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
        
          renderView = (
            <Aux>
              <Grid container spacing={8} justify="center">
                  <Grid item xs={12}  >
                    <React.Fragment>
                    { this.state.topItem ? 
                      (<Aux>
                        <ListItem>
                          <ListItemIcon>
                            <LabelIcon />
                          </ListItemIcon>
                          <ListItemText primary={this.state.topItem.title} secondary="현재 블로그 메인 글" />
                        </ListItem>
                      </Aux>) : 
                        <h4 className={classes.cardTitleWhite}>현재 블로그 메인 글이 없습니다.</h4>}
                      </React.Fragment>
                  </Grid>
              </Grid>
              <Grid container spacing={8} justify="center" style={{ marginTop:'15px' }}>
                  <Grid item xs={12} >
                  <Paper>
                    <BlogTableToolbar 
                        numSelected={selected.length} 
                        saveUsageToFalse={() => this.saveUsage(false)}
                        saveUsageToTrue={() => this.saveUsage(true)}
                        saveSelectedItem={this.saveSelectedItem}
                        selectAsMainTopPost={this.selectAsMainTopPost}
                        />
                      <div className={classes.tableWrapper}>
                        <Table className={classes.table} aria-labelledby="tableTitle">
                          <BlogListTable
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={data.length}
                          />
                          <TableBody>
                            {stableSort(data, getSorting(order, orderBy))
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map( (n, index) => {
                                const isSelected = this.isSelected(n.id);
                                const date = new Date(n.ins_dtime);
                                return (
                                  <TableRow
                                    className={classes.item}
                                    role="checkbox"
                                    aria-checked={isSelected}
                                    tabIndex={-1}
                                    key={n.id}
                                    selected={isSelected}
                                  >
                                    <TableCell padding="checkbox">
                                      <Checkbox checked={isSelected} onClick={event => this.handleClick(event, n.id)}/>
                                    </TableCell>
                                    <TableCell component="th" scope="row" padding="none" onClick={() => this.props.viewDetailPost(n._id)}>
                                      {n.title}
                                    </TableCell>
                                    <TableCell onClick={() => this.props.viewDetailPost(n._id)}>{n.isTopItem ? "Main" : "Normal"}</TableCell>
                                    <TableCell onClick={() => this.props.viewDetailPost(n._id)}>{n.usage}</TableCell>
                                    <TableCell onClick={() => this.props.viewDetailPost(n._id)}>{`${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일`}</TableCell>
                                    {/* <TableCell >
                                      <Button color="primary" onClick={() => this.props.viewDetailPost(n._id)}>
                                          Detail
                                      </Button>
                                    </TableCell> */}
                                  </TableRow>
                                );
                              })}
                            {emptyRows > 0 && (
                              <TableRow style={{ height: 49 * emptyRows }}>
                                <TableCell colSpan={6} />
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      <TablePagination
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                          'aria-label': 'Previous Page',
                        }}
                        nextIconButtonProps={{
                          'aria-label': 'Next Page',
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      />
                    </Paper>
                  </Grid>
              </Grid>
            </Aux>
          )
      }
      return renderView;
  }

  render() {
    return (
      <Aux>
        {this.renderView()}
      </Aux>
    )
  }
}

BlogTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BlogTable);