import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  useSendVerificationEmailMutation,
  useUpdateUserPasswordMutation,
} from "../../app/api/apiSlice";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/users/userSlice";

function RecoverPasswordDialog({ isOpen, setIsOpen }) {
  const [updateUserPassword, updateUserPasswordResult] =
    useUpdateUserPasswordMutation();
  const [sendVerificationEmail, sendVerificationEmailResult] =
    useSendVerificationEmailMutation();

  const [isDisabled, setIsDisabled] = useState(true);

  const [isEmail, setIsEmail] = useState(true);
  const user = useSelector(selectUser);
  const [open, setOpen] = useState(isOpen);
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmNewPassword: "",
    code: "",
  });
  useEffect(()=>{
    console.log(formData)
  },[formData])
  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  useEffect(() => {
    if (sendVerificationEmailResult.status === "rejected") {
      console.log("error while updating user");
    } else if (sendVerificationEmailResult.status === "fulfilled") {
      console.log("email was sent successfully");
      setIsEmail(false);
    }
  }, [sendVerificationEmailResult]);


   useEffect(() => {
     if (updateUserPasswordResult.status === "rejected") {
       console.log("error while updating password");
     } else if (updateUserPasswordResult.status === "fulfilled") {
       console.log("password updated successfully");
       setIsEmail(false);
       handleClose()
     }
   }, [updateUserPasswordResult]);


  useEffect(() => {
    console.log(formData);

    if (
      formData.email !== "" ||
      (formData.newPassword === formData.confirmNewPassword &&
        formData.code !== "")
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
      email: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setIsEmail(true);
  };
  const handleSave = async () => {
    const update = async () => {
      if (formData.email !== "")
        await sendVerificationEmail({
          email: formData.email,
        });
    if(formData.code!==''){
          await updateUserPassword({
            email:formData.email,
            code: formData.code,
            password:formData.newPassword,

          });
    }
    };

    await update();

    // setOpen(false);
    // setIsOpen(false);
  };

  return (
    <Dialog
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="dialog-title"> Modifier Mot De Pass</DialogTitle>
      <DialogContent>
        {isEmail ? (
          <>
            {" "}
            <TextField
              value={formData.email}
              onChange={handleChange("email")}
              autoFocus
              margin="dense"
              label="Email"
              // type="password"
              fullWidth
            />
          </>
        ) : (
          <>
            <TextField
              value={formData.code}
              onChange={handleChange("code")}
              margin="dense"
              label="Code"
              // type="password"
              fullWidth
            />
            <TextField
              value={formData.newPassword}
              onChange={handleChange("newPassword")}
              margin="dense"
              label="Nouveau Mot De Pass"
              // type="password"
              fullWidth
            />
            <TextField
              value={formData.confirmNewPassword}
              onChange={handleChange("confirmNewPassword")}
              margin="dense"
              label="Confirmer Mot De Pass"
              // type="password"
              fullWidth
            />
          </>
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

export default RecoverPasswordDialog;
