import React from 'react';
import './TodayGrit.css';

import Card from '@material-ui/core/Card';

const TodayGrit = (props) => {
    let front_class = null;
    let back_class = null;
    if(props.clickedKey!== props.id &&  props.checked) {
        front_class = "back face";
        back_class = "front face";
    } else {
        front_class = "front face";
        back_class = "back face"; 
    }

    let classes = null;
    if ( props.clickedKey === props.id ) {
        classes = "GritCheckItem flip-2-ver-left-2";
    } else {
        classes = "GritCheckItem"
    }

    return (
        <div className={classes} onClick={props.checked ? null :props.checkTodayWork}>
            <Card className={front_class}>
                <div className="gritBoard">
                    <div className="itemDate">
                        {props.date}
                    </div>
                    <div className="checkIcon">
                        <i className="material-icons">sentiment_very_dissatisfied</i>
                    </div>
                    <div className="textExplain">
                        아직 실행하지 않았습니다. 지금이라도 실천하세요.
                    </div>
                </div>
            </Card>
            <Card className={back_class}>
                <div className="gritBoard">
                    <div className="itemDate">
                        {props.date}
                    </div>
                    <div className="checkIcon">
                        <i className="material-icons checked">sentiment_very_satisfied</i>
                    </div>
                    <div className="textExplain">
                        오늘도 수고하셨습니다!
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default TodayGrit;