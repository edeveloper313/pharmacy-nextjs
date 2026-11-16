"use client";
import { styled, Container, Box, useMediaQuery, Theme } from "@mui/material"; // useMediaQuery import karein
import React, { useState } from "react";
import Header from "@/app/(DashboardLayout)/dashboard/layout/header/Header";
import Sidebar from "@/app/(DashboardLayout)/dashboard/layout/sidebar/Sidebar";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false); 
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Screen size check karne ke liye (sirf desktop par margin lagegi)
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  return (
    <MainWrapper className="mainwrapper">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
        toggleDesktopSidebar={() => setSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Wrapper (PageWrapper ki jagah Box use kiya hai dynamic styles ke liye) */}
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
          // Yahan Animation aur Margin add ki hai
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          // Agar screen desktop (lg) hai aur sidebar open hai, toh content ko 270px right push karo
          marginLeft: lgUp && isSidebarOpen ? "270px" : "0px", 
        }}
      >
        {/* Header */}
        <Header 
          toggleMobileSidebar={() => setMobileSidebarOpen(true)} 
          toggleDesktopSidebar={() => setSidebarOpen(!isSidebarOpen)}
        />
        
        {/* PageContent */}
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