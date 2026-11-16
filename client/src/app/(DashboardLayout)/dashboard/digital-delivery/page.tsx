"use client";

import React, { useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  InputAdornment,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  AlertColor,
} from "@mui/material";

import {
  Add,
  Search,
  EditOutlined,
  DeleteOutline,
  LocalShippingOutlined,
  DeliveryDiningOutlined,
  Close,
  Refresh,
  LocationOnOutlined,
} from "@mui/icons-material";

// Make sure these paths match your project structure
import SuccessAlert from "@/app/components/SuccessAlert";
import ErrorAlert from "@/app/components/ErrorAlert";
import { AlertState } from "@/app/components/types/types";

// ============================================
// INITIAL DATA
// ============================================
const initialDeliveries = [
  {
    id: 1,
    orderNo: "DEL-2026-001",
    customerName: "John Doe",
    phone: "0300-1234567",
    address: "House 123, Street 4, Clifton, Karachi",
    deliveryType: "Standard",
    riderName: "Ahmed Ali",
    deliveryDate: "2026-10-28",
    deliveryTime: "10:30 AM",
    status: "Delivered",
  },
  {
    id: 2,
    orderNo: "DEL-2026-002",
    customerName: "Jane Smith",
    phone: "0321-7654321",
    address: "Flat 4B, Gulberg III, Lahore",
    deliveryType: "Express",
    riderName: "Usman Khan",
    deliveryDate: "2026-10-28",
    deliveryTime: "02:00 PM",
    status: "In Transit",
  },
  {
    id: 3,
    orderNo: "DEL-2026-003",
    customerName: "Ali Khan",
    phone: "0333-5555555",
    address: "Sector F-10, Islamabad",
    deliveryType: "Standard",
    riderName: "Bilal Ahmed",
    deliveryDate: "2026-10-29",
    deliveryTime: "11:00 AM",
    status: "Pending",
  },
  {
    id: 4,
    orderNo: "DEL-2026-004",
    customerName: "Dr. Sarah Ahmed",
    phone: "0345-9998888",
    address: "CMH Rawalpindi",
    deliveryType: "Express",
    riderName: "Ahmed Ali",
    deliveryDate: "2026-10-27",
    deliveryTime: "09:00 AM",
    status: "Delivered",
  },
  {
    id: 5,
    orderNo: "DEL-2026-005",
    customerName: "Bilal Hussain",
    phone: "0311-4443333",
    address: "Satellite Town, Gujranwala",
    deliveryType: "Standard",
    riderName: "Unassigned",
    deliveryDate: "2026-10-30",
    deliveryTime: "03:30 PM",
    status: "Cancelled",
  },
];

const emptyForm = {
  orderNo: "",
  customerName: "",
  phone: "",
  address: "",
  deliveryType: "Standard",
  riderName: "Unassigned",
  deliveryDate: "",
  deliveryTime: "",
  status: "Pending",
};

