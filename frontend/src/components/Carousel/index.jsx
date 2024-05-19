import PropTypes from 'prop-types';
import clsx from 'clsx';
import OwlCarousel from 'react-owl-carousel3';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    position: 'relative',
  },
  wrapper: {
    width: '100%',
    height: 'auto',
    // '& img': {
    //   width: '100%',
    //   height: 'auto',
    // },
  },
  nav: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: `1px solid #ffffff00`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color : '#fff',
    transition : 'all 0.3s ease',
    pointerEvents: 'all',
    '&.disabled': {
      display: 'none',
    },
    '&:hover': {
      cursor: 'pointer',
      border: `1px solid #ffffff99`,
      color : '#ffffff99',
    },
    '&.owl-prev': {
      position: 'absolute',
      left: 0,
      top: 'calc(50% - 20px)',
      [theme.breakpoints.down('sm')]: {
        left: '-20px',
      },
    },
    
    '&.owl-next': {
      position: 'absolute',
      right: 0,
      top: 'calc(50% - 20px)',
      [theme.breakpoints.down('sm')]: {
        right: '-20px',
      },
    },
  },
  navContainer: {
    position: 'absolute',
    width: 'calc(100% + 120px)',
    top : '50%',
    transform : 'translateY(-50%)',
    height : 60,
    left : -60,
    pointerEvents: 'none',
  },
  dots: {
    display : 'flex',
    alignItems : 'center',
    justifyContent : 'center',
    marginTop : 8,
  },
  
}));

const Carousel = ({ className, navPrevClassName, navNextClassName, customOption, dots, dotClassName, children, fixedCount }) => {
  const classes = useStyles();
  const theme = useTheme();

  const options = {
    loop: true,
    nav: true,
    dots: dots,
    autoplayHoverPause: false,
    autoplay: false,
    autoplayTimeout: 5,
    margin: 10,

    navText: [
      `<div class="nav-btn prev-slide"><i class="fas fa-chevron-left"></i></div>`,
      `<div class="nav-btn next-slide"><i class="fas fa-chevron-right"></i></div>`,
    ],
    responsive: fixedCount ? {
      0: {
        items: 6,
      },
      [theme.breakpoints.values.md]: {
        items: 6,
      },
      [theme.breakpoints.values.lg]: {
        items: 6,
      },
      [theme.breakpoints.values.xl]: {
        items: 6,
      },
    }:
    {
      0: {
        items: 1,
      },
      [theme.breakpoints.values.md]: {
        items: 2,
      },
      [theme.breakpoints.values.lg]: {
        items: 4,
      },
      [theme.breakpoints.values.xl]: {
        items: 4,
      },
    }
  };
  const onChangedIndex = (item)=>{
  }
  return (
    <div className={clsx(classes.root, className)}>
      <OwlCarousel
        className="owl-carousel owl-theme"
        onChanged = {onChangedIndex}
        navContainerClass={classes.navContainer}
        dotsClass = {clsx(classes.dots)}
        dotClass =  {clsx(dotClassName)}
        navClass={[clsx(classes.nav, navPrevClassName), clsx(classes.nav, navNextClassName)]}
        {...Object.assign(options, customOption)}
      >
        {children}
      </OwlCarousel>
    </div>
  );
};
export default Carousel;
