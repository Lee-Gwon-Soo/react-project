import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import EmailIcon from '@material-ui/icons/Email';
import ContactPhone from '@material-ui/icons/ContactPhone';
import InfoIcon from '@material-ui/icons/Info';
import WorkIcon from '@material-ui/icons/Work';
import DomainIcon from '@material-ui/icons/Domain';
import LayersIcon from '@material-ui/icons/Layers';
import Avatar from '@material-ui/core/Avatar';
import HumanIcon from '../../Shared/HumanIcons/HumanIcon';

const styles = theme => ({
  listItem: {
    padding: `${theme.spacing.unit}px 0`,
  },
  total: {
    fontWeight: '700',
  },
  title: {
    marginTop: theme.spacing.unit * 2,
  },
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  }
});

function SignupReview(props) {
  const { classes } = props;
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <div className={classes.root}>
        <List>
            <ListItem>
                <ListItemIcon>
                    <EmailIcon />
                </ListItemIcon>
                <ListItemText primary={props.form.email} />
            </ListItem>
            <ListItem >
                <ListItemIcon>
                    <InfoIcon />
                </ListItemIcon>
                <ListItemText primary={`${props.form.name} / ${props.form.name_en}`} />
            </ListItem>
            <ListItem >
                <ListItemIcon>
                    <WorkIcon />
                </ListItemIcon>
                <ListItemText primary={props.form.belongto} />
            </ListItem>
            <ListItem >
                <ListItemIcon>
                    <ContactPhone />
                </ListItemIcon>
                <ListItemText primary={props.form.tel_no} />
            </ListItem>
            <ListItem >
                <ListItemIcon>
                    <DomainIcon />
                </ListItemIcon>
                <ListItemText primary={props.form.job} />
            </ListItem>
            <ListItem >
                <ListItemIcon>
                    <LayersIcon />
                </ListItemIcon>
                <ListItemText primary={props.form.position} />
            </ListItem>
        </List>
        <div>
        {props.isEmoticon ? 
            <Avatar style={{width:'100px', height:'100px', margin: '0 auto'}} alt="">
                <HumanIcon indexValue={props.imgPath} />
            </Avatar>: <img src={props.imgPath} alt="" width="200px" height="200px" style={{margin: '0 auto'}}/>}
        </div>
        <div style={{whiteSpace: 'pre-line', padding:'16px'}}>
            {props.intro}
        </div>
      </div>
    </React.Fragment>
  );
}

SignupReview.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignupReview);