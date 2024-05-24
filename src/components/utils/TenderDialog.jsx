import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

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
  Stack,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Link,
  HourglassEmpty as HourglassEmptyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  AddCommentRounded,
} from "@mui/icons-material"; // Importing icons

import {
  useAddAoReponseMutation,
  useAddPvClientMutation,
  useEditTenderNoticeMutation,
} from "../../app/api/apiSlice";
import CustomCircularPogress from "./CircularProgress";
import CustomDialog from "./CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import { selectTenders, setTenders } from "../../features/tenders/tender";
import { selectToken, selectUser } from "../../features/users/userSlice";
import Stepper from "./Stepper";
import StepperProgress from "./Stepper";
import ClearIcon from "@mui/icons-material/Clear";

function TenderDialog({
  isOpen,
  setIsOpen,
  tenderId,
  setPvOpen,
  setCdcOpen,
  setAoOpen,
  setTenderCallId,
  setOpenDeleteCdc,
  setOpenDeletePv,
  setOpenDeleteAoResponse,
  setItemIdToDelete,
  setDocumentId,
  setDialogRemoveItem,
  setAddCommentOpen,
  setShowComments,
  setItemToComment,
  setSelectedItem,
  setSelectedTenderForTab,
  setIsTabOpen,
}) {
  const [updateTender, updateTenderResult] = useEditTenderNoticeMutation();

  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const tenders = useSelector(selectTenders);
  const [tender, setTender] = useState(null);
  const [nextStatus, setNextStatus] = useState(null);

  const [itemToUpdate, setItemToUpdate] = useState(null);
  const [dialogAddItem, setDialogAddItem] = useState(false);
  const [dialogEditItem, setDialogEditItem] = useState(false);
  const [isTOpen, setIsTOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [inputText, setInputText] = useState("");

  console.log(tenderId);
  useEffect(() => {
    const item = tenders.find((item) => item._id === tenderId);
    console.log(item);
    setTender(item);
  }, [tenders, tenderId]);

  const [progress, setProgress] = useState(false);
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    switch (tender?.status) {
      case "validation de retrait de cdc":
        setNextStatus("analyse de la commission");
        break;
      case "analyse de la commission":
        setNextStatus("analyse de contolleur de gestion");
        break;
      case "analyse de contolleur de gestion":
        setNextStatus("validation de directeur");

        break;
      case "validation de directeur":
        setNextStatus("Terminer");

        break;
    }
  }, [tender?.status]);



  
  useEffect(() => {
    if (updateTenderResult.status === "rejected") {
      console.log("error while updating item");
    } else if (updateTenderResult.status === "fulfilled") {
      console.log(updateTenderResult.data);
      const filteredItems = tenders?.map((item) => {
        if (item._id !== updateTenderResult.data.msg._id) {
          return item;
        } else {
          return updateTenderResult.data.msg;
        }
      });
      console.log("filtred Items edit", filteredItems);
      dispatch(setTenders(filteredItems));
    }

    console.log("item have updated successfully");

    handleClose();
  }, [updateTenderResult]);
  return tender ? (
    <Dialog sx={{}} open={open} onClose={handleClose}>
      <Stack direction={"row"} spacing={6}>
        <DialogTitle id="dialog-title">{tender?.object}</DialogTitle>

        {tender.fournisseur_1 ? (
          <Box
            sx={{
              height: "20px",
              width: "50%",
              backgroundColor: "warning.main",
              borderRadius: "30px",
              textAlign: "center",
            }}
          >
            {" "}
            Externe
          </Box>
        ) : null}
      </Stack>
      <StepperProgress
        tender={tender}
        status={tender.status}
        isValide={tender[`${user.role}Response`]}
      />

      <Box>
        <DialogContent>
          <Stack direction={"row"} spacing={13}>
            <Stack>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Object:
              </Typography>
              <Typography variant="body2">{tender.object}</Typography>

              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Source:
              </Typography>
              <Typography variant="body2">{tender.source}</Typography>

              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Status:
              </Typography>
              <Typography variant="body2">{tender.status}</Typography>

              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Directeur Response:
              </Typography>
              <Typography variant="body2">
                {tender.directeurResponse}
              </Typography>
            </Stack>
          {user.username===tender.missionHead?  <Stack>
              {tender.cahierCharge ? (
                <Stack direction={"row"}>
                  {" "}
                  <label id="cdc-label" className="cdc-label">
                    Cdc file:
                  </label>
                  <IconButton
                    aria-labelledby="cdc-label"
                    sx={{ position: "sticky" }}
                    data-file-id={tender.cahierCharge}
                    onClick={async (e) => {
                      window.open(
                        `http://localhost:5000/cdc/cdc-data/${e.currentTarget.dataset.fileId}/${token}`,
                        "_blank"
                      );
                    }}
                  >
                    <AttachFileIcon />
                  </IconButton>
                  {user.role === "agentTc" ? (
                    <IconButton
                      data-tender-id={tender._id}
                      data-document-id={tender.cahierCharge}
                      onClick={(e) => {
                        setTenderCallId(e.currentTarget.dataset.tenderId);
                        setDocumentId(e.currentTarget.dataset.documentId);
                        setOpenDeleteCdc(true);
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  ) : null}
                </Stack>
              ) : user.role === "agentTc" ? (
                <Button
                  data-tender-id={tender._id}
                  variant="outlined"
                  onClick={(e) => {
                    setTenderCallId(e.currentTarget.dataset.tenderId);
                    console.log(e.currentTarget.dataset.tenderId);
                    setCdcOpen(true);
                  }}
                >
                  Ajouter Cdc
                </Button>
              ) : null}
              {tender.aoResponse ? (
                <Stack direction={"row"}>
                  <label id="aoreponse-label" className="aoreponse-label">
                    Dossier De Reponse:
                  </label>
                  <IconButton
                    aria-labelledby="aoreponse-label"
                    sx={{ position: "sticky" }}
                    data-file-id={tender.aoResponse}
                    onClick={async (e) => {
                      window.open(
                        `http://localhost:5000/aoReponse/ao-response-data/${e.currentTarget.dataset.fileId}/${token}`,
                        "_blank"
                      );
                    }}
                  >
                    <AttachFileIcon />
                  </IconButton>
                  {user.role === "agentTc" ? (
                    <IconButton
                      data-tender-id={tender._id}
                      data-document-id={tender.aoResponse}
                      onClick={(e) => {
                        setTenderCallId(e.currentTarget.dataset.tenderId);
                        setDocumentId(e.currentTarget.dataset.documentId);

                        setOpenDeleteAoResponse(true);
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  ) : null}
                </Stack>
              ) : user.role === "agentTc" ? (
                <Button
                  data-tender-id={tender._id}
                  variant="outlined"
                  onClick={(e) => {
                    setTenderCallId(e.currentTarget.dataset.tenderId);
                    console.log(e.currentTarget.dataset.tenderId);
                    setAoOpen(true);
                  }}
                >
                  Ajouter dossier de reponse
                </Button>
              ) : null}
              {tender.pvClient ? (
                <Stack direction={"row"}>
                  {" "}
                  <label id="cdc-label" className="cdc-label">
                    Pv Client:
                  </label>
                  <IconButton
                    aria-labelledby="cdc-label"
                    sx={{ position: "sticky" }}
                    data-file-id={tender.pvClient}
                    onClick={async (e) => {
                      window.open(
                        `http://localhost:5000/pvClient/client-pv-data/${e.currentTarget.dataset.fileId}/${token}`,
                        "_blank"
                      );
                    }}
                  >
                    <AttachFileIcon />
                  </IconButton>
                  {user.role === "agentTc" ? (
                    <IconButton
                      data-tender-id={tender._id}
                      data-document-id={tender.pvClient}
                      onClick={(e) => {
                        setTenderCallId(e.currentTarget.dataset.tenderId);
                        setDocumentId(e.currentTarget.dataset.documentId);

                        setOpenDeletePv(true);
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  ) : null}
                </Stack>
              ) : user.role === "agentTc" ? (
                <Button
                  data-tender-id={tender._id}
                  variant="outlined"
                  onClick={(e) => {
                    setTenderCallId(e.currentTarget.dataset.tenderId);
                    console.log(e.currentTarget.dataset.tenderId);
                    setPvOpen(true);
                  }}
                >
                  Ajouter PV client
                </Button>
              ) : null}
            </Stack>:null}
          </Stack>
        </DialogContent>
        <DialogActions>
          {user?.role === "agentTc" ? (
            <IconButton
              data-item-id={tender._id}
              onClick={(e) => {
                const itemId = e.currentTarget.dataset.itemId;
                setItemIdToDelete(itemId);
                setDialogRemoveItem(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          ) : null}
          {user?.role !== "agentTc" && user.role !== "admin" ? (
            <IconButton
              data-item-id={tender._id}
              onClick={(e) => {
                const itemId = e.currentTarget.dataset.itemId;
                setItemToComment(itemId);
                setAddCommentOpen(true);
              }}
            >
              <AddCommentRounded />
            </IconButton>
          ) : null}
          <Button
            data-item-id={tender._id}
            onClick={(e) => {
              const itemId = e.currentTarget.dataset.itemId;
              setSelectedItem(itemId);
              setShowComments(true);
            }}
          >
            show comments
          </Button>
          {(user.role === "directeur" &&
            (tender.status === "validation de retrait de cdc" 
             )) ||
          (user.role === "commission" &&
            tender.status === "analyse de la commission") ||
          (user.role === "controlleurDeGestion" &&
            tender.status === "analyse de contolleur de gestion") ? (
            <>
              <IconButton
                data-item-id={tender._id}
                data-item-status={tender.status}
                onClick={async (e) => {
                  const itemId = e.currentTarget.dataset.itemId;

                  console.log(nextStatus);
                  await updateTender({
                    data: {
                      [`${user.role}Response`]: "ok",
                      status: nextStatus,
                    },
                    id: itemId,
                  });
                }}
                color={
                  tender?.[`${user.role}Response`] === "ok"
                    ? "success"
                    : "default"
                }
              >
                <DoneOutlineIcon />
              </IconButton>
              <IconButton
                data-item-id={tender._id}
                onClick={async (e) => {
                  const itemId = e.currentTarget.dataset.itemId;

                  await updateTender({
                    data: { [`${user.role}Response`]: "refused" },
                    id: itemId,
                  });
                }}
                color={
                  tender?.[`${user.role}Response`] === "refused"
                    ? "error"
                    : "default"
                }
              >
                <ClearIcon />
              </IconButton>
            </>
          ) : null}
          {user.role === "directeur" &&
            (
              tender.status === "validation de directeur")?  <Button
              data-item-id={tender._id}
              onClick={async (e) => {
                const itemId = e.currentTarget.dataset.itemId;

                await updateTender({
                  data: { status: "Terminer" },
                  id: itemId,
                });
              }}
              color="success"
            >
              Terminer
            </Button>:null}

          {user.role === "directeur" &&
          tender.directeurResponse === "refused" ? (
            <Button
              data-item-id={tender._id}
              onClick={async (e) => {
                const itemId = e.currentTarget.dataset.itemId;

                await updateTender({
                  data: { status: "Annuler" },
                  id: itemId,
                });
              }}
              color="error"
            >
              Archiver
            </Button>
          ) : null}
          {tender?.selectedFournisseur ? (
            <Button
              sx={{ width: "100%" }}
              variant="outlined"
              data-item-id={tender._id}
              onClick={(e) => {
                const itemId = e.currentTarget.dataset.itemId;
                setSelectedTenderForTab(itemId);
                setIsTabOpen(true);
              }}
            >
              Tableau compartif
            </Button>
          ) : null}
        </DialogActions>

        {progress ? <CustomCircularPogress /> : null}
      </Box>
    </Dialog>
  ) : null;
}

export default TenderDialog;
