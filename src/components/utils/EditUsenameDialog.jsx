import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useUpdateUserMutation } from "../../app/api/apiSlice";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/users/userSlice";

function EditUsenameDialog({ isOpen, setIsOpen }) {
// const userId = sessionStorage.getItem('userId')
  const user = useSelector(selectUser); 
  const [open, setOpen] = useState(isOpen);
  const [updateUser, updateUserResult] = useUpdateUserMutation();
  const [isDisabled, setIsDisabled] = useState(true);

  const [data, setData] = useState("");
  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
    setData("");
  };
    useEffect(() => {
      console.log(data);
    }, [data]);
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
    console.log(data)
    await updateUser({ userId: user._id, username: data });
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
      <DialogTitle id="dialog-title">Edit Username</DialogTitle>
      <DialogContent>
        <TextField
          onChange={(e) => {
            
                setData(e.target.value)
              setIsDisabled(false);
            
          }}
          //   value={formData.currentPassword}
          //   onChange={handleChange("currentPassword")}
          autoFocus
          margin="dense"
          label="Username"
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

export default EditUsenameDialog;
