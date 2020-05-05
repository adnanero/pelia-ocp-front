import React from 'react';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';


export default function PhoneField(props) {
    let {Icone, ...others} = props;
    return (

    <TextField
    {...others}
        id="standard-basic input-with-icon-textfield"
        width= "200"
        fullWidth
        type="text"
        style={{direction: "ltr"}}
        InputProps={{
        startAdornment: (
            <InputAdornment position="start">
            <Icone color="#3695EB" />
            </InputAdornment>
        ),
        }}
    />
    )
    
  }