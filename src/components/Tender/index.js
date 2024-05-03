import React, { useEffect, useState } from 'react';
import { AddItemButton, BoxHeader, Wrapper } from './styles';
import { Box, Button, ButtonGroup, Card, CardActions, CardContent, CardMedia, Grid, IconButton, InputBase, OutlinedInput, Paper, Stack, TextField, Typography } from '@mui/material';
import { theme } from '../theme';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import CustomCircularPogress from '../utils/CircularProgress';
import { selectToken, selectUser } from '../../features/users/userSlice';
import { useEditTenderNoticeMutation, useGetTenderNoticeMutation, useGetUsersMutation } from '../../app/api/apiSlice';
import DeleteItemDialog from '../utils/DeleteItemDialog';
import EditItemDialog from '../utils/EditItemDialog';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddCdc from '../utils/AddCdc';
import AddAoReponse from '../utils/AddAoReponse';
import DeleteCdcDialog from '../utils/DeleteCdcDialog';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteAoResponseDialog from '../utils/DeleteAoResponseDialog';
import DeletePvClient from '../utils/DeletePvClientDialog';
import AddPvClient from '../utils/AddPv';
import { selectTenders, setTenders } from '../../features/tenders/tender';
import AddComment from '../utils/AddComment'
import { AddCommentRounded } from '@mui/icons-material';
import Comments from '../utils/Comments';
import ClearIcon from '@mui/icons-material/Clear';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
function TenderNotice({ users, tenders }) {

    const [updateTender, updateTenderResult] = useEditTenderNoticeMutation()

    const dispatch = useDispatch()

    const [commentOpen, setAddCommentOpen] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [itemToComment, setItemToComment] = useState(null)


    const token = useSelector(selectToken)




    const [selectedItem, setSelectedItem] = useState(null)
    const [tenderId, setTenderId] = useState(null)
    const [documentId, setDocumentId] = useState(null)
    const [openDeleteCdc, setOpenDeleteCdc] = useState(null)
    const [pvOpen, setPvOpen] = useState(null)
    const [openDeleteAoResponse, setOpenDeleteAoResponse] = useState(null)
    const [openDeletePv, setOpenDeletePv] = useState(null)
    const [itemToUpdate, setItemToUpdate] = useState(null)
    const [dialogAddItem, setDialogAddItem] = useState(false)
    const [dialogEditItem, setDialogEditItem] = useState(false)
    const [dialogRemoveItem, setDialogRemoveItem] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [cdcOpen, setCdcOpen] = useState(false)
    const [aoOpen, setAoOpen] = useState(false)
    const [progress, setProgress] = useState(false)
    const [dialogMessage, setDialogMessage] = useState('')
    const [dialogType, setDialogType] = useState('')
    const [inputText, setInputText] = useState('')

    let filteredItems=[]



    const [itemIdToDelete, setItemIdToDelete] = useState(null)

    const user = useSelector(selectUser)



    useEffect(() => {
        if (updateTenderResult.status === "rejected") {
            console.log("error while updating item");
        } else if (updateTenderResult.status === "fulfilled") {

             filteredItems = tenders?.map((item) => {
                 console.log(item._id, updateTenderResult.data.msg._id)
                if (item._id !== updateTenderResult.data.msg._id) {
                    return item;
                } else {
                    return updateTenderResult.data.msg;
                }
            });
            console.log("filtred ite;s", filteredItems);
            dispatch(setTenders(filteredItems))
            console.log("item have updated successfully");
        }


    }, [updateTenderResult]);



    const handleInputChange = (e) => {
        setInputText(e.target.value.toLowerCase());



    };
    console.log(selectedItem)


    return (
        <Wrapper sx={{ width: "100%" }}>
            <Box marginTop={'5px'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>

                <TextField label='Search Item' placeholder='Search item' type='text' value={inputText} onChange={handleInputChange} />
            </Box>

            <Grid container sx={{ justifyContent: 'center', width: "100%" }} spacing={2} marginTop={'10px'}>
                {tenders.map((item, index) => (
                    <Grid item key={index}>
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                            <Card style={{ flex: '1', width: '200px' }}>
                                {user?.role === 'agentTc' || user?.role === 'directeur' ? <IconButton sx={{ position: "sticky" }} data-item-id={item._id} onClick={(e) => {

                                    setSelectedItem(e.currentTarget.dataset.itemId)
                                    // Add your logic to handle edit action here
                                    setDialogEditItem(true)

                                }}>
                                    <EditIcon />
                                </IconButton> : null}

                                <CardContent>
                                    <Typography color={'black'} variant="h6">TITLE: {item.object}</Typography>
                                    <Typography variant='subtitle1' color={theme.palette.error.main}>SOURCE: {item.source}</Typography>
                                    <Typography variant='subtitle1' color={theme.palette.error.main}>Mission Head: {item.missionHead}</Typography>
                                    <Typography variant='subtitle1' color={theme.palette.success.main}>DESCRIPTION: {item.description}</Typography>
                                    <Typography variant='subtitle1'>STATUS: {item.status}</Typography>
                                    {
                                        item.cahierCharge && user.role !== 'controlleurDeGestion' ?
                                            <Stack direction={'row'}>  <label id='cdc-label' className='cdc-label'>Cdc file:</label>
                                                <IconButton
                                                    aria-labelledby='cdc-label'
                                                    sx={{ position: "sticky" }}
                                                    data-file-id={item.cahierCharge}
                                                    onClick={async (e) => {
                                                        window.open(
                                                            `http://localhost:5000/cdc/cdc-data/${e.currentTarget.dataset.fileId}/${token}`,
                                                            "_blank"
                                                        );
                                                    }}
                                                >
                                                    <AttachFileIcon />
                                                </IconButton>
                                                {(user.role === 'agentTc') ? (<IconButton data-tender-id={item._id} data-document-id={item.cahierCharge} onClick={(e) => {
                                                    setTenderId(e.currentTarget.dataset.tenderId)
                                                    setDocumentId(e.currentTarget.dataset.documentId)

                                                    setOpenDeleteCdc(true)
                                                }}><DeleteOutlineIcon /></IconButton>) : null}
                                            </Stack>
                                            : (user.role === 'agentTc') ?
                                                <Button data-tender-id={item._id} variant='outlined' onClick={(e) => {
                                                    setTenderId(e.currentTarget.dataset.tenderId)
                                                    console.log(e.currentTarget.dataset.tenderId)
                                                    setCdcOpen(true)


                                                }}>Ajouter Cdc</Button> : null

                                    }
                                    {
                                        item.aoResponse && user.role !== 'commission' && user.role !== 'controlleurDeGestion' ?
                                            <Stack direction={'row'}>  <label id='aoreponse-label' className='aoreponse-label'>Dossier De Reponse:</label>
                                                <IconButton
                                                    aria-labelledby='aoreponse-label'
                                                    sx={{ position: "sticky" }}
                                                    data-file-id={item.aoResponse}
                                                    onClick={async (e) => {
                                                        window.open(
                                                            `http://localhost:5000/aoReponse/ao-response-data/${e.currentTarget.dataset.fileId}/${token}`,
                                                            "_blank"
                                                        );
                                                    }}
                                                >
                                                    <AttachFileIcon />
                                                </IconButton>
                                                {(user.role === 'agentTc') ? <IconButton data-tender-id={item._id} data-document-id={item.aoResponse} onClick={(e) => {
                                                    setTenderId(e.currentTarget.dataset.tenderId)
                                                    setDocumentId(e.currentTarget.dataset.documentId)

                                                    setOpenDeleteAoResponse(true)
                                                }}><DeleteOutlineIcon /></IconButton> : null}

                                            </Stack>
                                            :
                                            (user.role === 'agentTc') ? <Button data-tender-id={item._id} variant='outlined' onClick={(e) => {
                                                setTenderId(e.currentTarget.dataset.tenderId)
                                                console.log(e.currentTarget.dataset.tenderId)
                                                setAoOpen(true)


                                            }}>Ajouter dossier de reponse</Button> : null

                                    }
                                    {
                                        item.pvClient && user.role !== 'commission' && user.role !== 'controlleurDeGestion' ?
                                            <Stack direction={'row'}>  <label id='cdc-label' className='cdc-label'>Pv Client:</label>
                                                <IconButton
                                                    aria-labelledby='cdc-label'
                                                    sx={{ position: "sticky" }}
                                                    data-file-id={item.pvClient}
                                                    onClick={async (e) => {
                                                        window.open(
                                                            `http://localhost:5000/pvClient/client-pv-data/${e.currentTarget.dataset.fileId}/${token}`,
                                                            "_blank"
                                                        );
                                                    }}
                                                >
                                                    <AttachFileIcon />
                                                </IconButton>

                                                {(user.role === 'agentTc') ? <IconButton data-tender-id={item._id} data-document-id={item.pvClient} onClick={(e) => {
                                                    setTenderId(e.currentTarget.dataset.tenderId)
                                                    setDocumentId(e.currentTarget.dataset.documentId)

                                                    setOpenDeletePv(true)
                                                }}><DeleteOutlineIcon /></IconButton> : null}
                                            </Stack>
                                            :
                                            (user.role === 'agentTc') ? <Button data-tender-id={item._id} variant='outlined' onClick={(e) => {
                                                setTenderId(e.currentTarget.dataset.tenderId)
                                                console.log(e.currentTarget.dataset.tenderId)
                                                setPvOpen(true)


                                            }}>Ajouter PV client</Button> : null}



                                </CardContent>
                                <CardActions>
                                    {user?.role === 'agentTc' ?
                                        <IconButton data-item-id={item._id} onClick={(e) => {
                                            const itemId = e.currentTarget.dataset.itemId;
                                            setItemIdToDelete(itemId)
                                            setDialogRemoveItem(true);


                                        }}>
                                            <DeleteIcon />
                                        </IconButton> : null}
                                    {user?.role !== 'agentTc' && user.role !== 'admin' ?
                                        <IconButton data-item-id={item._id} onClick={(e) => {
                                            const itemId = e.currentTarget.dataset.itemId;
                                            setItemToComment(itemId)
                                            setAddCommentOpen(true);


                                        }}>
                                            <AddCommentRounded />
                                        </IconButton> : null}
                                    <Button data-item-id={item._id} onClick={(e) => {
                                        const itemId = e.currentTarget.dataset.itemId;
                                        setSelectedItem(itemId)
                                        setShowComments(true);


                                    }}>
                                        show comments
                                    </Button>
                                    <ButtonGroup>
                                        <IconButton data-item-id={item._id} onClick={async (e) => {
                                            const itemId = e.currentTarget.dataset.itemId;
                                            await updateTender({ data: { [`${user.role}Response`]: "ok" }, id: itemId })




                                        }}

                                            color={item?.[`${user.role}Response`] === 'ok' ? 'success' : 'default'}

                                        >

                                            <DoneOutlineIcon />
                                        </IconButton>
                                        <IconButton data-item-id={item._id} onClick={async (e) => {
                                            const itemId = e.currentTarget.dataset.itemId;

                                            await updateTender({ data: { [`${user.role}Response`]: "refused" }, id: itemId })


                                        }}
                                            color={item?.[`${user.role}Response`] === 'refused' ? 'error' : 'default'}

                                        >
                                            <ClearIcon />

                                        </IconButton>
                                    </ButtonGroup>



                                </CardActions>


                            </Card>
                            <Box

                                display="flex"
                                flexDirection="column"
                                justifyContent="flex-end"
                                alignItems="flex-end"
                                padding="8px"
                                height="100%"
                            >

                                <Paper elevation={6} sx={{
                                    marginBottom: "-3px", zIndex: '5', bgcolor: item?.directeurResponse === 'ok' ? 'success.main' : item?.directeurResponse !== 'null' ? 'error.main' : "transparent",
                                }}>


                                    <Typography
                                        variant="body2"
                                        component="div"
                                        sx={{
                                            marginBottom: '8px',
                                            padding: '4px',
                                            writingMode: 'vertical-lr', // Vertical writing mode
                                            textOrientation: 'mixed', // Mixed orientation
                                        }}
                                    >
                                        Directeur
                                    </Typography>     </Paper>
                                <Paper elevation={3} sx={{
                                    marginBottom: "-3px", zIndex: '4', bgcolor: item?.commissionResponse === 'ok' ? 'success.main' : 'error.main',
                                }}> <Typography
                                    variant="body2"
                                    component="div"
                                    sx={{
                                        marginBottom: '8px',
                                        padding: '4px',
                                        writingMode: 'vertical-lr', // Vertical writing mode
                                        textOrientation: 'mixed', // Mixed orientation
                                    }}
                                >
                                        Commission
                                    </Typography> </Paper>
                                <Paper elevation={1} sx={{
                                    zIndex: '3', bgcolor: item?.controlleurDeGestionResponse === 'refused' ? 'error.main' : item?.controlleurDeGestionResponse !== 'null' ? 'success.main' : "transparent",
                                }} >    <Typography
                                    variant="body2"
                                    component="div"
                                    sx={{
                                        marginBottom: '8px',
                                        padding: '4px',
                                        writingMode: 'vertical-lr', // Vertical writing mode
                                        textOrientation: 'mixed', // Mixed orientation
                                    }}
                                >
                                        Controlleur de gestion
                                    </Typography>
                                </Paper>
                            </Box>

                        </Box>
                    </Grid>
                ))}
            </Grid>


            <AddAoReponse isOpen={aoOpen} setIsOpen={setAoOpen} tenderId={tenderId} />
            <AddCdc isOpen={cdcOpen} setIsOpen={setCdcOpen} tenderId={tenderId} />
            <AddPvClient isOpen={pvOpen} setIsOpen={setPvOpen} tenderId={tenderId} />


            <DeleteItemDialog productId={itemIdToDelete} isOpen={dialogRemoveItem} setIsOpen={setDialogRemoveItem} />
            <DeleteCdcDialog isOpen={openDeleteCdc} setIsOpen={setOpenDeleteCdc} itemId={tenderId} documentId={documentId} />
            <DeleteAoResponseDialog isOpen={openDeleteAoResponse} setIsOpen={setOpenDeleteAoResponse} itemId={tenderId} documentId={documentId} />
            <DeletePvClient isOpen={openDeletePv} setIsOpen={setOpenDeletePv} itemId={tenderId} documentId={documentId} />

            <AddComment isOpen={commentOpen} setIsOpen={setAddCommentOpen} itemId={itemToComment} items={tenders} />
            <Comments isOpen={showComments} setIsOpen={setShowComments} itemId={selectedItem} items={tenders} />

            <EditItemDialog users={users} items={tenders} itemId={selectedItem} productId={itemIdToDelete} isOpen={dialogEditItem} setIsOpen={setDialogEditItem} />
            {/* {/* <CustomDialog message={dialogMessage} isOpen={isOpen} type={dialogType} setIsOpen={setIsOpen} /> */}
            {progress ? <CustomCircularPogress
            /> : null}
        </Wrapper>
    );
}

export default TenderNotice;
