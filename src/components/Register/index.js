import React, { useEffect, useState } from 'react';
import { Wrapper } from './styles';
import { Box, FormControlLabel, Paper, IconButton, Radio, RadioGroup, Stack, TextField, Typography, Divider, Button } from '@mui/material';
import { RemoveRedEye, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';
import CustomDialog from '../utils/CustomDialog';
import { useRegisterUserMutation } from '../../app/api/apiSlice';
import ceticLogo from '../../ceticLogo.png'; // Ajustez le chemin en fonction de votre structure de projet

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
        await registerUser(formData);
    };

    useEffect(() => {
        if (registerUserResult.isError) {
            if (registerUserResult.error.status === 409) {
                setDialogMessage('Email already exists, try again with another email');
            } else {
                setDialogMessage('Unknown error occurred');
            }
            setDialogType("Error");
            setDialogOpen(true);
        } else {
            setDialogOpen(false);
            if (registerUserResult.status === 'fulfilled') {
                navigate('/', { state: { registrationSuccess: true } });
            }
        }
    }, [registerUserResult, navigate]);

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    return (
        <Wrapper>
            {(registerUserResult.status === 'pending') ? (<>Loading...</>) :
                <>
                    <Paper sx={{ padding: '20px', width: '400px' }}>
                        <Box display="flex" flexDirection="column" alignItems="center"margin={'20px'}>
                            <img src={ceticLogo} alt="Logo" style={{ width: '200px', marginBottom: '20px' }} />
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <Stack spacing={2}>
                                    <Box textAlign="center">
                                        <Typography marginBottom={'5px'} variant='h3'>
                                            Créer un compte
                                        </Typography>
                                        <Typography marginBottom={'15px'} variant='body1'>
                                            L'inscription est rapide et facile.
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
                                        type={visible ? 'text' : 'password'}
                                        value={formData.password}
                                        sx={{ width: '100%' }}
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
                                        type={visible ? 'text' : 'password'}
                                        value={formData.password2}
                                        sx={{ width: '100%' }}
                                        label='Password Confirmation'
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton onClick={() => setVisible(!visible)}>
                                                    {visible ? <VisibilityOff /> : <RemoveRedEye />}
                                                </IconButton>
                                            ),
                                        }}
                                    />
                                    <Box display="flex" justifyContent="center">
                                        <RadioGroup
                                            onChange={handleChange('role')}
                                            aria-labelledby='demo-radio-buttons-group-label'
                                            defaultValue='admin'
                                            name='radio-buttons-group'
                                            sx={{ flexDirection: 'row', justifyContent: 'center' }}
                                        >
                                            <FormControlLabel name='role' value='admin' control={<Radio />} label='Admin' />
                                            <FormControlLabel name='role' value='directeur' control={<Radio />} label='Directeur' />
                                            <FormControlLabel name='role' value='agentTc' control={<Radio />} label='Agent Tc' />
                                            <FormControlLabel name='role' value='commission' control={<Radio />} label='Commission' />
                                            <FormControlLabel name='role' value='controlleurDeGestion' control={<Radio />} label='Contrôleur de Gestion' />
                                        </RadioGroup>
                                    </Box>
                                    <Box display="flex" justifyContent="center">
                                        <Button
                                            type='submit'
                                            disabled={disable}
                                            variant='contained'
                                            sx={{ bgcolor:'L14DW25C', width: '130px', margin: '10px', fontStyle: 'normal' }}
                                        >
                                            <Typography variant='h6'>Créer</Typography>
                                        </Button>
                                        <Button
                                            variant='outlined'
                                            component={Link}
                                            to="/"
                                            sx={{  width: '130px', margin: '10px', fontStyle: 'normal' }}
                                        >
                                            Connexion
                                        </Button>
                                    </Box>
                                </Stack>
                            </form>
                        </Box>
                    </Paper>
                </>
            }
            <CustomDialog message={dialogMessage} isOpen={dialogOpen} type={dialogType} />
        </Wrapper>
    );
}

export default Register;
