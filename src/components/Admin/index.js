import React, { useEffect, useState } from 'react';
import { Typography, Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { useGetUsersMutation, useDeleteUserMutation, useGetActivitiesMutation } from '../../app/api/apiSlice';
import CustomDialog from '../utils/CustomDialog';
import CustomCircularProgress from '../utils/CircularProgress';
import { Delete } from '@mui/icons-material';
import DeleteUserDialog from '../utils/DeleteUserDialog';
import PersonIcon from '@mui/icons-material/Person';

function Admin() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('');
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);

  const [getUsers, getUsersResult] = useGetUsersMutation();
  const [deleteUser, deleteUserResult] = useDeleteUserMutation();
  const [getActivities, getActivitiesResult] = useGetActivitiesMutation();

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    (async () => {
      await getUsers();
      await getActivities();
    })();
  }, []);

  useEffect(() => {
    if (getUsersResult.status === 'fulfilled') {
      setProgress(false);
      setUsers(getUsersResult.data.msg);
    } else if (getUsersResult.status === 'pending') {
      setProgress(true);
    } else {
      setProgress(false);
    }
  }, [getUsersResult]);

  useEffect(() => {
    if (getActivitiesResult.status === 'fulfilled') {
      setProgress(false);
      setActivities(getActivitiesResult.data.msg);
    } else if (getActivitiesResult.status === 'pending') {
      setProgress(true);
    } else {
      setProgress(false);
    }
  }, [getActivitiesResult]);

  useEffect(() => {
    if (deleteUserResult.status === 'fulfilled') {
      setProgress(false);
      getUsers();
    } else if (deleteUserResult.status === 'pending') {
      setProgress(true);
    } else {
      setProgress(false);
    }
  }, [deleteUserResult]);

  const handleDelete = (e) => {
    deleteUser({ id: e.currentTarget.dataset.id });
  };

  return (
    <Box sx={{ margin: '75px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant='h3' marginTop={"100px"}>Admin Dashboard</Typography>
      <Stack direction={'row'} spacing={4} sx={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: '40px' }}>
        <Box sx={{ width: '100%', bgcolor: '#f4f6fa', borderRadius: '8px', boxShadow: 3, overflow: 'auto', maxHeight: '560px', marginBottom: '30px' }}>
          <Typography variant='h4' sx={{ p: 2, color: 'black', textAlign: 'center' }}>Utilisateur</Typography>
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
            <Table>
            <TableRow>
                <TableCell>
                      
                    </TableCell>
                  <TableCell style={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell style={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell style={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>Supprimer</TableCell>
                </TableRow>
              <TableBody>
                {users.map((value) => (
                  <TableRow key={value._id}>
                    <TableCell >
                      <PersonIcon sx={{ marginRight: 0 }} />
                    </TableCell>
                    <TableCell  style={{ alignItems: 'center' }}>
                      <Typography variant='body1'>{value.email}</Typography>
                    </TableCell>
                    <TableCell align="center"  style={{ color: 'black', paddingRight: '175px' }}>{value.role}</TableCell>
                    <TableCell align="center">
                      <IconButton edge="center" data-id={value._id} onClick={(e) => {
                        setSelectedUser(e.currentTarget.dataset.id);
                        setDeleteOpen(true);
                      }}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box sx={{ width: '100%', bgcolor: '#f4f6fa', borderRadius: '8px', boxShadow: 3, overflow: 'auto', maxHeight: '560px' }}>
          <Typography variant='h4' sx={{ p: 2, color: 'black', textAlign: 'center' }}>Journal d'activité</Typography>
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                <TableCell>
                      
                    </TableCell>
                  <TableCell style={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>Nom d'utilisateur</TableCell>
                  <TableCell style={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>Action</TableCell>
                  <TableCell style={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.map((item) => (
                  <TableRow key={item._id}>
                     <TableCell>
                      <PersonIcon sx={{ marginRight: 0 }} />
                    </TableCell>
                    <TableCell style={{ color: 'black', textAlign: 'center' }}>{item.username}</TableCell>
                    <TableCell style={{ color: 'black', textAlign: 'center' }}>{item.action}</TableCell>
                    <TableCell style={{ color: 'black', textAlign: 'center' }}>{new Date(item.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Stack>
      <CustomDialog message={dialogMessage} isOpen={isOpen} type={dialogType} setIsOpen={setIsOpen} />
      <DeleteUserDialog isOpen={deleteOpen} setIsOpen={setDeleteOpen} itemId={selectedUser} setUsers={setUsers} users={users} />
      {progress && <CustomCircularProgress />}
    </Box>
  );
}

export default Admin;
