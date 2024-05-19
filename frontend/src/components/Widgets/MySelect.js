import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React, { useContext } from 'react';
import ThemeContext from '../../context/ThemeContext';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: props => (props.theme === 'light' ?'#e2e2e2':'rgba(255, 255, 255, 0.04)'),
    minWidth : 86,
    borderRadius : '8px !important',
    
    '&:hover': {
      
    },

    '&:hover fieldset': {
      borderColor: '#00000000 !important',
    },
    '& fieldset': {
      borderColor: '#00000000 !important',
    },
    '& .Mui-focused': {
      borderColor: '#00000000 !important',
    },
    '& .MuiSelect-select': {
      color : props => (props.theme === 'light' ?'#00000088':'#fff'),
      minHeight: '20px !important',
      padding : '5px 32px 5px 8px !important',
      fontSize : 14,
      gap : 8,
      [theme.breakpoints.down('sm')]: {
        fontSize : 14,
      },
      
    },
    '& .MuiSvgIcon-root': {
      color : props => (props.theme === 'light' ?'#00000088':'#fff'),

    },
    '& .MuiMenu-list': {
      background: '#313131 !important',
    },
    
  },
  select: {
    borderRadius : '10px !important',
    backgroundColor: props => (props.theme === 'light' ?'#fff !important':'#313131 !important'),
    backdropFilter: 'blur(10px)',
    marginTop : 5,
    maxHeight : '200px !important',
    "& ul": {
        
    },
    "& li": {
      transition : 'all 0.3s ease',
      textAlign : 'left !important',
      color : props => (props.theme === 'light' ?'#000':'#fff'),
      display : 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      fontSize : 14,
      padding : '10px 10px',
      gridArea : 'auto',
      gap : 8,
      '&:hover': {
        backgroundColor: "#49566c33",
      },
      "& span": {
        display : 'flex',
        alignItems: 'center',
        gridArea : 'auto',
        gap : 8,
        [theme.breakpoints.down('sm')]: {
          height : '36px !important',
        },
      },
      [theme.breakpoints.down('xs')]: {
        borderRadius : 32,
        lineHeight : 1,
        backgroundColor: props => (props.theme === 'light' ?'#0000000a':'#ffffff0a'),
        justifyContent: 'center',
        maxHeight : '36px !important',
        boxSizing : 'border-box',
        padding : '2px 10px !important',
        transform : 'scale(0.8)',
        fontSize : 16,
      },
    },
    
  },
  
}));

const MySelect = ({className, value, onChange, options}) => {
  const { theme } = useContext(ThemeContext)
  const classes = useStyles({theme});

  const handleChange = (event) => {
    onChange(event.target.value);
  };
  return (
    <Select
      value={value}
      defaultValue = {value}
      onChange={handleChange}
      displayEmpty
      inputProps={{ 'aria-label': 'Without label' }}
      className = {clsx(classes.root, className)}
      MenuProps={{ classes: { paper: clsx(classes.select, className) } }}
      label = {<>dfdfd</>}
    >
      {options.map((d, k)=>(
        <MenuItem value={d?.value} key = {k}>{d?.label}</MenuItem>
      ))}
    </Select>
  );
};

export default MySelect;
