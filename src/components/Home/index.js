import { Alert, Box, Button, Divider, IconButton, OutlinedInput, Paper, TextField, Typography, } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StyledBox } from './styles'
import { Check, RemoveRedEye } from '@mui/icons-material'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { logOut, setCredentials } from '../../features/users/userSlice'
import { useDispatch} from 'react-redux';
import {  useLogInUserMutation } from '../../app/api/apiSlice';
import CustomDialog from '../utils/CustomDialog';
import { resetStore } from '../../helpers/functions';
import ceticLogo from '/Users/sirine/Desktop/frontend/CETIC_PFE_FRONTEND/src/logo-cetic.jpg';


function Home() {




  const dispatch = useDispatch()
  // const user =useSelector(selectUser)


  const [logInUser, logInUserResult] = useLogInUserMutation();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('');

  useEffect(()=>{
    console.log('HEHEHEHEH')
    resetStore(dispatch)

  },[])
  useEffect(() => {
    if (location.state && location.state.registrationSuccess) {
      setShowSuccessAlert(true);
      navigate({
        state: {},
        replace: true,
      });
    }
  }, [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await logInUser(formData);
    const { data } = logInUserResult
    if(logInUserResult.status==='fulfilled'){
    const user = data?.user;
    const token = data?.token
    console.log('tokenmm=',token)
    if (data?.user && data?.token) {
      console.log('entred')
      const payload = {
        user:user,
        token:token
      }
      dispatch(setCredentials(payload))
    }}


  };
  // useEffect(()=>{
  //    console.log(user)

  // },[user])
  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (logInUserResult.isError) {
      if (logInUserResult.error.status === 404 || logInUserResult.error.status === 403) {
        setDialogMessage('Email or password are incorrect')
        dispatch(logOut())

      } else {
        console.log(logInUserResult.status)
        setDialogMessage('Unknown error occurred')
        dispatch(logOut())


      }
      setDialogType("Error")
      setDialogOpen(true)
    } else {
      setDialogOpen(false)

      if (logInUserResult.status === 'fulfilled') {
        console.log(logInUserResult.data)
      
        dispatch(setCredentials({ user: logInUserResult.data.user, token: logInUserResult.data.token }))
        // console.log(logInUserResult)

        console.log(logInUserResult.data.user, 'login successful')

        switch (logInUserResult.data.user.role) {
          case 'directeur':
            navigate('/directeur');
            break;
          case 'agentTc':
            navigate('/agentTc');
            break;
          case 'commission':
            navigate('/commission');
            break;
          case 'controlleurDeGestion':
            navigate('/cg');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            // Handle other roles or no role defined
            break;
        }
        
      }

    }






  }, [logInUserResult, navigate])
  return (
    <StyledBox backgroundColor={'#F0ECEC'}>
      <Paper sx={{ padding: '20px', width: '400px' , display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                        <Box display="flex" flexDirection="column" alignItems="center"margin={'20px'}>
                            <img src={ceticLogo} alt="Logo" style={{ width: '200px', marginBottom: '20px' }} />
        <form onSubmit={handleSubmit}>
        <Box textAlign="center">
                                        <Typography marginBottom={'20px'} variant='h4'>
                                            Se connecter à votre compte
                                        </Typography>
                                        
                                        <Divider />
                                    </Box>
            <Box>
              <OutlinedInput name='email' required onChange={handleChange('email')} sx={{ width: '300px',margin:'20px' }} placeholder='Email ' />
            </Box>
            <Box>
              <TextField name='password' required onChange={handleChange('password')} type={visible ? 'password' : 'text'} sx={{ width: '300px',marginBottom:'20px',marginLeft:'20px' }} placeholder='Password' InputProps={{ endAdornment: (<IconButton onClick={() => setVisible(!visible)}>{visible ? <VisibilityOffIcon /> : <RemoveRedEye />}</IconButton>) }} />
            </Box>
           
            <Box  sx={{ marginLeft: '100px',marginBottom:"20px" ,marginTop:"10px"}}>
              <Link style={{ textDecoration: 'none' }}>Mot de passe oublier</Link>
            </Box>
            <Divider />
            <Box display="flex" justifyContent="center" marginTop={'15px'}>
  <Button type='submit' variant='contained' sx={{ bgcolor: 'L14DW25C', width: '130px', height: '50px', fontStyle: 'normal' }}>
    Connexion
  </Button>
  <Button type='submit' variant='outlined' component={Link} sx={{ width: '175px', height: '50px', fontStyle: 'normal', marginLeft: '20px' }} to={'/Register'}>
    Créer un compte
  </Button>
</Box>

          
        </form>
      </Box>
      {showSuccessAlert && (
        <Alert
          sx={{
            position: 'absolute',
            top: '80%',
          
            zIndex: '3',
          }}
          variant={'filled'}
          severity='success'
          icon={<Check fontSize='inherit' />}
          action={
            <Button
              color='inherit'
              size='small'
              onClick={() => {
                setShowSuccessAlert(false);
              }}
            >
              UNDO
            </Button>
          }
        >
          Registration successful! You can now log in.
        </Alert>
      )}
      
      <CustomDialog message={dialogMessage} setIsOpen={setDialogOpen} isOpen={dialogOpen} type={dialogType} />
      </Paper>
    </StyledBox>
  );
}

export default Home;


