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
  ReceiptLongOutlined,
  PointOfSaleOutlined,
  Close,
  Refresh,
  PrintOutlined,
} from "@mui/icons-material";

// Make sure these paths match your project structure
import SuccessAlert from "@/app/components/SuccessAlert";
import ErrorAlert from "@/app/components/ErrorAlert";
import { AlertState } from "@/app/components/types/types";

// ============================================
// INITIAL DATA
// ============================================
const initialBills = [
  {
    id: 1,
    invoiceNo: "INV-2026-001",
    customerName: "Walk-in Customer",
    date: "2026-10-25",
    itemsCount: 3,
    subTotal: 1250,
    discount: 50,
    tax: 0,
    grandTotal: 1200,
    paymentMethod: "Cash",
    status: "Paid",
  },
  {
    id: 2,
    invoiceNo: "INV-2026-002",
    customerName: "John Doe",
    date: "2026-10-25",
    itemsCount: 5,
    subTotal: 4500,
    discount: 200,
    tax: 215,
    grandTotal: 4515,
    paymentMethod: "Card",
    status: "Paid",
  },
  {
    id: 3,
    invoiceNo: "INV-2026-003",
    customerName: "Jane Smith",
    date: "2026-10-26",
    itemsCount: 2,
    subTotal: 800,
    discount: 0,
    tax: 40,
    grandTotal: 840,
    paymentMethod: "Easypaisa",
    status: "Pending",
  },
  {
    id: 4,
    invoiceNo: "INV-2026-004",
    customerName: "Ali Khan",
    date: "2026-10-26",
    itemsCount: 10,
    subTotal: 8500,
    discount: 500,
    tax: 400,
    grandTotal: 8400,
    paymentMethod: "Cash",
    status: "Paid",
  },
  {
    id: 5,
    invoiceNo: "INV-2026-005",
    customerName: "Walk-in Customer",
    date: "2026-10-27",
    itemsCount: 1,
    subTotal: 350,
    discount: 0,
    tax: 0,
    grandTotal: 350,
    paymentMethod: "Cash",
    status: "Paid",
  },
];

const emptyForm = {
  invoiceNo: "",
  customerName: "Walk-in Customer",
  date: "",
  itemsCount: "",
  subTotal: "",
  discount: "0",
  tax: "0",
  paymentMethod: "Cash",
  status: "Paid",
};

