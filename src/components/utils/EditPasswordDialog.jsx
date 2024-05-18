import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  useLogInUserMutation,
  useUpdateUserMutation,
} from "../../app/api/apiSlice";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/users/userSlice";

function EditPasswordDialog({ isOpen, setIsOpen }) {
  const [loginUser, LoginUserResult] = useLogInUserMutation();
  const [updateUser, updateUserResult] = useUpdateUserMutation();
  const [isDisabled, setIsDisabled] = useState(true);
  const userId = sessionStorage.getItem('userId')
  const user = useSelector(selectUser); 
  const [open, setOpen] = useState(isOpen);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

useEffect(() => {
  
    if (updateUserResult.status === "rejected") {
      console.log('error while updating user')
    } else if (updateUserResult.status === "fulfilled") {
      console.log("password updated successfully");
    }
  }
, [updateUserResult]);

  useEffect(() => {
    console.log(formData);

    if (
      formData.confirmNewPassword === formData.newPassword &&
      formData.confirmNewPassword !== "" &&
      formData.newPassword !== "" &&
      formData.password !== ""
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [formData]);
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };
  const handleSave = async () => {
    const update = async () => {
      await updateUser({
        email: user.email,
        username: user.username,
        userId: user._id,
        password: formData.newPassword,
      });
    };
    
   await update();
   

    setOpen(false);
    setIsOpen(false);
  };

  return (
    <Dialog
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="dialog-title" sx={{ textAlign: "center" }} >Modifier mot de passe </DialogTitle>
      <DialogContent>
        <TextField
          value={formData.currentPassword}
          onChange={handleChange("Ancien mot de")}
          autoFocus
          margin="dense"
          label="Mot de passe actuel"
          // type="password"
          fullWidth
        />
        <TextField
          value={formData.newPassword}
          onChange={handleChange("newPassword")}
          margin="dense"
          label="Nouveau mot de passe"
          // type="password"
          fullWidth
        />
        <TextField
          value={formData.confirmNewPassword}
          onChange={handleChange("confirmNewPassword")}
          margin="dense"
          label="Confirmer le nouveau mot de passe"
          // type="password"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button disabled={isDisabled} onClick={handleSave} color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditPasswordDialog;
