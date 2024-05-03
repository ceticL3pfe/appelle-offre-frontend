import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrapper } from './styles';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, IconButton, InputBase, OutlinedInput, Paper, Stack, TextField, Typography } from '@mui/material';
import { theme } from '../theme';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import CustomCircularPogress from '../utils/CircularProgress';
import { selectToken, selectUser } from '../../features/users/userSlice';
import { useGetCdcsMutation, useGetCdcMutation } from '../../app/api/apiSlice';
import AddCdc from '../utils/AddCdc';
import DeleteCdcDialog from '../utils/DeleteCdcDialog';
import EditCdcDialog from '../utils/EditCdcDialog';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

function CdcList() {
    const navigate = useNavigate();

    const token = useSelector(selectToken)


    const [cdc, setCdc] = useState([]);

    const [selectedItem, setSelectedItem] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
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
    const [getCdcData, getCdcDataResult] = useGetCdcMutation()

    const [itemIdToDelete, setItemIdToDelete] = useState(null)
    const [documentIdToDelete, setDocumentToDelete] = useState(null)

    const user = useSelector(selectUser)

    useEffect(() => {
        (async () => {
            const rep = await getCdcs();
        })();

        setSelectedFile(null)
    }, []);


    useEffect(() => {
        if (getCdcsResult.status === 'rejected') {
            setProgress(false)

            console.log('failed to load cdcs from server')
        } else if (getCdcsResult.status === 'fulfilled') {
            setProgress(false)

            setCdc(getCdcsResult.data.msg)
            console.log(getCdcsResult.data.msg)


        } else if (getCdcsResult.status === 'pending') {
            setProgress(true)

        }

    }, [getCdcsResult])


    useEffect(() => {
        if (getCdcDataResult.status === 'fulfilled') {
            setProgress(false)
            const pdfData = getCdcDataResult.data.msg
            // console.log(pdfData.toString('base64'))
            // const dataUrl = `data:application/pdf;base64,${pdfData.toString('base64')}`;
            window.open(pdfData, '_blank');

            // Open the PDF in the default browser's PDF viewer

        }
        else if (getCdcDataResult.status === 'rejected') {
            if (getCdcDataResult.error.originalStatus === 200) {
                //     // Create a data URL for PDF content


                //     // openPdfInNewPage(getCdcDataResult.error.data);

                // }
                setProgress(false)

                console.log('failed to load cdcs from server')
            }

            else if (getCdcDataResult.status === 'pending') {
                setProgress(true)

            }
        }
    }
        , [getCdcDataResult])



    const handleInputChange = (e) => {
        setInputText(e.target.value.toLowerCase());



    };
    useEffect(() => {
        console.log(selectedFile)
    }, [selectedFile])


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
                            <IconButton sx={{ position: "sticky" }} data-file-id={item.fileId}
                                onClick={async (e) => {
                                    window.open(`http://localhost:5000/cdc/cdc-data/${e.currentTarget.dataset.fileId}/${token}`, '_blank',)

                                }}>
                                <AttachFileIcon />
                            </IconButton>
                            <IconButton sx={{ position: "sticky" }}
                                data-id={item.fileId}
                                data-name={item.name}
                                data-client={item.client}
                                data-deadLine={item.deadLine}
                                data-description={item.description}
                                data-controlleurComments={["adasd","asdasdasd"]}
                                data-commissionComments={item.commissionComment}
                                onClick={(e) => {
                                    const { id, name, client, deadLine, description, controlleurComment, commissionComment } = e.currentTarget.dataset
                                    console.log(e.currentTarget.dataset)
                                    console.log("item", { id, name, client, deadLine, description, controlleurComment, commissionComment })
                                    navigate('/cdc/single', 
                                        { state: { id, name, client, deadline: deadLine, description, controlleurComment, commissionComment } });



                                }}>
                                <OpenInFullIcon />
                            </IconButton>

                            <CardContent>
                                <Typography color={'black'} variant="h6">name: {item.name}</Typography>
                                <Typography variant='subtitle1' color={theme.palette.error.main}>client: {item.client}</Typography>
                                <Typography variant='subtitle1' color={theme.palette.error.main}>deadLine: {item.deadLine}</Typography>
                                <Typography variant='subtitle1' color={theme.palette.success.main}>DESCRIPTION: {item.description}</Typography>


                            </CardContent>
                            <CardActions>
                                {user?.role === 'agentTc' ?
                                    <IconButton data-item-id={item._id} data-document-id={item.fileId} onClick={(e) => {
                                        const itemId = e.currentTarget.dataset.itemId;
                                        const documentId = e.currentTarget.dataset.documentId;
                                        setItemIdToDelete(itemId)
                                        setDocumentToDelete(documentId)
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
            <DeleteCdcDialog setItems={setCdc} itemId={itemIdToDelete} documentId={documentIdToDelete} isOpen={dialogRemoveItem} setIsOpen={setDialogRemoveItem} />
            <EditCdcDialog items={cdc} itemId={selectedItem} setItems={setCdc} isOpen={dialogEditItem} setIsOpen={setDialogEditItem} />
            {/* {/* <CustomDialog message={dialogMessage} isOpen={isOpen} type={dialogType} setIsOpen={setIsOpen} /> */}
            {progress ? <CustomCircularPogress
            /> : null}
        </Wrapper>
    );
}

export default CdcList;
