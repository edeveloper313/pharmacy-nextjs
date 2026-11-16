import React from "react";
import Menuitems from "./MenuItems";
import { Box, Tooltip } from "@mui/material";
import {
  Sidebar as MUI_Sidebar,
  Menu,
  MenuItem,
  Submenu,
} from "react-mui-sidebar";
import { IconPoint } from '@tabler/icons-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import ForSidebarLogo from "../shared/logo/ForSidebarLogo";

const renderMenuItems = (items: any, pathDirect: any, isSidebarOpen: boolean) => {
  return items.map((item: any) => {
    const Icon = item.icon ? item.icon : IconPoint;
    const itemIcon = <Icon stroke={1.5} size="1.3rem" />;

    if (item.subheader) {
      return (
        <Menu
          subHeading={isSidebarOpen ? item.subheader : ""} 
          key={item.subheader}
        />
      );
    }

    if (item.children) {
      return (
        <Submenu
          key={item.id}
          title={isSidebarOpen ? item.title : ""}
          icon={itemIcon}
          borderRadius='7px'
        >
          {renderMenuItems(item.children, pathDirect, isSidebarOpen)}
        </Submenu>
      );
    }

    return (
      <Box px={isSidebarOpen ? 3 : 1} key={item.id} sx={{ display: 'flex', justifyContent: isSidebarOpen ? 'flex-start' : 'center' }}>
        <Tooltip title={!isSidebarOpen ? item.title : ""} placement="right" arrow>
          <Box sx={{ width: '100%' }}>
            <MenuItem
              key={item.id}
              isSelected={pathDirect === item?.href}
              borderRadius='8px'
              icon={itemIcon}
              link={item.href}
              component={Link}
            >
              <Box sx={{ display: isSidebarOpen ? 'block' : 'none', whiteSpace: 'nowrap' }}>
                {item.title}
              </Box>
            </MenuItem>
          </Box>
        </Tooltip>
      </Box>
    );
  });
};

interface SidebarItemsProps {
  isSidebarOpen?: boolean;
}

const SidebarItems = ({ isSidebarOpen = true }: SidebarItemsProps) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  return (
    <>
      <MUI_Sidebar 
        width={"100%"} 
        showProfile={false} 
        themeColor={"#5D87FF"} 
        themeSecondaryColor={'#49beff'} 
      >
        {/* Yahan Logo ko isSidebarOpen pass kiya hai */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: isSidebarOpen ? 'flex-start' : 'center' }}>
          <ForSidebarLogo isSidebarOpen={isSidebarOpen} />
        </Box>

        {renderMenuItems(Menuitems, pathDirect, isSidebarOpen)}
      </MUI_Sidebar>
    </>
  );
};

export default SidebarItems;