import React, {useContext} from 'react';
import ThemeContext from '../../context/ThemeContext';
import { makeStyles } from '@material-ui/core/styles';

import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';

import {
  Paper,
  ModalHeader,
  Title,
  WalletWrapper,
  WalletItem,
  WalletLogo,
  WalletTitle,
  ModalCloseIcon
} from './styles';

const useStyles = makeStyles(() => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

const ConnectDialog = (props) => {
  const { theme } = useContext(ThemeContext)
  const classes = useStyles();

  const { open, handleClose, connectors, connectToProvider, connectorLocalStorageKey } = props;

  return (
    <Modal      
      className={classes.modal}
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Fade in={open}>
        <Paper className={`bg_${theme}`}>
          <ModalHeader className={`border_${theme}`}>
            <Title className={`text_color_1_${theme}`}>Connect Wallet</Title>
            <ModalCloseIcon size={32} onClick={handleClose}  className={`text_color_1_${theme}`}/>
          </ModalHeader>
          <WalletWrapper>
            {
              connectors.map((entry, index) => (
                <WalletItem
                  key={index}
                  onClick={() => {
                    connectToProvider(entry.connectorId);
                    window.localStorage.setItem(connectorLocalStorageKey, entry.key);
                    handleClose();
                  }}
                  id={`wallet-connect-${entry.title.toLocaleLowerCase()}`}
                >
                  <WalletLogo>
                    <entry.icon width="30" />
                  </WalletLogo>
                  <WalletTitle>{entry.title}</WalletTitle>
                </WalletItem>
              ))
            }
          </WalletWrapper>          
        </Paper>
      </Fade>
    </Modal>
  )
}

export default ConnectDialog
