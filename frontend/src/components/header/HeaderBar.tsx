import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext/authContext';
import styles from './HeaderBar.module.css';

const pages = [
    {
  name: 'Game',
  url: '/'
  },
  {
  name: 'Blogs',
  url: '/blogs'
  },
  {
  name: 'Past Games',
  url: '/past-games'
  }
];

const loginPage = [{
  name: "login",
  url: '/login'
}]

// Latter add all other types.
const settings = [
  // 'Profile', 'Account', 'Dashboard', 
  'Logout'];

const AnonymousUserSetting = ["Bazinga!"]

const  HeaderBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  const { isAuthenticated, logout } = useAuth();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (option: string) => () =>{
    handleCloseUserMenu();
    if (option === 'Logout') {
      logout();
    }
  }
  
  const navigationHandler = (url: string) => () => {
    navigate(url);
    handleCloseNavMenu();
  }

  const pagesToShow = isAuthenticated ? pages : loginPage;
  const menuOptions = isAuthenticated ? settings : AnonymousUserSetting;

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#vhdc"
            className={styles.logo + ' ' + styles.md}
          >
            Chess.JS
          </Typography>

          <Box className={styles.navBox + ' ' + styles.sm} sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            {isAuthenticated && (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  classes={{ paper: styles.menuPaper }}
                  sx={{ display: { xs: 'block', md: 'none' } }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page.name} onClick={navigationHandler(page.url)}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#vhdc"
            className="logo sm"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Chess.JS
          </Typography>
          {/*<Box className={styles.navBox + ' ' + styles.md} sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>*/}
          {/*  {pagesToShow.map((page) => (*/}
          {/*    <Button*/}
          {/*      key={page.name}*/}
          {/*      onClick={navigationHandler(page.url)}*/}
          {/*      className={styles.menuButton}*/}
          {/*      sx={{ my: 2, color: 'white', display: 'block' }}*/}
          {/*    >*/}
          {/*      {page.name}*/}
          {/*    </Button>*/}
          {/*  ))}*/}
          {/*</Box>*/}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} className={styles.avatarButton}>
                <Avatar alt="M" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              classes={{ paper: styles.menuPaper }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {menuOptions.map((option) => (
                <MenuItem key={option} onClick={handleMenuClick(option)}>
                  <Typography textAlign="center">{option}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default HeaderBar;