import { Box, Button, styled } from "@mui/material";

export const Wrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flex: '1',

    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'center',

    backgroundColor: theme.palette.grey[300],
    overflowY: 'scroll',
    overflowX: 'hidden',
    marginTop: '75px'
})
)
// export const BoxHeader = styled(Box)(({ theme }) => ({
//     display: 'flex',

//     backgroundColor: theme.palette.grey[100]
// })
// )
// export const AddItemButton = styled(Button)(({ theme }) => ({
//     color: 'black',
//     maxWidth: '150px',
//     margin: '3px',
//     backgroundColor: theme.palette.secondary.dark
// })
// )
