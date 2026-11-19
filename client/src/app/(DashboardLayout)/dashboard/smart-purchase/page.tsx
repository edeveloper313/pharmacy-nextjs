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
  ShoppingCartOutlined,
  LocalPharmacyOutlined,
  Close,
  Refresh,
  ReceiptOutlined,
} from "@mui/icons-material";

// Make sure these paths match your project structure
import Alert from "@/app/components/Alert";
import { AlertState } from "@/app/components/types/types";

// ============================================
// INITIAL DATA
// ============================================
const initialPurchases = [
  {
    id: 1,
    invoiceNo: "PUR-2026-001",
    supplier: "GSK Pakistan",
    invoiceDate: "2026-10-15",
    totalItems: 3,
    subTotal: 45000,
    discount: 2000,
    grandTotal: 43000,
    status: "Received",
    paymentStatus: "Paid",
  },
  {
    id: 2,
    invoiceNo: "PUR-2026-002",
    supplier: "Abbott Laboratories",
    invoiceDate: "2026-10-16",
    totalItems: 5,
    subTotal: 120000,
    discount: 5000,
    grandTotal: 115000,
    status: "Pending",
    paymentStatus: "Unpaid",
  },
  {
    id: 3,
    invoiceNo: "PUR-2026-003",
    supplier: "Getz Pharma",
    invoiceDate: "2026-10-18",
    totalItems: 2,
    subTotal: 8500,
    discount: 0,
    grandTotal: 8500,
    status: "Received",
    paymentStatus: "Partial",
  },
  {
    id: 4,
    invoiceNo: "PUR-2026-004",
    supplier: "Searle Pakistan",
    invoiceDate: "2026-10-20",
    totalItems: 4,
    subTotal: 32000,
    discount: 1500,
    grandTotal: 30500,
    status: "Cancelled",
    paymentStatus: "Unpaid",
  },
  {
    id: 5,
    invoiceNo: "PUR-2026-005",
    supplier: "Hilton Pharma",
    invoiceDate: "2026-10-22",
    totalItems: 8,
    subTotal: 95000,
    discount: 2500,
    grandTotal: 92500,
    status: "Received",
    paymentStatus: "Paid",
  },
];

