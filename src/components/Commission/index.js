import React, { useEffect, useState } from 'react'
import { BoxHeader, Dashboard, Dashboard1, Dashboard2, Dashboard3, Wrapper } from './styles'
import { Box, Typography, ButtonGroup, Button, Paper, Grid, Stack, TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import { useAddTenderNoticeMutation, useGetTenderNoticeMutation, useGetUsersMutation } from '../../app/api/apiSlice'
import CustomCircularPogress from '../utils/CircularProgress'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { CartesianGrid, Line, LineChart, PieChart, Tooltip, XAxis, YAxis } from 'recharts'
import CustomDialog from '../utils/CustomDialog'
import AddTenderNoticeDialog from '../utils/AddTenderNoticeDialog'
import ListTender from '../Tender/ListTender'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../features/users/userSlice'
import { selectTenders, setTenders } from "../../features/tenders/tender"
function Commission() {
    const dispatch = useDispatch()
    const tenders = useSelector(selectTenders)
    const [getTender, getTenderResult] = useGetTenderNoticeMutation()
    const [currentTanders, setCurrentTenders] = useState([])


    const [isOpen, setIsOpen] = useState(false)
    const [progress, setProgress] = useState(false)
    const [dialogMessage, setDialogMessage] = useState('')
    const [dialogType, setDialogType] = useState('')
    const [users, setUsers] = useState([])
    const user = useSelector(selectUser)





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
                if (tender.status === "analyse de la commission") {
                    // If the condition is met, return the tender
                    return tender;
                }
                // If the condition is not met, return null
                return null;
            }).filter((tender) => tender !== null); // Filter out null values
            console.log(userTenders)
            dispatch(setTenders(userTenders))
            setCurrentTenders(userTenders)


        } else if (getTenderResult.status === 'pending') {
            setProgress(true)

        }


    }, [getTenderResult])




    const [inputText, setInputText] = useState('')
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

    const handleInputChange = (e) => {
        setInputText(e.target.value.toLowerCase());



    };
    return (
        <Wrapper>
           

            <Box margin={'15px'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>

                <TextField label='Search Item' placeholder='Search item' type='text' value={inputText} onChange={handleInputChange} />
            </Box>

            <ListTender users={users} tenders={currentTanders} />






            {progress ? <CustomCircularPogress
            /> : null}
        </Wrapper>
    )
}

export default Commission
