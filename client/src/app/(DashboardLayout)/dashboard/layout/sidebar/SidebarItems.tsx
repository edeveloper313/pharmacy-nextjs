"use client";

import React from "react";
import Menuitems from "./MenuItems";

import { Box, Tooltip } from "@mui/material";

import {
  Sidebar as MUI_Sidebar,
  Menu,
  MenuItem,
  Submenu,
} from "react-mui-sidebar";

import { IconPoint } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import ForSidebarLogo from "../shared/logo/ForSidebarLogo";

interface SidebarItemsProps {
  isSidebarOpen?: boolean;
}

const renderMenuItems = (
  items: any[],
  pathDirect: string,
  isSidebarOpen: boolean,
): React.ReactNode => {
  return items.map((item: any) => {
    const Icon = item.icon || IconPoint;

    const itemIcon = <Icon stroke={1.5} size="1.3rem" />;

    // =========================
    // SECTION HEADING
    // =========================
    if (item.subheader) {
      // Closed sidebar mein heading render nahi hogi
      if (!isSidebarOpen) return null;

      return (
        <Menu key={item.id || item.subheader} subHeading={item.subheader} />
      );
    }

    // =========================
    // SUBMENU
    // =========================
    if (item.children) {
      return (
        <Tooltip
          key={item.id}
          title={!isSidebarOpen ? item.title : ""}
          placement="right"
          arrow
          disableHoverListener={isSidebarOpen}
        >
          <Box>
            <Submenu
              title={isSidebarOpen ? item.title : ""}
              icon={itemIcon}
              borderRadius="7px"
            >
              {renderMenuItems(item.children, pathDirect, isSidebarOpen)}
            </Submenu>
          </Box>
        </Tooltip>
      );
    }

    // =========================
    // NORMAL MENU ITEM
    // =========================
    const isSelected = pathDirect === item.href;

    return (
      <Box
        key={item.id}
        px={isSidebarOpen ? 3 : 1}
        sx={{
          display: "flex",
          justifyContent: isSidebarOpen ? "flex-start" : "center",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Tooltip
          title={!isSidebarOpen ? item.title : ""}
          placement="right"
          arrow
          disableHoverListener={isSidebarOpen}
        >
          <Box sx={{ width: "100%" }}>
            <MenuItem
              isSelected={isSelected}
              borderRadius="8px"
              icon={itemIcon}
              link={item.href}
              component={Link}
            >
              {isSidebarOpen && (
                <Box
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </Box>
              )}
            </MenuItem>
          </Box>
        </Tooltip>
      </Box>
    );
  });
};

const SidebarItems = ({ isSidebarOpen = true }: SidebarItemsProps) => {
  const pathname = usePathname();

  return (
    <MUI_Sidebar
      width="100%"
      showProfile={false}
      themeColor="#5D87FF"
      themeSecondaryColor="#49beff"
    >
      {/* LOGO */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: isSidebarOpen ? "flex-start" : "center",
        }}
      >
        <ForSidebarLogo isSidebarOpen={isSidebarOpen} />
      </Box>

      {/* MENU ITEMS */}
      {renderMenuItems(Menuitems, pathname, isSidebarOpen)}
    </MUI_Sidebar>
  );
};

export default SidebarItems;
