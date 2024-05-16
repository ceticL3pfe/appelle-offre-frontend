import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        secondary: { main: "#5842A5" },
        primary: { main: "#083a8a" },
        success: { main: '#008823' },
        grey: { main: '#F0ECEC' },
        white: { main: '#FFFFFF' },
        red: { main: '#BF0808' },
        orange: { main: '#E67613 '}
    },
    typography: {


        subtitle1: {
            color: 'black',
            fontSize: 14,
        },
        subtitle2: {
            fontSize: 10,
        },

        body2: {
            fontWeight: 500,
        },
        button: {
            fontStyle: 'italic',
        },
    },
    
    backdrop: {
        zIndex: 1000,
        color: '#fff',
        backdropFilter: 'blur(5px)', // Adjust the blur amount as needed
    },
});
