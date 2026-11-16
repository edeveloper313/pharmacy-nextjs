"use client";
import { styled, Container, Box, useMediaQuery, Theme } from "@mui/material";
import React, { useState } from "react";
import Header from "@/app/(DashboardLayout)/dashboard/layout/header/Header";
import Sidebar from "@/app/(DashboardLayout)/dashboard/layout/sidebar/Sidebar";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // By default mini/closed
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  return (
    <MainWrapper className="mainwrapper">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
        toggleDesktopSidebar={() => setSidebarOpen(!isSidebarOpen)}
      />

      <Box
        className="page-wrapper"
        sx={{
          display: "flex",
          flexGrow: 1,
          paddingBottom: "60px",
          flexDirection: "column",
          zIndex: 1,
          backgroundColor: "transparent",
          width: "100%", 
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          // Desktop par: Open hone par 270px, Close hone par 80px jagah chorega
          marginLeft: lgUp ? (isSidebarOpen ? "270px" : "80px") : "0px", 
        }}
      >
        <Header 
          toggleMobileSidebar={() => setMobileSidebarOpen(true)} 
          toggleDesktopSidebar={() => setSidebarOpen(!isSidebarOpen)}
        />
        
        <Container
          sx={{
            paddingTop: "20px",
            maxWidth: "1200px",
          }}
        >
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
        </Container>
      </Box>
    </MainWrapper>
  );
}