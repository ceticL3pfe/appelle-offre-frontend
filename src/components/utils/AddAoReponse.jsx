import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  ListItemIcon,
  InputBase,
  Input,
} from "@mui/material";
import {
  Link,
  HourglassEmpty as HourglassEmptyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
} from "@mui/icons-material"; // Importing icons

import { useAddAoReponseMutation } from "../../app/api/apiSlice";
import CustomCircularPogress from "./CircularProgress";
import CustomDialog from "./CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import { selectTenders, setTenders } from "../../features/tenders/tender";

function AddAoReponse({ isOpen, setIsOpen, tenderId }) {
  const dispatch = useDispatch()
  const tenders = useSelector(selectTenders)


  const [addCdc, addCdcResult] = useAddAoReponseMutation();

  const [progress, setProgress] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [open, setOpen] = useState(isOpen);

  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("");
  const [formData, setFormData] = useState({
    file: null, // New file field
  });

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    if (
      formData.file // Check file field
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [formData]);

  useEffect(() => {
    if (addCdcResult.status === "rejected") {
      setProgress(false);
      setDialogMessage("Failed to add tender notice");
      setDialogType("failed");
      setIsOpen(true);
    } else if (addCdcResult.status === "fulfilled") {
        
             const  filteredItems = tenders.map((tender) => {
                if (tender._id === tenderId) {
                  return addCdcResult.data.msg;
                }
                return tender;
              });
        dispatch(setTenders(filteredItems))
      
      setProgress(false);
      handleClose();
    } else if (addCdcResult.status === "pending") {
      setProgress(true);
    }
  }, [addCdcResult]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      file: event.target.files[0], // Save the selected file
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addCdc({ tenderId, data: formData });
  };

  const handleClose = () => {
    setFormData({
      file: null, // Reset file field
    });
    setIsDisabled(true);
    setIsOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="dialog-title">Ajouter Dossier De Reponse</DialogTitle>

      <Box>
        <DialogContent>
          <form encType="multipart/form-data">
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Input
                type="file"
                onChange={handleFileChange}
                name="file"
                required
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isDisabled}>
            Save
          </Button>
        </DialogActions>

        {progress ? <CustomCircularPogress /> : null}
      </Box>
    </Dialog>
  );
}

export default AddAoReponse;
