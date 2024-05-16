import React, { useEffect, useState } from 'react'
import { BoxHeader, Dashboard, Dashboard1, Dashboard2, Dashboard3, Wrapper } from './styles'
import { Box, Typography, ButtonGroup, Button, Paper, Grid, Stack, TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import { useAddTenderNoticeMutation, useGetTenderNoticeMutation, useGetUsersMutation } from '../../app/api/apiSlice'
import CustomCircularPogress from '../utils/CircularProgress'

import CustomDialog from '../utils/CustomDialog'
import AddTenderNoticeDialog from '../utils/AddTenderNoticeDialog'
import TenderNotice from '../Tender'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../features/users/userSlice'
import { selectTenders, setTenders } from "../../features/tenders/tender"
import ListTender from '../Tender/ListTender'
function AgentTc() {
    const dispatch = useDispatch()
    const tenders = useSelector(selectTenders)
    const [getTender, getTenderResult] = useGetTenderNoticeMutation()
const [currentTanders,setCurrentTenders] = useState([])
    const [isTOpen, setIsTOpen] = useState(false)

    const [isOpen, setIsOpen] = useState(false)
    const [progress, setProgress] = useState(false)
    const [dialogMessage, setDialogMessage] = useState('')
    const [dialogType, setDialogType] = useState('')
    const [inputText, setInputText] = useState('')
    const [users, setUsers] = useState([])
    const user = useSelector(selectUser)

    
    

    const handleInputChange = (e) => {
        setInputText(e.target.value.toLowerCase());



    };
    useEffect(() => {
        if (inputText !== "") {


            const filteredList = currentTanders.filter((item) =>
                item.object.toLowerCase().includes(inputText)

            );
            setCurrentTenders(filteredList);

        } else {
            if (tenders) {

                

                setCurrentTenders(tenders);
            }
        }
    }, [inputText]);



    useEffect(() => {
        (async () => {
            await getTender()

        })();
    }, []);
    useEffect(() => {

        if (getTenderResult.status === 'rejected') {
            setProgress(false)

            console.log('failed to load users from server')
        } else if (getTenderResult.status === 'fulfilled') {




            setProgress(false)
            const userTenders = getTenderResult.data.msg.map((tender) => {
                // Check if the tender's missionHead matches the user's id
                if (tender.missionHead === user.username || tender.userId === user._id) {
                    // If the condition is met, return the tender
                    return tender;
                }
                // If the condition is not met, return null
                return null;
            }).filter((tender) => tender !== null); // Filter out null values
            console.log(userTenders)
            setCurrentTenders(userTenders)
            dispatch(setTenders(userTenders))
         



        } else if (getTenderResult.status === 'pending') {
            setProgress(true)

        }


    }, [getTenderResult])

    const handleMyTendersClick=()=>{
       const filtredTenders =  tenders.filter(item=>item.missionHead===user.username)
       setCurrentTenders(filtredTenders)
        console.log(filtredTenders)
    }


    const handleAllTendersClick=()=>{
        const filtredTenders = tenders.filter(item => item.userId === user._id && !item.missionHead )
        setCurrentTenders(filtredTenders)
        console.log(filtredTenders)
    }






    return (
        <Wrapper>



            <Stack direction={'row'} width={'100%'} height={'100%'}>
                <Stack margin={'15px'}  width={'15%'} bgcolor={'white'} sx={{ backgroundColor: 'white.main', borderRadius: '10px',  }}>
                    <Box marginTop={'5px'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>

                        <TextField label='Search Item' placeholder='Search item' type='text' value={inputText} onChange={handleInputChange} />
                    </Box>
                    <Box marginTop={'5px'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                        <Button sx={{margin:'5px'}} variant='contained' onClick={()=>{
                            setIsTOpen(true)

                        }}>Ajouter Appel d'offre</Button>
                    </Box>
                    
                    <Box marginTop={'5px'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                        <Button sx={{ margin: '5px', width: '90%' }} onClick={handleMyTendersClick} variant='outlined'>mes missions</Button>
                    </Box>
                   
                    <Box marginTop={'5px'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                        <Button sx={{ margin: '5px' }} onClick={handleAllTendersClick} variant='outlined'>appel d'offre ajouter par moi</Button>
                    </Box>
                   
                </Stack>
                <ListTender users={users} tenders={currentTanders} />


            </Stack>


            <AddTenderNoticeDialog isOpen={isTOpen} setIsOpen={setIsTOpen} />

            {progress ? <CustomCircularPogress
            /> : null}
        </Wrapper>
    )
}

export default AgentTc
