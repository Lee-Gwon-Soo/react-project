import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SelectionQuestion from './SelectionQuestion';
import ShortQuestion from './ShortQuestion';
import EssayQuestion from './EssayQuestion';
import Aux from '../../../../HOC/Aux';


const styles = theme => ({
  root: {
    display: 'flex',
    paddingTop: '16px',
    paddingLeft: '16px',
    paddingRight: '16px',
    borderRadius: '4px',
    paddingBottom: '16px',
    backgroundColor: '#eeeeee',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
});

const Step2 = (props) => {
    let count = 0;
    return (
        <Aux>
            {props.questionList.map((item, index) => {
                if(item.type === '선택형') {
                    count += 1;
                    return (<SelectionQuestion  
                                    key={"question_"+index} 
                                    form={item} 
                                    problemNumber={count}
                                    index={index}
                                    onAddOption={() => props.onAddOption(index)}
                                    handleQuestion={(event) => props.handleQuestion(index, event)}
                                    deleteOption={(questionIndex, optionIndex) => props.deleteOption(questionIndex, optionIndex)}
                                    checkAsAnswer={(questionIndex, optionIndex) => props.checkAsAnswer(questionIndex, optionIndex)}
                                    onAddVideoLink={() => props.onAddVideoLink(index)}
                                    cancelVideo={() => props.cancelVideo(index)}
                                    onRegisterImage={(event) => props.onRegisterImage(event, index)}
                                />);
                    
                } else if (item.type === '단답형') {
                    count += 1;
                    return (<ShortQuestion  
                        key={"question_"+index} 
                        form={item} 
                        index={index}
                        problemNumber={count}
                        handleQuestion={(event) => props.handleQuestion(index, event)}
                        handleAnswer={(event) => props.handleAnswer(index, event)}
                        onAddVideoLink={() => props.onAddVideoLink(index)}
                        cancelVideo={() => props.cancelVideo(index)}
                        onRegisterImage={(event) => props.onRegisterImage(event, index)}
                    />);
                } else{
                    count += 1;
                    return (<EssayQuestion  
                        key={"question_"+index} 
                        form={item} 
                        problemNumber={count}
                        index={index}
                        handleQuestion={(event) => props.handleQuestion(index, event)}
                        onAddVideoLink={() => props.onAddVideoLink(index)}
                        cancelVideo={() => props.cancelVideo(index)}
                        onRegisterImage={(event) => props.onRegisterImage(event, index)}
                    />);
                }

            })}
        </Aux>
    );
}

Step2.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Step2);