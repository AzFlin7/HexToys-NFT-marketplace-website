import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: 90,
  },
  iconButton: {
    flexShrink: 0,
    width: 40,
    height: 40,
    '&:hover': {
      border: `2px solid #fff`,
    },
  },
}));

const CarouselController = (props) => {
  const { className, nextName, prevName } = props;
  const classes = useStyles();

  const handleNextAction = () => {
    let nb = document.getElementsByClassName(nextName)[0];
    nb.click();
  };

  const handlePrevAction = () => {
    let pb = document.getElementsByClassName(prevName)[0];
    pb.click();
  };

  return (
    <div className={clsx(classes.root, className)}>
      <IconButton className={classes.iconButton} onClick={handlePrevAction}>
      </IconButton>
      <IconButton className={classes.iconButton} onClick={handleNextAction}>
      </IconButton>
    </div>
  );
};
export default CarouselController;
