import React, { useState ,useEffect} from "react";
import {
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

function Comments({ items, itemId , isOpen, setIsOpen,}) {

  const selectedItem = items.find((item) => item._id === itemId);

  const [open, setOpen] = useState(isOpen);


  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {

    setIsOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Comments for
          {selectedItem ? ` : ${selectedItem.object}` : "Selected Item"}
        </DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <Paper
              elevation={3}
              style={{ padding: "20px", marginBottom: "20px" }}
            >
              <Typography variant="h5" gutterBottom>
                Commission Comments
              </Typography>
              {
                selectedItem.commissionComments.map(element => {
                 return   <Typography variant="body1">
                      {element}
                    </Typography>;
                })
              }
              
            </Paper>
          )}

          {selectedItem && (
            <Paper elevation={3} style={{ padding: "20px" }}>
              <Typography variant="h5" gutterBottom>
                Controlleur De Gestion Comments
              </Typography>{
              selectedItem.controlleurDeGestionComments.map(element => {
                 return   <Typography variant="body1">
                      {element}
                    </Typography>;
                })}
            </Paper>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Comments;
