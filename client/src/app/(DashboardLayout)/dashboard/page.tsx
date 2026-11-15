
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Chip,
  Divider,
  LinearProgress,
} from "@mui/material";

import {
  PeopleAlt,
  Inventory2,
  ShoppingCart,
  Payments,
  ReceiptLong,
  WarningAmber,
  PersonOutline,
  SettingsOutlined,
  InventoryOutlined,
  GroupsOutlined,
  ShoppingBasketOutlined,
  WarehouseOutlined,
  ReceiptOutlined,
  FileDownloadOutlined,
  LocalShippingOutlined,
  AssessmentOutlined,
  ArrowUpward,
  ArrowDownward,
  MoreHoriz,
  Add,
} from "@mui/icons-material";

import PageContainer from "@/app/(DashboardLayout)/dashboard/components/container/PageContainer";
import SuccessAlert from "@/app/components/SuccessAlert";

// ==========================================
// DASHBOARD DATA
// Replace these values with your API data
// ==========================================

const statistics = [
  {
    title: "Total Products",
    value: 2450,
    change: "+12.5%",
    icon: <Inventory2 />,
    color: "#2563eb",
    bg: "#eff6ff",
    up: true,
  },
  {
    title: "Total Clients",
    value: 1280,
    change: "+8.2%",
    icon: <PeopleAlt />,
    color: "#16a34a",
    bg: "#f0fdf4",
    up: true,
  },
  {
    title: "Inventory Stock",
    value: 8560,
    change: "+5.4%",
    icon: <ShoppingCart />,
    color: "#9333ea",
    bg: "#faf5ff",
    up: true,
  },
  {
    title: "Total Revenue",
    value: 125800,
    prefix: "$",
    change: "+15.3%",
    icon: <Payments />,
    color: "#ea580c",
    bg: "#fff7ed",
    up: true,
  },
  {
    title: "Pending Invoices",
    value: 32,
    change: "-4.2%",
    icon: <ReceiptLong />,
    color: "#0891b2",
    bg: "#ecfeff",
    up: false,
  },
  {
    title: "Low Stock Items",
    value: 18,
    change: "+2.1%",
    icon: <WarningAmber />,
    color: "#dc2626",
    bg: "#fef2f2",
    up: false,
  },
];

// ==========================================
// QUICK MODULES
// Update href according to your actual routes
// ==========================================

const quickModules = [
  {
    title: "Profile",
    subtitle: "Manage your profile",
    icon: <PersonOutline />,
    color: "#2563eb",
    bg: "#eff6ff",
    href: "/dashboard/profile",
  },
  {
    title: "Setting",
    subtitle: "System configuration",
    icon: <SettingsOutlined />,
    color: "#64748b",
    bg: "#f1f5f9",
    href: "/dashboard/setting",
  },
  {
    title: "Product",
    subtitle: "Manage products",
    icon: <InventoryOutlined />,
    color: "#9333ea",
    bg: "#faf5ff",
    href: "/dashboard/product",
  },
  {
    title: "Client Management",
    subtitle: "Manage your clients",
    icon: <GroupsOutlined />,
    color: "#0891b2",
    bg: "#ecfeff",
    href: "/dashboard/client-management",
  },
  {
    title: "Smart Purchase",
    subtitle: "Purchase management",
    icon: <ShoppingBasketOutlined />,
    color: "#ea580c",
    bg: "#fff7ed",
    href: "/dashboard/smart-purchase",
  },
  {
    title: "Inventory Management",
    subtitle: "Track your inventory",
    icon: <WarehouseOutlined />,
    color: "#16a34a",
    bg: "#f0fdf4",
    href: "/dashboard/inventory-management",
  },
  {
    title: "Billing System",
    subtitle: "Manage billing",
    icon: <ReceiptOutlined />,
    color: "#db2777",
    bg: "#fdf2f8",
    href: "/dashboard/billing-system",
  },
  {
    title: "Invoice Export",
    subtitle: "Export invoices",
    icon: <FileDownloadOutlined />,
    color: "#4f46e5",
    bg: "#eef2ff",
    href: "/dashboard/invoice-export",
  },
  {
    title: "Digital Delivery",
    subtitle: "Manage deliveries",
    icon: <LocalShippingOutlined />,
    color: "#0284c7",
    bg: "#f0f9ff",
    href: "/dashboard/digital-delivery",
  },
  {
    title: "Reports",
    subtitle: "View business reports",
    icon: <AssessmentOutlined />,
    color: "#ca8a04",
    bg: "#fefce8",
    href: "/dashboard/reports",
  },
];

