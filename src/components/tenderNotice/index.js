import React, { useEffect, useState } from 'react';
import { AddItemButton, BoxHeader, Wrapper } from './styles';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, IconButton, InputBase, OutlinedInput, Paper, Stack, TextField, Typography } from '@mui/material';
import { theme } from '../theme';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {  useSelector } from 'react-redux';
import CustomCircularPogress from '../utils/CircularProgress';
import { selectUser } from '../../features/users/userSlice';
import { useGetTenderNoticeMutation } from '../../app/api/apiSlice';
import DeleteItemDialog from '../utils/DeleteItemDialog';
import EditItemDialog from '../utils/EditItemDialog';


function TenderNotice({tenders,setTenders}) {

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




    const [getTenderNotices, getTenderNoticeResult] = useGetTenderNoticeMutation()

    const [itemIdToDelete, setItemIdToDelete] = useState(null)

    const user = useSelector(selectUser)
   
    useEffect(() => {
        (async () => {
            const rep = await getTenderNotices();
        })();
    }, []);


    useEffect(() => {
        if (getTenderNoticeResult.status === 'rejected') {
            setProgress(false)

            console.log('failed to load tender notices from server')
        } else if (getTenderNoticeResult.status === 'fulfilled') {
            setProgress(false)

            setTenders(getTenderNoticeResult.data.msg)


        } else if (getTenderNoticeResult.status === 'pending') {
            setProgress(true)

        }

    }, [getTenderNoticeResult])


    // useEffect(() => {
    //     if (getSalesResult.state === 'rejected') {
    //         setProgress(false)

    //         console.log('failed to load items from server')
    //     } else if (getSalesResult.status === 'fulfilled') {
    //         setProgress(false)

    //         dispatch(setSaleToStore(getSalesResult.data))
    //     } else if (getSalesResult.status === 'pending') {
    //         setProgress(true)

    //     }

    // }, [getSalesResult])

    // useEffect(() => {
    //     if (inputText !== "") {


    //         const filteredList = itemsFromStore.filter((item) =>
    //             item.productName.toLowerCase().includes(inputText)

    //         );
    //         setItems(filteredList);

    //     } else {
    //         if (items) {

    //             setItems(itemsFromStore);
    //         }
    //     }
    // }, [inputText]);
    // useEffect(() => {
    //     if (updateItemResult.status === 'rejected') {
    //         setProgress(false)
    //         console.log('failed to load items from server')
    //     } else if (updateItemResult.status === 'fulfilled') {
    //         setProgress(false)


    //         dispatch(setProduct(prev => {
    //             const filteredItems = prev?.map((item) => {
    //                 console.log('updateItem', updateItemResult.data)

    //                 if (item._id !== updateItemResult.data._id) {
    //                     return item
    //                 } else {
    //                     return updateItemResult.data
    //                 }
    //             })
    //             console.log(filteredItems)
    //             return filteredItems

    //         }
    //         ))
    //         const { productName, price, buyPrice } = updateItemResult.data;
    //         const createdAt = new Date();


    //         //add the item to the sell list
    //         addSale({ count: sellCount, price, saleName: productName, buyPrice: buyPrice, createdAt: createdAt.toLocaleDateString('en-US') });

    //         setSellCount(1)
    //     } else if (updateItemResult.status === 'pending') {
    //         setProgress(true)

    //     }

    // }, [updateItemResult])
    // useEffect(() => {
    //     if (addSaleResult.status === 'rejected') {

    //         updateItem(updateItem({ productId: itemToUpdate._id, data: { count: itemToUpdate.count + 1 } }))
    //         setProgress(false)

    //         console.log('failed to add new Sale ')
    //     } else if (addSaleResult.status === 'fulfilled') {
    //         setProgress(false)

    //         console.log(addSaleResult.data)

    //         dispatch(addSaleToStore(addSaleResult.data));

    //         console.log('sale added seccussfully')


    //     } else if (addSaleResult.status === 'pending') {
    //         setProgress(true)
    //     }

    // }, [addSaleResult])


    // useEffect(() => {
    //     if (updateItemResult.useState === 'rejected') {
    //         console.log('failed to load items from server')
    //     } else if (updateItemResult.status === 'fulfilled') {
    //         console.log('fill')
    //         dispatch(setProduct(getProductsResult.data))
    //         getProducts()
    //     }

    // }, [updateItemResult])

    const handleInputChange = (e) => {
        setInputText(e.target.value.toLowerCase());



    };
useEffect(()=>{
console.log(tenders)
},[tenders])


    return (
        <Wrapper sx={{ width: "100%" }}>
            <Box marginTop={'5px'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>

                <TextField label='Search Item' placeholder='Search item' type='text' value={inputText} onChange={handleInputChange} />
            </Box>

            <Grid container sx={{ justifyContent: 'center', width: "100%" }} spacing={2} marginTop={'10px'}>
                {tenders.map((item, index) => (
                    <Grid item key={index}>
                        <Card style={{ width: '200px' }}>
                            {user?.role === 'manager' ? <IconButton sx={{ position: "sticky" }} data-item-id={item._id} onClick={(e) => {

                                setSelectedItem(e.currentTarget.dataset.itemId)
                                // Add your logic to handle edit action here
                                setDialogEditItem(true)

                            }}>
                                <EditIcon />
                            </IconButton> : null}

                            <CardContent>
                                <Typography color={'black'} variant="h6">TITLE: {item.title}</Typography>
                                <Typography variant='subtitle1' color={theme.palette.error.main}>SOURCE: {item.source}</Typography>
                                <Typography variant='subtitle1' color={theme.palette.error.main}>Mission Head: {item.missionHead}</Typography>
                                <Typography variant='subtitle1' color={theme.palette.success.main}>DESCRIPTION: {item.description}</Typography>
                                <Typography variant='subtitle1'>STATUS: {item.status}</Typography>


                            </CardContent>
                            <CardActions>
                                {user?.role === 'manager' ?
                                    <IconButton data-item-id={item._id} onClick={(e) => {
                                        const itemId = e.currentTarget.dataset.itemId;
                                        console.log("itemId::::",itemId)
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
            <DeleteItemDialog setItems={setTenders} productId={itemIdToDelete} isOpen={dialogRemoveItem} setIsOpen={setDialogRemoveItem} />
           <EditItemDialog items={tenders} itemId={selectedItem} setItems={setTenders} productId={itemIdToDelete} isOpen={dialogEditItem} setIsOpen={setDialogEditItem} /> 
            {/* {/* <CustomDialog message={dialogMessage} isOpen={isOpen} type={dialogType} setIsOpen={setIsOpen} /> */}
            {progress ? <CustomCircularPogress
            /> : null}
        </Wrapper>
    );
}

export default TenderNotice;
