import React, { useState } from 'react'
import { Wrapper } from './styles'
import { StyledBox } from './styles'
import { Avatar, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/users/userSlice'
import  profileImage from '../../profileImage.png'
import EditPasswordDialog from '../utils/EditPasswordDialog'
import EditUsenameDialog from '../utils/EditUsenameDialog'
import EditProfilImageDialog from '../utils/EditProfilImageDialog'

function Profile() {


    const handleUsernameClick = ()=>{
        setOpenDialogUsername(true)
        console.log('ssss')
    }
    const handleImageClick = ()=>{
        setOpenDialogImage(true)

    }
    const [openDialog, setOpenDialog] = useState(false)
    const [openDialogUsername, setOpenDialogUsername] = useState(false)
    const [openDialogImage, setOpenDialogImage] = useState(false)
    const userId = sessionStorage.getItem('userId')
    const user = useSelector(selectUser)
    return (
        <Wrapper>
            <Stack spacing={5}>
                
                <Box >
                    <Typography  
                     variant='h3'>{user?.username}</Typography>
                </Box>
                <Box >
                    <Typography  
                     variant='h4'>{user?.email}</Typography>
                </Box>
                <Box >
                    <Typography  
                     variant='h5'>{user?.role}</Typography>
                </Box>
                <Box component={Button} onClick={()=>{
                    setOpenDialog(true)
                    // setOpenDialog(false)
                    console.log(openDialog)
                }}>
                    <Typography>Edite password</Typography>
                </Box>
            </Stack>
            <EditPasswordDialog isOpen={openDialog} setIsOpen={setOpenDialog} />

        </Wrapper>
    )
}

export default Profile
