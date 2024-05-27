import React, { useEffect, useRef, useState } from 'react'
import { useDeleteTenderNoticeArchive, useDeleteTenderNoticeArchiveMutation, useGetTenderNoticeArchiveMutation } from '../../app/api/apiSlice';
import CustomCircularPogress from '../utils/CircularProgress';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, TextField, Stack } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { handleDownloadPDF } from '../../helpers/functions';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import 'react-datepicker/dist/react-datepicker.css';

import DatePicker from 'react-datepicker';


import { Wrapper } from './styles';
import { Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../../features/users/userSlice';
import TableauComparatif from '../utils/TableauComparatif';
import { selectTenders, setTenders } from '../../features/tenders/tender';
import DeleteItemDialog from '../utils/DeleteItemDialog';

function Archive() {

  const tenders = useSelector(selectTenders)
  const token = useSelector(selectToken)
  const [inputText, setInputText] = useState('')
  const dispatch = useDispatch()
  const [getArchive, getArchiveResult] = useGetTenderNoticeArchiveMutation()
  const [deleteArchive, deleteArchiveResult] = useDeleteTenderNoticeArchiveMutation()

  const [calendarOpen, setCalendarOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false)
  const [selectedTender, setSelectedTender] = useState(null)
  const [endDate, setEndDate] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [isTabOpen, setIsTabOpen] = useState(null)
  const [selectedTenderForTab, setSelectedTenderForTab] = useState('')
  const [progress, setProgress] = useState(false)
  const [archive, setArchive] = useState([])

  useEffect(() => {
    (async () => {
      await getArchive()

    })();
  }, []);


  useEffect(() => {
    if (inputText !== "") {

      const filteredList = tenders.filter((item) =>
        item.object.toLowerCase().includes(inputText)
      );
      console.log(filteredList)
      setArchive(filteredList);
    } else {
      if (tenders) {
        setArchive(tenders);
      }
    }
  }, [inputText]);

  useEffect(() => {
    const handleSearch = () => {

      setArchive(tenders)

      let filtredTenders
      let fromDate = null
      let toDate = null
      console.log(startDate)
      if (startDate)

        fromDate = Date.parse(startDate?.toLocaleDateString('en-US'))
      if (endDate)
        toDate = Date.parse(endDate?.toLocaleDateString('en-US'))

      if (fromDate && toDate) {

        filtredTenders = tenders.filter(item => {
          const tenderDate = Date.parse(item.createdAt)
          console.log('dates: ', tenderDate, fromDate, toDate)
          return tenderDate >= fromDate && tenderDate <= toDate;
        });

      } else if (fromDate) {
        filtredTenders = tenders.filter(item => {
          const tenderDate = Date.parse(item.createdAt)
          console.log('dates: ', fromDate, tenderDate)

          // console.log(tenderDate, fromDate, toDate)
          return tenderDate >= fromDate
        });

      } else if (toDate) {
        filtredTenders = tenders.filter(item => {

          const tenderDate = Date.parse(item.createdAt)
          console.log('dates: ', tenderDate, toDate)
          console.log(tenderDate, fromDate, toDate)
          return tenderDate <= toDate;
        });
      }
      setArchive(filtredTenders)
    };

    if (startDate || endDate) {
      handleSearch();
    }
  }, [startDate, endDate]);

  const handleStartSelect = (ranges) => {
    setStartDate(ranges);
    console.log(ranges)
    // setSales(salesFromStore)

  };
  const handleEndSelect = (ranges) => {
    setEndDate(ranges);

    // setSales(salesFromStore)

  };
  const handleResetDate = () => {
    setArchive(tenders)
    setStartDate(null)
    setEndDate(null)

  }
  const renderResetButton = (selectedDate, handleReset) => {
    return (
      selectedDate && (
        <Button onClick={handleReset} variant="text" size="small">
          X
        </Button>
      )
    );
  };

  const pdfRef = useRef()





  useEffect(() => {

    if (getArchiveResult.status === 'rejected') {
      setProgress(false)

      console.log('failed to load users from server')
    } else if (getArchiveResult.status === 'fulfilled') {




      setProgress(false)
      setArchive(getArchiveResult.data.msg)
      dispatch(setTenders(getArchiveResult.data.msg))



    } else if (getArchiveResult.status === 'pending') {
      setProgress(true)

    }


  }, [getArchiveResult])
  useEffect(() => {
    setArchive(tenders)
  }, [tenders])

  const handleInputChange = (e) => {
    setInputText(e.target.value.toLowerCase());



  };


  return (
    <Wrapper>
      <Box>
        <Typography variant='h3' marginTop={'10px'}style={{ textAlign: 'center' }} >Les archives des AO</Typography>
      </Box>

      <Box marginTop={'10px'} marginBottom={'30px'} display={'flex'} flexDirection={'row'} justifyContent={'space-around'} alignItems={'center'} width={'100%'} >


        <Button onClick={() => handleDownloadPDF(startDate, endDate)} style={{ fontStyle: 'normal' }}>
          <DownloadIcon /> Télécharger en PDF
        </Button>



        <Typography>

          De:<DatePicker
            onCalendarOpen={() => setCalendarOpen(true)}
            onCalendarClose={() => setCalendarOpen(false)}
            // popperPlacement="left-start"
            selected={startDate}
            onChange={handleStartSelect}
            maxDate={endDate}
            style={{ zIndex: 9999 }}

          // range2Placeholder="End Date"
          // showSelectionPreview={true} // Add optional preview
          />
          {renderResetButton(startDate, handleResetDate)}

        </Typography>
        <Typography>
          <Box>
            à:
            <DatePicker
              onCalendarOpen={() => setCalendarOpen(true)}
              onCalendarClose={() => setCalendarOpen(false)}
              minDate={startDate}
              style={{ zIndex: 9999 }}
              // popperPlacement="right-end"
              selected={endDate}
              onChange={handleEndSelect}
            // range2Placeholder="End Date"
            // showSelectionPreview={true} // Add optional preview
            />
            {renderResetButton(endDate, handleResetDate)}
          </Box>
        </Typography>
        <TextField label='Rechercher un AO' placeholder='Rechercher un AO' type='text' value={inputText} onChange={handleInputChange} />
      </Box>
      <TableContainer
        ref={pdfRef}
        component={Paper}
        sx={{
          overflowY: 'scroll',
          height: "400px",
          borderRadius: '15px',
          marginLeft: '86px',
          width: '90%',



        }}
      >        <Table className={'seles-tab'} aria-label="archive table" bgcolor='#f4f6fa' stickyHeader={!calendarOpen} >
          <TableHead  >
            <TableRow>
              <TableCell align="center">supprimer</TableCell>
              <TableCell align="center">Statut</TableCell>
              <TableCell align="center">Commentaire Commission</TableCell>
              <TableCell align="center">Commentaire Controlleur De Gestion</TableCell>
              <TableCell align="center">Commentaire Directeur</TableCell>
              <TableCell align="center">Source</TableCell>
              <TableCell align="center">Object</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">chef de mission</TableCell>
              <TableCell align="center">AO Résponse</TableCell>
              <TableCell align="center">PV Client</TableCell>
              <TableCell align="center">Cahier Charge</TableCell>
              <TableCell align="center">Fourinsseur</TableCell>
              <TableCell align="center">Crée le</TableCell>
              <TableCell align="center">Terminer le</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {archive?.map((item, index) => (
              <TableRow key={index}>
                <TableCell align="center"><IconButton data-id={item._id} onClick={(e) => { setSelectedTender(e.currentTarget.dataset.id); setIsOpen(true) }} > <DeleteIcon /></IconButton></TableCell>

                <TableCell align="center">{item.status}</TableCell>
                <TableCell align="center">{item.commissionComments !== 0 ? item.commissionComments : "---"}</TableCell>
                <TableCell align="center">{item.controlleurDeGestionComments.length !== 0 ? item.controlleurDeGestionComments : "---"}</TableCell>
                <TableCell align="center">{item.directeurComments !== 0 ? item.directeurComments : "---"}</TableCell>
                <TableCell align="center">{item.source}</TableCell>
                <TableCell align="center">{item.object}</TableCell>
                <TableCell align="center">{item.description}</TableCell>
                <TableCell align="center">{item.missionHead ? item.missionHead : '---'}</TableCell>
                <TableCell align="center">{item.aoResponse ? <IconButton
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
                </IconButton> : '---'}</TableCell>
                <TableCell>{item.pvClient ? <IconButton
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
                  : '---'}</TableCell>
                <TableCell>{item.cahierCharge ? <IconButton
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
                </IconButton> : '---'}</TableCell>
                {/* Add more table cells for other fields as needed */}
                <TableCell>{item.selectedFounisseur ? <Button data-item-id={item._id} onClick={(e) => {
                  const itemId = e.currentTarget.dataset.itemId;
                  setSelectedTenderForTab(itemId)
                  setIsTabOpen(true);
                  console.log(isTabOpen)


                }}>
                  Tableau compartif
                </Button> : "---"}</TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(item.updatedAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </TableContainer>
      <TableauComparatif tenders={archive} tenderId={selectedTenderForTab} isOpen={isTabOpen} setIsOpen={setIsTabOpen} />

      {progress ? <CustomCircularPogress
      /> : null}

      <DeleteItemDialog isOpen={isOpen} setIsOpen={setIsOpen} productId={selectedTender} />
    </Wrapper>
  );





}

export default Archive
