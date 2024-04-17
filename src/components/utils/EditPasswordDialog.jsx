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
   if (LoginUserResult.status === "rejected") {
     console.log("wrong password");
   }
   const update = async () => {
    await updateUser({
      email: user.email,
      username: user.username,
      userId: user._id,
      password:formData.newPassword
    });
  };

  if (LoginUserResult.status === "fulfilled") {
    update();
  }
  
 }, [LoginUserResult]);
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
    
    await loginUser({ email: user?.email, password: formData.currentPassword })
   

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
      <DialogTitle id="dialog-title">Edit Password</DialogTitle>
      <DialogContent>
        <TextField
          value={formData.currentPassword}
          onChange={handleChange("currentPassword")}
          autoFocus
          margin="dense"
          label="Current Password"
          // type="password"
          fullWidth
        />
        <TextField
          value={formData.newPassword}
          onChange={handleChange("newPassword")}
          margin="dense"
          label="New Password"
          // type="password"
          fullWidth
        />
        <TextField
          value={formData.confirmNewPassword}
          onChange={handleChange("confirmNewPassword")}
          margin="dense"
          label="Confirm New Password"
          // type="password"
          fullWidth
        />
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

export default EditPasswordDialog;
