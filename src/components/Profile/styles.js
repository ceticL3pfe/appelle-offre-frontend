import { Box, styled } from "@mui/material";

export const Wrapper = styled(Box)(({ theme }) => ({
    backgroundColor:theme.palette.grey[300],
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: '100vh',
    paddingTop:'20px'
})
)
export const StyledBox = styled(Box)(({theme})=>({
}))
