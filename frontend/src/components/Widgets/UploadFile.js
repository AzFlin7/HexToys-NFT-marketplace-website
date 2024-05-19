import React, { forwardRef, Ref, useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import toast from 'react-hot-toast';
const useStyles = makeStyles(theme => ({
  root: {},

  dropzone: {
    // border: '1px solid #ffffff11',
    height: props => (props.fileAssetType === 'Video' ? 'auto' : props.boxSize === 'small' ? 60 : 140),
    width: '100%',
    background: '#ffffff00',
    borderRadius: 10,
    margin: 'auto',
    position: 'relative',
    textAlign: 'center',
    display : 'flex',
    alignItems : 'center',
    [theme.breakpoints.down('xs')]: {
      height: props => (props.fileAssetType === 'Video' ? 'auto' : 100),
    },
    '&:hover': {
      '& $fileButton': {
        opacity: 1,
      },
      '& .closeBtn': {
        opacity: 1,
      },
    },
    
    '& span': {
      width: 'calc(100% - 140px)',
      maxWidth : 210,
      display : 'flex',
      flexDirection: 'column',
      '& h5': {
        width: '100%',
        color: '#636569',
        fontWeight: 400,
        overflow: 'hidden',
        whiteSpace :'nowrap',
        textAlign: 'left',
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
    zIndex: 1,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '& h4': {
      color: '#aaa',
      fontWeight: 400,
      textAlign: 'center',
    },
    '& h5': {
      color: '#aaa',
      fontWeight: 400,
      textAlign: 'left',
    },
    
  },
  fileButton: {
    backgroundColor: '#F7F9FA00',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderRadius: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width : props => (props.boxSize === 'small' ? 60 : 48),
    height: props => (props.boxSize === 'small' ? 60 : 48),
    border : '2px dashed #aaa',
    opacity: 0.3,
    color : '#aaa',
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
    borderRadius: '10px',
    opacity: 1,
    // margin : 10,
  },
  [theme.breakpoints.down('xs')]: {
    width: 100,
    height: 100,
  },
}));

const UploadFile = forwardRef(
  (
    {
      info = 'Click to Upload or Drag and Drop',
      accept = 'All',
      fileName,
      fileSize,
      size,
      dispalyAsset,
      defaultAsset,
      defaultAssetType,
      onRemove,
      onChange,
    },
    ref,
  ) => {
    const [fileAsset, setFileAsset] = useState(defaultAsset);
    const [fileAssetType, setFileAssetType] = useState(defaultAssetType);
    const [boxSize, setBoxSize] = useState(size);
    //console.log(fileAssetType, fileAsset);
    const classes = useStyles({ fileAssetType, boxSize });

    useEffect(() => {
      setFileAsset(defaultAsset);
      setFileAssetType(defaultAssetType);
      setBoxSize(size)
    }, [defaultAsset, defaultAssetType, size]);

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

    function getAcceptType(accept) {
      switch (accept) {
        case 'Image':
          return 'image/*';
        case 'Video':
          return 'video/*';
        case 'Audio':
          return 'audio/*';
        case 'All':
          return 'image/*, audio/*, video/*';
      }
      return '';
    }

    const onChangeFile = (e) => {
      if (e.target.files[0].size > 2 * 1024 * 1024){
        toast.error("File Size is too big!");
        return;
      }
      onChange && onChange(e);
      e.target.files.length > 0 && setFileAsset(URL.createObjectURL(e.target.files[0]));
      e.target.files.length > 0 && setFileAssetType(getAssetType(e.target.files[0].name));
    };
    const onDelete = () => {
      onRemove();
      setFileAsset(undefined);
    };

    return (
      <div className={`${classes.dropzone} dropzone`}>
        <div className={classes.fileOverlay}>
          <label className={clsx(classes.fileButton)}>
            <i className="fas fa-plus"></i>
            <input className={classes.input} type="file" accept={getAcceptType(accept)}  onClick={(event)=> { 
               event.target.value = null
          }}onChange={onChangeFile} />
          </label>
        </div>
        {info && fileAsset && 
            <div className="closeBtn" onClick={onDelete}>
              <i className="fas fa-times"></i>
            </div>}
        {fileAsset && dispalyAsset && fileAssetType === 'Image' && (
          <img className={classes.img} src={fileAsset} alt="" />
        )}
        {fileAsset && dispalyAsset && fileAssetType === 'Video' && (
          <>
            <video className={classes.img} controls>
              <source src={fileAsset} type="video/mp4" />
            </video>
          </>
        )}
        {fileAsset && dispalyAsset && fileAssetType === 'Audio' && (
          <audio className={classes.img} src={fileAsset} controls />
        )}
        
      </div>
    );
  },
);
export default UploadFile;
