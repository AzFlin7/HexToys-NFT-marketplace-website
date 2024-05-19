import React, { forwardRef, Ref, useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const useStyles = makeStyles(theme => ({
  root: {},

  dropzone: {
    height: 80,
    width: 80,
    background: '#ffffffff00',
    borderRadius: 10,
    // margin: 'auto',
    position: 'relative',
    textAlign: 'center',
    display : 'flex',
    alignItems : 'center',
    [theme.breakpoints.down('xs')]: {
    },
    '&:hover': {
      '& $fileButton': {
        opacity: 1,
      },
      '& .closeBtn': {
        opacity: 1,
      },
    },
    
    '& .closeBtn': {
      position: 'absolute',
      zIndex: 2,
      transition: 'all 0.3s ease',
      opacity: 0,
      top : 10,
      right : 10,
      cursor: 'pointer',
      color: '#fff',
      fontSize : 20,
      '&:hover': {
        color: '#555',
      },
    },
  },
  icon: {
    color: '#fff',
    marginLeft: 0,
  },
  fileOverlay: {
    position: 'absolute',
    width: '100%',
    margin: 0,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 2,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '& h4': {
      color: '#fff',
      fontSize : 20,
      fontWeight: 400,
      textAlign: 'center',
    },
    '& h5': {
      color: 'rgba(255, 255, 255, 0.64);',
      fontWeight: 400,
      textAlign: 'center',
      fontSize : 14,
    },
  },
  fileButton: {
    backgroundColor: '#F7F9FA00',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width : 80,
    height : 80,
    opacity: 0.6,
    color : '#E2EBFB',
    '&:active': {
      transform: 'scale(0.9)',
    },
  },
  input: {
    display: 'none',
  },
  img: {
    width: '100%',
    height: '100%',
    zIndex : 1,
    objectFit: 'cover',
    borderRadius: 24,
    // margin : 10,
  },
  [theme.breakpoints.down('xs')]: {
    width: 100,
    height: 100,
  },
}));

const UploadAvatar = forwardRef(
  (
    {
      error,
      dispalyAsset,
      defaultAsset,
      onChange,
    },
    ref,
  ) => {
    const [fileAsset, setFileAsset] = useState(defaultAsset);
    const [fileAssetType, setFileAssetType] = useState();
    const classes = useStyles({ fileAssetType });

    useEffect(() => {
      setFileAsset(defaultAsset);
    }, [defaultAsset]);

    function getExtension(filename) {
      var parts = filename.split('.');
      return parts[parts.length - 1];
    }

    function getAssetType(filename) {
      var ext = getExtension(filename);
      switch (ext.toLowerCase()) {
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'bmp':
        case 'png':
          return 'Image';
        case 'm4v':
        case 'avi':
        case 'mpg':
        case 'mp4':
          return 'Video';
        case 'mp3':
          return 'Audio';
      }
      return '';
    }

    const onChangeFile = (e) => {
      if (e.target.files[0].size > 2 * 1024 * 1024){
        toast.error("File Size is too big!");
        return;
      }
      onChange && onChange(URL.createObjectURL(e.target.files[0]));
      e.target.files.length > 0 && setFileAsset(URL.createObjectURL(e.target.files[0]));
      e.target.files.length > 0 && setFileAssetType(getAssetType(e.target.files[0].name));
    };

    return (
      <div className={`${classes.dropzone} dropzone ${error ? 'error':''}`}>
        <div className={classes.fileOverlay}>
          <label className={clsx(classes.fileButton)}>
          <i className="fas fa-camera"></i>
            <input className={classes.input} type="file" onClick={(event)=> { 
               event.target.value = null
          }}onChange={onChangeFile} />
          </label>
        </div>
        {fileAsset && dispalyAsset&& (
          <img className={classes.img} src={fileAsset} alt="" />
        )}

      </div>
    );
  },
);
export default UploadAvatar;