const emptyForm = {
  invoiceNo: "",
  supplier: "",
  invoiceDate: "",
  totalItems: "",
  subTotal: "",
  discount: "0",
  status: "Pending",
  paymentStatus: "Unpaid",
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

export default function SmartPurchasePage() {
  const [purchases, setPurchases] = useState(initialPurchases);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

    const [order, setOrder] = useState<"asc" | "desc">("desc");

  const [orderBy, setOrderBy] = useState("invoiceDate");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
 const [alert, setAlert] = useState<
  { id: number; type: AlertColor; message: string } | null
>(null);

const showAlert = (type: AlertColor, message: string) => {
  setAlert({ id: Date.now(), type, message });
};

  // Calculate grand total dynamically in the form
  const calculatedGrandTotal = useMemo(() => {
    const sub = Number(form.subTotal) || 0;
    const disc = Number(form.discount) || 0;
    return Math.max(0, sub - disc);
  }, [form.subTotal, form.discount]);

  // ==========================================
  // FILTERING & SORTING
  // ==========================================
  const filteredPurchases = useMemo(() => {
    const result = purchases.filter((p) => {
      const keyword = search.toLowerCase();
      const searchMatch = [
        p.invoiceNo,
        p.supplier,
        p.invoiceDate,
      ].some((value) => String(value || "").toLowerCase().includes(keyword));

      const statusMatch = statusFilter === "all" || p.status === statusFilter;
      const paymentMatch = paymentFilter === "all" || p.paymentStatus === paymentFilter;

      return searchMatch && statusMatch && paymentMatch;
    });

    return [...result].sort(getComparator(order, orderBy));
  }, [purchases, search, statusFilter, paymentFilter, order, orderBy]);

  const paginatedPurchases = filteredPurchases.slice(
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
      invoiceNo: `PUR-${new Date().getFullYear()}-${String(purchases.length + 1).padStart(3, "0")}`,
      invoiceDate: new Date().toISOString().split("T")[0],
    });
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleEdit = (purchase) => {
    setEditingId(purchase.id);
    setForm({
      ...purchase,
      totalItems: String(purchase.totalItems),
      subTotal: String(purchase.subTotal),
      discount: String(purchase.discount),
    });
    setDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const requiredFields = ["invoiceNo", "supplier", "invoiceDate", "totalItems", "subTotal"];
    if (requiredFields.some((key) => String(form[key] ?? "").trim() === "")) {
      return showAlert("error", "Please fill all required fields.");
    }

    if (Number(form.totalItems) <= 0) {
      return showAlert("error", "Total items must be greater than 0.");
    }

    if (Number(form.subTotal) <= 0) {
      return showAlert("error", "Sub total must be greater than 0.");
    }

    if (Number(form.discount) < 0 || Number(form.discount) > Number(form.subTotal)) {
      return showAlert("error", "Discount cannot be negative or greater than sub total.");
    }

    if (purchases.some((p) => p.invoiceNo.toLowerCase() === form.invoiceNo.trim().toLowerCase() && p.id !== editingId)) {
      return showAlert("error", "This Invoice Number already exists.");
    }

    const purchaseData = {
      ...form,
      invoiceNo: form.invoiceNo.trim(),
      supplier: form.supplier.trim(),
      totalItems: Number(form.totalItems),
      subTotal: Number(form.subTotal),
      discount: Number(form.discount),
      grandTotal: calculatedGrandTotal,
    };

    if (editingId !== null) {
      setPurchases((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...purchaseData } : p)));
      showAlert("success", "Purchase order updated successfully!");
    } else {
      setPurchases((prev) => [{ ...purchaseData, id: Date.now() }, ...prev]);
      setPage(0);
      showAlert("success", "Purchase order created successfully!");
    }

    setDialogOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase record?")) return;
    setPurchases((prev) => prev.filter((p) => p.id !== id));
    setPage(0);
    showAlert("success", "Purchase record deleted!");
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setOrder("asc");
    setOrderBy("invoiceDate");
    setPage(0);
  };

  // ==========================================
  // TABLE COLUMNS
  // ==========================================
  const columns = [
    { id: "invoiceNo", label: "Invoice / PO" },
    { id: "supplier", label: "Supplier" },
    { id: "invoiceDate", label: "Date" },
    { id: "totalItems", label: "Items" },
    { id: "grandTotal", label: "Grand Total" },
    { id: "status", label: "Status" },
    { id: "paymentStatus", label: "Payment" },
  ];

  const getStatusColor = (status) => {
    if (status === "Received") return "success";
    if (status === "Pending") return "warning";
    if (status === "Cancelled") return "error";
    return "default";
  };

  const getPaymentColor = (status) => {
    if (status === "Paid") return "success";
    if (status === "Partial") return "warning";
    if (status === "Unpaid") return "error";
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
      {alert && (
  <Alert
    key={alert.id}          
    id={alert.id}           
    type={alert.type}
    message={alert.message}
  />
)}


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
            Smart Purchase
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Manage supplier invoices, stock purchases, and payables.
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
          New Purchase
        </Button>
      </Stack>

      {/* PURCHASE ENTRY FORM */}
      <Card elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, mb: 3, width: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}>
              <LocalPharmacyOutlined />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Purchase Order Entry
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Record a new purchase invoice from a supplier.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* CSS GRID FOR RESPONSIVE LAYOUT WITHOUT SCROLLBARS */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography fontWeight={700} color="#2563eb">
                Invoice Information
              </Typography>
            </Box>

            <TextField fullWidth size="small" label="Invoice / PO Number *" name="invoiceNo" value={form.invoiceNo} onChange={handleChange} placeholder="e.g. PUR-2026-006" />
            
            <TextField fullWidth size="small" select label="Supplier *" name="supplier" value={form.supplier} onChange={handleChange}>
              <MenuItem value="GSK Pakistan">GSK Pakistan</MenuItem>
              <MenuItem value="Abbott Laboratories">Abbott Laboratories</MenuItem>
              <MenuItem value="Getz Pharma">Getz Pharma</MenuItem>
              <MenuItem value="Searle Pakistan">Searle Pakistan</MenuItem>
              <MenuItem value="Hilton Pharma">Hilton Pharma</MenuItem>
              <MenuItem value="Other">Other Supplier</MenuItem>
            </TextField>
            
            <TextField fullWidth size="small" label="Invoice Date *" name="invoiceDate" type="date" value={form.invoiceDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography fontWeight={700} color="#2563eb">
                Billing Summary
              </Typography>
            </Box>

            <TextField fullWidth size="small" label="Total Items *" name="totalItems" type="number" value={form.totalItems} onChange={handleChange} />
            
            <TextField fullWidth size="small" label="Sub Total (Rs.) *" name="subTotal" type="number" value={form.subTotal} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} />
            
            <TextField fullWidth size="small" label="Discount (Rs.)" name="discount" type="number" value={form.discount} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} />

            <Box sx={{ gridColumn: { xs: "1 / -1", sm: "1 / -1", lg: "1 / -1" }, display: "flex", justifyContent: "flex-end", alignItems: "center", bgcolor: "#f8fafc", p: 1.5, borderRadius: 2, border: "1px solid #e2e8f0" }}>
              <Typography variant="body2" color="text.secondary" mr={1}>Calculated Grand Total:</Typography>
              <Typography variant="h6" fontWeight={700} color="#2563eb">Rs. {calculatedGrandTotal.toLocaleString()}</Typography>
            </Box>

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography fontWeight={700} color="#2563eb">
                Order Status
              </Typography>
            </Box>

            <TextField fullWidth size="small" select label="Order Status" name="status" value={form.status} onChange={handleChange}>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Received">Received</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>
            
            <TextField fullWidth size="small" select label="Payment Status" name="paymentStatus" value={form.paymentStatus} onChange={handleChange}>
              <MenuItem value="Unpaid">Unpaid</MenuItem>
              <MenuItem value="Partial">Partial</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
            </TextField>

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" spacing={1.5}>
                <Button variant="outlined" color="inherit" onClick={() => setForm(emptyForm)} startIcon={<Refresh />} sx={{ textTransform: "none", borderRadius: 2 }}>
                  Reset Form
                </Button>
                <Button variant="contained" startIcon={<ReceiptOutlined />} onClick={handleSave} sx={{ bgcolor: "#2563eb", textTransform: "none", borderRadius: 2, boxShadow: "none" }}>
                  Save Purchase
                </Button>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* PURCHASE DATA TABLE */}
      <Card elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, width: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box mb={2.5}>
            <Typography variant="h6" fontWeight={700}>
              Purchase History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search, sort, filter and manage your supplier invoices.
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
              placeholder="Search Invoice No, Supplier..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Order Status</InputLabel>
              <Select value={statusFilter} label="Order Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Received">Received</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Payment</InputLabel>
              <Select value={paymentFilter} label="Payment" onChange={(e) => { setPaymentFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Payments</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Partial">Partial</MenuItem>
                <MenuItem value="Unpaid">Unpaid</MenuItem>
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
                {paginatedPurchases.map((purchase) => (
                  <TableRow key={purchase.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar variant="rounded" sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}>
                          <ShoppingCartOutlined />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700} variant="body2">{purchase.invoiceNo}</Typography>
                          <Typography variant="caption" color="text.secondary">{purchase.totalItems} Items</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{purchase.supplier}</Typography>
                    </TableCell>
                    
                    <TableCell>{purchase.invoiceDate}</TableCell>
                    
                    <TableCell>
                      <Typography fontWeight={700}>{purchase.totalItems}</Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography fontWeight={700} color="#2563eb">
                        Rs. {purchase.grandTotal.toLocaleString()}
                      </Typography>
                      {purchase.discount > 0 && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Disc: Rs. {purchase.discount.toLocaleString()}
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Chip size="small" color={getStatusColor(purchase.status)} label={purchase.status} />
                    </TableCell>
                    
                    <TableCell>
                      <Chip size="small" variant="outlined" color={getPaymentColor(purchase.paymentStatus)} label={purchase.paymentStatus} />
                    </TableCell>
                    
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleEdit(purchase)} sx={{ color: "#2563eb" }}>
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDelete(purchase.id)} sx={{ color: "#dc2626" }}>
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredPurchases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <ReceiptOutlined sx={{ fontSize: 45, color: "#94a3b8", mb: 1 }} />
                      <Typography fontWeight={700}>No Purchases Found</Typography>
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
            count={filteredPurchases.length}
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

      {/* EDIT PURCHASE DIALOG */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 3, mx: 2, width: "100%" } }}>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography fontWeight={700} variant="h6">Edit Purchase Order</Typography>
              <Typography variant="caption" color="text.secondary">Update invoice information.</Typography>
            </Box>
            <IconButton onClick={() => setDialogOpen(false)}><Close /></IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField fullWidth size="small" label="Invoice / PO Number *" name="invoiceNo" value={form.invoiceNo} onChange={handleChange} />
            
            <TextField fullWidth size="small" select label="Supplier *" name="supplier" value={form.supplier} onChange={handleChange}>
              <MenuItem value="GSK Pakistan">GSK Pakistan</MenuItem>
              <MenuItem value="Abbott Laboratories">Abbott Laboratories</MenuItem>
              <MenuItem value="Getz Pharma">Getz Pharma</MenuItem>
              <MenuItem value="Searle Pakistan">Searle Pakistan</MenuItem>
              <MenuItem value="Hilton Pharma">Hilton Pharma</MenuItem>
              <MenuItem value="Other">Other Supplier</MenuItem>
            </TextField>
            
            <TextField fullWidth size="small" label="Invoice Date *" name="invoiceDate" type="date" value={form.invoiceDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            
            <TextField fullWidth size="small" label="Total Items *" name="totalItems" type="number" value={form.totalItems} onChange={handleChange} />
            
            <TextField fullWidth size="small" label="Sub Total (Rs.) *" name="subTotal" type="number" value={form.subTotal} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} />
            
            <TextField fullWidth size="small" label="Discount (Rs.)" name="discount" type="number" value={form.discount} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} />

            <Box sx={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", alignItems: "center", bgcolor: "#f8fafc", p: 1.5, borderRadius: 2, border: "1px solid #e2e8f0" }}>
              <Typography variant="body2" color="text.secondary" mr={1}>Grand Total:</Typography>
              <Typography variant="h6" fontWeight={700} color="#2563eb">Rs. {calculatedGrandTotal.toLocaleString()}</Typography>
            </Box>

            <TextField fullWidth size="small" select label="Order Status" name="status" value={form.status} onChange={handleChange}>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Received">Received</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>
            
            <TextField fullWidth size="small" select label="Payment Status" name="paymentStatus" value={form.paymentStatus} onChange={handleChange}>
              <MenuItem value="Unpaid">Unpaid</MenuItem>
              <MenuItem value="Partial">Partial</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#2563eb", textTransform: "none", boxShadow: "none" }}>Update Purchase</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}