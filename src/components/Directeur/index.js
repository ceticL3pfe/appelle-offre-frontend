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
import TenderNotice from '../Tender'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../features/users/userSlice'
import { selectTenders, setTenders } from '../../features/tenders/tender'
function Directeur() {


    const dispatch = useDispatch()

    const tenders = useSelector(selectTenders)
    const [currentItems, setCurrentItems] = useState([]);

    const [getUsers, getUsersResult] = useGetUsersMutation()
    const [getTender, getTenderResult] = useGetTenderNoticeMutation()

    const [demandeCdc, setDemandeCdc] = useState(false)

    const [isOpen, setIsOpen] = useState(false)
    const [progress, setProgress] = useState(false)
    const [dialogMessage, setDialogMessage] = useState('')
    const [dialogType, setDialogType] = useState('')
    const [users, setUsers] = useState([])
    const user = useSelector(selectUser)


    useEffect(()=>{
    setCurrentItems(tenders)
    },[tenders])

useEffect(()=>{console.log("tenders",tenders)},[tenders])
    useEffect(() => {

        if (getTenderResult.status === 'rejected') {
            setProgress(false)

            console.log('failed to load users from server')
        } else if (getTenderResult.status === 'fulfilled') {


            setProgress(false)
            dispatch(setTenders(getTenderResult.data.msg))






        } else if (getTenderResult.status === 'pending') {
            setProgress(true)

        }


    }, [getTenderResult])



    useEffect(() => {
        (async () => {
            await getUsers()
            await getTender()

        })();
    }, []);



    useEffect(() => {
        if (getUsersResult.status === 'rejected') {
            setProgress(false)

            console.log('failed to load users from server')
        } else if (getUsersResult.status === 'fulfilled') {
            setProgress(false)

            setUsers(getUsersResult.data.msg)



        } else if (getUsersResult.status === 'pending') {
            setProgress(true)

        }

    }, [getUsersResult])

    useEffect(() => {
        let newTenders=[]
        
        if (demandeCdc) {
         
                newTenders =   tenders.map((tender) => {
                    if (tender.status === "validation retrait cdc") {
                        return tender
                    }
                    return null;
                }).filter(tender => tender !== null);

            }

            

         else {
            newTenders = tenders.map((tender) => {
                if (tender.status === "validation dossier de reponse") {
                    return tender
                }
                return null;
            }).filter(tender => tender !== null);
         
        }


        setCurrentItems(newTenders)

    }, [demandeCdc,tenders])






    return (
        <Wrapper>
            <Box width={'100%'}>
                <Typography variant='h3'>DASHBOARD {user.role}</Typography>
                <BoxHeader direction={'column'} spacing={1}>

                    <ButtonGroup>
                        <Button variant='outlined' onClick={(e) => {
                            
                            setDemandeCdc(true)

                        }}>Demande retrait de Cdc</Button>
                        <Button variant='outlined' onClick={(e) => {
                            setDemandeCdc(false)

                        }}>Demande de validation de dossier de reposne</Button>
                    </ButtonGroup>
                </BoxHeader>


            </Box>



            <TenderNotice users={users} tenders={currentItems}  />






            <AddTenderNoticeDialog isOpen={isOpen} setIsOpen={setIsOpen} />


            {progress ? <CustomCircularPogress
            /> : null}
        </Wrapper>
    )
}

export default Directeur