// ============================================
// SORTING FUNCTIONS
// ============================================
const descendingComparator = (a, b, orderBy) => {
  const first = a[orderBy] ?? "";
  const second = b[orderBy] ?? "";

  if (typeof first === "number" && typeof second === "number") {
    return second - first;
  }

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

export default function BillingSystemPage() {
  const [bills, setBills] = useState(initialBills);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("date");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

   const [alert, setAlert] = useState<{ type: AlertColor; message: string } | null>(null);

  const showAlert = (type: AlertState['type'], message: string) => {
    setAlert({ type, message });
  };

  // Calculate grand total dynamically in the form
  const calculatedGrandTotal = useMemo(() => {
    const sub = Number(form.subTotal) || 0;
    const disc = Number(form.discount) || 0;
    const tax = Number(form.tax) || 0;
    return Math.max(0, sub - disc + tax);
  }, [form.subTotal, form.discount, form.tax]);

  // ==========================================
  // FILTERING & SORTING
  // ==========================================
  const filteredBills = useMemo(() => {
    const result = bills.filter((b) => {
      const keyword = search.toLowerCase();
      const searchMatch = [
        b.invoiceNo,
        b.customerName,
        b.date,
      ].some((value) => String(value || "").toLowerCase().includes(keyword));

      const paymentMatch = paymentFilter === "all" || b.paymentMethod === paymentFilter;
      const statusMatch = statusFilter === "all" || b.status === statusFilter;

      return searchMatch && paymentMatch && statusMatch;
    });

    return [...result].sort(getComparator(order, orderBy));
  }, [bills, search, paymentFilter, statusFilter, order, orderBy]);

  const paginatedBills = filteredBills.slice(
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
      invoiceNo: `INV-${new Date().getFullYear()}-${String(bills.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
    });
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleEdit = (bill) => {
    setEditingId(bill.id);
    setForm({
      ...bill,
      itemsCount: String(bill.itemsCount),
      subTotal: String(bill.subTotal),
      discount: String(bill.discount),
      tax: String(bill.tax),
    });
    setDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const requiredFields = ["invoiceNo", "customerName", "date", "itemsCount", "subTotal"];
    if (requiredFields.some((key) => String(form[key] ?? "").trim() === "")) {
      return showAlert("error", "Please fill all required fields.");
    }

    if (Number(form.itemsCount) <= 0) {
      return showAlert("error", "Items count must be greater than 0.");
    }

    if (Number(form.subTotal) <= 0) {
      return showAlert("error", "Sub total must be greater than 0.");
    }

    if (Number(form.discount) < 0 || Number(form.tax) < 0) {
      return showAlert("error", "Discount and Tax cannot be negative.");
    }

    if (bills.some((b) => b.invoiceNo.toLowerCase() === form.invoiceNo.trim().toLowerCase() && b.id !== editingId)) {
      return showAlert("error", "This Invoice Number already exists.");
    }

    const billData = {
      ...form,
      invoiceNo: form.invoiceNo.trim(),
      customerName: form.customerName.trim(),
      itemsCount: Number(form.itemsCount),
      subTotal: Number(form.subTotal),
      discount: Number(form.discount),
      tax: Number(form.tax),
      grandTotal: calculatedGrandTotal,
    };

    if (editingId !== null) {
      setBills((prev) => prev.map((b) => (b.id === editingId ? { ...b, ...billData } : b)));
      showAlert("success", "Invoice updated successfully!");
    } else {
      setBills((prev) => [{ ...billData, id: Date.now() }, ...prev]);
      setPage(0);
      showAlert("success", "Invoice generated successfully!");
    }

    setDialogOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    setBills((prev) => prev.filter((b) => b.id !== id));
    setPage(0);
    showAlert("success", "Invoice deleted successfully!");
  };

  const handleReset = () => {
    setSearch("");
    setPaymentFilter("all");
    setStatusFilter("all");
    setOrder("desc");
    setOrderBy("date");
    setPage(0);
  };

  // ==========================================
  // TABLE COLUMNS
  // ==========================================
  const columns = [
    { id: "invoiceNo", label: "Invoice No" },
    { id: "customerName", label: "Customer" },
    { id: "date", label: "Date" },
    { id: "itemsCount", label: "Items" },
    { id: "grandTotal", label: "Amount" },
    { id: "paymentMethod", label: "Payment" },
    { id: "status", label: "Status" },
  ];

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
            Billing System
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Generate invoices, manage sales, and track payments.
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
          Create Invoice
        </Button>
      </Stack>

      {/* BILLING ENTRY FORM */}
      <Card elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, mb: 3, width: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}>
              <PointOfSaleOutlined />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Billing Entry
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Create a new customer invoice.
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
                Invoice Details
              </Typography>
            </Box>

            <TextField fullWidth size="small" label="Invoice Number *" name="invoiceNo" value={form.invoiceNo} onChange={handleChange} />
            <TextField fullWidth size="small" label="Customer Name *" name="customerName" value={form.customerName} onChange={handleChange} placeholder="e.g. Walk-in Customer" />
            <TextField fullWidth size="small" label="Invoice Date *" name="date" type="date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth size="small" label="Total Items *" name="itemsCount" type="number" value={form.itemsCount} onChange={handleChange} />

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography fontWeight={700} color="#2563eb">
                Billing & Payment
              </Typography>
            </Box>

            <TextField fullWidth size="small" label="Sub Total (Rs.) *" name="subTotal" type="number" value={form.subTotal} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} />
            <TextField fullWidth size="small" label="Discount (Rs.)" name="discount" type="number" value={form.discount} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} />
            <TextField fullWidth size="small" label="Tax (Rs.)" name="tax" type="number" value={form.tax} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} />

            <TextField fullWidth size="small" select label="Payment Method" name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Card">Card</MenuItem>
              <MenuItem value="Easypaisa">Easypaisa</MenuItem>
              <MenuItem value="JazzCash">JazzCash</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
            </TextField>
            
            <TextField fullWidth size="small" select label="Payment Status" name="status" value={form.status} onChange={handleChange}>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </TextField>

            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#f8fafc", p: 1.5, borderRadius: 2, border: "1px solid #e2e8f0" }}>
              <Typography variant="body2" color="text.secondary" mr={1}>Grand Total:</Typography>
              <Typography variant="h6" fontWeight={700} color="#2563eb">Rs. {calculatedGrandTotal.toLocaleString()}</Typography>
            </Box>

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" spacing={1.5}>
                <Button variant="outlined" color="inherit" onClick={() => setForm(emptyForm)} startIcon={<Refresh />} sx={{ textTransform: "none", borderRadius: 2 }}>
                  Reset Form
                </Button>
                <Button variant="contained" startIcon={<ReceiptLongOutlined />} onClick={handleSave} sx={{ bgcolor: "#2563eb", textTransform: "none", borderRadius: 2, boxShadow: "none" }}>
                  Generate Invoice
                </Button>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* BILLING HISTORY TABLE */}
      <Card elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, width: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box mb={2.5}>
            <Typography variant="h6" fontWeight={700}>
              Invoice History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search, sort, filter and manage past invoices.
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
              placeholder="Search Invoice No, Customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Payment Method</InputLabel>
              <Select value={paymentFilter} label="Payment Method" onChange={(e) => { setPaymentFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Methods</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Card">Card</MenuItem>
                <MenuItem value="Easypaisa">Easypaisa</MenuItem>
                <MenuItem value="JazzCash">JazzCash</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
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
                {paginatedBills.map((bill) => (
                  <TableRow key={bill.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar variant="rounded" sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}>
                          <ReceiptLongOutlined />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700} variant="body2">{bill.invoiceNo}</Typography>
                          <Typography variant="caption" color="text.secondary">{bill.date}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{bill.customerName}</Typography>
                    </TableCell>
                    
                    <TableCell>{bill.date}</TableCell>
                    
                    <TableCell>
                      <Typography fontWeight={700}>{bill.itemsCount}</Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography fontWeight={700} color="#2563eb">
                        Rs. {bill.grandTotal.toLocaleString()}
                      </Typography>
                      {bill.discount > 0 && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Disc: Rs. {bill.discount.toLocaleString()}
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Chip size="small" label={bill.paymentMethod} variant="outlined" />
                    </TableCell>
                    
                    <TableCell>
                      <Chip size="small" color={bill.status === "Paid" ? "success" : "warning"} label={bill.status} />
                    </TableCell>
                    
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Print Invoice">
                          <IconButton size="small" sx={{ color: "#475569" }}>
                            <PrintOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleEdit(bill)} sx={{ color: "#2563eb" }}>
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDelete(bill.id)} sx={{ color: "#dc2626" }}>
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredBills.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <ReceiptLongOutlined sx={{ fontSize: 45, color: "#94a3b8", mb: 1 }} />
                      <Typography fontWeight={700}>No Invoices Found</Typography>
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
            count={filteredBills.length}
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

      {/* EDIT INVOICE DIALOG */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 3, mx: 2, width: "100%" } }}>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography fontWeight={700} variant="h6">Edit Invoice</Typography>
              <Typography variant="caption" color="text.secondary">Update invoice details.</Typography>
            </Box>
            <IconButton onClick={() => setDialogOpen(false)}><Close /></IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField fullWidth size="small" label="Invoice Number *" name="invoiceNo" value={form.invoiceNo} onChange={handleChange} />
            <TextField fullWidth size="small" label="Customer Name *" name="customerName" value={form.customerName} onChange={handleChange} />
            <TextField fullWidth size="small" label="Invoice Date *" name="date" type="date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth size="small" label="Total Items *" name="itemsCount" type="number" value={form.itemsCount} onChange={handleChange} />
            
            <TextField fullWidth size="small" label="Sub Total (Rs.) *" name="subTotal" type="number" value={form.subTotal} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} />
            <TextField fullWidth size="small" label="Discount (Rs.)" name="discount" type="number" value={form.discount} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} />
            <TextField fullWidth size="small" label="Tax (Rs.)" name="tax" type="number" value={form.tax} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} />

            <Box sx={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", alignItems: "center", bgcolor: "#f8fafc", p: 1.5, borderRadius: 2, border: "1px solid #e2e8f0" }}>
              <Typography variant="body2" color="text.secondary" mr={1}>Grand Total:</Typography>
              <Typography variant="h6" fontWeight={700} color="#2563eb">Rs. {calculatedGrandTotal.toLocaleString()}</Typography>
            </Box>

            <TextField fullWidth size="small" select label="Payment Method" name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Card">Card</MenuItem>
              <MenuItem value="Easypaisa">Easypaisa</MenuItem>
              <MenuItem value="JazzCash">JazzCash</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
            </TextField>
            
            <TextField fullWidth size="small" select label="Payment Status" name="status" value={form.status} onChange={handleChange}>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#2563eb", textTransform: "none", boxShadow: "none" }}>Update Invoice</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}