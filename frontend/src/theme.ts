import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E2A3B', // Темно-синий
    },
    secondary: {
      main: '#FFFFFF', // Белый для текста и фона контента
    },
    background: {
      default: '#1E2A3B', // Темный синий для всего фона
    },
    text: {
      primary: '#FFFFFF', // Белый цвет текста
      secondary: '#B0BEC5', // Более светлый цвет текста для второстепенных элементов
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h6: {
      fontSize: '1.2rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1E2A3B',
          borderRight: '1px solid #ddd',
          borderRadius: '20px 0 0 20px',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
});

export default theme;