import { useMediaQuery, Box, Drawer, IconButton, Theme } from "@mui/material";
import SidebarItems from "./SidebarItems";
import { IconX, IconMenu2 } from "@tabler/icons-react"; // Open/Close icons

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

  // Dynamic Width: Open hone par 270px, close hone par 80px (Mini Sidebar)
  const sidebarWidth = isSidebarOpen ? "270px" : "80px";

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
        open={true} // Permanent drawer hamesha open rehta hai, width se khelte hain
        variant="permanent" // Persistent ki jagah permanent kiya taake mini mode mein visible rahe
        slotProps={{
          paper: {
            sx: {
              boxSizing: "border-box",
              ...scrollbarStyles,
              width: sidebarWidth,
              transition: "width 0.3s ease", // Smooth animation
              overflowX: "hidden", // Text bahar na nikle
            },
          }
        }}
      >
        <Box sx={{ height: "100%" }}>
          {/* Top Toggle Button */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: isSidebarOpen ? 'flex-end' : 'center', 
            p: 2, 
            pb: 0,
            mt: 1
          }}>
            <IconButton onClick={toggleDesktopSidebar} size="small" sx={{ color: "text.secondary" }}>
              {isSidebarOpen ? <IconX size="20" /> : <IconMenu2 size="20" />}
            </IconButton>
          </Box>

          <Box sx={{ mt: isSidebarOpen ? 0 : 2 }}>
            {/* Pass isSidebarOpen prop to SidebarItems */}
            <SidebarItems isSidebarOpen={isSidebarOpen} />
          </Box>
        </Box>
      </Drawer>
    );
  }

  // Mobile ke liye temporary hi rahega
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
        {/* Mobile par hamesha full sidebar khulega */}
        <SidebarItems isSidebarOpen={true} />
      </Box>
    </Drawer>
  );
};

export default MSidebar;