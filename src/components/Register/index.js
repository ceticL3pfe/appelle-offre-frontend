import React, { useEffect, useState } from 'react';
import { Wrapper } from './styles';
import { Box, FormControlLabel, Paper, IconButton, Radio, RadioGroup, Stack, TextField, Typography, Divider, Button } from '@mui/material';
import { RemoveRedEye, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate,Link } from 'react-router-dom';
import CustomDialog from '../utils/CustomDialog';
import { useRegisterUserMutation } from '../../app/api/apiSlice';

function Register() {

    const [registerUser, registerUserResult] = useRegisterUserMutation();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState('');

    const [disable, setDisable] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        password2: '',
        role: 'admin'
    });
    const theme = useTheme();
    const [visible, setVisible] = useState(false);

    const navigate = useNavigate();

    const handleChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value,
        });
        if (field === 'password2') {
            if (formData.password !== event.target.value) {
                setDisable(true);
            } else {
                setDisable(false);
            }
        }
    };



    const handleSubmit = async (event) => {
        event.preventDefault();
        await registerUser(formData)
    }
    useEffect(() => {
        if (registerUserResult.isError) {
            if (registerUserResult.error.status === 409) {
                setDialogMessage('Email already exists try again with another email')

            } else {
                setDialogMessage('Unknown error occurred')

            }
            setDialogType("Error")
            setDialogOpen(true)
        } else {
            setDialogOpen(false)

            if (registerUserResult.status === 'fulfilled') {
                navigate('/', { state: { registrationSuccess: true } });
            }

        }






    }, [registerUserResult, navigate])


useEffect(()=>{
console.log(formData)
},[formData])


    return (
        <Wrapper>
            {("registerUserResult.status" === 'pending') ? (<>Loading...</>) :
                <>

                    <Paper sx={{ padding: '10px', width: 'min-conten' }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: 'min-content' }}>
                            <Stack>
                                <Box>
                                    <Typography marginBottom={'5px'} variant='h3'>
                                        Register
                                    </Typography>
                                    <Typography marginBottom={'5px'} variant='body1'>
                                        It's fast and easy
                                    </Typography>
                                    <Divider />
                                </Box>

                                <TextField
                                    name='email'
                                    type='email'
                                    required
                                    label='Email'
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                />
                                <TextField
                                    name='username'
                                    type='text'
                                    required
                                    label='Username'
                                    value={formData.username}
                                    onChange={handleChange('username')}
                                />

                                <TextField
                                    name='password'
                                    onChange={handleChange('password')}
                                    required
                                    type={visible ? 'password' : 'text'}
                                    value={formData.password}
                                    sx={{ width: '300px' }}
                                    label='Password'
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={() => setVisible(!visible)}>
                                                {visible ? <VisibilityOff /> : <RemoveRedEye />}
                                            </IconButton>
                                        ),
                                    }}
                                />
                                <TextField
                                    name='password2'
                                    onChange={handleChange('password2')}
                                    required
                                    type={visible ? 'password' : 'text'}
                                    value={formData.password2}
                                    sx={{ width: '300px' }}
                                    label='Password Confirmation'
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={() => setVisible(!visible)}>
                                                {visible ? <VisibilityOff /> : <RemoveRedEye />}
                                            </IconButton>
                                        ),
                                    }}
                                />
                               
                                <RadioGroup
                                    onChange={handleChange('role')}
                                    aria-labelledby='demo-radio-buttons-group-label'
                                    defaultValue='admin'
                                    name='radio-buttons-group'
                                    sx={{ flexDirection: 'row' }}
                                >
                                    <FormControlLabel name='email' value='admin' control={<Radio  />} label='admin' />
                                    <FormControlLabel name='email' value='directeur' control={<Radio  />} label='directeur' />
                                    <FormControlLabel name='email' value='agentTc' control={<Radio />} label='AgentTc' />
                                    <FormControlLabel name='email' value='commission' control={<Radio />} label='commission' />
                                    <FormControlLabel name='email' value='controlleurDeGestion' control={<Radio />} label='controlleur de Gestion' />
                                </RadioGroup>
                                <Button
                                    type='submit'
                                    disabled={disable}
                                    variant='contained'
                                    sx={{ bgcolor: theme.palette.success.main, width: '85%', margin: '20px' }}
                                >
                                    <Typography variant='h6'>Register</Typography>
                                </Button>
                            </Stack>
                        </form>
                        <Link to={"/"}>Login</Link>
                    </Paper>       </>
            }
            <CustomDialog message={dialogMessage} isOpen={dialogOpen} type={dialogType} />

        </Wrapper>)




}
export default Register;
