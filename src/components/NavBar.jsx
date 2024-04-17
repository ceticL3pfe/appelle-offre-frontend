import { styled, Stack, IconButton, Avatar, AppBar } from "@mui/material";
import React from "react";
import {Article, Chat, Group, History, Home, Inventory, Logout} from "@mui/icons-material";
import { logOut, selectUser } from "../features/users/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate ,useParams} from "react-router-dom";
function NavBar() {
  const navigate = useNavigate()
  const user = useSelector(selectUser);
  const dispatch = useDispatch();


  const handleLogoutClick = ()=>{
   dispatch( logOut())
   navigate('/')
  }


  const StyledIconButton = styled(IconButton)(({ theme }) => ({
    borderLeft: "5px solid transparent",
    borderRadius: 0,
    paddingLeft: 15,
    paddingRight: 15,
    "&:hover": {
      borderLeft: `5px solid ${theme.palette.secondary.main}`,
    },
  }));
  const StyledNavbar = styled(AppBar)(({ theme }) => ({
    padding: "10px",
    flex:'1',
    // justifyContent: "start",
    width: "100%",
    alignItems: "center",
    top: 0,
    flexDirection: "row",
    backgroundColor: theme.palette.primary.main,
    overflow: "unset",
  }));
  return (
    <StyledNavbar position="fixed" direction={"row"} spacing={5}>
      <Avatar
        onClick={() => {
          navigate(`/profile`);
        }}
        sx={{
          cursor: "pointer",
          height: 50,
          width: 50,
          borderTop: "5px solid transparent",
        }}
        variant="circular"
        src={user?.image}
        alt="Jane Doe"
      />
      <StyledIconButton
        color="white"
        disableRipple
        onClick={() => {
          navigate(`/main`);
        }}
      >
        <Home />
      </StyledIconButton>
      <StyledIconButton
        color="white"
        onClick={() => {
          navigate(`/inventory`);
        }}
      >
        <Inventory />
      </StyledIconButton>
      <StyledIconButton
        color="white"
        onClick={() => {
          navigate(`/history`);
        }}
      >
        <History />
      </StyledIconButton>
      <StyledIconButton color="white" onClick={handleLogoutClick}>
        <Logout />
      </StyledIconButton>
    </StyledNavbar>
  );
}

export default NavBar;
