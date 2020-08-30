import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useForm } from 'react-hook-form';
import RequiredTextField from 'src/components/RequiredTextField';
import Alert from 'src/components/Alert';
import AppContext from 'src/contexts/AppContext';

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MakeComplaintView = () => {
  // TODO: Lagay nalang to as popup form
  // nasa dashboard yung button to say "make a complaint" instead of may own route pa sya
  const { signedUser } = React.useContext(AppContext);

  const [open, setOpen] = React.useState(false);
  const [notification, setNotification] = React.useState({
    open: false,
    severity: 'info',
    message: ''
  });

  // React Hook Form
  const { register, handleSubmit, errors, reset } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      message: ''
    }
  });

  // const complainant = '5f4057ed5a146d379cb500cf';
  const complainant = signedUser?._id;

  const onSubmit = ({ message }) => {
    const complaint = { complainant, message };

    fetch(`${process.env.REACT_APP_API_URL}/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(complaint)
    })
      .then(res => {
        const success = res.status === 200;
        setNotification({
          open: true,
          severity: success ? 'info' : 'error',
          message: success
            ? 'We apologize for the inconvinience, your complaint was submitted for consideration'
            : 'There was a problem in the server. Please try again'
        });
        setOpen(false);
        reset();
      })
      .catch(err => {
        console.error(err);
        setNotification({
          open: true,
          severity: 'error',
          message: 'There was a problem in the server. Please try again'
        });
      });
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
        Make a Complaint
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="alert-dialog-slide-title">
            Tell us your concerns
            {/* <span style={{ fontSize: '20rem' }}>Tell us your concerns</span> */}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              We&apos;re sorry for the trouble we caused you. Describe
              accurately the details of your complaint and against whom.
            </DialogContentText>
            <RequiredTextField
              name="message"
              autoFocus
              error={errors.message}
              label="What's wrong? :("
              register={register}
              fullWidth
              multiline
              rows="5"
              rowsMax="10"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Cancel
            </Button>
            <Button color="primary" variant="contained" type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {notification?.open && (
        <Alert
          open
          severity={notification?.severity}
          handleClose={() => {
            setNotification(prevState => ({
              ...prevState,
              open: false
            }));
          }}
        >
          {notification?.message}
        </Alert>
      )}
    </div>
  );
};

export default MakeComplaintView;
