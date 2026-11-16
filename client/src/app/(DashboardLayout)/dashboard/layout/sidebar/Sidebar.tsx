import { useMediaQuery, Box, Drawer, Theme } from "@mui/material";
import SidebarItems from "./SidebarItems";

interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
  toggleDesktopSidebar: () => void; // Header se toggle karne ke liye prop yahan hai
}

const MSidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
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
        open={true}
        variant="permanent"
        slotProps={{
          paper: {
            sx: {
              boxSizing: "border-box",
              ...scrollbarStyles,
              width: sidebarWidth,
              transition: "width 0.3s ease", 
              overflowX: "hidden", 
            },
          }
        }}
      >
        <Box sx={{ height: "100%", pt: 2 }}>
          {/* Toggle button yahan se hata diya gaya hai */}
          
          <Box>
            {/* Sidebar Items directly start honge */}
            <SidebarItems isSidebarOpen={isSidebarOpen} />
          </Box>
        </Box>
      </Drawer>
    );
  }

  // Mobile ke liye temporary
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