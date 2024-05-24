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
import { Alert, CircularProgress } from "@mui/material";
import { Check } from "@mui/icons-material";

function RecoverPasswordDialog({ isOpen, setIsOpen }) {
  const [updateUserPassword, updateUserPasswordResult] =
    useUpdateUserPasswordMutation();
  const [sendVerificationEmail, sendVerificationEmailResult] =
    useSendVerificationEmailMutation();

  const [isDisabled, setIsDisabled] = useState(true);

  const [isEmail, setIsEmail] = useState(true);
  const [isFailed, setIsFailed] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [isPending, setIsPending] = useState(false);
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
      setIsPending(false)
      console.log("email was not sent correctly ");
    } else if (sendVerificationEmailResult.status === "fulfilled") {
                setIsPending(false);
      console.log("email was sent successfully");
      setIsEmail(false);
    }else if (sendVerificationEmailResult.status === "pending") {
      setIsPending(true);
    }
  }, [sendVerificationEmailResult]);


   useEffect(() => {
     if (updateUserPasswordResult.status === "rejected") {
            setIsPending(false);

      setOpenAlert(true);
      setIsFailed(true);
       console.log("error while updating password");
     } else if (updateUserPasswordResult.status === "fulfilled") {
            setIsPending(false);

        setOpenAlert(true);

        setIsFailed(false);
       console.log("password updated successfully");
       setIsEmail(false);
       handleClose()
     }else if (updateUserPasswordResult.status === "pending") {
       setIsPending(true);
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
    <>
      {" "}
      <Dialog
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="dialog-title"> Modifier Mot De Passe</DialogTitle>
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
          <Button onClick={handleClose}>Annuler</Button>
          <Button disabled={isDisabled} onClick={handleSave} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
      {openAlert && (
        <Alert
        onClose={()=>{setOpenAlert(false)}}
          sx={{
            position: "absolute",
            top: "80%",

            zIndex: "3",
          }}
          variant={"filled"}
          severity={!isFailed ? "success" : "error"}
          icon={<Check fontSize="inherit" />}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                setOpenAlert(false);
              }}
            >
              UNDO
            </Button>
          }
        >
          {isFailed ? (
            <>Error , le code que vous avez introduit est incorrecte</>
          ) : (
            <> votre mot de passe a etais modifier correctement.</>
          )}
        </Alert>
      )}
      {isPending?<CircularProgress sx={{position:'absolute'}}/>:null}
    </>
  );
}

export default RecoverPasswordDialog;
