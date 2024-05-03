import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useDeleteAoReponseMutation,  } from "../../app/api/apiSlice";
import { useDispatch } from "react-redux";
import { setTenders } from "../../features/tenders/tender";

function DeleteAoResponseDialog({ isOpen, setIsOpen, itemId, documentId, }) {
    const dispatch = useDispatch();

  const [open, setOpen] = useState(isOpen);

  const [deleteItem, deleteItemResult] = useDeleteAoReponseMutation();

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


        dispatch(setTenders((prevTenders) => {
        return prevTenders.map((tender) => {
          if (tender._id === itemId) {
            // Modify the tender with the updated information
            return {
              ...tender,
              // Assuming you have a field like 'hasPvClient', you can set it to true
              aoResponse: null,
              // You can modify other fields as needed
            };
          }
          return tender;
        });
      }));
      console.log("item have been deleted successfully");
      setOpen(false);
      setIsOpen(false);
    }
  }, [deleteItemResult]);

  const handleDelete = async () => {
    console.log("itemId", itemId,documentId);
    await deleteItem({ itemId, documentId });
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
      <DialogTitle id="dialog-title">Delete Dossier de reponse</DialogTitle>
      <DialogContent>
        Are you sure you want to remove the Dossier de reponse from the app?
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

export default DeleteAoResponseDialog;
