import {PaletteColor, PaletteColorOptions, ThemeOptions} from '@mui/material/styles'


declare module '@mui/material/styles'{
    interface Theme {
        status:{
            danger:string
        }
    }

    interface PaletteOptions{
        neutral?:PaletteColorOptions

    }
    interface Palette{
        neutral?:PaletteColor
    }
    interface ThemeOptions{
        status:{
            danger:React.CSSProperties['color']
        }
    }
    interface SimplePaletteColorOptions{
        darker?: string
    }
    interface PaletteColor{
        darker?:string
    }
}