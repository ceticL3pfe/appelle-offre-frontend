import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useDeleteTenderNoticeMutation } from "../../app/api/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectTenders, setTenders } from "../../features/tenders/tender";

function DeleteItemDialog({ isOpen, setIsOpen, productId }) {
  const [open, setOpen] = useState(isOpen);
  const tenders = useSelector(selectTenders);
  const dispatch = useDispatch();
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
      const filteredItems = tenders.filter((item) => item._id !== productId);
      console.log(filteredItems);
      dispatch(setTenders(filteredItems));

      console.log("item have been added successfully");
      setOpen(false);
      setIsOpen(false);
    }
  }, [deleteItemResult]);

  const handleDelete = async () => {
    console.log("productId", productId);
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
