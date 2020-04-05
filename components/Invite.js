import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFirebaseConnect } from 'react-redux-firebase';
import { Typography, Card, Button, Input, TextField, IconButton, Snackbar } from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CloseIcon from '@material-ui/icons/Close';


function Invite(){

    const textFieldRef = React.useRef();

    const [open, setOpen] = React.useState(false);

    const [openSnack, setOpenSnack] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenSnack = () => {
      setOpenSnack(true);
    };

    const handleCloseSnack = (event, reason) => {
      if (reason === 'clickaway') return;
      setOpen(false);
    };

    return <>
    <Button variant="outlined" style={{margin: 3, height: 180, width: 150}} onClick={handleClickOpen}>
        <Typography variant="h6">+</Typography>
    </Button>
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{"Invite someone to this space?"}</DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
            You just need to send them this link!
        </DialogContentText>
        <div style={{display:'flex'}}>
            <TextField inputRef={textFieldRef} label="Share" value={window.location.href} />
            <IconButton onClick={() => {
                let textField = textFieldRef.current;
                /* Select the text field */
                textField.select();
                textField.setSelectionRange(0, 99999); /*For mobile devices*/

                /* Copy the text inside the text field */
                document.execCommand("copy");
                handleOpenSnack();
                handleClose();
            }}>
                <FileCopyIcon />
            </IconButton>
        </div>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose} color="primary">
            Cancel
        </Button>
        <Button onClick={handleClose} color="primary" autoFocus>
            Done
        </Button>
        </DialogActions>
    </Dialog>
    <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        message="Link copied!"
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnack}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </>
}

export default Invite;