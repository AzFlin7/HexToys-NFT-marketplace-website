import { SelectChangeEvent } from '@mui/material/Select';
import { Switch } from '@material-ui/core';
import { Theme, withStyles, styled } from '@material-ui/core/styles';


export const AntSwitch = withStyles((theme) => ({
  root: {
    width: (props) => (props.kind === 'small' ? 40 : 48),
    height: (props) => (props.kind === 'small' ? 20 : 29),
    borderRadius: 20,
    padding: 0,
    display: 'flex',
  },
  switchBase: {
    padding: 1,
    color: '#622f88',
    '&$checked': {
      transform: 'translateX(calc(100% - 11px))',
      backgroundColor: '#32D74B',
      color: '#cadadd',
      '& + $track': {
        opacity: 1,
        backgroundColor: '#fff',
        borderColor: '#622f88',
      },
      '& .MuiSwitch-thumb': {
        backgroundColor: '#32D74B !important',
      }
    },
  },
  thumb: (props) => ({
    width: props.kind === 'small' ? 13 : 27,
    height: props.kind === 'small' ? 13 : 27,
    boxShadow: 'none',
    backgroundColor: '#fff',
  }),
  track: {
    // border: '2px solid #622f88',
    borderColor: '#622f88',
    borderRadius: 20,
    opacity: 1,
    backgroundColor: '#32D74B',
  },
  checked: {},
}))(Switch);

export const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 40,
  
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(8px)',
    backgroundColor: '#F400F5',
    top: 8,
    
    '&.Mui-checked': {
      color: '#fff',
      backgroundColor: '#fff',
      zIndex : 1,
      transform: 'translateX(calc(100% + 8px))',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('/assets/icons/lock_icon_02.svg')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#F400F5',
        
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#ffffff00',
    width: 22,
    height: 22,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('/assets/icons/lock_icon_01.svg')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    color : '#F400F5',
    backgroundColor: '#fff',
    borderRadius: 30,
    border : '1px #F400F5 solid',
  },
}));

const MySwitch = ({kind = 'small', onChange, value}) => {

  const handleChange = (event) => {
    onChange(event.target.value);
  };
  return (
    <AntSwitch kind = {kind} onChange = {handleChange} value = {value} />
  );
};

export default MySwitch;
