import React, { useEffect, useState } from 'react';
import { AddItemButton, BoxHeader, Wrapper } from './styles';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, IconButton, InputBase, OutlinedInput, Paper, Stack, TextField, Typography } from '@mui/material';
import { theme } from '../theme';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import CustomCircularPogress from '../utils/CircularProgress';
import { selectUser } from '../../features/users/userSlice';
import { useGetCdcsMutation, useGetTenderNoticeMutation } from '../../app/api/apiSlice';
import DeleteItemDialog from '../utils/DeleteItemDialog';
import EditItemDialog from '../utils/EditItemDialog';
import AddCdc from '../utils/AddCdc';


function CdcList() {

const [cdc,setCdc] = useState([]);

    const [selectedItem, setSelectedItem] = useState(null)
    const [itemToUpdate, setItemToUpdate] = useState(null)
    const [dialogAddItem, setDialogAddItem] = useState(false)
    const [dialogEditItem, setDialogEditItem] = useState(false)
    const [dialogRemoveItem, setDialogRemoveItem] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [progress, setProgress] = useState(false)
    const [dialogMessage, setDialogMessage] = useState('')
    const [dialogType, setDialogType] = useState('')
    const [inputText, setInputText] = useState('')




    const [getCdcs, getCdcsResult] = useGetCdcsMutation()

    const [itemIdToDelete, setItemIdToDelete] = useState(null)

    const user = useSelector(selectUser)

    useEffect(() => {
        (async () => {
            const rep = await getCdcs();
        })();
    }, []);


    useEffect(() => {
        if (getCdcsResult.status === 'rejected') {
            setProgress(false)

            console.log('failed to load cdcs from server')
        } else if (getCdcsResult.status === 'fulfilled') {
            setProgress(false)

            setCdc(getCdcsResult.data.msg)


        } else if (getCdcsResult.status === 'pending') {
            setProgress(true)

        }

    }, [getCdcsResult])



    const handleInputChange = (e) => {
        setInputText(e.target.value.toLowerCase());



    };
    useEffect(() => {
        console.log(cdc)
    }, [cdc])


    return (
        <Wrapper sx={{ width: "100%" }}>
            <Box marginTop={'5px'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>

                <TextField label='Search Item' placeholder='Search item' type='text' value={inputText} onChange={handleInputChange} />
            </Box>
            {user.role === 'agentTc' ? (<Button variant='contained' color='success' onClick={() => setIsOpen(true)
            }>Add CDC</Button>) : null}
            <Grid container sx={{ justifyContent: 'center', width: "100%" }} spacing={2} marginTop={'10px'}>
                {cdc.map((item, index) => (
                    <Grid item key={index}>
                        <Card style={{ width: '200px' }}>
                            {user?.role === 'agentTc' ? <IconButton sx={{ position: "sticky" }} data-item-id={item._id} onClick={(e) => {

                                setSelectedItem(e.currentTarget.dataset.itemId)
                                // Add your logic to handle edit action here
                                setDialogEditItem(true)

                            }}>
                                <EditIcon />
                            </IconButton> : null}

                            <CardContent>
                                <Typography color={'black'} variant="h6">name: {item.name}</Typography>
                                <Typography variant='subtitle1' color={theme.palette.error.main}>client: {item.client}</Typography>
                                <Typography variant='subtitle1' color={theme.palette.error.main}>deadLine: {item.deadLine}</Typography>
                                <Typography variant='subtitle1' color={theme.palette.success.main}>DESCRIPTION: {item.description}</Typography>


                            </CardContent>
                            <CardActions>
                                {user?.role === 'agentTc' ?
                                    <IconButton data-item-id={item._id} onClick={(e) => {
                                        const itemId = e.currentTarget.dataset.itemId;
                                        console.log("itemId::::", itemId)
                                        setItemIdToDelete(itemId)
                                        setDialogRemoveItem(true);


                                    }}>
                                        <DeleteIcon />
                                    </IconButton> : null}


                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <AddCdc isOpen={isOpen} setIsOpen={setIsOpen} cdcs={cdc} setCdcs={setCdc} />
            {/* <DeleteItemDialog setItems={setTenders} productId={itemIdToDelete} isOpen={dialogRemoveItem} setIsOpen={setDialogRemoveItem} /> */}
            {/* <EditItemDialog items={tenders} itemId={selectedItem} setItems={setTenders} productId={itemIdToDelete} isOpen={dialogEditItem} setIsOpen={setDialogEditItem} /> */}
            {/* {/* <CustomDialog message={dialogMessage} isOpen={isOpen} type={dialogType} setIsOpen={setIsOpen} /> */}
            {progress ? <CustomCircularPogress
            /> : null}
        </Wrapper>
    );
}

export default CdcList;
