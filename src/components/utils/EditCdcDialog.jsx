import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  ListItemIcon,
} from "@mui/material";

import {
  HourglassEmpty as HourglassEmptyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import { useEditCdcMutation } from "../../app/api/apiSlice";
import { useDispatch } from "react-redux";

function EditCdcDialog({ isOpen, setIsOpen, setItems, itemId, items }) {
  const [open, setOpen] = useState(isOpen);
  const [isDisabled, setIsDisabled] = useState(true);

  const [updateItem, updateItemResult] = useEditCdcMutation();
  const [item, setItem] = useState(null);
  const [data, setData] = useState({
    name: null,
    client: null,
    deadLine: null,
    description: null,
  });
  const dispatch = useDispatch();
  const handleClose = () => {
    setData({
      name: null,
      client: null,
      deadLine: null,
      description: null,
    });
    setIsDisabled(true);
    setOpen(false);
    setIsOpen(false);
    // setData("");
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const arr = items.filter((element) => element._id === itemId);
    setItem(arr[0]);
  }, [isOpen]);

  useEffect(() => {
    if (updateItemResult.status === "rejected") {
      console.log("error while updating item");
    } else if (updateItemResult.status === "fulfilled") {
      console.log(updateItemResult.data);
      const filteredItems = items?.map((item) => {
        if (item._id !== updateItemResult.data.msg._id) {
          return item;
        } else {
          return updateItemResult.data.msg;
        }
      });
      console.log("filtred ite;s", filteredItems);
      setItems(filteredItems);
    }

    console.log("item have updated successfully");

    handleClose();
  }, [updateItemResult]);

  const handleSave = async () => {
    console.log("data,id", data, item._id);
    await updateItem({ data, id: item._id });
  };

  const handleChange = (field) => (event) => {
    setData({
      ...data,
      [field]: event.target.value,
    });
    //   console.log(...data)
  };

  return (
    <Dialog
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="dialog-title">Edit Item</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ marginTop: "5px" }}
          type="text"
          label="Name"
          defaultValue={item?.name}
          onChange={(e) => {
            if (e.currentTarget.value.length > 0) {
              setIsDisabled(false);

              handleChange("name")(e);
            } else {
              e.target.value = "";
              setIsDisabled(true);
            }
          }}
        />
        <TextField
          sx={{ marginTop: "5px" }}
          type="text"
          label="Client"
          defaultValue={item?.client}
          onChange={(e) => {
            if (e.currentTarget.value !== "") {
              setIsDisabled(false);

              handleChange("client")(e);
            } else {
              setIsDisabled(true);
            }
          }}
        />
        <TextField
          sx={{ marginTop: "5px" }}
          type="text"
          label="deadLine"
          defaultValue={item?.deadLine}
          onChange={(e) => {
            if (e.currentTarget.value !== "") {
              setIsDisabled(false);

              handleChange("deadLine")(e);
            } else {
              setIsDisabled(true);
            }
          }}
        />
        <TextField
          sx={{ marginTop: "5px" }}
          type="text"
          label="DESCRIPTION"
          defaultValue={item?.description}
          onChange={(e) => {
            if (e.currentTarget.value !== "") {
              setIsDisabled(false);

              handleChange("description")(e);
            } else {
              setIsDisabled(true);
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={isDisabled}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditCdcDialog;
