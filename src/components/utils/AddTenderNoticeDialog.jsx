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
} from "@mui/material";
import {
  Link,
  HourglassEmpty as HourglassEmptyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
} from "@mui/icons-material"; // Importing icons

import { useAddTenderNoticeMutation } from "../../app/api/apiSlice";
import CustomCircularPogress from "./CircularProgress";
import CustomDialog from "./CustomDialog";

function AddTenderNoticeDialog({ isOpen, setIsOpen, setTenders, tenders }) {
  const [addTenderNotice, addTenderNoticeResult] = useAddTenderNoticeMutation();

  const [progress, setProgress] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [open, setOpen] = useState(isOpen);

  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("");
  const [formData, setFormData] = useState({
    title: null,
    source: null,
    description: null,
    status: "Pending",
  });

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (
      formData.title &&
      formData.description &&
      formData.source &&
      formData.status
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [formData]);

  useEffect(() => {
    if (addTenderNoticeResult.status === "rejected") {
      setProgress(false);
      setDialogMessage("Failed to add tender notice");
      setDialogType("failed");
      setIsOpen(true);
    } else if (addTenderNoticeResult.status === "fulfilled") {
      setProgress(false);
      setTenders([...tenders, addTenderNoticeResult.data.msg]);
      handleClose();
    } else if (addTenderNoticeResult.status === "pending") {
      setProgress(true);
    }
  }, [addTenderNoticeResult]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addTenderNotice(formData);
  };

  const handleClose = () => {
    setFormData({
      title: null,
      source: null,
      description: null,
      status: "Pending",
    });
    setIsDisabled(true);
    setIsOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="dialog-title">Add Tender Notice</DialogTitle>

      <Box>
        <DialogContent>
          <form>
            <Box
              sx={{ display: "flex", flexDirection: "column", }}
            >
              <TextField
                required
                label={"Title"}
                onChange={handleChange("title")}
                name="title"
                value={formData.title}
              />
              <TextField
                required
                label={"Source"}
                onChange={handleChange("source")}
                name="source"
                value={formData.source}
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
                label={"Mission Head"}
                onChange={handleChange("missionHead")}
                name="missionHead"
                value={formData.missionHead}
              />
              <Select
                required
                label={"Status"}
                onChange={handleChange("status")}
                value={formData.status}
              >
                <MenuItem value={"Pending"}>
                  <ListItemIcon>
                    <HourglassEmptyIcon />
                  </ListItemIcon>
                  Pending
                </MenuItem>
                <MenuItem value={"Open"}>
                  <ListItemIcon>
                    <CheckCircleIcon />
                  </ListItemIcon>
                  Open
                </MenuItem>
                <MenuItem value={"Closed"}>
                  <ListItemIcon>
                    <CloseIcon />
                  </ListItemIcon>
                  Closed
                </MenuItem>
                <MenuItem value={"Cancelled"}>
                  <ListItemIcon>
                    <CancelIcon />
                  </ListItemIcon>
                  Cancelled
                </MenuItem>
              </Select>
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

export default AddTenderNoticeDialog;
