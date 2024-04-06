import { Box, Divider, Drawer } from '@mui/material';

const MenuDrawer = ({
  open,
  toggleDrawer,
}: {
  open: boolean;
  toggleDrawer: (newOpen: boolean) => () => void;
}) => {
  return (
    <Drawer
      anchor={'right'}
      open={open}
      onClose={toggleDrawer(false)}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
      >
        <Divider />
      </Box>
    </Drawer>
  );
};

export default MenuDrawer;
