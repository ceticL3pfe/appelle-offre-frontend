import React, { useEffect, useState } from 'react'
import { useGetTenderNoticeArchiveMutation } from '../../app/api/apiSlice';
import CustomCircularPogress from '../utils/CircularProgress';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Dialog } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import { Wrapper } from './styles';
import { Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../../features/users/userSlice';
import TableauComparatif from '../utils/TableauComparatif';
import { selectTenders, setTenders } from '../../features/tenders/tender';

function Archive() {

const tenders = useSelector(selectTenders)
  const token = useSelector(selectToken)
const dispatch = useDispatch()
  const [getArchive, getArchiveResult] = useGetTenderNoticeArchiveMutation()

  const [isOpen, setIsOpen] = useState(false)
  const [isTabOpen, setIsTabOpen] = useState(false)
  const [selectedTenderForTab, setSelectedTenderForTab] = useState('')
  const [progress, setProgress] = useState(false)
  const [archive, setArchive] = useState([])

  useEffect(() => {
    (async () => {
      await getArchive()

    })();
  }, []);




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
  return (
    <Wrapper>
      <TableContainer component={Paper}>
        <Table aria-label="archive table">
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Commission Comments</TableCell>
              <TableCell>Controlleur De Gestion Comments</TableCell>
              <TableCell>Directeur Comments</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Object</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Mission Head</TableCell>
              <TableCell>AO Response</TableCell>
              <TableCell>PV Client</TableCell>
              <TableCell>Cahier Charge</TableCell>
              <TableCell>Fourinsseur</TableCell>

              {/* Add more table headers for other fields as needed */}
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
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
                <TableCell>{item.selectedFounisseur? <Button data-item-id={item._id} onClick={(e) => {
                  const itemId = e.currentTarget.dataset.itemId;
                  setSelectedTenderForTab(itemId)
                  setIsTabOpen(true);
                  console.log(isTabOpen)


                }}>
                  Tableau compartif
                </Button>:"---"}</TableCell>
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
