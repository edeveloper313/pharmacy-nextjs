
"use client";

import React, { useState } from "react";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Chip,
  Button,
  Divider,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import {
  TrendingUp,
  TrendingDown,
  Payments,
  ShoppingCart,
  AccountBalanceWallet,
  ReceiptLong,
  Inventory2,
  Download,
  Print,
  Assessment,
  CalendarMonth,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";

import SuccessAlert from "@/app/components/SuccessAlert";
import ErrorAlert from "@/app/components/ErrorAlert";

// ==========================================
// DEMO REPORT DATA
// Replace with your API data
// ==========================================

const reportStats = [
  {
    title: "Total Sales",
    value: "Rs. 485,000",
    change: "+12.5%",
    icon: <TrendingUp />,
    color: "#2563eb",
    bg: "#eff6ff",
    positive: true,
  },
  {
    title: "Total Purchases",
    value: "Rs. 185,000",
    change: "+8.2%",
    icon: <ShoppingCart />,
    color: "#9333ea",
    bg: "#faf5ff",
    positive: true,
  },
  {
    title: "Net Profit",
    value: "Rs. 210,000",
    change: "+15.3%",
    icon: <AccountBalanceWallet />,
    color: "#16a34a",
    bg: "#f0fdf4",
    positive: true,
  },
  {
    title: "Pending Payments",
    value: "Rs. 45,000",
    change: "-5.2%",
    icon: <ReceiptLong />,
    color: "#ea580c",
    bg: "#fff7ed",
    positive: false,
  },
];

// ==========================================
// MONTHLY CHART DATA
// ==========================================

const monthlyData = [
  { month: "Jan", sales: 45, purchase: 25 },
  { month: "Feb", sales: 60, purchase: 35 },
  { month: "Mar", sales: 52, purchase: 30 },
  { month: "Apr", sales: 75, purchase: 42 },
  { month: "May", sales: 65, purchase: 38 },
  { month: "Jun", sales: 90, purchase: 50 },
  { month: "Jul", sales: 70, purchase: 45 },
  { month: "Aug", sales: 85, purchase: 55 },
  { month: "Sep", sales: 60, purchase: 35 },
  { month: "Oct", sales: 95, purchase: 60 },
  { month: "Nov", sales: 80, purchase: 45 },
  { month: "Dec", sales: 100, purchase: 65 },
];

// ==========================================
// TRANSACTIONS
// ==========================================

const transactions = [
  {
    id: "#INV-1001",
    name: "Ahmed Medical Store",
    type: "Sale",
    date: "15 Nov 2026",
    amount: "Rs. 25,000",
    status: "Paid",
  },
  {
    id: "#PUR-1002",
    name: "ABC Pharmaceuticals",
    type: "Purchase",
    date: "14 Nov 2026",
    amount: "Rs. 18,500",
    status: "Pending",
  },
  {
    id: "#INV-1003",
    name: "City Pharmacy",
    type: "Sale",
    date: "13 Nov 2026",
    amount: "Rs. 12,000",
    status: "Paid",
  },
  {
    id: "#PUR-1004",
    name: "Health Distributors",
    type: "Purchase",
    date: "12 Nov 2026",
    amount: "Rs. 32,000",
    status: "Paid",
  },
  {
    id: "#INV-1005",
    name: "Al Madina Medical",
    type: "Sale",
    date: "11 Nov 2026",
    amount: "Rs. 8,500",
    status: "Pending",
  },
];

// ==========================================
// STAT CARD
// ==========================================

const ReportStatCard = ({ item }) => {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #e8edf3",
        borderRadius: "14px",
        height: "100%",
        transition: "all .3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
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
              bgcolor: item.bg,
              color: item.color,
              borderRadius: "12px",
              width: 48,
              height: 48,
            }}
          >
            {item.icon}
          </Avatar>

          <Chip
            size="small"
            icon={
              item.positive ? (
                <ArrowUpward sx={{ fontSize: "14px !important" }} />
              ) : (
                <ArrowDownward sx={{ fontSize: "14px !important" }} />
              )
            }
            label={item.change}
            sx={{
              bgcolor: item.positive ? "#f0fdf4" : "#fff7ed",
              color: item.positive ? "#16a34a" : "#ea580c",
              fontWeight: 700,
            }}
          />
        </Stack>

        <Typography
          variant="h5"
          fontWeight={700}
          color="#1e293b"
          mb={0.5}
        >
          {item.value}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {item.title}
        </Typography>
      </CardContent>
    </Card>
  );
};

// ==========================================
// MAIN REPORT PAGE
// ==========================================

