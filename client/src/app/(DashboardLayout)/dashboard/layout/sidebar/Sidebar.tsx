import { useMediaQuery, Box, Drawer, IconButton, Theme } from "@mui/material";
import SidebarItems from "./SidebarItems";
import { IconX } from "@tabler/icons-react"; // Close icon import kiya

interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
  toggleDesktopSidebar: () => void; 
}

const MSidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
  toggleDesktopSidebar,
}: ItemType) => {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  const sidebarWidth = "270px";

  // Custom CSS for short scrollbar
  const scrollbarStyles = {
    '&::-webkit-scrollbar': {
      width: '7px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#eff2f7',
      borderRadius: '15px',
    },
  };

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        variant="persistent" // <--- Yahan permanent ki jagah persistent kiya hai
        slotProps={{
          paper: {
            sx: {
              boxSizing: "border-box",
              ...scrollbarStyles,
              width: sidebarWidth,
            },
          }
        }}
      >
        <Box sx={{ height: "100%" }}>
          {/* Top Button to Close Sidebar */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, pb: 0 }}>
            <IconButton onClick={toggleDesktopSidebar} size="small">
              <IconX size="20" />
            </IconButton>
          </Box>

          <Box>
            {/* Sidebar Items */}
            <SidebarItems />
          </Box>
        </Box>
      </Drawer>
    );
  }

  // Mobile ke liye temporary hi rahega jo click bahar karne se close hota hai
  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      slotProps={{
        paper: {
          sx: {
            boxShadow: (theme) => theme.shadows[8],
            ...scrollbarStyles,
          },
        }
      }}
    >
      <Box>
        <SidebarItems />
      </Box>
    </Drawer>
  );
};

export default MSidebar;