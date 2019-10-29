import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Danger from "../../CustomLayout/components/Typography/Danger.jsx";
import Success from "../../CustomLayout/components/Typography/Success.jsx";
// import Button from "../../CustomLayout/components/CustomButtons/Button.jsx";

import Button from '@material-ui/core/Button';
// @material-ui/icons
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";

const styles = {
  table: {
    width: "100%",
    maxWidth: "100%",
    marginBottom: "1rem",
    backgroundColor: "transparent",
    borderCollapse: "collapse",
    display: "table",
    borderSpacing: "2px",
    borderColor: "grey",
    "& thdead tr th": {
      fontSize: "1.063rem",
      padding: "12px 8px",
      verticalAlign: "middle",
      fontWeight: "300",
      borderTopWidth: "0",
      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
      textAlign: "inherit"
    },
    "& tbody tr td": {
      padding: "12px 8px",
      verticalAlign: "middle",
      borderTop: "1px solid rgba(0, 0, 0, 0.06)"
    },
    "& td, & th": {
      display: "table-cell"
    }
  },
  center: {
    textAlign: "center"
  }
}
const StorePlan = (props) => {
    const {classes} = props;
    return (
        <table className={classes.table}>
            <thead>
            <tr>
                <th />
                <th className={classes.center}>기본</th>
                <th className={classes.center}>책벌레</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>도서 보관 수</td>
                <td className={classes.center}>100</td>
                <td className={classes.center}>무제한</td>
            </tr>
            <tr>
                <td>공유 가능 도서</td>
                <td className={classes.center}>무제한</td>
                <td className={classes.center}>무제한</td>
            </tr>
            <tr>
                <td>추천 도서 서비스 제공</td>
                <td className={classes.center}>
                    <Danger>
                        <Close />
                    </Danger>
                    </td>
                    <td className={classes.center}>
                    <Success>
                        <Check />
                    </Success>
                </td>
            </tr>
            <tr>
                <td>도서 통계 프로그래 제공</td>
                <td className={classes.center}>
                <Danger>
                    <Close />
                </Danger>
                </td>
                <td className={classes.center}>
                <Success>
                    <Check />
                </Success>
                </td>
            </tr>
            <tr>
                <td>
                PDF 파일 제작 서비스
                </td>
                <td className={classes.center}>
                <Danger>
                    <Close />
                </Danger>
                </td>
                <td className={classes.center}>
                <Success>
                    <Check />
                </Success>
                </td>
            </tr>
            {/* <tr>
                <td>Mini Sidebar</td>
                <td className={classes.center}>
                <Danger>
                    <Close />
                </Danger>
                </td>
                <td className={classes.center}>
                <Success>
                    <Check />
                </Success>
                </td>
            </tr>
            <tr>
                <td>Premium Support</td>
                <td className={classes.center}>
                <Danger>
                    <Close />
                </Danger>
                </td>
                <td className={classes.center}>
                <Success>
                    <Check />
                </Success>
                </td>
            </tr> */}
            <tr>
                <td />
                <td className={classes.center}>Free</td>
                <td className={classes.center}>Just $10</td>
            </tr>
            <tr>
                <td />
                <td className={classes.center}>
                <Button
                    onClick={() => props.selectNext('basic')}
                    color="default"
                    >
                    선택
                </Button>
                </td>
                <td className={classes.center}>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => props.selectNext('pro')}
                >
                    선택
                </Button>
                </td>
            </tr>
            </tbody>
        </table>
    )
}

export default withStyles(styles)(StorePlan);