export default function ReportsPage() {
  const [reportType, setReportType] = useState("all");
  const [dateRange, setDateRange] = useState("monthly");

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // ========================================
  // CSV EXPORT
  // ========================================

  const handleExport = () => {
    try {
      const headers = [
        "Invoice ID",
        "Client / Supplier",
        "Type",
        "Date",
        "Amount",
        "Status",
      ];

      const rows = transactions
        .filter((item) => {
          if (reportType === "all") return true;
          return item.type.toLowerCase() === reportType;
        })
        .map((item) => [
          item.id,
          item.name,
          item.type,
          item.date,
          item.amount,
          item.status,
        ]);

      const csv = [
        headers,
        ...rows,
      ]
        .map((row) =>
          row.map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          ).join(",")
        )
        .join("\n");

      const blob = new Blob(
        ["\uFEFF" + csv],
        { type: "text/csv;charset=utf-8;" }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "rx-pilot-report.csv";
      link.click();

      URL.revokeObjectURL(url);

      setShowError(false);
      setShowSuccess(true);
    } catch (error) {
      setShowError(true);
      setShowSuccess(false);
    }
  };

  // ========================================
  // PRINT REPORT
  // ========================================

  const handlePrint = () => {
    window.print();
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((item) => {
    if (reportType === "all") return true;
    return item.type.toLowerCase() === reportType;
  });

  return (
    <Box sx={{ width: "100%", pb: 4 }}>

      {/* ALERTS */}

      {showSuccess && (
        <SuccessAlert message="Report exported successfully!" />
      )}

      {showError && (
        <ErrorAlert message="Unable to export report!" />
      )}

      {/* ================================= */}
      {/* PAGE HEADER */}
      {/* ================================= */}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            color="#1e293b"
          >
            Reports & Analytics
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mt={0.5}
          >
            Monitor sales, purchases, profits and inventory performance.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={handlePrint}
            sx={{
              borderRadius: "9px",
              textTransform: "none",
            }}
          >
            Print
          </Button>

          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleExport}
            sx={{
              bgcolor: "#2563eb",
              borderRadius: "9px",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#1d4ed8",
                boxShadow: "none",
              },
            }}
          >
            Export CSV
          </Button>
        </Stack>
      </Stack>

      {/* ================================= */}
      {/* REPORT FILTERS */}
      {/* ================================= */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid #e8edf3",
          borderRadius: "14px",
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ md: "center" }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                sx={{
                  bgcolor: "#eff6ff",
                  color: "#2563eb",
                  width: 40,
                  height: 40,
                }}
              >
                <Assessment />
              </Avatar>

              <Box>
                <Typography fontWeight={700}>
                  Report Filters
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Customize your report view
                </Typography>
              </Box>
            </Stack>

            <Box flex={1} />

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Report Type</InputLabel>

              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="all">All Reports</MenuItem>
                <MenuItem value="sale">Sales</MenuItem>
                <MenuItem value="purchase">Purchases</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Date Range</InputLabel>

              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => setDateRange(e.target.value)}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="weekly">This Week</MenuItem>
                <MenuItem value="monthly">This Month</MenuItem>
                <MenuItem value="yearly">This Year</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      {/* ================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================= */}

      <Grid container spacing={2.5} mb={3}>
        {reportStats.map((item, index) => (
          <Grid
            key={index}
            size={{ xs: 12, sm: 6, xl: 3 }}
          >
            <ReportStatCard item={item} />
          </Grid>
        ))}
      </Grid>

      {/* ================================= */}
      {/* SALES & PURCHASE CHART */}
      {/* ================================= */}

      <Grid container spacing={3} mb={3}>

        <Grid size={{ xs: 12, lg: 8 }}>
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
                    Sales & Purchase Analytics
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Monthly business performance
                  </Typography>
                </Box>

                <Chip
                  label="2026"
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Stack>

              <Stack direction="row" spacing={2} mb={3}>
                <Stack direction="row" alignItems="center" spacing={0.8}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      bgcolor: "#2563eb",
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="caption">Sales</Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={0.8}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      bgcolor: "#16a34a",
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="caption">Purchases</Typography>
                </Stack>
              </Stack>

              {/* CHART */}

              <Box
                sx={{
                  height: 245,
                  display: "flex",
                  alignItems: "flex-end",
                  borderBottom: "1px solid #e5e7eb",
                  position: "relative",
                  pb: 0,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    pointerEvents: "none",
                  }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <Divider
                      key={i}
                      sx={{
                        borderStyle: "dashed",
                        borderColor: "#e5e7eb",
                      }}
                    />
                  ))}
                </Box>

                {monthlyData.map((item) => (
                  <Box
                    key={item.month}
                    sx={{
                      flex: 1,
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-end",
                      gap: "3px",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Box
                      title={`Sales: ${item.sales}`}
                      sx={{
                        width: "35%",
                        maxWidth: 22,
                        height: `${item.sales}%`,
                        bgcolor: "#2563eb",
                        borderRadius: "5px 5px 0 0",
                        transition: "all .3s",
                        "&:hover": {
                          bgcolor: "#1d4ed8",
                        },
                      }}
                    />

                    <Box
                      title={`Purchase: ${item.purchase}`}
                      sx={{
                        width: "35%",
                        maxWidth: 22,
                        height: `${item.purchase}%`,
                        bgcolor: "#16a34a",
                        borderRadius: "5px 5px 0 0",
                        transition: "all .3s",
                        "&:hover": {
                          bgcolor: "#15803d",
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>

              <Stack
                direction="row"
                justifyContent="space-around"
                mt={1.5}
              >
                {monthlyData.map((item) => (
                  <Typography
                    key={item.month}
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: { xs: 9, sm: 11 } }}
                  >
                    {item.month}
                  </Typography>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* PROFIT BREAKDOWN */}

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e8edf3",
              borderRadius: "14px",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                Profit Breakdown
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={3}>
                Business financial summary
              </Typography>

              <Box mb={3}>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="#16a34a"
                >
                  Rs. 210,000
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Net Profit
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {[
                {
                  label: "Total Revenue",
                  amount: "Rs. 485,000",
                  color: "#2563eb",
                },
                {
                  label: "Total Purchases",
                  amount: "Rs. 185,000",
                  color: "#9333ea",
                },
                {
                  label: "Other Expenses",
                  amount: "Rs. 90,000",
                  color: "#ea580c",
                },
                {
                  label: "Net Profit",
                  amount: "Rs. 210,000",
                  color: "#16a34a",
                },
              ].map((item) => (
                <Stack
                  key={item.label}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        bgcolor: item.color,
                      }}
                    />

                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Stack>

                  <Typography variant="body2" fontWeight={700}>
                    {item.amount}
                  </Typography>
                </Stack>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ================================= */}
      {/* INVENTORY REPORT */}
      {/* ================================= */}

      <Grid container spacing={3} mb={3}>
        <Grid size={12}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e8edf3",
              borderRadius: "14px",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                mb={3}
              >
                <Avatar
                  sx={{
                    bgcolor: "#eff6ff",
                    color: "#2563eb",
                    borderRadius: "10px",
                  }}
                >
                  <Inventory2 />
                </Avatar>

                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Inventory Report
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Current stock distribution
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={3}>
                {[
                  {
                    label: "In Stock",
                    count: "6,120",
                    percentage: 72,
                    color: "#16a34a",
                    bg: "#f0fdf4",
                  },
                  {
                    label: "Low Stock",
                    count: "1,530",
                    percentage: 18,
                    color: "#f59e0b",
                    bg: "#fffbeb",
                  },
                  {
                    label: "Out of Stock",
                    count: "850",
                    percentage: 10,
                    color: "#dc2626",
                    bg: "#fef2f2",
                  },
                ].map((item) => (
                  <Grid
                    key={item.label}
                    size={{ xs: 12, md: 4 }}
                  >
                    <Box
                      sx={{
                        p: 2.5,
                        bgcolor: item.bg,
                        borderRadius: "12px",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        mb={2}
                      >
                        <Typography fontWeight={700}>
                          {item.label}
                        </Typography>

                        <Typography fontWeight={700} color={item.color}>
                          {item.percentage}%
                        </Typography>
                      </Stack>

                      <Typography variant="h4" fontWeight={700} mb={2}>
                        {item.count}
                      </Typography>

                      <LinearProgress
                        variant="determinate"
                        value={item.percentage}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          bgcolor: "#ffffff",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: item.color,
                            borderRadius: 5,
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ================================= */}
      {/* TRANSACTIONS TABLE */}
      {/* ================================= */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid #e8edf3",
          borderRadius: "14px",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
            mb={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Recent Transactions
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Latest sales and purchase records
              </Typography>
            </Box>

            <Chip
              label={`${filteredTransactions.length} Records`}
              color="primary"
              variant="outlined"
            />
          </Stack>

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  {[
                    "Invoice ID",
                    "Client / Supplier",
                    "Type",
                    "Date",
                    "Amount",
                    "Status",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        fontWeight: 700,
                        color: "#475569",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredTransactions.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      "&:last-child td": { border: 0 },
                    }}
                  >
                    <TableCell>
                      <Typography
                        fontWeight={700}
                        color="#2563eb"
                        variant="body2"
                      >
                        {item.id}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {item.name}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={item.type}
                        size="small"
                        color={item.type === "Sale" ? "primary" : "secondary"}
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item.date}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight={700} variant="body2">
                        {item.amount}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={item.status}
                        size="small"
                        color={item.status === "Paid" ? "success" : "warning"}
                      />
                    </TableCell>
                  </TableRow>
                ))}

                {filteredTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

    </Box>
  );
}
