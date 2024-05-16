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
  Stack,
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
import { useDispatch, useSelector } from "react-redux";
import { selectTenders, setTenders } from "../../features/tenders/tender";
import { selectUser } from "../../features/users/userSlice";

function AddTenderNoticeDialog({ isOpen, setIsOpen, }) {
  const user = useSelector(selectUser)
  const tenders = useSelector(selectTenders)
  const dispatch = useDispatch()
  const [addTenderNotice, addTenderNoticeResult] = useAddTenderNoticeMutation();

  const [progress, setProgress] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [open, setOpen] = useState(isOpen);

  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("");
  const [formData, setFormData] = useState({
    object: null,
    source: null,
    description: null,
    userId: user?._id,
    username:user.username
  });

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (
      formData.object &&
      formData.description &&
      formData.source     ) {
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
        dispatch(setTenders([...tenders, addTenderNoticeResult.data.msg]));
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
    console.log(formData)
    await addTenderNotice(formData,);
  };

  const handleClose = () => {
    setFormData({
      object: null,
      source: null,
      description: null,
      userId: user?._id,
      username: user.username,
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
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TextField
                required
                label={"object"}
                onChange={handleChange("object")}
                name="object"
                value={formData.object}
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
              <Stack direction={"row"}>
                <TextField
                  label={"fournisseur 1"}
                  onChange={handleChange("fournisseur_1")}
                  name="fournisseur_1"
                  value={formData.fournisseur_1}
                />
                <TextField
                  label={"prix"}
                  onChange={handleChange("prix_fournisseur_1")}
                  name="prix_fournisseur_1"
                  value={formData.prix_fournisseur_1}
                />
                <TextField
                  label={"durée"}
                  onChange={handleChange("durée_fournisseur_1")}
                  name="durée_fournisseur_1"
                  value={formData.durée_fournisseur_1}
                />
              </Stack>
              <Stack direction={"row"}>
                <TextField
                  label={"fournisseur 2"}
                  onChange={handleChange("fournisseur_2")}
                  name="fournisseur_2"
                  value={formData.fournisseur_2}
                />
                <TextField
                  label={"prix"}
                  onChange={handleChange("prix_fournisseur_2")}
                  name="prix_fournisseur_2"
                  value={formData.prix_fournisseur_2}
                />
                <TextField
                  label={"durée"}
                  onChange={handleChange("durée_fournisseur_2")}
                  name="durée_fournisseur_2"
                  value={formData.durée_fournisseur_2}
                />
              </Stack>
              <Stack direction={"row"}>
                <TextField
                  label={"fournisseur 3"}
                  onChange={handleChange("fournisseur_3")}
                  name="fournisseur_3"
                  value={formData.fournisseur_3}
                />
                <TextField
                  label={"prix"}
                  onChange={handleChange("prix_fournisseur_3")}
                  name="prix_fournisseur_3"
                  value={formData.prix_fournisseur_3}
                />
                <TextField
                  label={"durée"}
                  onChange={handleChange("durée_fournisseur_3")}
                  name="durée_fournisseur_3"
                  value={formData.durée_fournisseur_3}
                />
              </Stack>
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
