import React, { useEffect, useState } from 'react'
import { Typography, Box } from '@mui/material'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import { IconButton, Button } from '@mui/material'
import { useGetUsersMutation, useActivateUsersMutation } from '../../app/api/apiSlice';
import DoneOutlineSharpIcon from '@mui/icons-material/DoneOutlineSharp'; 
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import CustomDialog from '../utils/CustomDialog';
import CustomCircularPogress from '../utils/CircularProgress';

function Admin() {


  const [isOpen, setIsOpen] = useState(false)
  const [progress, setProgress] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [dialogType, setDialogType] = useState('')
  const [checked, setChecked] = React.useState([]);

  const [users, setUsers] = useState([])

  const [getUsers, getUsersResult] = useGetUsersMutation()
  const [activateUsers, activateUsersResult] = useActivateUsersMutation()


  useEffect(() => {
    getUsers();
  }, [])




  useEffect(() => {
    if (getUsersResult.status === 'rejected') {
      setProgress(false)

      console.log('failed to load users from server')
    } else if (getUsersResult.status === 'fulfilled') {
      setProgress(false)

      setUsers(getUsersResult.data.msg)



    } else if (getUsersResult.status === 'pending') {
      setProgress(true)

    }

  }, [getUsersResult])

  useEffect(() => {
    if (activateUsersResult.status === 'rejected') {
      setProgress(false)

      console.log('failed to activate users ')
    } else if (activateUsersResult.status === 'fulfilled') {
      setProgress(false)

      getUsers()
      setChecked([])



    } else if (activateUsersResult.status === 'pending') {
      setProgress(true)

    }

  }, [activateUsersResult])





  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value._id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value._id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };


  const handleActivate = () => {

    if (checked.length !== 0)
      activateUsers({ids:checked})

  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Typography variant='1'>Admin Dashboard</Typography>
      <Box>
        <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {users.map((value) => {
            const labelId = `checkbox-list-secondary-label-${value}`;
            return (
              <ListItem
                key={value._id}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={handleToggle(value)}
                    checked={checked.indexOf(value._id) !== -1}
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                }
                disablePadding
              >
                <ListItemButton disableRipple>
                  <ListItemAvatar>
                    <Avatar
                      alt={`Avatar n°${value + 1}`}
                    />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={` ${value.username}`} secondary={value.role} />
                  <IconButton>{value.activated ?
                    <DoneOutlineSharpIcon color='success' />

                    : <RemoveDoneIcon color='error' />}</IconButton>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Button color='success' disabled={checked.length === 0} variant='contained' onClick={handleActivate}> Activate accounts</Button>
      </Box>
      <CustomDialog message={dialogMessage} isOpen={isOpen} type={dialogType} setIsOpen={setIsOpen} />
      {progress ? <CustomCircularPogress
      /> : null}
    </Box>
  )
}

export default Admin
