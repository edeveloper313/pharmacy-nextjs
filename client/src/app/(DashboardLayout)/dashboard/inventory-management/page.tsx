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
  Inventory2Outlined,
  WarningAmberOutlined,
  Close,
  Refresh,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";

// Make sure these paths match your project structure

import Alert from "@/app/components/Alert";
import { AlertState } from "@/app/components/types/types";

// ============================================
// INITIAL DATA
// ============================================
const initialInventory = [
  {
    id: 1,
    name: "Panadol",
    sku: "MED-1001",
    category: "Tablet",
    batchNo: "B-2026-001",
    location: "Rack A - Shelf 1",
    stock: 250,
    minStock: 20,
    expiryDate: "2027-08-15",
    status: "In Stock",
  },
  {
    id: 2,
    name: "Augmentin",
    sku: "MED-1002",
    category: "Tablet",
    batchNo: "B-2026-002",
    location: "Rack A - Shelf 2",
    stock: 12,
    minStock: 20,
    expiryDate: "2027-04-20",
    status: "Low Stock",
  },
  {
    id: 3,
    name: "Brufen",
    sku: "MED-1003",
    category: "Tablet",
    batchNo: "B-2026-003",
    location: "Rack B - Shelf 1",
    stock: 0,
    minStock: 15,
    expiryDate: "2027-11-10",
    status: "Out of Stock",
  },
  {
    id: 4,
    name: "Calpol",
    sku: "MED-1004",
    category: "Syrup",
    batchNo: "B-2026-004",
    location: "Rack C - Shelf 3",
    stock: 85,
    minStock: 15,
    expiryDate: "2027-06-25",
    status: "In Stock",
  },
  {
    id: 5,
    name: "Vitamin C",
    sku: "MED-1005",
    category: "Capsule",
    batchNo: "B-2026-005",
    location: "Rack D - Shelf 2",
    stock: 150,
    minStock: 25,
    expiryDate: "2026-12-20",
    status: "In Stock",
  },
];

