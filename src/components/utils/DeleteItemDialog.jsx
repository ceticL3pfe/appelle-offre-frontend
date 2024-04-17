import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {  useDeleteTenderNoticeMutation } from "../../app/api/apiSlice";


function DeleteItemDialog({ setItems, isOpen, setIsOpen, productId }) {
  const [open, setOpen] = useState(isOpen);

  const [deleteItem, deleteItemResult] = useDeleteTenderNoticeMutation();

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


      setItems(prev=>{
      const arr =  prev.filter(item=>item._id!==productId)
      return arr
      })
      console.log("item have been added successfully");
      setOpen(false);
      setIsOpen(false);
    }
  }, [deleteItemResult]);

  const handleDelete = async () => {
    console.log("productId",productId)
    await deleteItem(productId);
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
      <DialogTitle id="dialog-title">Delete Item</DialogTitle>
      <DialogContent>
        Are you sure you want to remove the item from the app?
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

export default DeleteItemDialog;
