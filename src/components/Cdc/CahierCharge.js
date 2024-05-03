import React, { useEffect, useState } from 'react'
import { useEditCdcMutation } from '../../app/api/apiSlice'
import { Button, TextField, Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
function CahierCharge() {
    const location = useLocation()
    const [editCdc, editCdcResult] = useEditCdcMutation();

    const { id, name, client, deadline, description, commissionComment, controlleurComment } = location.state;
    console.log(controlleurComment,commissionComment,location.state)

    const [inputData, setInputData] = useState(null)
    const [isDisabled, setIsDisabled] = useState(true)


    const user = useSelector(selectUser)
    useEffect(() => {
        if (inputData) {
            setIsDisabled(true)
        } else {
            setIsDisabled(false)
        }
    }, [inputData])



    useEffect(() => {
        if (editCdcResult.status === "rejected") {
            console.log("error while updating item");
        } else if (editCdcResult.status === "fulfilled") {

            // comments.push(inputData);
            setInputData(null)
        }

        console.log("item have updated successfully");

    }, [editCdcResult]);
    return (
        <Box sx={{ width: '100%', display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>




            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant='h1'>{name}</Typography>
                <Typography variant='h3'>{client}</Typography>
                <Typography variant='h3'>{deadline}</Typography>
                <Typography variant='h3'>{description}</Typography>
            </Box>

            {user.role === 'commission' ? <TextField
                label={" Commission Commentaire"}
                value={inputData?.commissionComment}

                placeholder='Entrer votre commentaire'
                onChange={(event) => {
                    console.log(event.currentTarget.value)
                    setInputData({ ["commissionComment"]: commissionComment.concat( event.currentTarget.value) })

                }}


            /> : null}
            {user.role === 'controlleurDeGestion' ? <TextField
                value={inputData?.controlleurComment}

                label={" Controlleur de gestion Commentaire"}
                placeholder='Entrer votre commentaire'
                onChange={(event) => {
                    setInputData({ ["controlleurComment"]: event.target.value })
                }}


            /> : null}
            {user.role === "commission" || user.role === 'controlleurDeGestion' ? <Button disabled={!inputData} onClick={async () => {
                let arr = [];
                if (user.role === "commission") {
                  
                    console.log(inputData.commissionComment)
                    await editCdc({ data: inputData.commissionComment, id })
                } else {
                    await editCdc({ data: [...controlleurComment, inputData], id })

                }
            }}>Ajouter commentaire</Button> : null}

        </Box>
    )
}

export default CahierCharge
