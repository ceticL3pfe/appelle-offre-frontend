import { Box, Paper, Stack, styled } from "@mui/material";

export const Wrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'start',
    width: '100%',
    height: '100vh',
    backgroundColor:theme.palette.primary.light,
    marginTop:'75px'
})
)


export const BoxHeader = styled(Stack)(({ theme }) => ({
    
justifyContent:'center',
alignItems:'center',
    backgroundColor: theme.palette.primary.light
})
)
export const Dashboard1 = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.orange.main,
    minWidth:'150px',

    
})
)
export const Dashboard2 = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.success.main,
    minWidth:'150px',

    
})
)
export const Dashboard3   = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.red.main,
    minWidth:'150px',

    
})
)
