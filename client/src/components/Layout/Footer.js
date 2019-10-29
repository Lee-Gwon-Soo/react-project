import React from 'react';
import classes from './Footer.css';
import Divider  from '@material-ui/core/Divider';

const Footer = (props) => {
    return (
        <div className={classes.Footer}>
            <section className={classes.footer_upper}>
                <section className={classes.contact}>
                    Contact
                    <ul className={classes.lists}>
                        <li>mkeyword.developer@gmail.com</li>
                        {/* <li>010-0000-0000</li>
                        <li>기부목록</li> */}
                    </ul>
                    <ul className={classes.icons}>
                        <li><i className="material-icons">email</i></li>
                        <li><i className="material-icons">phone</i></li>
                        <li><i className="material-icons">favorite</i></li>
                    </ul>
                </section>
            </section>
            <Divider className={classes.crossLine} />
            <section className={classes.footer_bottom} >
                mKeyword
                {/* <ul>
                    <li> 이용약관</li>
                    <li> 정책</li>
                </ul> */}
            </section>
        </div>
    )
}

export default Footer;