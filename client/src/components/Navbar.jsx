import { AppBar, Toolbar, Box, Button, Typography, IconButton, Tooltip } from '@mui/material';
import { NavLink } from 'react-router-dom';
import BoltIcon from '@mui/icons-material/Bolt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useColorMode } from '../App';

const Navbar = () => {
  const { toggleColorMode, mode } = useColorMode();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          maxWidth: '1000px',
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              backgroundColor: '#16a34a',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>
              R
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 900,
                color: 'text.primary',
                lineHeight: 1.1,
                fontSize: 17,
              }}
            >
              Reoxide
            </Typography>
            <Typography sx={{ fontSize: 10, color: 'text.secondary', lineHeight: 1 }}>
              AI Content Agent
            </Typography>
          </Box>
        </Box>

        {/* Right side — Nav + Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Nav Links */}
          <NavLink to="/" end style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                startIcon={<BoltIcon />}
                variant={isActive ? 'contained' : 'text'}
                size="small"
                sx={{
                  backgroundColor: isActive ? '#16a34a' : 'transparent',
                  color: isActive ? '#fff' : 'text.secondary',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: isActive ? '#15803d' : 'action.hover',
                  },
                }}
              >
                Generator
              </Button>
            )}
          </NavLink>

          <NavLink to="/feedback" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                startIcon={<ChatBubbleOutlineIcon />}
                variant={isActive ? 'contained' : 'text'}
                size="small"
                sx={{
                  backgroundColor: isActive ? '#16a34a' : 'transparent',
                  color: isActive ? '#fff' : 'text.secondary',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: isActive ? '#15803d' : 'action.hover',
                  },
                }}
              >
                View Feedback
              </Button>
            )}
          </NavLink>

          {/* Dark/Light Toggle */}
          <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
            <IconButton
              onClick={toggleColorMode}
              size="small"
              sx={{
                ml: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '10px',
                p: 0.8,
                color: 'text.secondary',
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;