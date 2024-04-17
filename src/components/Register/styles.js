import {Box,styled} from '@mui/material'

export const Wrapper = styled(Box)(({theme})=>({
display:'flex',
justifyContent:'center',
alignItems:'center',
width:'100%',
height:'100vh',
backgroundColor:theme.palette.grey[300]
}))