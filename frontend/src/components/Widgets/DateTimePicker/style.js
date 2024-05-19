import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    '& label': {
      transform: 'translate(0, -6px) scale(0.75)  !important',
      textTransform: 'uppercase',
      position: 'absolute',
      top: 18,
      left: -150,
      fontSize: 16,
      fontWeight: 500,
      width : 150,
      color : '#636569',
      [theme.breakpoints.down('xs')]: {
        fontSize: 12,
        width : 100,
      },
      '&.Mui-focused': {
        color: theme.palette.text.hint,
      },
    },
    '& .MuiInputBase-root': {
      width: '100%',
    },
    '& .Mui-error': {
      '& input': {
        borderColor: 'red',
      },
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 0, 0, 0) !important',
    },
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0) !important',
    },
    '&.Mui-focused': {
    },
    '& input': {
      cursor: 'pointer',
      background: '#ffffff00',
      border: '1px #222 solid',
      color: '#fff',
      fontSize: 14,
      width: '100%',
      padding: '10px 10px 10px 10px',
      borderRadius: 10,
    },
  },
}));

export default useStyles;
