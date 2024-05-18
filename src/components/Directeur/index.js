import React, { useEffect, useState } from 'react';
import { Wrapper } from './styles';
import { Button, Stack, TextField } from '@mui/material';
import CustomCircularPogress from '../utils/CircularProgress';
import ListTender from '../Tender/ListTender';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import { selectTenders, setTenders } from '../../features/tenders/tender';
import { useGetTenderNoticeMutation, useGetUsersMutation } from '../../app/api/apiSlice';

function Directeur() {
    const dispatch = useDispatch();
    const tenders = useSelector(selectTenders);
    const [currentItems, setCurrentItems] = useState([]);
    const [getUsers, getUsersResult] = useGetUsersMutation();
    const [getTender, getTenderResult] = useGetTenderNoticeMutation();
    const [inputText, setInputText] = useState('');
    const [demandeCdc, setDemandeCdc] = useState(false);
    const [ToutAo, setToutAo] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [progress, setProgress] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setCurrentItems(tenders.filter(tender => {
            if (demandeCdc) {
                return tender.status === "validation de retrait de cdc";
            } else if (!ToutAo) {
                return tender.status === "validation de directeur";
            } else {
                return true;
            }
        }));
    }, [demandeCdc, ToutAo, tenders]);

    useEffect(() => {
        if (inputText !== "") {
            const filteredList = currentItems.filter(item => item.object.toLowerCase().includes(inputText));
            setCurrentItems(filteredList);
        } else {
            setCurrentItems(tenders);
        }
    }, [inputText, tenders]);

    useEffect(() => {
        const fetchTenderData = async () => {
            await getUsers();
            await getTender();
        };
        fetchTenderData();
    }, []);

    useEffect(() => {
        if (getTenderResult.status === 'rejected') {
            setProgress(false);
            console.log('failed to load users from server');
        } else if (getTenderResult.status === 'fulfilled') {
            setProgress(false);
            dispatch(setTenders(getTenderResult.data.msg));
        } else if (getTenderResult.status === 'pending') {
            setProgress(true);
        }
    }, [getTenderResult, dispatch]);

    useEffect(() => {
        if (getUsersResult.status === 'rejected') {
            setProgress(false);
            console.log('failed to load users from server');
        } else if (getUsersResult.status === 'fulfilled') {
            setProgress(false);
            setUsers(getUsersResult.data.msg);
        } else if (getUsersResult.status === 'pending') {
            setProgress(true);
        }
    }, [getUsersResult]);

    const handleInputChange = (e) => {
        setInputText(e.target.value.toLowerCase());
    };

    return (
        <Wrapper>
            <Stack direction={'column'} width={'100%'} height={'100%'}>
                <Stack
                    margin={'50px'}
                    bgcolor={'white'}
                    sx={{ borderRadius: '10px'}}
                    flexDirection={'row'}
                    justifyContent={'space-evenly'}
                    height={'100px'}
                >
                    <Button
                        sx={{ margin: '5px', fontFamily: 'Arial', fontStyle: 'normal', height: '55px' }}
                        variant={ToutAo ? 'contained' : 'outlined'}
                        onClick={(e) => {
                            setDemandeCdc(false);
                            setToutAo(true);
                        }}
                    >
                        Tous les appels d'offres
                    </Button>

                    <Button 
                        sx={{ margin: '5px', fontFamily: 'Arial', fontStyle: 'normal', height: '55px' }}
                        variant={demandeCdc ? 'contained' : 'outlined'}
                        onClick={(e) => {
                            setDemandeCdc(true);
                            setToutAo(false);
                        }}
                    >
                        Demande retrait de Cdc
                    </Button>

                    <Button 
                        sx={{ margin: '5px', fontFamily: 'Arial', fontStyle: 'normal', height: '55px' }}
                        variant={(!demandeCdc && !ToutAo) ? 'contained' : 'outlined'}
                        onClick={(e) => {
                            setDemandeCdc(false);
                            setToutAo(false);
                        }}
                    >
                        Demande de validation de dossier de réponse
                    </Button>
                    
                    <TextField
                        label='Rechercher un AO'
                        placeholder='Rechercher un AO'
                        type='text'
                        value={inputText}
                        onChange={handleInputChange}
                        sx={{ fontFamily: 'Arial', fontStyle: 'normal', height: '70px', margin: '5px' }}
                    />
                </Stack>
                <ListTender users={users} tenders={currentItems} />
            </Stack>
            {progress ? <CustomCircularPogress /> : null}
        </Wrapper>
    );
}

export default Directeur;
