import { Box, Button, styled } from "@mui/material";

export const Wrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'start',
    width: '98%',
    height: 'calc(100vh - 75px)', // Adjusted height for the rest of the screen height

   
})
)
export const BoxHeader = styled(Box)(({ theme }) => ({
    display: 'flex',

    backgroundColor: theme.palette.grey[100]
})
)
export const AddItemButton = styled(Button)(({ theme }) => ({
    color: 'black',
    maxWidth: '150px',
    margin: '3px',
    backgroundColor: theme.palette.secondary.dark
})
)
