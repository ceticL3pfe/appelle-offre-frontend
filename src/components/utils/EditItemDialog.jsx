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

import { useEditTenderNoticeMutation } from "../../app/api/apiSlice";
import { useDispatch } from "react-redux";
import { setProduct } from "../../features/products/productSlice";

function EditItemDialog({ isOpen, setIsOpen, setItems, itemId, items }) {
  const [open, setOpen] = useState(isOpen);
  const [isDisabled, setIsDisabled] = useState(true);

  const [updateItem, updateItemResult] = useEditTenderNoticeMutation();
  const [item, setItem] = useState(null);
  const [data, setData] = useState({
    title: null,
    source: null,
    description: null,
    status: null,
    missionHead:null
  });
  const dispatch = useDispatch();
  const handleClose = () => {
    setData({
      title: null,
      source: null,
      description: null,
      status: null,
      missionHead: null,
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
      console.log("filtred ite;s",filteredItems)
      setItems(filteredItems);
    }

    console.log("item have updated successfully");

    handleClose();
  }, [updateItemResult]);

  const handleSave = async () => {
    console.log("data,id",data,item._id)
    await updateItem(
      {data,
     id: item._id}
    );
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
          label="TITLE"
          defaultValue={item?.title}
          onChange={(e) => {
            if (e.currentTarget.value.length > 0) {
              setIsDisabled(false);

              handleChange("title")(e);
            } else {
              e.target.value = "";
              setIsDisabled(true);
            }
          }}
        />
        <TextField
          sx={{ marginTop: "5px" }}
          type="text"
          label="SOURCE"
          defaultValue={item?.source}
          onChange={(e) => {
            if (e.currentTarget.value !== "") {
              setIsDisabled(false);

              handleChange("source")(e);
            } else {
              setIsDisabled(true);
            }
          }}
        />
        <TextField
          sx={{ marginTop: "5px" }}
          type="text"
          label="DESCRIPTION"
          defaultValue={item?.descritpion}
          onChange={(e) => {
            if (e.currentTarget.value !== "") {
              setIsDisabled(false);

              handleChange("description")(e);
            } else {
              setIsDisabled(true);
            }
          }}
        />
        <TextField
          sx={{ marginTop: "5px" }}
          type="text"
          label="MISSION HEAD"
          defaultValue={item?.missionHead}
          onChange={(e) => {
            if (e.currentTarget.value !== "") {
              setIsDisabled(false);

              handleChange("missionHead")(e);
            } else {
              setIsDisabled(true);
            }
          }}
        />

    
        <Select
          required
          label={"Status"}
          onChange={(e) => {
            if (e.target.value !== "") {
              setIsDisabled(false);

              handleChange("status")(e);
            } else {
              setIsDisabled(true);
            }
          }}
          value={data.status}
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

export default EditItemDialog;
