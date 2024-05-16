import React, { useEffect, useRef, useState } from 'react'
import { useGetTenderNoticeArchiveMutation } from '../../app/api/apiSlice';
import CustomCircularPogress from '../utils/CircularProgress';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Dialog, TextField, Stack } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { handleDownloadPDF } from '../../helpers/functions';
import DownloadIcon from '@mui/icons-material/Download';


import DatePicker from 'react-datepicker';


import { Wrapper } from './styles';
import { Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../../features/users/userSlice';
import TableauComparatif from '../utils/TableauComparatif';
import { selectTenders, setTenders } from '../../features/tenders/tender';

function Archive() {

  const tenders = useSelector(selectTenders)
  const token = useSelector(selectToken)
  const [inputText, setInputText] = useState('')
  const dispatch = useDispatch()
  const [getArchive, getArchiveResult] = useGetTenderNoticeArchiveMutation()
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false)
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
      let fromDate=null
      let toDate=null
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
    console.log(archive)
  }, [archive])

  const handleInputChange = (e) => {
    setInputText(e.target.value.toLowerCase());



  };
  return (
    <Wrapper>
      <Box marginTop={'5px'} display={'flex'} flexDirection={'row'} justifyContent={'space-around'} alignItems={'center'} width={'100%'} >
        
          <TextField label='Search Item' placeholder='Search item' type='text' value={inputText} onChange={handleInputChange} />
          <Button onClick={() => handleDownloadPDF(startDate, endDate)}><DownloadIcon /> PDF</Button>
          <Typography>
            From:
            <DatePicker
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
            To:
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

          </Typography>
      </Box>
      <TableContainer
        ref={pdfRef}
        component={Paper}
        sx={{
          overflowY: 'scroll',
          height: "90%",
          borderRadius: '15px',
          margin: '14px',
          width: '98%',
          '&::-webkit-scrollbar': {
            width: '12px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >        <Table className={'seles-tab'} aria-label="archive table">
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Commission Comments</TableCell>
              <TableCell>Controlleur De Gestion Comments</TableCell>
              <TableCell>Directeur Comments</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Object</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>chef de mission</TableCell>
              <TableCell>AO Response</TableCell>
              <TableCell>PV Client</TableCell>
              <TableCell>Cahier Charge</TableCell>
              <TableCell>Fourinsseur</TableCell>

              {/* Add more table headers for other fields as needed */}
              <TableCell>Crée le</TableCell>
              <TableCell>Terminer le</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {archive?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.commissionComments !== 0 ? item.commissionComments : "---"}</TableCell>
                <TableCell>{item.controlleurDeGestionComments.length !== 0 ? item.controlleurDeGestionComments : "---"}</TableCell>
                <TableCell>{item.directeurComments !== 0 ? item.directeurComments : "---"}</TableCell>
                <TableCell>{item.source}</TableCell>
                <TableCell>{item.object}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.missionHead ? item.missionHead : '---'}</TableCell>
                <TableCell>{item.aoResponse ? <IconButton
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
    </Wrapper>
  );





}

export default Archive
