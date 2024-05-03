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

import {
  useAddAoReponseMutation,
  useAddPvClientMutation,
} from "../../app/api/apiSlice";
import CustomCircularPogress from "./CircularProgress";
import CustomDialog from "./CustomDialog";
import { useDispatch } from "react-redux";
import { setTenders } from "../../features/tenders/tender";

function AddPvClient({ isOpen, setIsOpen, tenderId, }) {
  const dispatch = useDispatch()


  const [addCdc, addCdcResult] = useAddPvClientMutation();

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
        dispatch(setTenders((prevTenders) => {
        return prevTenders.map((tender) => {
          if (tender._id === tenderId) {
            return addCdcResult.data.msg;
          }
          return tender;
        });
      }));

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
      <DialogTitle id="dialog-title">Ajouter Pv Client</DialogTitle>

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

export default AddPvClient;
