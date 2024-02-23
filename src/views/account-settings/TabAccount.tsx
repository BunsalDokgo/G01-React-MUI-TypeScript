// ** React Imports
import { useState, ElementType, ChangeEvent, SyntheticEvent, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button, { ButtonProps } from '@mui/material/Button'

import axios from 'axios';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

interface State extends SnackbarOrigin {
  open: boolean;
}

const TabAccount = () => {
  // ** State
  const [openAlert, setOpenAlert] = useState<boolean>(true)
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png');

  const [state, setState] = useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;
  
  useEffect(() => {
    setTimeout(() => {
      setState({ ...state, open: false });
    }, 5000);
  }, [state]);

  useEffect(() => {
    getProfile();
  }, []);
  
  const handleClick = (newState: SnackbarOrigin) => {
    setState({ ...newState, open: true });
  };
  
  const [isError, setIsError] = useState<boolean>(false);
  const [resMessage, setResMessage] = useState<string>('');
  
  const handleClose = () => {
    setState({ ...state, open: false });
  };
  
  const errSnackbarBackgroundColor = {
    backgroundColor: '#EF4040',
  };
  
  const successSnackbarBackgroundColor = {
    backgroundColor: '#74E291',
  };

  const getProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:8080/api/auth/get-profile/${userId}`);
      const { data } = response;
  
      if (data && data.imagePath) {
        const imageURL = new URL(data.imagePath, 'http://localhost:8080').href;
        setImgSrc(imageURL);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (file: ChangeEvent) => {
    const reader = new FileReader();
    const { files } = file.target as HTMLInputElement;
    if (files && files.length !== 0) {
      reader.onload = async () => {
        setImgSrc(reader.result as string);
        
        const id = localStorage.getItem('userId');
  
        const formData = new FormData();
        formData.append('image', files[0]);
        formData.append('id', id as any);
  
        handleClick({ vertical: 'top', horizontal: 'right' });
  
        try {
          await axios.post('http://localhost:8080/api/auth/upload-profile', formData)
            .then(({ data }: any) => {
              localStorage.setItem('imagePath', data.imagePath);
              setResMessage(data?.message);
              setIsError(false);
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            })
            .catch((err): any => {
              const message = err.response.data.message;
              if (!message) setResMessage('Invalid file type, only JPEG and PNG is allowed!');
              else setResMessage(message);
              setIsError(true);
            })
        } catch (err: any) {
          setIsError(true);
          setResMessage(err);
        }
      };
  
      reader.readAsDataURL(files[0])
    }
  };

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={imgSrc} alt='Profile Pic' />
              <Box>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                  Upload New Photo
                  <input
                    hidden
                    type='file'
                    onChange={onChange}
                    accept='image/png, image/jpeg'
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <Snackbar
                  anchorOrigin={{ vertical, horizontal }}
                  open={open}
                  onClose={handleClose}
                  message={resMessage}
                  key={vertical + horizontal}
                  ContentProps={{
                    style: isError ? errSnackbarBackgroundColor : successSnackbarBackgroundColor
                  }}
                />
                <Typography variant='body2' sx={{ marginTop: 5 }}>
                  Allowed PNG or JPEG. Max size of 800K.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Username' placeholder='Salalazz' defaultValue='Bunsal' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Name' placeholder='Bunsal' defaultValue='Bunsal' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='email'
              label='Email'
              placeholder='bunsal@example.com'
              defaultValue='bunsal@example.com'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select label='Role' defaultValue='admin'>
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='author'>Author</MenuItem>
                <MenuItem value='editor'>Editor</MenuItem>
                <MenuItem value='maintainer'>Maintainer</MenuItem>
                <MenuItem value='subscriber'>Subscriber</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select label='Status' defaultValue='active'>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
                <MenuItem value='pending'>Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Company' placeholder='ABC Company' defaultValue='ABC Company' />
          </Grid>

          {openAlert ? (
            <Grid item xs={12} sx={{ mb: 3 }}>
              <Alert
                severity='warning'
                sx={{ '& a': { fontWeight: 400 } }}
                action={
                  <IconButton size='small' color='inherit' aria-label='close' onClick={() => setOpenAlert(false)}>
                    <Close fontSize='inherit' />
                  </IconButton>
                }
              >
                <AlertTitle>Your email is not confirmed. Please check your inbox.</AlertTitle>
                <Link href='/' onClick={(e: SyntheticEvent) => e.preventDefault()}>
                  Resend Confirmation
                </Link>
              </Alert>
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <Button variant='contained' sx={{ marginRight: 3.5 }}>
              Save Changes
            </Button>
            <Button type='reset' variant='outlined' color='secondary'>
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccount
