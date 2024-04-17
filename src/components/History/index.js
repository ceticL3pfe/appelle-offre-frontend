import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetSalesMutation, useRemoveSaleMutation } from '../../app/api/apiSlice';
import { Wrapper } from './styles';
import { removeSaleFromStore, removeSalesFromStore, selectSales, setSaleToStore } from '../../features/sales/saleSlice';
import CustomCircularPogress from '../utils/CircularProgress';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import DownloadIcon from '@mui/icons-material/Download';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import html2canvas from 'html2canvas'
// import html2pdf from 'html2pdf'
import jspdf from 'jspdf'
import { Button, Checkbox, IconButton, Stack, Typography } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { theme } from '../theme';
import CustomDialog from '../utils/CustomDialog';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { handleDownloadPDF } from '../../helpers/functions';
function History() {
    const dispatch = useDispatch();
    const [sales, setSales] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [selectedSales, setSelectedSales] = useState([]);

    const [getSales, getSalesResult] = useGetSalesMutation();
    const [removeSales, removeSalesResult] = useRemoveSaleMutation();
    const salesFromStore = useSelector(selectSales);

    useEffect(() => {
        setSales(salesFromStore);
        console.log(salesFromStore)
    }, [salesFromStore]);

    useEffect(() => {
        getSales();
    }, []);

    useEffect(() => {
        if (getSalesResult.status === 'rejected') {
            setMessage('Failed to load sales, please refresh')
            setType('Error')
            setDialogOpen(true)
            setIsOpen(false);
            console.log('Failed to load sales, please refresh');
        } else if (getSalesResult.status === 'fulfilled') {
            setMessage('')
            setType('')
            setDialogOpen(false)
            setIsOpen(false);
            console.log(getSalesResult.data);

            setSales(getSalesResult.data);
            dispatch(setSaleToStore(getSalesResult.data));
        } else if (getSalesResult.status === 'pending') {
            setMessage('')
            setType('')
            setDialogOpen(false)
            setIsOpen(true);
        }
    }, [getSalesResult]);
    useEffect(() => {
        if (removeSalesResult.status === 'rejected') {
            setIsOpen(false);
            setMessage('Failed to remove Sale, please try again')
            setType('Error')
            setDialogOpen(true)
            console.log('eerror')
            // console.log('Failed to remove Sale, please try again');
        } else if (removeSalesResult.status === 'fulfilled') {
            setIsOpen(false);
            setMessage('')
            setType('')
            setDialogOpen(false)
            console.log(removeSalesResult.data);
            setSelectedSales([])

            dispatch(removeSalesFromStore(selectedSales));
        } else if (removeSalesResult.status === 'pending') {
            setMessage('')
            setType('')
            setDialogOpen(false)
            setIsOpen(true);
        }
    }, [removeSalesResult]);

    useEffect(() => {
        if (inputText !== '') {
            const filteredList = salesFromStore.filter((item) =>
                item.saleName.toLowerCase().includes(inputText)
            );
            setSales(filteredList);
        } else {
            if (sales.length > 0) {
                setSales(salesFromStore);
            }
        }
    }, [inputText]);

    // useEffect(() => {
    //     console.log(salesFromStore)
    //     console.log(sales)
    // }, [sales])

    const handleInputChange = (e) => {
        setInputText(e.target.value.toLowerCase());
    };



    useEffect(() => {
        const handleSearch = () => {

            setSales(salesFromStore)

            let filteredSales
            const fromDate = Date.parse(startDate?.toLocaleDateString('en-US'))

            const toDate = Date.parse(endDate?.toLocaleDateString('en-US'))

            if (fromDate && toDate) {

                filteredSales = salesFromStore.filter(sale => {
                    const saleDate = Date.parse(sale.createdAt)
                    console.log('dates: ', saleDate, fromDate, toDate)
                    return saleDate >= fromDate && saleDate <= toDate;
                });

            } else if (fromDate) {
                filteredSales = salesFromStore.filter(sale => {
                    const saleDate = Date.parse(sale.createdAt)
                    console.log('dates: ', fromDate, saleDate)

                    // console.log(saleDate, fromDate, toDate)
                    return saleDate >= fromDate
                });

            } else if (toDate) {
                filteredSales = salesFromStore.filter(sale => {

                    const saleDate = Date.parse(sale.createdAt)
                    console.log('dates: ', saleDate, toDate)
                    console.log(saleDate, fromDate, toDate)
                    return saleDate <= toDate;
                });
            }
            setSales(filteredSales)
        };

        if (startDate || endDate) {
            handleSearch();
        }
    }, [startDate, endDate]);
    const handleStartSelect = (ranges) => {
        setStartDate(ranges);
        // setSales(salesFromStore)

    };
    const handleEndSelect = (ranges) => {
        setEndDate(ranges);

        // setSales(salesFromStore)

    };
    const handleResetDate = () => {
        setSales(salesFromStore)
        setStartDate(null)
        setEndDate(null)

    }

    const handleCheckboxClick = (saleId) => {
        const updatedSelectedSales = [...selectedSales];

        if (updatedSelectedSales.includes(saleId)) {
            // If already selected, remove it
            updatedSelectedSales.splice(updatedSelectedSales.indexOf(saleId), 1);
        } else {
            // If not selected, add it
            updatedSelectedSales.push(saleId);
        }

        setSelectedSales(updatedSelectedSales);
    };
    const renderResetButton = (selectedDate, handleReset) => {
        return (
            selectedDate && (
                <Button onClick={handleReset} variant="text" size="small">
                    X
                </Button>
            )
        );
    };


    const handleDeleteSales = ()=>{
        removeSales({sales:selectedSales})
    }



    const pdfRef = useRef()
    return (
        <Wrapper>

            <Box marginTop={'5px'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                <TextField label="Search Item" placeholder="Search item" type="text" value={inputText} onChange={handleInputChange} />
            </Box>

            <Box
                width={{ xs: "100%", sm: "80%", md: "60%", lg: "50%" }}
                margin="auto"
            >
                <Stack direction={'row'}>
                    <Stack>

                        <IconButton disabled={selectedSales?.length===0} onClick={handleDeleteSales}>                  <DeleteForeverIcon  /></IconButton>    
                    <Button onClick={()=>handleDownloadPDF(startDate,endDate)}><DownloadIcon /> PDF</Button>
</Stack>
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

                    </Typography></Stack>


            </Box>

            <Box>

            </Box>

            <TableContainer ref={pdfRef} sx={{
                flex: '1',

                '&::-webkit-scrollbar': {
                    width: '0.1em',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'transparent',
                },
            }} component={Paper}>
                <Table className={'seles-tab'} stickyHeader={!calendarOpen} sx={{
                    minWidth: 300,

                }} aria-label="simple table">
                    <TableHead >
                        <TableRow >
                            <TableCell align="right"><Typography variant='h6'>Item Name</Typography></TableCell>
                            <TableCell align="right"><Typography color={theme.palette.success.main} variant='h6'>Sell &nbsp;(DA)</Typography></TableCell>
                            <TableCell align="right"><Typography color={theme.palette.error.main} variant='h6'>Buy &nbsp;(DA)</Typography></TableCell>
                            <TableCell align="right"><Typography color={theme.palette.primary.main} variant='h6'>Count </Typography></TableCell>
                            <TableCell align="right"> <Typography variant='h6'>Date</Typography> </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sales?.map((row, index) => (
                            <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: index % 2 === 0 ? theme.palette.grey[300] : theme.palette.grey[500] }}>
                                <TableCell component="th" scope="row">
                                    <Typography fontWeight={'bolder'}>
                                        <Checkbox
                                            checked={selectedSales.includes(row._id)}
                                            onChange={() => handleCheckboxClick(row._id)}
                                        />{row.saleName}</Typography>
                                </TableCell>
                                <TableCell align="right"><Typography fontWeight={'bold'}>{row.price}</Typography></TableCell>
                                <TableCell align="right"><Typography fontWeight={'bold'}>{row.buyPrice}</Typography></TableCell>
                                <TableCell align="right"><Typography fontWeight={'bold'}>{row.count}</Typography></TableCell>
                                <TableCell align="right"><Typography fontWeight={'bold'}>{row.createdAt}</Typography></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {isOpen ? <CustomCircularPogress /> : null}
            <CustomDialog isOpen={dialogOpen} setIsOpen={setDialogOpen} message={message} type={type}/>
        </Wrapper>
    );
}

export default History;
