import React, { useEffect, useState } from 'react'
import { Typography, Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import { IconButton, Button } from '@mui/material'
import { useGetUsersMutation, useActivateUsersMutation, useDeleteUserMutation, useGetActivitiesMutation } from '../../app/api/apiSlice';
import DoneOutlineSharpIcon from '@mui/icons-material/DoneOutlineSharp';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import CustomDialog from '../utils/CustomDialog';
import CustomCircularPogress from '../utils/CircularProgress';
import { Delete } from '@mui/icons-material';
import DeleteUserDialog from '../utils/DeleteUserDialog';

function Admin() {

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(false)

  const [isOpen, setIsOpen] = useState(false)
  const [progress, setProgress] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [dialogType, setDialogType] = useState('')
  const [activities, setActivities] = React.useState([]);

  const [users, setUsers] = useState([])

  const [getUsers, getUsersResult] = useGetUsersMutation()
  const [deleteUser, deleteUserResult] = useDeleteUserMutation()
  const [getActivities, getActivitiesResult] = useGetActivitiesMutation()


  useEffect(() => {
    getUsers();
  }, [])
  useEffect(() => {
    (async () => {
      await getUsers();
      await getActivities()

    })();
  }, []);



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
    if (getActivitiesResult.status === 'rejected') {
      setProgress(false)

      console.log('failed to load users from server')
    } else if (getActivitiesResult.status === 'fulfilled') {
      setProgress(false)

      setActivities(getActivitiesResult.data.msg)
      console.log(activities)


    } else if (getActivitiesResult.status === 'pending') {
      setProgress(true)

    }

  }, [getActivitiesResult])

  useEffect(() => {
    if (deleteUserResult.status === 'rejected') {
      setProgress(false)

      console.log('failed to activate users ')
    } else if (deleteUserResult.status === 'fulfilled') {
      setProgress(false)

      getUsers()



    } else if (deleteUserResult.status === 'pending') {
      setProgress(true)

    }

  }, [deleteUserResult])






  const handleDelete = (e) => {

    deleteUser({ id: e.currentTarget.dataset.id })

  }

  return (
    <Box sx={{ marginTop: '75px', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Typography variant='h4'>Admin Dashboard</Typography>
      <Stack direction={'row'}>

        <List dense sx={{ width: '100%', maxWidth: 360,maxHeight:'400px', bgcolor: 'background.paper',overflow:'scroll' }}>
          <Typography variant='h3' > Utilisateur</Typography>

          {users.map((value) => {
            const labelId = `checkbox-list-secondary-label-${value}`;
            return (
              <ListItem
                key={value._id}

              >
                <ListItemButton disableRipple>
                  <ListItemAvatar>
                    <Avatar
                      alt={`Avatar n°${value + 1}`}
                    />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={` ${value.email}`} secondary={value.role} />
                </ListItemButton>
                <IconButton data-id={value._id} onClick={(e) => {
                  setSelectedUser(e.currentTarget.dataset.id);

                  setDeleteOpen(true);
                }}><Delete /></IconButton>
              </ListItem>
            );
          })}
        </List>
        <Box sx={{ backgroundColor: "black", borderRadius: "15px" ,maxHeight:"400px",overflowY:'scroll'}}>
          <Typography variant='h3'  color="white.main"> Logs</Typography>
          <TableContainer sx={{bgcolor:'transparent'}} component={Paper}>
            <Table sx={{height:"80%", }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: 'white' }}>Username</TableCell>
                  <TableCell style={{ color: 'white' }}>Action</TableCell>
                  <TableCell style={{ color: 'white' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell style={{ color: 'white' }}>{item.username}</TableCell>
                    <TableCell style={{ color: 'white' }}>{item.action}</TableCell>
                    <TableCell style={{ color: 'white' }}>{item.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </Box>
      </Stack >
      <CustomDialog message={dialogMessage} isOpen={isOpen} type={dialogType} setIsOpen={setIsOpen} />
      <DeleteUserDialog isOpen={deleteOpen} setIsOpen={setDeleteOpen} itemId={selectedUser} setUsers={setUsers} users={users} />
      {progress ? <CustomCircularPogress
      /> : null}
    </Box>
  )
}

export default Admin
