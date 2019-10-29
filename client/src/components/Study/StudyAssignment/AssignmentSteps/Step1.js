import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
  root: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
        paddingTop: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingBottom: '16px',
    },
    backgroundColor: '#eeeeee',
    borderRadius: '4px',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  formControlMobile: {
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'row',
    },
  }
});

class Step1 extends React.Component {
    state = {
        form : {
            qType: '',
            reference: {
                video: false,
                image: false,   
                audio: false,
            },
            count: 1,
        },
        moreCount: ''
    };

    addQuestion = () => {
        //문제 추가하기
        if(this.state.form.qType === '') {
            this.props.showAlarm('문제를 선택해주세요.');
            return false;
        }

        this.props.addQuestion(this.state.form);
        this.setState(function(state, props) {
            return {
                form : {
                    qType: '',
                    reference: {
                        video: false,
                        image: false,   
                        audio: false,
                    },
                    count: 1,
                },
                moreCount: ''
            }
        })
    }

    handleChange = (identifier, value) => event => {
        const form = {...this.state.form};
        if(identifier === 'reference') {
            form[identifier][value] = event.target.checked;
        } else {
            if(event.target.checked) {
                form[identifier] = value;
            } else {
                form[identifier] = '';
            }
        }
        this.setState(function(state, props){
            return {
                form:form
            }
        });
    };

    renderMoreOptions = () => {
        let renderView = [];
        for(let i = 4 ; i <= 20 ; i ++ ){
            const option = (
                <MenuItem value={i} key={'option_'+i}>{i}</MenuItem>
            );
            renderView.push(option);
        }
        return renderView;
    }

    selectMoreOption = (event) => {
        const selection = event.target.value;
        const form = {...this.state.form};
        form.count = selection;
        this.setState(function(state, props){
            return {
                form:form,
                moreCount: selection
                
            }
        })
    }

    displayText = (obj) => {
        let text = '';
        switch(obj.qType) {
            case 'short' :
                text += '단답형 / ';
                break;
            case 'selection' :
                text += '선택형 / ';
                break;
            case 'essay' :
                text += '논술형 / ';
                break;
            default:
            break;
        }
        const keys = Object.keys(obj.reference);
        for(let i = 0 ; i< keys.length; i++ ){
            if(obj.reference[keys[i]]){
                text += keys[i]+' / ';
            }
        }

        text += obj.count+' 문제';
        return text;
    }

    render() {
        const { classes } = this.props;

        return (
        <Grid className={classes.root} container spacing={8}>
            <Grid item xs={12} sm={4} >
                <FormControl required component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">문제 유형</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                        control={
                            <Checkbox checked={this.state.form.qType === 'selection'} onChange={this.handleChange('qType','selection')} value="selection" />
                        }
                        label="선택형"
                        />
                        <FormControlLabel
                        control={
                            <Checkbox checked={this.state.form.qType === 'short'} onChange={this.handleChange('qType','short')} value="short" />
                        }
                        label="단답형"
                        />
                        <FormControlLabel
                        control={
                            <Checkbox checked={this.state.form.qType === 'essay'} onChange={this.handleChange('qType','essay')} value="essay" />
                        }
                        label="논술형"
                        />
                    </FormGroup>
                    <FormHelperText>어떤 문제를 출제하고 싶으신가요?</FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} >
                <FormControl  component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">문제에 필요한 자료</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                        control={
                            <Checkbox checked={this.state.form.reference.video} onChange={this.handleChange('reference', 'video')} value="video" />
                        }
                        label="영상 자료 (유튜브)"
                        />
                        <FormControlLabel
                        control={
                            <Checkbox checked={this.state.form.reference.image} onChange={this.handleChange('reference', 'image')} value="image" />
                        }
                        label="이미지 자료"
                        />
                        <FormControlLabel
                        control={
                            <Checkbox checked={this.state.form.reference.audio} disabled onChange={this.handleChange('reference','audio')} value="audio" />
                        }
                        label="음성 자료"
                        />
                    </FormGroup>
                    <FormHelperText>문제에 어떤 자료가 필요한가요?</FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} >
                <FormControl required  component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">필요한 문제 수</FormLabel>
                    <FormGroup className={classes.formControlMobile}>
                        <FormControlLabel
                        control={
                            <Checkbox checked={this.state.form.count === 1} onChange={this.handleChange('count', 1)} value="1" />
                        }
                        label="1"
                        />
                        <FormControlLabel
                        control={
                            <Checkbox checked={this.state.form.count === 2} onChange={this.handleChange('count', 2)} value="2" />
                        }
                        label="2"
                        />
                        <FormControlLabel
                        control={
                            <Checkbox checked={this.state.form.count === 3} onChange={this.handleChange('count',3)} value="3" />
                        }
                        label="3"
                        />
                    </FormGroup>
                    <FormHelperText>몇 문제가 필요한가요?</FormHelperText>
                </FormControl>
            </Grid>
            {/* <Grid item xs={12} sm={3} >
                <FormControl required  component="fieldset" className={classes.formControl}>
                    <FormGroup>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="age-helper">더 많은 문제 수</InputLabel>
                            <Select
                                value={this.state.moreCount}
                                onChange={this.selectMoreOption}
                                displayEmpty
                                input={<Input name="age" id="age-helper" />}
                            >
                                {this.renderMoreOptions()}
                            </Select>
                            <FormHelperText>더 많은 문제가 필요합니다.</FormHelperText>
                        </FormControl>
                    </FormGroup>
                </FormControl>
            </Grid> */}
            <Grid item xs={12} sm={6}>
                <Button onClick={this.addQuestion} variant="contained" color="primary" >추가하기</Button>
                <section>
                <List>
                    {this.props.assignmentOption.map((item,index) => {
                        return (
                        <ListItem key={index} dense button>
                            <ListItemText primary={this.displayText(item)} />
                            <ListItemSecondaryAction>
                            <IconButton color="secondary" className={classes.button} aria-label="delete" onClick={() => this.props.deleteQuestionOption(index)}>
                                <DeleteIcon />
                            </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        )
                    })}
                    </List>
                </section>
            </Grid>
        </Grid>
        );
    }
}

Step1.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Step1);