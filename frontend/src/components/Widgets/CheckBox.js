import React, { useEffect, useState, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ThemeContext from '../../context/ThemeContext';

const useStyles = makeStyles((theme) => ({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '& .MuiFormControlLabel-label': {
      color: props => (props.theme === 'dark' ? '#CBCBCB' : '#3F3F3F'),
      fontSize : 14,
    },
    '& .PrivateSwitchBase-root-13': {
      padding : 0,
      paddingRight : 8,
    },
    marginRight : 0,
    marginLeft : 0,
  },
  icon: {
    borderRadius: 3,
    width: 16,
    height: 16,
    display : 'flex',
    alignItems : 'center',
    justifyContent : 'center',
    backgroundColor: 'transparent',
    border: `1px solid #888`,
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
  },
  checkedIcon: {
    backgroundColor: '#88888805',
    border:  props => (props.theme === 'dark' ? `1px solid #CBCBCB` : `1px solid #3F3F3F`),
    display : 'flex',
    alignItems : 'center',
    justifyContent : 'center',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: props => (props.theme === 'dark' ? "url('/assets/icons/icon_check.svg')" : "url('/assets/icons/icon_check_dark.svg')"),
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '1px 3px',
      content: '""',
    },
  },
}));

const CheckBox = ({
  wrapperClassName,
  className,
  value,
  onChange,
  checked,
  label,
}) => {
  const { theme } = useContext(ThemeContext)
  const classes = useStyles({theme});
  const [ isChecked, setChecked ] = useState(checked);
  const handleChangeCheck = (event) => {
    setChecked(event.target.checked);
    onChange(event.target.checked);
  };

  useEffect(() => {
    // if (value){
      setChecked(checked);
      // onChange(value);
    // }
  }, [checked])
  
  return (
    <FormControlLabel
      className={clsx(classes.root, wrapperClassName)}
      control={(
        <Checkbox
          className={clsx(classes.root, className)}
          disableRipple
          color="default"
          checkedIcon={(
            <span className={clsx(classes.icon, classes.checkedIcon)} />
          )}
          icon={<span className={classes.icon} />}
          checked={isChecked}
          onChange={handleChangeCheck}
        />
      )}
      label={label}
    />
  );
};

CheckBox.propTypes = {
  wrapperClassName: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,

};

CheckBox.defaultProps = {
  wrapperClassName: '',
  className: '',
  checked : false,
  value: false,
  onChange: () => {},
  label: '',
};

export default CheckBox;
