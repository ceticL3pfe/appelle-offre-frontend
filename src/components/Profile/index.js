import React, { useState } from 'react';
import { Wrapper } from './styles';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import EditPasswordDialog from '../utils/EditPasswordDialog';
import PersonIcon from '@mui/icons-material/Person';
function Profile() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogUsername, setOpenDialogUsername] = useState(false);
  const [openDialogImage, setOpenDialogImage] = useState(false);
  const user = useSelector(selectUser);

  return (
    <Wrapper sx={{ marginLeft: 4 }}>
      <Stack spacing={6} direction={'row'}>
      <Stack  spacing={1} direction={'column'} alignItems="center">
      <PersonIcon sx={{ marginRight: 0 }} />
        
          <Typography variant="body2" sx={{ color: 'white' }}>
            {user?.username}
          </Typography>
        
        </Stack>
        <Stack spacing={1} direction={'column'} alignItems="flex-start">
        <Box>
          <Typography variant="body2" sx={{ color: 'white' }}>
           Email: {user?.email}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" sx={{ color: 'white' }}>
          Role: {user?.role}
          </Typography>
        </Box>
        </Stack>
  

      
     
      </Stack>
    </Wrapper>
  );
}

export default Profile;
