import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import useStyles from './style';
export default function DateTimePickerField({ value, onChange, error }) {
  const classes = useStyles();
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DateTimePicker
        className={classes.root}
        inputVariant="outlined"
        value={value}
        onChange={onChange}
        error = {error}
      />
    </MuiPickersUtilsProvider>
  );
}