const emptyForm = {
  name: "",
  sku: "",
  category: "Tablet",
  batchNo: "",
  location: "",
  stock: "",
  minStock: "10",
  expiryDate: "",
  status: "In Stock",
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

export default function InventoryManagementPage() {
  const [inventory, setInventory] = useState(initialInventory);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

    const [order, setOrder] = useState<"asc" | "desc">("desc");

  const [orderBy, setOrderBy] = useState("name");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

 const [alert, setAlert] = useState<{ type: AlertColor; message: string } | null>(null);

  const showAlert = (type: AlertState['type'], message: string) => {
    setAlert({ type, message });
  };

  // ==========================================
  // FILTERING & SORTING
  // ==========================================
  const filteredInventory = useMemo(() => {
    const result = inventory.filter((item) => {
      const keyword = search.toLowerCase();
      const searchMatch = [
        item.name,
        item.sku,
        item.batchNo,
        item.location,
      ].some((value) => String(value || "").toLowerCase().includes(keyword));

      const categoryMatch = categoryFilter === "all" || item.category === categoryFilter;
      const stockMatch =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && item.stock > item.minStock) ||
        (stockFilter === "low-stock" && item.stock > 0 && item.stock <= item.minStock) ||
        (stockFilter === "out-of-stock" && item.stock === 0);

      return searchMatch && categoryMatch && stockMatch;
    });

    return [...result].sort(getComparator(order, orderBy));
  }, [inventory, search, categoryFilter, stockFilter, order, orderBy]);

  const paginatedInventory = filteredInventory.slice(
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
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      ...item,
      stock: String(item.stock),
      minStock: String(item.minStock),
    });
    setDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const requiredFields = ["name", "sku", "batchNo", "stock", "expiryDate"];
    if (requiredFields.some((key) => String(form[key] ?? "").trim() === "")) {
      return showAlert("error", "Please fill all required fields.");
    }

    const numericFields = ["stock", "minStock"];
    if (numericFields.some((key) => !Number.isFinite(Number(form[key])) || Number(form[key]) < 0)) {
      return showAlert("error", "Please enter valid positive numbers for stock.");
    }

    // Duplicate check for SKU + Batch (same medicine can have different batches, but same batch+sku should be unique)
    if (inventory.some((i) => i.sku.toLowerCase() === form.sku.trim().toLowerCase() && i.batchNo === form.batchNo.trim() && i.id !== editingId)) {
      return showAlert("error", "This Batch Number for this SKU already exists.");
    }

    // Auto-determine status based on stock vs minStock
    let computedStatus = "In Stock";
    const stockNum = Number(form.stock);
    const minStockNum = Number(form.minStock);
    
    if (stockNum === 0) computedStatus = "Out of Stock";
    else if (stockNum <= minStockNum) computedStatus = "Low Stock";

    const itemData = {
      ...form,
      name: form.name.trim(),
      sku: form.sku.trim(),
      batchNo: form.batchNo.trim(),
      location: form.location.trim(),
      stock: stockNum,
      minStock: minStockNum,
      status: computedStatus,
    };

    if (editingId !== null) {
      setInventory((prev) => prev.map((i) => (i.id === editingId ? { ...i, ...itemData } : i)));
      showAlert("success", "Inventory updated successfully!");
    } else {
      setInventory((prev) => [{ ...itemData, id: Date.now() }, ...prev]);
      setPage(0);
      showAlert("success", "Stock added successfully!");
    }

    setDialogOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this stock record?")) return;
    setInventory((prev) => prev.filter((i) => i.id !== id));
    setPage(0);
    showAlert("success", "Stock record deleted!");
  };

  const handleReset = () => {
    setSearch("");
    setCategoryFilter("all");
    setStockFilter("all");
    setOrder("asc");
    setOrderBy("name");
    setPage(0);
  };

  // ==========================================
  // TABLE COLUMNS
  // ==========================================
  const columns = [
    { id: "name", label: "Product Details" },
    { id: "batchNo", label: "Batch & Location" },
    { id: "category", label: "Category" },
    { id: "stock", label: "Current Stock" },
    { id: "expiryDate", label: "Expiry Date" },
    { id: "status", label: "Status" },
  ];

  const getStatusColor = (status) => {
    if (status === "In Stock") return "success";
    if (status === "Low Stock") return "warning";
    if (status === "Out of Stock") return "error";
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
    key={alert.message}
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
            Inventory Management
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Track medicine batches, stock levels, and storage locations.
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
          Add Stock Entry
        </Button>
      </Stack>

      {/* INVENTORY ENTRY FORM */}
      <Card elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, mb: 3, width: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}>
              <Inventory2Outlined />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Stock Entry
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Record batch details, location, and quantities.
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
                Product & Batch Information
              </Typography>
            </Box>

            <TextField fullWidth size="small" label="Product Name *" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Panadol" />
            <TextField fullWidth size="small" label="SKU / Product Code *" name="sku" value={form.sku} onChange={handleChange} placeholder="e.g. MED-1001" />
            
            <TextField fullWidth size="small" select label="Category" name="category" value={form.category} onChange={handleChange}>
              {["Tablet", "Capsule", "Syrup", "Injection", "Drops", "Cream", "Other"].map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </TextField>
            
            <TextField fullWidth size="small" label="Batch Number *" name="batchNo" value={form.batchNo} onChange={handleChange} placeholder="e.g. B-2026-001" />
            <TextField fullWidth size="small" label="Location / Rack" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Rack A - Shelf 1" />
            <TextField fullWidth size="small" label="Expiry Date *" name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography fontWeight={700} color="#2563eb">
                Stock Quantities
              </Typography>
            </Box>

            <TextField fullWidth size="small" label="Opening / Current Stock *" name="stock" type="number" value={form.stock} onChange={handleChange} />
            <TextField fullWidth size="small" label="Minimum Stock Alert" name="minStock" type="number" value={form.minStock} onChange={handleChange} />
            
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#f8fafc", p: 1, borderRadius: 2, border: "1px solid #e2e8f0" }}>
              <WarningAmberOutlined sx={{ color: "#ea580c", mr: 1, fontSize: 20 }} />
              <Typography variant="caption" color="text.secondary">
                Status will auto-update based on stock vs minimum stock.
              </Typography>
            </Box>

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" spacing={1.5}>
                <Button variant="outlined" color="inherit" onClick={() => setForm(emptyForm)} startIcon={<Refresh />} sx={{ textTransform: "none", borderRadius: 2 }}>
                  Reset Form
                </Button>
                <Button variant="contained" startIcon={<Add />} onClick={handleSave} sx={{ bgcolor: "#2563eb", textTransform: "none", borderRadius: 2, boxShadow: "none" }}>
                  Save Stock
                </Button>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* INVENTORY DATA TABLE */}
      <Card elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, width: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box mb={2.5}>
            <Typography variant="h6" fontWeight={700}>
              Inventory List
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search, sort, filter and manage your current stock.
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
              placeholder="Search name, SKU, batch, location..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select value={categoryFilter} label="Category" onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Categories</MenuItem>
                {["Tablet", "Capsule", "Syrup", "Injection", "Drops", "Cream", "Other"].map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Stock Status</InputLabel>
              <Select value={stockFilter} label="Stock Status" onChange={(e) => { setStockFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Stock</MenuItem>
                <MenuItem value="in-stock">In Stock</MenuItem>
                <MenuItem value="low-stock">Low Stock</MenuItem>
                <MenuItem value="out-of-stock">Out of Stock</MenuItem>
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
            <Table sx={{ minWidth: 850 }}>
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
                {paginatedInventory.map((item) => (
                  <TableRow key={item.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar variant="rounded" sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}>
                          <Inventory2Outlined />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700} variant="body2">{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.sku}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{item.batchNo}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.location || "No location set"}</Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip size="small" label={item.category} variant="outlined" />
                    </TableCell>
                    
                    <TableCell>
                      <Typography fontWeight={700} color={item.stock === 0 ? "error.main" : item.stock <= item.minStock ? "warning.main" : "text.primary"}>
                        {item.stock} units
                      </Typography>
                      <Typography variant="caption" color="text.secondary">Min: {item.minStock}</Typography>
                    </TableCell>
                    
                    <TableCell>{item.expiryDate}</TableCell>
                    
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

                {filteredInventory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Inventory2Outlined sx={{ fontSize: 45, color: "#94a3b8", mb: 1 }} />
                      <Typography fontWeight={700}>No Stock Found</Typography>
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
            count={filteredInventory.length}
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

      {/* EDIT INVENTORY DIALOG */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 3, mx: 2, width: "100%" } }}>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography fontWeight={700} variant="h6">Edit Inventory</Typography>
              <Typography variant="caption" color="text.secondary">Update stock and batch information.</Typography>
            </Box>
            <IconButton onClick={() => setDialogOpen(false)}><Close /></IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField fullWidth size="small" label="Product Name *" name="name" value={form.name} onChange={handleChange} />
            <TextField fullWidth size="small" label="SKU / Product Code *" name="sku" value={form.sku} onChange={handleChange} />
            
            <TextField fullWidth size="small" select label="Category" name="category" value={form.category} onChange={handleChange}>
              {["Tablet", "Capsule", "Syrup", "Injection", "Drops", "Cream", "Other"].map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </TextField>
            
            <TextField fullWidth size="small" label="Batch Number *" name="batchNo" value={form.batchNo} onChange={handleChange} />
            <TextField fullWidth size="small" label="Location / Rack" name="location" value={form.location} onChange={handleChange} />
            <TextField fullWidth size="small" label="Expiry Date *" name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth size="small" label="Current Stock *" name="stock" type="number" value={form.stock} onChange={handleChange} />
            <TextField fullWidth size="small" label="Minimum Stock Alert" name="minStock" type="number" value={form.minStock} onChange={handleChange} />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#2563eb", textTransform: "none", boxShadow: "none" }}>Update Stock</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}