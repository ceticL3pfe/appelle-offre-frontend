import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useDeleteCdcMutation, useDeleteUserMutation } from "../../app/api/apiSlice";
import { selectTenders, setTenders } from "../../features/tenders/tender";
import { useDispatch, useSelector } from "react-redux";

function DeleteUserDialog({ isOpen, setIsOpen, itemId, setUsers,users }) {
  const [open, setOpen] = useState(isOpen);

  const [deleteItem, deleteItemResult] = useDeleteUserMutation();

  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
    // setData("");
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (deleteItemResult.status === "rejected") {
      console.log("error while adding item");
    } else if (deleteItemResult.status === "fulfilled") {
      const filteredItems = users.map((tender) => {
        if (tender._id === itemId) {
          // Modify the tender with the updated information
          return null
        }
        return tender;
      }).filter(item=>item!==null);
      console.log(filteredItems);
      setUsers(filteredItems);

      console.log("item have been deleted successfully");
      setOpen(false);
      setIsOpen(false);
    }
  }, [deleteItemResult]);

  const handleDelete = async () => {
    console.log("itemId", itemId);
    await deleteItem({ id:itemId });
  };
  const handleCancel = () => {
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
      <DialogTitle id="dialog-title">Delete User</DialogTitle>
      <DialogContent>
        Are you sure you want to remove the user from the app?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} variant="contained">
          Delete
        </Button>
        <Button onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteUserDialog;
