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
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";

import {
  HourglassEmpty as HourglassEmptyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import { useEditTenderNoticeMutation } from "../../app/api/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setProduct, setTenders } from "../../features/tenders/tender";
import { selectUser } from "../../features/users/userSlice";

function AddComment({  isOpen, setIsOpen, itemId, items }) {
  const user = useSelector(selectUser);
  const [open, setOpen] = useState(isOpen);
  const [isDisabled, setIsDisabled] = useState(true);
  const [tcagents, setTcAgents] = useState([]);
  const [updateItem, updateItemResult] = useEditTenderNoticeMutation();
  const [item, setItem] = useState(null);

console.log(items)
    useEffect(() => {
      const arr = items.filter((element) => element._id === itemId);
      setItem(arr[0]);
    }, [isOpen]);

  const [data, setData] = useState({
    directeurComments: item?.directeurComments,
    commissionComments: item?.commissionComments,
    controlleurDeGestionComments: item?.controlleurDeGestionComments,
  });
  const dispatch = useDispatch();
  const handleClose = () => {
    setData({
      directeurComments: item?.directeurComments,
      commissionComments: item?.commissionComments,
      controlleurDeGestionComments: item?.controlleurDeGestionComments,
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
      dispatch(setTenders(filteredItems));
    }

    console.log("item have updated successfully");

    handleClose();
  }, [updateItemResult]);

  const handleSave = async () => {
    console.log("data,id", data, item._id);
    await updateItem({ data, id: item._id ,username:user.username});
  };

  const handleChange = (field) => (event) => {
    setData({
      [field]:  item[field].concat([event.target.value]),
    });
    //   console.log(...data)
  };
  

  useEffect(()=>{
    console.log("data",data);
  },[data])

  return (
   user? (<Dialog
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="dialog-title">Ajouter Commentaire</DialogTitle>
      <DialogContent>
     
          <TextField
            sx={{ marginTop: "5px" }}
            type="text"
            label={`${user.role} Comment`}
            onChange={(e) => {
              if (e.currentTarget.value.length > 0) {
                setIsDisabled(false);

                handleChange(`${user.role}Comments`)(e);

              } else {
                e.target.value = "";
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
    </Dialog>):null
  );
}

export default AddComment;
