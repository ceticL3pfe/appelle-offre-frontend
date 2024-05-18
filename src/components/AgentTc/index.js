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
        <Stack direction={'column'} width={'100%'}  >
            <Stack
                margin={'50px'}
                
                bgcolor={'white'}
                sx={{ borderRadius: '10px'}}
                flexDirection={'row'}
                justifyContent={'space-evenly'}
                height={'100px'}
            >
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <Button
                        sx={{ margin: '5px', fontFamily: 'Arial', fontStyle: 'normal', height: '55px' }}
                        variant='contained'
                        onClick={() => {
                            setIsTOpen(true);
                        }}
                    >
                        Ajouter Appel d'offre
                    </Button>
                </Box>
    
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <Button
                        sx={{ margin: '5px', width: '100%', fontFamily: 'Arial', fontStyle: 'normal', height: '55px' }}
                        onClick={handleMyTendersClick}
                        variant='outlined'
                    >
                        mes missions
                    </Button>
                </Box>
    
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <Button
                        sx={{ margin: '5px', fontFamily: 'Arial', fontStyle: 'normal', height: '55px' }}
                        onClick={handleAllTendersClick}
                        variant='outlined'
                    >
                        mes appel d'offres
                    </Button>
                </Box>
    
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <TextField
                        justifyContent={'center'}
                        label='Rechercher un AO'
                        placeholder='Rechercher un AO'
                        type='text'
                        
                        value={inputText}
                        onChange={handleInputChange}
                        sx={{ fontFamily: 'Arial', fontStyle: 'normal', height: '50px', margin: '5px' }}
                    />
                </Box>
            </Stack>
    
            <Box flex={'1'} display="flex" flexDirection="column">
                <ListTender   users={users} tenders={currentTanders} />
            </Box>
        </Stack>
    
        <AddTenderNoticeDialog isOpen={isTOpen} setIsOpen={setIsTOpen} />
    
        {progress ? <CustomCircularPogress /> : null}
    </Wrapper>
    
    )
}

export default AgentTc
