import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
} from '@mui/material';
import { theme } from '../theme';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TenderNoticeDialog from '.';
import TenderDialog from '../utils/TenderDialog';
import AddAoReponse from '../utils/AddAoReponse';
import AddCdc from '../utils/AddCdc';
import AddPvClient from '../utils/AddPv';
import DeleteItemDialog from '../utils/DeleteItemDialog';
import DeleteCdcDialog from '../utils/DeleteCdcDialog';
import DeleteAoResponseDialog from '../utils/DeleteAoResponseDialog';
import DeletePvClient from '../utils/DeletePvClientDialog';
import AddComment from '../utils/AddComment';
import Comments from '../utils/Comments';
import TableauComparatif from '../utils/TableauComparatif';
import EditItemDialog from '../utils/EditItemDialog';
import AddTenderNoticeDialog from '../utils/AddTenderNoticeDialog';
import { Wrapper } from './styles';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
// Import other components, hooks, and styles...

function TenderNotice({ users, tenders }) {
    const user = useSelector(selectUser)
    console.log(users)

    const [commentOpen, setAddCommentOpen] = useState(false)
    const [itemToComment, setItemToComment] = useState(null)
    const [item, setItem] = useState(null)
    const [tenderCallId, setTenderCallId] = useState(null)
    const [documentId, setDocumentId] = useState(null)
    const [openDeleteCdc, setOpenDeleteCdc] = useState(null)
    const [pvOpen, setPvOpen] = useState(null)
    const [openDeleteAoResponse, setOpenDeleteAoResponse] = useState(null)
    const [openDeletePv, setOpenDeletePv] = useState(null)
    const [itemToUpdate, setItemToUpdate] = useState(null)
    const [dialogAddItem, setDialogAddItem] = useState(false)
    const [isTOpen, setIsTOpen] = useState(false)
    const [cdcOpen, setCdcOpen] = useState(false)
    const [aoOpen, setAoOpen] = useState(false)
    const [progress, setProgress] = useState(false)
    const [dialogMessage, setDialogMessage] = useState('')
    const [dialogType, setDialogType] = useState('')
    const [inputText, setInputText] = useState('')
    const [isTabOpen, setIsTabOpen] = useState(false)
    const [selectedTenderForTab, setSelectedTenderForTab] = useState('')
    // State and useEffect hooks...
    const [selectedItem, setSelectedItem] = useState(null)
    const [dialogEditItem, setDialogEditItem] = useState('')
    const [dialogTender, setDialogTender] = useState(false)
    const [itemIdToDelete, setItemIdToDelete] = useState('')
    const [dialogRemoveItem, setDialogRemoveItem] = useState('')
    const [showComments, setShowComments] = useState('')

    const handleEditItemClick = (itemId) => {
        setSelectedItem(itemId);
        setDialogEditItem(true);
    };



    const handleDeleteItemClick = (itemId) => {
        setItemIdToDelete(itemId);
        setDialogRemoveItem(true);
    };

    const handleShowCommentsClick = (itemId) => {
        setSelectedItem(itemId);
        setShowComments(true);
    };

    return (

        <Wrapper>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          
          width="100%"
        >
          <TableContainer
            sx={{
              borderRadius: "5px",
              
              overflowY: 'scroll',
              backgroundColor: '#f4f6fa',
              height: '70vh', // Ajuste la hauteur de la table
              width: '90%',   // Ajuste la largeur de la table
              maxHeight: '58vh' // Limite maximale de la hauteur de la table
            }}
            component={Paper}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold',textAlign: 'center' }}>Title</TableCell>
                  <TableCell style={{ color: 'black',textAlign: 'center', fontWeight: 'bold' }}>Source</TableCell>
                  <TableCell style={{ color: 'black', textAlign: 'center',fontWeight: 'bold' }}>Responsable de mission </TableCell>
                  <TableCell style={{ color: 'black', textAlign: 'center',fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell style={{ color: 'black', textAlign: 'center',fontWeight: 'bold' }}>Statut</TableCell>
                  <TableCell style={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenders.map((item, index) => (
                  <TableRow
                    key={index}
                    data-tender-id={item?._id}
                    onClick={(e) => {
                      setSelectedItem(e.currentTarget.dataset.tenderId);
                      setDialogTender(true);
                    }}
                  >
                    <TableCell style={{ color: 'black', textAlign: 'center' }}>{item.object}</TableCell>
                    <TableCell style={{ color: 'black', textAlign: 'center' }}>{item.source}</TableCell>
                    <TableCell style={{ color: 'black', textAlign: 'center' }}>{item.missionHead}</TableCell>
                    <TableCell style={{ color: 'black', textAlign: 'center' }}>{item.description}</TableCell>
                    <TableCell style={{ color: 'black', textAlign: 'center' }}>{item.status}</TableCell>
                    <TableCell style={{ color: 'black', textAlign: 'center' }}>
                      {user.role === 'agentTc' || user.role === 'directeur' ? (
                        <>
                          <IconButton onClick={() => handleEditItemClick(item._id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteItemClick(item._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </>
                      ) : null}
                      <Button onClick={() => handleShowCommentsClick(item._id)} style={{  fontStyle: 'normal', }}>
                        Voir les commentaires
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      
        <TenderDialog
          setIsTabOpen={setIsTabOpen}
          setSelectedTenderForTab={setSelectedTenderForTab}
          setSelectedItem={setSelectedItem}
          setItemToComment={setItemToComment}
          setShowComments={setShowComments}
          setAddCommentOpen={setAddCommentOpen}
          setDialogRemoveItem={setDialogRemoveItem}
          setDocumentId={setDocumentId}
          setItemIdToDelete={setItemIdToDelete}
          setOpenDeleteCdc={setOpenDeleteCdc}
          setOpenDeletePv={setOpenDeletePv}
          setOpenDeleteAoResponse={setOpenDeleteAoResponse}
          setTenderCallId={setTenderCallId}
          isOpen={dialogTender}
          setIsOpen={setDialogTender}
          tenderId={selectedItem}
          tenderCallId={tenderCallId}
          setPvOpen={setPvOpen}
          setCdcOpen={setCdcOpen}
          setAoOpen={setAoOpen}
        />
      
        <AddAoReponse isOpen={aoOpen} setIsOpen={setAoOpen} tenderId={tenderCallId} />
        <AddCdc isOpen={cdcOpen} setIsOpen={setCdcOpen} tenderId={tenderCallId} />
        <AddPvClient isOpen={pvOpen} setIsOpen={setPvOpen} tenderId={tenderCallId} />
      
        <DeleteItemDialog productId={itemIdToDelete} isOpen={dialogRemoveItem} setIsOpen={setDialogRemoveItem} />
        <DeleteCdcDialog isOpen={openDeleteCdc} setIsOpen={setOpenDeleteCdc} itemId={tenderCallId} documentId={documentId} />
        <DeleteAoResponseDialog isOpen={openDeleteAoResponse} setIsOpen={setOpenDeleteAoResponse} itemId={tenderCallId} documentId={documentId} />
        <DeletePvClient isOpen={openDeletePv} setIsOpen={setOpenDeletePv} itemId={tenderCallId} documentId={documentId} />
      
        <AddComment isOpen={commentOpen} setIsOpen={setAddCommentOpen} itemId={itemToComment} items={tenders} />
        <Comments isOpen={showComments} setIsOpen={setShowComments} itemId={selectedItem} items={tenders} />
      
        <TableauComparatif tenderId={selectedTenderForTab} isOpen={isTabOpen} setIsOpen={setIsTabOpen} />
        <EditItemDialog users={users} items={tenders} itemId={selectedItem} productId={itemIdToDelete} isOpen={dialogEditItem} setIsOpen={setDialogEditItem} />
      </Wrapper>
      
      
    );
}

export default TenderNotice;
