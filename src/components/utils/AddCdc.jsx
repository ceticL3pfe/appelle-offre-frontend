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

import { useAddCdcMutation } from "../../app/api/apiSlice";
import CustomCircularPogress from "./CircularProgress";
import CustomDialog from "./CustomDialog";

function AddCdc({ isOpen, setIsOpen, setCdcs, cdcs }) {
  const [addCdc, addCdcResult] = useAddCdcMutation();

  const [progress, setProgress] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [open, setOpen] = useState(isOpen);

  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("");
  const [formData, setFormData] = useState({
    name: null,
    deadLine: null,
    description: null,
    client: null,
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
      formData.name &&
      formData.description &&
      formData.deadLine &&
      formData.client &&
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
      setProgress(false);
      setCdcs([...cdcs, addCdcResult.data.msg]);
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
    await addCdc(formData);
  };

  const handleClose = () => {
    setFormData({
      name: null,
      deadLine: null,
      description: null,
      client: null,
      file: null, // Reset file field
    });
    setIsDisabled(true);
    setIsOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="dialog-title">Add CDC</DialogTitle>

      <Box>
        <DialogContent>
          <form encType="multipart/form-data">
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TextField
                required
                label={"name"}
                onChange={handleChange("name")}
                name="name"
                value={formData.name}
              />
              <TextField
                required
                label={"dead Line"}
                onChange={handleChange("deadLine")}
                name="deadLine"
                value={formData.deadLine}
              />
              <TextField
                required
                label={"Description"}
                onChange={handleChange("description")}
                name="description"
                value={formData.description}
              />
              <TextField
                required
                label={"client"}
                onChange={handleChange("client")}
                name="client"
                value={formData.client}
              />
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

export default AddCdc;
