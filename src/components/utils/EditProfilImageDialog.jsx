import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Input,
} from "@mui/material";
import { useUpdateUserMutation } from "../../app/api/apiSlice";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/users/userSlice";
import { convertFileToBase64 } from "../../helpers/functions";

function EditProfilImageDialog({ isOpen, setIsOpen }) {
  const userId = sessionStorage.getItem('userId')
  const user = useSelector(selectUser);
  const [open, setOpen] = useState(isOpen);
  const [updateUser, updateUserResult] = useUpdateUserMutation();
  const [isDisabled, setIsDisabled] = useState(true);

  // const [data, setData] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
    // setData("");
    setSelectedImage(null);
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (updateUserResult.status === "rejected") {
      console.log("error while updating user");
    } else if (updateUserResult.status === "fulfilled") {
      console.log("user has been updated successfully");
    }
  }, [updateUserResult]);

  const handleSave = async () => {

    await updateUser({
      userId: user._id,
      image:  selectedImage,
    }); setOpen(false);
    setIsOpen(false);
  
}
   
  

  return (
    <Dialog
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="dialog-title">Edit Profile</DialogTitle>
      <DialogContent>
        {/* <TextField
          onChange={(e) => {
            setData(e.target.value);
            setIsDisabled(false);
          }}
          autoFocus
          margin="dense"
          label="Username"
          type="text"
          fullWidth
        /> */}
        <Input
          type="file"
          onChange={(e) => {
            setIsDisabled(false);
           convertFileToBase64(e,setSelectedImage)
// console.log(selectedImage)
         
          }}
        />
        {selectedImage !== "" && selectedImage !== null ? (
          <img alt="image" src={selectedImage} />
        ) : (
          <></>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={isDisabled} onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditProfilImageDialog;
