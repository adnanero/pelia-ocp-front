
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';


import {FaCheck} from 'react-icons/fa';
import {IoIosSend} from 'react-icons/io'


const useStyles = makeStyles(theme => ({
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonProgress: {
      color: "#8dc63f",
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }));

export default function ButtonSubmit(props) {
  const classes = useStyles();

  return (
      <div className={classes.wrapper}>
        <button
          type={props.type}
          variant="contained"
          className= " btn btn-primary "
          disabled={props.sending}
        >
          {props.valeur}
          {props.success ? <FaCheck className="mx-3"/> : <IoIosSend className="mx-3" />}
        </button>
        {props.sending && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
  );
}