// ==========================================
// CHART DATA - DEMO DATA
// ==========================================

const chartData = [
  { month: "Jan", revenue: 45, purchase: 30 },
  { month: "Feb", revenue: 65, purchase: 40 },
  { month: "Mar", revenue: 52, purchase: 35 },
  { month: "Apr", revenue: 80, purchase: 48 },
  { month: "May", revenue: 60, purchase: 38 },
  { month: "Jun", revenue: 90, purchase: 55 },
  { month: "Jul", revenue: 72, purchase: 42 },
  { month: "Aug", revenue: 85, purchase: 50 },
  { month: "Sep", revenue: 68, purchase: 44 },
  { month: "Oct", revenue: 95, purchase: 60 },
  { month: "Nov", revenue: 78, purchase: 45 },
  { month: "Dec", revenue: 100, purchase: 65 },
];

// ==========================================
// NUMBER COUNTER
// ==========================================

const Counter = ({ value, prefix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const duration = 1000;
    const steps = 40;
    const increment = value / steps;

    const timer = setInterval(() => {
      current += increment;

      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <>
      {prefix}
      {count.toLocaleString("en-US")}
    </>
  );
};

// ==========================================
// STATISTIC CARD
// ==========================================

const StatCard = ({ item }) => {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #e8edf3",
        borderRadius: "14px",
        height: "100%",
        transition: "all .3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
        },
      }}
    >
      <CardContent sx={{ p: "20px !important" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: item.bg,
              color: item.color,
              borderRadius: "12px",
            }}
          >
            {item.icon}
          </Avatar>

          <Chip
            size="small"
            icon={
              item.up ? (
                <ArrowUpward sx={{ fontSize: "14px !important" }} />
              ) : (
                <ArrowDownward sx={{ fontSize: "14px !important" }} />
              )
            }
            label={item.change}
            sx={{
              bgcolor: item.up ? "#f0fdf4" : "#fff7ed",
              color: item.up ? "#16a34a" : "#ea580c",
              fontWeight: 700,
              borderRadius: "6px",
            }}
          />
        </Stack>

        <Typography
          variant="h4"
          fontWeight={700}
          color="#1e293b"
          mb={0.5}
        >
          <Counter value={item.value} prefix={item.prefix} />
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {item.title}
        </Typography>
      </CardContent>
    </Card>
  );
};

// ==========================================
// MAIN DASHBOARD
// ==========================================

