import React, { useState } from "react";
import { styled, Stack, IconButton, AppBar, Box, Typography, Button } from "@mui/material";
import { Home, History, Logout ,Lock as LockIcon} from "@mui/icons-material";
import { logOut, selectUser } from "../features/users/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ceticLogo from './../logo-cetic.jpg';
import Profile from '../components/Profile';
import EditPasswordDialog from '../components/utils/EditPasswordDialog';

function NavBar() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);

  const handleLogoutClick = () => {
    dispatch(logOut());
    navigate('/');
  };

  const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: "white",
    "&:hover": {
      backgroundColor: "transparent",
    },
  }));

  const StyledNavbar = styled(AppBar)(({ theme }) => ({
    padding: "10px",
    height: "70px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.palette.primary.main,
    overflow: "unset",
    position: "fixed",
    top: 0,
    left: 0,
  }));

  return (
    <StyledNavbar>
      <Profile />

      <Stack direction="row" alignItems="center" spacing={14} mr={4}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <StyledIconButton
            disableRipple
            onClick={() => {
              navigate(`/${user.role}`);
            }}
          >
            <Home />
          </StyledIconButton>
          <Typography variant="body2" sx={{ color: "white" }}>
            {" "}
            {/* Ajoutez un texte à côté de l'icône */}
            Accueil
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <StyledIconButton
            onClick={() => {
              navigate(`/archive`);
            }}
          >
            <History />
          </StyledIconButton>
          <Typography variant="body2" sx={{ color: "white" }}>
            {" "}
            {/* Ajoutez un texte à côté de l'icône */}
            Archive
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <StyledIconButton onClick={() => setOpenDialog(true)}>
            <LockIcon />
          </StyledIconButton>
          <Typography variant="body2" sx={{ color: "white" }}>
            {" "}
            {/* Ajoutez un texte à côté de l'icône */}
            Modifier mot de passe
          </Typography>
        { user.role==='admin'? <Button
            type="submit"
            variant="outlined"
            component={Link}
            sx={{
              width: "175px",
              height: "50px",
              fontStyle: "normal",
              marginLeft: "20px",
              color:'white.main'
            }}
            to={"/Register"}
          >
            Créer un compte
          </Button>:null}
        </Stack>
        <EditPasswordDialog isOpen={openDialog} setIsOpen={setOpenDialog} />{" "}
        {/* Placez EditPasswordDialog en dehors de Button */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <StyledIconButton onClick={handleLogoutClick}>
            <Logout />
          </StyledIconButton>
          <Typography variant="body2" sx={{ color: "white" }}>
            {" "}
            {/* Ajoutez un texte à côté de l'icône */}
            Déconnexion
          </Typography>
        </Stack>
      </Stack>

      <img
        src={ceticLogo}
        style={{ width: "150px", height: "auto" }}
        alt="CETIC Logo"
      />
    </StyledNavbar>
  );
}

export default NavBar;
