import React, { useEffect, useState } from 'react'
import { BoxHeader, Dashboard, Dashboard1, Dashboard2, Dashboard3, Wrapper } from './styles'
import { Box, Typography, ButtonGroup, Button, Paper, Grid, Stack, TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import { useAddTenderNoticeMutation} from '../../app/api/apiSlice'
import CustomCircularPogress from '../utils/CircularProgress'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { CartesianGrid, Line, LineChart, PieChart, Tooltip, XAxis, YAxis } from 'recharts'
import CustomDialog from '../utils/CustomDialog'
import AddTenderNoticeDialog from '../utils/AddTenderNoticeDialog'
import TenderNotice from '../tenderNotice'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/users/userSlice'
function Main() {


    const [isOpen, setIsOpen] = useState(false)
    const [progress, setProgress] = useState(false)
    const [dialogMessage, setDialogMessage] = useState('')
    const [dialogType, setDialogType] = useState('')
    const [tenders, setTenders] = useState([])
const user = useSelector(selectUser)







    return (
        <Wrapper>
            <Box width={'100%'}>
                <Typography variant='h3'>DASHBOARD</Typography>
                <BoxHeader direction={'column'} spacing={1}>

                    <Box >
                        <Link to={"/admin"}>Admin panel</Link>
                    </Box>
                </BoxHeader>

              {  user.role==='agentTc'?(<Button variant='contained' color='success' onClick={() => setIsOpen(true)
                }>Add Tender Notice</Button>):null}

            </Box>



            <TenderNotice tenders={tenders} setTenders={setTenders}/>
            



            <AddTenderNoticeDialog isOpen={isOpen} setIsOpen={setIsOpen} setTenders={setTenders} tenders={tenders}/>


            {progress ? <CustomCircularPogress
            /> : null}
        </Wrapper>
    )
}

export default Main