// ============================================
// SORTING FUNCTIONS
// ============================================
const descendingComparator = (a, b, orderBy) => {
  const first = a[orderBy] ?? "";
  const second = b[orderBy] ?? "";

  return String(second).localeCompare(String(first), undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export default function DigitalDeliveryPage() {
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("deliveryDate");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

   const [alert, setAlert] = useState<{ type: AlertColor; message: string } | null>(null);

  const showAlert = (type: AlertState['type'], message: string) => {
    setAlert({ type, message });
  };
  // ==========================================
  // FILTERING & SORTING
  // ==========================================
  const filteredDeliveries = useMemo(() => {
    const result = deliveries.filter((d) => {
      const keyword = search.toLowerCase();
      const searchMatch = [
        d.orderNo,
        d.customerName,
        d.phone,
        d.address,
        d.riderName,
      ].some((value) => String(value || "").toLowerCase().includes(keyword));

      const statusMatch = statusFilter === "all" || d.status === statusFilter;
      const typeMatch = typeFilter === "all" || d.deliveryType === typeFilter;

      return searchMatch && statusMatch && typeMatch;
    });

    return [...result].sort(getComparator(order, orderBy));
  }, [deliveries, search, statusFilter, typeFilter, order, orderBy]);

  const paginatedDeliveries = filteredDeliveries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleAdd = () => {
    setForm({
      ...emptyForm,
      orderNo: `DEL-${new Date().getFullYear()}-${String(deliveries.length + 1).padStart(3, "0")}`,
      deliveryDate: new Date().toISOString().split("T")[0],
    });
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({ ...item });
    setDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const requiredFields = ["orderNo", "customerName", "phone", "address", "deliveryDate", "deliveryTime"];
    if (requiredFields.some((key) => String(form[key] ?? "").trim() === "")) {
      return showAlert("error", "Please fill all required fields.");
    }

    if (deliveries.some((d) => d.orderNo.toLowerCase() === form.orderNo.trim().toLowerCase() && d.id !== editingId)) {
      return showAlert("error", "This Order Number already exists.");
    }

    const deliveryData = {
      ...form,
      orderNo: form.orderNo.trim(),
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      riderName: form.riderName.trim(),
    };

    if (editingId !== null) {
      setDeliveries((prev) => prev.map((d) => (d.id === editingId ? { ...d, ...deliveryData } : d)));
      showAlert("success", "Delivery updated successfully!");
    } else {
      setDeliveries((prev) => [{ ...deliveryData, id: Date.now() }, ...prev]);
      setPage(0);
      showAlert("success", "Delivery scheduled successfully!");
    }

    setDialogOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this delivery record?")) return;
    setDeliveries((prev) => prev.filter((d) => d.id !== id));
    setPage(0);
    showAlert("success", "Delivery record deleted!");
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setOrder("desc");
    setOrderBy("deliveryDate");
    setPage(0);
  };

  // ==========================================
  // TABLE COLUMNS
  // ==========================================
  const columns = [
    { id: "orderNo", label: "Order No" },
    { id: "customerName", label: "Customer & Address" },
    { id: "deliveryType", label: "Type" },
    { id: "riderName", label: "Rider" },
    { id: "deliveryDate", label: "Date & Time" },
    { id: "status", label: "Status" },
  ];

  const getStatusColor = (status) => {
    if (status === "Delivered") return "success";
    if (status === "In Transit") return "info";
    if (status === "Pending") return "warning";
    if (status === "Cancelled") return "error";
    return "default";
  };

  return (
    <Box
      sx={{
        pb: 4,
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {alert?.type === "success" && <SuccessAlert key={alert.message} message={alert.message} />}
      {alert?.type === "error" && <ErrorAlert key={alert.message} message={alert.message} />}

      {/* HEADER */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1e293b">
            Digital Delivery
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Manage home deliveries, assign riders, and track order status.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          sx={{
            bgcolor: "#2563eb",
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "none",
            px: 2.5,
            whiteSpace: "nowrap",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          New Delivery
        </Button>
      </Stack>

      {/* DELIVERY ENTRY FORM */}
      <Card elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, mb: 3, width: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}>
              <DeliveryDiningOutlined />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Delivery Entry
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Schedule a new home delivery order.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* CSS GRID FOR RESPONSIVE LAYOUT */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography fontWeight={700} color="#2563eb">
                Customer Information
              </Typography>
            </Box>

            <TextField fullWidth size="small" label="Order Number *" name="orderNo" value={form.orderNo} onChange={handleChange} />
            <TextField fullWidth size="small" label="Customer Name *" name="customerName" value={form.customerName} onChange={handleChange} placeholder="e.g. John Doe" />
            <TextField fullWidth size="small" label="Phone Number *" name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 0300-1234567" />
            
            <Box sx={{ gridColumn: { xs: "1 / -1", sm: "1 / -1", lg: "1 / -1" } }}>
              <TextField fullWidth size="small" label="Delivery Address *" name="address" value={form.address} onChange={handleChange} placeholder="e.g. House 123, Street 4, City" />
            </Box>

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography fontWeight={700} color="#2563eb">
                Delivery Details
              </Typography>
            </Box>

            <TextField fullWidth size="small" select label="Delivery Type" name="deliveryType" value={form.deliveryType} onChange={handleChange}>
              <MenuItem value="Standard">Standard</MenuItem>
              <MenuItem value="Express">Express</MenuItem>
            </TextField>
            
            <TextField fullWidth size="small" select label="Assign Rider" name="riderName" value={form.riderName} onChange={handleChange}>
              <MenuItem value="Unassigned">Unassigned</MenuItem>
              <MenuItem value="Ahmed Ali">Ahmed Ali</MenuItem>
              <MenuItem value="Usman Khan">Usman Khan</MenuItem>
              <MenuItem value="Bilal Ahmed">Bilal Ahmed</MenuItem>
            </TextField>
            
            <TextField fullWidth size="small" label="Delivery Date *" name="deliveryDate" type="date" value={form.deliveryDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth size="small" label="Delivery Time *" name="deliveryTime" type="time" value={form.deliveryTime} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            
            <TextField fullWidth size="small" select label="Delivery Status" name="status" value={form.status} onChange={handleChange}>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Transit">In Transit</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" spacing={1.5}>
                <Button variant="outlined" color="inherit" onClick={() => setForm(emptyForm)} startIcon={<Refresh />} sx={{ textTransform: "none", borderRadius: 2 }}>
                  Reset Form
                </Button>
                <Button variant="contained" startIcon={<LocalShippingOutlined />} onClick={handleSave} sx={{ bgcolor: "#2563eb", textTransform: "none", borderRadius: 2, boxShadow: "none" }}>
                  Save Delivery
                </Button>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* DELIVERY DATA TABLE */}
      <Card elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, width: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box mb={2.5}>
            <Typography variant="h6" fontWeight={700}>
              Delivery History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search, sort, filter and manage your delivery orders.
            </Typography>
          </Box>

          {/* SEARCH AND FILTER */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "2fr 1fr 1fr auto" },
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search order no, customer, rider..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Transit">In Transit</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select value={typeFilter} label="Type" onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="Standard">Standard</MenuItem>
                <MenuItem value="Express">Express</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Reset Filters">
                <Button fullWidth variant="outlined" onClick={handleReset} sx={{ height: 40, minWidth: 40 }}>
                  <Refresh />
                </Button>
              </Tooltip>
            </Box>
          </Box>

          {/* TABLE */}
          <TableContainer
            sx={{
              overflowX: "auto",
              maxWidth: "100%",
              "&::-webkit-scrollbar": { height: 8 },
              "&::-webkit-scrollbar-thumb": { bgcolor: "#cbd5e1", borderRadius: 4 },
            }}
          >
            <Table sx={{ minWidth: 950 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  {columns.map((column) => (
                    <TableCell key={column.id} sx={{ fontWeight: 700, color: "#475569", whiteSpace: "nowrap" }}>
                      <TableSortLabel active={orderBy === column.id} direction={orderBy === column.id ? order : "asc"} onClick={() => handleSort(column.id)}>
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedDeliveries.map((item) => (
                  <TableRow key={item.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar variant="rounded" sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}>
                          <LocalShippingOutlined />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700} variant="body2">{item.orderNo}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.phone}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{item.customerName}</Typography>
                      <Tooltip title={item.address}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <LocationOnOutlined sx={{ fontSize: 14 }} />
                          {item.address}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={item.deliveryType} 
                        variant="outlined" 
                        color={item.deliveryType === "Express" ? "warning" : "default"}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" color={item.riderName === "Unassigned" ? "text.secondary" : "text.primary"} fontStyle={item.riderName === "Unassigned" ? "italic" : "normal"}>
                        {item.riderName}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{item.deliveryDate}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.deliveryTime}</Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip size="small" color={getStatusColor(item.status)} label={item.status} />
                    </TableCell>
                    
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleEdit(item)} sx={{ color: "#2563eb" }}>
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDelete(item.id)} sx={{ color: "#dc2626" }}>
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredDeliveries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <LocalShippingOutlined sx={{ fontSize: 45, color: "#94a3b8", mb: 1 }} />
                      <Typography fontWeight={700}>No Deliveries Found</Typography>
                      <Typography variant="body2" color="text.secondary">Try another search or filter.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* PAGINATION */}
          <TablePagination
            component="div"
            count={filteredDeliveries.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              ".MuiTablePagination-toolbar": {
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-end" },
              },
            }}
          />
        </CardContent>
      </Card>

      {/* EDIT DELIVERY DIALOG */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 3, mx: 2, width: "100%" } }}>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography fontWeight={700} variant="h6">Edit Delivery</Typography>
              <Typography variant="caption" color="text.secondary">Update delivery information.</Typography>
            </Box>
            <IconButton onClick={() => setDialogOpen(false)}><Close /></IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField fullWidth size="small" label="Order Number *" name="orderNo" value={form.orderNo} onChange={handleChange} />
            <TextField fullWidth size="small" label="Customer Name *" name="customerName" value={form.customerName} onChange={handleChange} />
            <TextField fullWidth size="small" label="Phone Number *" name="phone" value={form.phone} onChange={handleChange} />
            
            <Box sx={{ gridColumn: "1 / -1" }}>
              <TextField fullWidth size="small" label="Delivery Address *" name="address" value={form.address} onChange={handleChange} />
            </Box>

            <TextField fullWidth size="small" select label="Delivery Type" name="deliveryType" value={form.deliveryType} onChange={handleChange}>
              <MenuItem value="Standard">Standard</MenuItem>
              <MenuItem value="Express">Express</MenuItem>
            </TextField>
            
            <TextField fullWidth size="small" select label="Assign Rider" name="riderName" value={form.riderName} onChange={handleChange}>
              <MenuItem value="Unassigned">Unassigned</MenuItem>
              <MenuItem value="Ahmed Ali">Ahmed Ali</MenuItem>
              <MenuItem value="Usman Khan">Usman Khan</MenuItem>
              <MenuItem value="Bilal Ahmed">Bilal Ahmed</MenuItem>
            </TextField>
            
            <TextField fullWidth size="small" label="Delivery Date *" name="deliveryDate" type="date" value={form.deliveryDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth size="small" label="Delivery Time *" name="deliveryTime" type="time" value={form.deliveryTime} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            
            <TextField fullWidth size="small" select label="Delivery Status" name="status" value={form.status} onChange={handleChange}>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Transit">In Transit</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#2563eb", textTransform: "none", boxShadow: "none" }}>Update Delivery</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}