const Dashboard = () => {
  return (
    <PageContainer
      title="Dashboard - Rx Pilot"
      description="Rx Pilot Business Dashboard"
    >
      <SuccessAlert message="Login Successfully" />

      <Box sx={{ width: "100%", pb: 3 }}>

        {/* HEADER */}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
          mb={3}
        >
          <Box>
            <Typography variant="h5" fontWeight={700} color="#1e293b">
              Dashboard Overview
            </Typography>

            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Welcome back! Here's what's happening with your business.
            </Typography>
          </Box>

          <Chip
            label="Business Overview"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Stack>

        {/* STATISTICS CARDS */}

        <Grid container spacing={2.5} mb={3}>
          {statistics.map((item, index) => (
            <Grid
              key={index}
              size={{ xs: 12, sm: 6, md: 4, xl: 2 }}
            >
              <StatCard item={item} />
            </Grid>
          ))}
        </Grid>

   
        {/* QUICK MODULE SHORTCUTS */}

        <Card
          elevation={0}
          sx={{
            border: "1px solid #e8edf3",
            borderRadius: "14px",
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Quick Access
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Quickly access your business modules
                </Typography>
              </Box>

              <Chip
                label={`${quickModules.length} Modules`}
                color="primary"
                variant="outlined"
              />
            </Stack>

            <Grid container spacing={2}>
              {quickModules.map((module, index) => (
                <Grid
                  key={index}
                  size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}
                >
                  <Box
                    component={Link}
                    href={module.href}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      minHeight: 85,
                      textDecoration: "none",
                      border: "1px solid #edf0f4",
                      borderRadius: "12px",
                      transition: "all .25s ease",
                      "&:hover": {
                        borderColor: module.color,
                        bgcolor: module.bg,
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: module.bg,
                        color: module.color,
                        width: 42,
                        height: 42,
                        flexShrink: 0,
                      }}
                    >
                      {module.icon}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color="#1e293b"
                        sx={{ lineHeight: 1.3 }}
                      >
                        {module.title}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          mt: 0.4,
                          lineHeight: 1.3,
                        }}
                      >
                        {module.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* BOTTOM SECTION */}

        <Grid container spacing={3}>
          {/* RECENT ACTIVITY */}

          <Grid size={{ xs: 12, md: 7 }}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid #e8edf3",
                borderRadius: "14px",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Recent Activity
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Latest business transactions
                    </Typography>
                  </Box>

                  <MoreHoriz color="action" />
                </Stack>

                {[
                  {
                    title: "New Client Added",
                    description: "A new client was registered",
                    time: "Today, 10:30 AM",
                    icon: <PeopleAlt />,
                    color: "#2563eb",
                    bg: "#eff6ff",
                    status: "Completed",
                  },
                  {
                    title: "Purchase Order",
                    description: "New inventory purchase recorded",
                    time: "Today, 09:15 AM",
                    icon: <ShoppingCart />,
                    color: "#9333ea",
                    bg: "#faf5ff",
                    status: "Completed",
                  },
                  {
                    title: "Invoice Generated",
                    description: "New billing invoice created",
                    time: "Yesterday, 04:45 PM",
                    icon: <ReceiptLong />,
                    color: "#16a34a",
                    bg: "#f0fdf4",
                    status: "Pending",
                  },
                  {
                    title: "Delivery Updated",
                    description: "Delivery status has been updated",
                    time: "Yesterday, 02:20 PM",
                    icon: <LocalShippingOutlined />,
                    color: "#ea580c",
                    bg: "#fff7ed",
                    status: "Completed",
                  },
                ].map((activity, index) => (
                  <React.Fragment key={index}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      py={1.5}
                    >
                      <Avatar
                        sx={{
                          bgcolor: activity.bg,
                          color: activity.color,
                          borderRadius: "10px",
                        }}
                      >
                        {activity.icon}
                      </Avatar>

                      <Box flex={1} minWidth={0}>
                        <Typography fontWeight={700} variant="body2">
                          {activity.title}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {activity.description}
                        </Typography>

                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                        >
                          {activity.time}
                        </Typography>
                      </Box>

                      <Chip
                        size="small"
                        label={activity.status}
                        color={
                          activity.status === "Completed"
                            ? "success"
                            : "warning"
                        }
                        variant="outlined"
                      />
                    </Stack>

                    {index !== 3 && <Divider />}
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* LOW STOCK ALERT */}

          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid #e8edf3",
                borderRadius: "14px",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <WarningAmber sx={{ color: "#dc2626" }} />

                  <Typography variant="h6" fontWeight={700}>
                    Stock Alerts
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" mb={3}>
                  Products that need attention
                </Typography>

                {[
                  { name: "Product A", stock: 5, limit: 20 },
                  { name: "Product B", stock: 8, limit: 25 },
                  { name: "Product C", stock: 3, limit: 15 },
                ].map((product) => (
                  <Box
                    key={product.name}
                    sx={{
                      p: 1.5,
                      border: "1px solid #fee2e2",
                      bgcolor: "#fffafa",
                      borderRadius: "10px",
                      mb: 1.5,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2" fontWeight={700}>
                        {product.name}
                      </Typography>

                      <Chip
                        label={`${product.stock} Left`}
                        color="error"
                        size="small"
                      />
                    </Stack>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      mt={0.5}
                      display="block"
                    >
                      Minimum stock: {product.limit}
                    </Typography>
                  </Box>
                ))}

                <Box
                  component={Link}
                  href="/dashboard/inventory-management"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    mt: 2,
                    py: 1.5,
                    borderRadius: "9px",
                    bgcolor: "#eff6ff",
                    color: "#2563eb",
                    fontWeight: 700,
                    textDecoration: "none",
                    fontSize: 14,
                    "&:hover": { bgcolor: "#dbeafe" },
                  }}
                >
                  <Add fontSize="small" />
                  Manage Inventory
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Box>
    </PageContainer>
  );
};

export default Dashboard;
