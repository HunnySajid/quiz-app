import * as React from 'react';
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { FiLogOut } from "react-icons/fi";
import { useUser } from '../contexts/UserContext';

export const AccountMenu = () => {
  const user = useUser();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title='Account settings'>
          <IconButton
            onClick={handleClick}
            size='small'
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {user?.email ? <MenuItem>{user.email}</MenuItem> : null}
        <Divider />
        <MenuItem
          onClick={() => {
            localStorage.removeItem('user');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }}
        >
          <FiLogOut size={16} /> Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};
