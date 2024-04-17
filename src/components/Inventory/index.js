import React, { useEffect, useState } from 'react';
import { AddItemButton, BoxHeader, Wrapper } from './styles';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, IconButton, InputBase, OutlinedInput, Paper, Stack, TextField, Typography } from '@mui/material';
import { theme } from '../theme';
import AddItemDialog from '../utils/AddItemDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAddSaleMutation, useGetProductsMutation, useGetSalesMutation, useUpdateProductMutation } from '../../app/api/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectProducts, setProduct } from '../../features/products/productSlice';
import DeleteItemDialog from '../utils/DeleteItemDialog';
import EditItemDialog from '../utils/EditItemDialog';
import { addSaleToStore, setSaleToStore } from '../../features/sales/saleSlice';
import CustomDialog from '../utils/CustomDialog';
import CustomCircularPogress from '../utils/CircularProgress';


function Inventory() {

    const dispatch = useDispatch()
    const [items, setItems] = useState([])
    const [selectedItem, setSelectedItem] = useState(null)
    const [itemToUpdate,setItemToUpdate] = useState(null)
    const [dialogAddItem, setDialogAddItem] = useState(false)
    const [dialogEditItem, setDialogEditItem] = useState(false)
    const [dialogRemoveItem, setDialogRemoveItem] = useState(false)
    const [inputText, setInputText] = useState('');
    const [isOpen, setIsOpen] = useState(false)
    const [progress, setProgress] = useState(false)
    const [dialogMessage, setDialogMessage] = useState('')
    const [dialogType, setDialogType] = useState('')

    const [sellCount, setSellCount] = useState(1)
    const [getProducts, getProductsResult] = useGetProductsMutation()
    const [updateItem, updateItemResult] = useUpdateProductMutation()
    const [getSales, getSalesResult] = useGetSalesMutation()
    const [addSale, addSaleResult] = useAddSaleMutation();

    const [itemIdToDelete, setItemIdToDelete] = useState(null)


    const itemsFromStore = useSelector(selectProducts)
    useEffect(() => {
        getProducts()
        getSales()
    }, [])
    useEffect(() => {
        setItems(itemsFromStore)
    }, [itemsFromStore])
    const handleInputChange = (e) => {
        setInputText(e.target.value.toLowerCase());



    };

    const handleSellClick = (e) => {

        const itemId = e.currentTarget.dataset.itemId;
        let itemToUpdate


        if (sellCount > 0 && sellCount <= items.find(item => item._id === itemId)?.count) {



            const updatedItems = items.map(item => {
                if (itemId === item._id && sellCount <= item.count) {
                    itemToUpdate = { ...item, count: item.count - sellCount }
                    setItemToUpdate(itemToUpdate)
                    return { ...item, count: item.count - sellCount };
                }
                return item;
            });

            updateItem({ productId: itemToUpdate._id, data: { count: itemToUpdate.count } })
        } else {
            console.log('Not enough items to sell');
            setDialogMessage("Not enough items to sell")
            setDialogType('warning')
            setIsOpen(true)
        }



    };

    useEffect(() => {
        console.log(items)
    }, [items])
  
    useEffect(() => {
        if (getProductsResult.useState === 'rejected') {
            setProgress(false)

            console.log('failed to load sales from server')
        } else if (getProductsResult.status === 'fulfilled') {
            setProgress(false)

            dispatch(setProduct(getProductsResult.data))
            setItems(getProductsResult.data)


        } else if (getProductsResult.status === 'pending') {
            setProgress(true)

        }

    }, [getProductsResult])
    useEffect(() => {
        if (getSalesResult.state === 'rejected') {
            setProgress(false)

            console.log('failed to load items from server')
        } else if (getSalesResult.status === 'fulfilled') {
            setProgress(false)

            dispatch(setSaleToStore(getSalesResult.data))
        } else if (getSalesResult.status === 'pending'){
            setProgress(true)

        }

    }, [getSalesResult])

    useEffect(() => {
        if (inputText !== "") {


            const filteredList = itemsFromStore.filter((item) =>
                item.productName.toLowerCase().includes(inputText)

            );
            setItems(filteredList);

        } else {
            if (items) {

                setItems(itemsFromStore);
            }
        }
    }, [inputText]);
    useEffect(() => {
        if (updateItemResult.status === 'rejected') {
            setProgress(false)
            console.log('failed to load items from server')
        } else if (updateItemResult.status === 'fulfilled') {
            setProgress(false)


            dispatch(setProduct(prev => {
                const filteredItems = prev?.map((item) => {
                    console.log('updateItem', updateItemResult.data)

                    if (item._id !== updateItemResult.data._id) {
                        return item
                    } else {
                        return updateItemResult.data
                    }
                })
                console.log(filteredItems)
                return filteredItems

            }
            ))
            const { productName, price, buyPrice } = updateItemResult.data;
            const createdAt = new Date();

           
            //add the item to the sell list
            addSale({ count: sellCount, price, saleName: productName, buyPrice: buyPrice, createdAt: createdAt.toLocaleDateString('en-US') });

            setSellCount(1)
        } else if (updateItemResult.status === 'pending') {
            setProgress(true)

        }

    }, [updateItemResult])
    useEffect(() => {
        if (addSaleResult.status === 'rejected') {
            
            updateItem(updateItem({ productId: itemToUpdate._id, data: { count: itemToUpdate.count + 1 } }))
            setProgress(false)

            console.log('failed to add new Sale ')
        } else if (addSaleResult.status === 'fulfilled') {
            setProgress(false)

            console.log(addSaleResult.data)

            dispatch(addSaleToStore(addSaleResult.data));

            console.log('sale added seccussfully')


        } else if (addSaleResult.status === 'pending') {
            setProgress(true)
        }

    }, [addSaleResult])


    // useEffect(() => {
    //     if (updateItemResult.useState === 'rejected') {
    //         console.log('failed to load items from server')
    //     } else if (updateItemResult.status === 'fulfilled') {
    //         console.log('fill')
    //         dispatch(setProduct(getProductsResult.data))
    //         getProducts()
    //     }

    // }, [updateItemResult])




    return (
        <Wrapper>
            <Box marginTop={'5px'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                <AddItemButton onClick={() => {
                    setDialogAddItem(true)
                }}>Add Item</AddItemButton>
                <TextField label='Search Item' placeholder='Search item' type='text' value={inputText} onChange={handleInputChange} />
            </Box>

            <Grid container sx={{ justifyContent: 'center', }} spacing={2} marginTop={'10px'}>
                {items.map((item, index) => (
                    <Grid item key={index}>
                        <Card style={{ width: '200px' }}>
                            <IconButton sx={{ position: "sticky" }} data-item-id={item._id} onClick={(e) => {

                                setSelectedItem(e.currentTarget.dataset.itemId)
                                // Add your logic to handle edit action here
                                setDialogEditItem(true)

                            }}>
                                <EditIcon />
                            </IconButton>
                            {<CardMedia component="img" alt={item.productName} height="140" image={`data:image/jpeg;base64,${item.productPicture}`} />}

                            <CardContent>
                                <Typography color={'black'}  variant="h6">{item.productName}</Typography>
                                <Typography variant='subtitle1' color={theme.palette.error.main}>SELL: {item.price}</Typography>
                                <Typography variant='subtitle1'  color={theme.palette.success.main}>BUY: {item.buyPrice}</Typography>
                                <Typography variant='subtitle1'>COUNT: {item.count}</Typography>


                            </CardContent>
                            <CardActions>

                                <IconButton data-item-id={item._id} onClick={(e) => {
                                    const itemId = e.currentTarget.dataset.itemId;
                                    console.log(itemId)
                                    setItemIdToDelete(itemId)
                                    setDialogRemoveItem(true);


                                }}>
                                    <DeleteIcon />
                                </IconButton>
                                <Button variant='contained' data-item-id={item._id} onClick={handleSellClick}>Sell</Button>
                                <InputBase type='number' key={item._id} value={sellCount} onChange={(e) => {
                                    if (e.target.value < 0)
                                        e.target.value = 1
                                    setSellCount(e.currentTarget.value)
                                    console.log(typeof sellCount)

                                }} />

                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <AddItemDialog setItems={setItems} isOpen={dialogAddItem} setIsOpen={setDialogAddItem} />
            <DeleteItemDialog setItems={setItems} productId={itemIdToDelete} isOpen={dialogRemoveItem} setIsOpen={setDialogRemoveItem} />
            <EditItemDialog items={items} itemId={selectedItem} setItems={setItems} productId={itemIdToDelete} isOpen={dialogEditItem} setIsOpen={setDialogEditItem} />
            <CustomDialog message={dialogMessage} isOpen={isOpen} type={dialogType} setIsOpen={setIsOpen} />
            {progress ? <CustomCircularPogress
            /> : null}
        </Wrapper>
    );
}

export default Inventory;
