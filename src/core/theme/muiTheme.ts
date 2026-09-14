import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#502313', // Nâu gỗ gụ trầm cổ kính
      light: '#72371F',
      dark: '#35160A',
      contrastText: '#FAF6F0',
    },
    secondary: {
      main: '#C59B27', // Vàng đồng Đông Sơn hoàng gia
      light: '#DEC067',
      dark: '#9A7416',
      contrastText: '#261C14',
    },
    background: {
      default: '#F7F2E7', // Nền giấy dó cổ truyền phong sương
      paper: '#FCFAF5', // Màu trang cổ thư
    },
    text: {
      primary: '#2A1A0F', // Mực nho đậm đà sắc nét
      secondary: '#665343', // Mực nâu thư tịch
    },
    error: {
      main: '#8E201B', // Đỏ son chu sa sắc phong
    },
    divider: '#D8C5AA',
  },
  typography: {
    fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.01em',
      lineHeight: 1.25,
    },
    h3: {
      fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: 700,
      letterSpacing: '0em',
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: 700,
      letterSpacing: '0.01em',
      lineHeight: 1.35,
    },
    h5: {
      fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: 700,
      letterSpacing: '0.01em',
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: 700,
      letterSpacing: '0.01em',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontFamily: '"Be Vietnam Pro", sans-serif',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontFamily: '"Be Vietnam Pro", sans-serif',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    body1: {
      fontFamily: '"Be Vietnam Pro", sans-serif',
      lineHeight: 1.65,
      letterSpacing: '-0.01em',
    },
    body2: {
      fontFamily: '"Be Vietnam Pro", sans-serif',
      lineHeight: 1.6,
      letterSpacing: '-0.01em',
    },
    button: {
      fontFamily: '"Be Vietnam Pro", sans-serif',
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 18px',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
        },
        contained: {
          boxShadow: '0 2px 6px rgba(80, 35, 19, 0.16)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(80, 35, 19, 0.24)',
          },
          '&.MuiButton-containedSecondary': {
            background: 'linear-gradient(180deg, #D4AF37 0%, #B8860B 100%)',
            color: '#261C14',
            border: '1px solid #C59B27',
            boxShadow: '0 2px 8px rgba(197, 155, 39, 0.25)',
            '&:hover': {
              background: 'linear-gradient(180deg, #DEC067 0%, #C59B27 100%)',
              boxShadow: '0 4px 14px rgba(197, 155, 39, 0.4)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#FCFAF5',
          border: '1px solid #D8C5AA',
          boxShadow: '0 4px 18px rgba(50, 26, 15, 0.05), 0 1px 3px rgba(50, 26, 15, 0.03)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FDFBF7',
          color: '#2A1A0F',
          boxShadow: '0 2px 8px rgba(50, 26, 15, 0.04)',
          borderBottom: '1px solid #D8C5AA',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
