import { Box, Paper, Stack, styled } from "@mui/material";

export const Wrapper = styled(Box)(({ theme }) => ({
      display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'start',
    width: '100%',
    height: 'calc(100vh - 75px)', // Adjusted height for the rest of the screen height

    backgroundColor: theme.palette.grey[300],
    marginTop: '75px'
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
