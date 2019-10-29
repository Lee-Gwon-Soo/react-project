import React from 'react';
import './NewGritCheck.css'

import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const NewGritCheck = (props) => {
    return (
        <Grid className="NewGritCheck" item sm={6} xs={12} lg={6}>
            <div>
                <h3>새로운 Grit 체크리스트</h3>
            </div>
            <table>
                <tbody>
                    <tr>
                        <th>제목</th>
                        <td>{props.element.title}</td>
                    </tr>
                    <tr>
                        <th>타입</th>
                        <td>{props.element.type}</td>
                    </tr>
                    <tr>
                        <th>시작일자</th>
                        <td>{props.element.startDate}</td>
                    </tr>
                    <tr>
                        <th>종료일자</th>
                        <td>{props.element.dueDate}</td>
                    </tr>
                </tbody>
            </table>
           <div className="configArea">
                <section>
                    <FormControlLabel
                        control={
                            <Checkbox
                            checked={props.checkList[1]}
                            onChange={() => props.clickAgreement(1)}
                            />
                        }
                        label="Grit 리스트는 한번 생성 후에는 삭제하실 수 없습니다."
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                            checked={props.checkList[2]} 
                            onChange={() => props.clickAgreement(2)}
                            />
                        }
                        label="Grit 리스트를 마무리 기한까지 확실하게 지키겠습니다."
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                            checked={props.checkList[3]}
                            onChange={() => props.clickAgreement(3)}
                            value="checkedA"
                            />
                        }
                        label="중간에 절대로 포기하지 않겠습니다."
                    />
                </section>
                <div className="buttonText">
                    <h3 onClick={props.reStartGritList}>다시하겠습니다.</h3>
                    <h3 className="next" onClick={props.addNewGritList}>진행하겠습니다.</h3>
                </div>
            </div>
        </Grid>
    )
}

export default NewGritCheck;