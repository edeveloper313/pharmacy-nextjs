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
} from "@mui/material";

import {
  Add,
  Search,
  EditOutlined,
  DeleteOutline,
  Inventory2Outlined,
  MedicationOutlined,
  Close,
  Refresh,
} from "@mui/icons-material";

import SuccessAlert from "@/app/components/SuccessAlert";
import ErrorAlert from "@/app/components/ErrorAlert";

// ============================================
// INITIAL DATA
// ============================================
const initialProducts = [
  { id: 1, name: "Panadol", genericName: "Paracetamol", sku: "MED-1001", barcode: "8901234567890", category: "Tablet", strength: "500mg", manufacturer: "GSK", batchNumber: "B-2026-001", purchasePrice: 120, salePrice: 150, stock: 250, minStock: 20, expiryDate: "2027-08-15", status: "Active" },
  { id: 2, name: "Augmentin", genericName: "Amoxicillin", sku: "MED-1002", barcode: "8901234567891", category: "Tablet", strength: "625mg", manufacturer: "GSK", batchNumber: "B-2026-002", purchasePrice: 450, salePrice: 520, stock: 12, minStock: 20, expiryDate: "2027-04-20", status: "Active" },
  { id: 3, name: "Brufen", genericName: "Ibuprofen", sku: "MED-1003", barcode: "8901234567892", category: "Tablet", strength: "400mg", manufacturer: "Abbott", batchNumber: "B-2026-003", purchasePrice: 80, salePrice: 110, stock: 0, minStock: 15, expiryDate: "2027-11-10", status: "Active" },
  { id: 4, name: "Calpol", genericName: "Paracetamol", sku: "MED-1004", barcode: "8901234567893", category: "Syrup", strength: "120mg/5ml", manufacturer: "GSK", batchNumber: "B-2026-004", purchasePrice: 180, salePrice: 220, stock: 85, minStock: 15, expiryDate: "2027-06-25", status: "Active" },
  { id: 5, name: "Vitamin C", genericName: "Ascorbic Acid", sku: "MED-1005", barcode: "8901234567894", category: "Capsule", strength: "500mg", manufacturer: "Nutrifactor", batchNumber: "B-2026-005", purchasePrice: 200, salePrice: 280, stock: 150, minStock: 25, expiryDate: "2026-12-20", status: "Active" },
];

const emptyForm = {
  name: "", genericName: "", sku: "", barcode: "", category: "", strength: "", manufacturer: "", batchNumber: "", purchasePrice: "", salePrice: "", stock: "", minStock: "10", expiryDate: "", status: "Active",
};

const getStockStatus = (product) => {
  if (product.stock === 0) return { label: "Out of Stock", color: "error" };
  if (product.stock <= product.minStock) return { label: "Low Stock", color: "warning" };
  return { label: "In Stock", color: "success" };
};

const descendingComparator = (a, b, orderBy) => {
  const first = a[orderBy] ?? "";
  const second = b[orderBy] ?? "";
  if (typeof first === "number" && typeof second === "number") return second - first;
  return String(second).localeCompare(String(first), undefined, { numeric: true, sensitivity: "base" });
};

const getComparator = (order, orderBy) => {
  return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
};

export default function ProductPage() {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message) => setAlert({ type, message });

  const filteredProducts = useMemo(() => {
    const result = products.filter((p) => {
      const keyword = search.toLowerCase();
      const searchMatch = [p.name, p.genericName, p.sku, p.barcode, p.manufacturer, p.batchNumber].some((value) => String(value || "").toLowerCase().includes(keyword));
      const categoryMatch = categoryFilter === "all" || p.category === categoryFilter;
      const stockMatch = stockFilter === "all" || (stockFilter === "in-stock" && p.stock > p.minStock) || (stockFilter === "low-stock" && p.stock > 0 && p.stock <= p.minStock) || (stockFilter === "out-of-stock" && p.stock === 0);
      return searchMatch && categoryMatch && stockMatch;
    });
    return [...result].sort(getComparator(order, orderBy));
  }, [products, search, categoryFilter, stockFilter, order, orderBy]);

  const paginatedProducts = filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleAdd = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };
  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({ ...product, purchasePrice: String(product.purchasePrice), salePrice: String(product.salePrice), stock: String(product.stock), minStock: String(product.minStock) });
    setDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const requiredFields = ["name", "genericName", "sku", "category", "purchasePrice", "salePrice", "stock", "expiryDate"];
    if (requiredFields.some((key) => String(form[key] ?? "").trim() === "")) return showAlert("error", "Please fill all required fields.");
    const numericFields = ["purchasePrice", "salePrice", "stock", "minStock"];
    if (numericFields.some((key) => !Number.isFinite(Number(form[key])) || Number(form[key]) < 0)) return showAlert("error", "Please enter valid positive numbers.");
    if (Number(form.salePrice) < Number(form.purchasePrice)) return showAlert("error", "Sale price cannot be less than purchase price.");
    if (products.some((p) => p.sku.toLowerCase() === form.sku.trim().toLowerCase() && p.id !== editingId)) return showAlert("error", "This SKU already exists.");

    const productData = { ...form, name: form.name.trim(), sku: form.sku.trim(), barcode: form.barcode.trim(), purchasePrice: Number(form.purchasePrice), salePrice: Number(form.salePrice), stock: Number(form.stock), minStock: Number(form.minStock) };

    if (editingId !== null) {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...productData } : p)));
      showAlert("success", "Product updated successfully!");
    } else {
      setProducts((prev) => [{ ...productData, id: Date.now() }, ...prev]);
      setPage(0);
      showAlert("success", "Product added successfully!");
    }
    setDialogOpen(false); setForm(emptyForm); setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setPage(0);
    showAlert("success", "Product deleted successfully!");
  };

  const handleReset = () => {
    setSearch(""); setCategoryFilter("all"); setStockFilter("all"); setOrder("asc"); setOrderBy("name"); setPage(0);
  };

  const columns = [
    { id: "name", label: "Product Name" },
    { id: "sku", label: "SKU" },
    { id: "category", label: "Category" },
    { id: "purchasePrice", label: "Purchase Price" },
    { id: "salePrice", label: "Sale Price" },
    { id: "stock", label: "Stock" },
    { id: "expiryDate", label: "Expiry Date" },
  ];

  return (
    <Box
      sx={{
        pb: 4,
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflowX: "hidden", // Stops the main page from scrolling horizontally
        boxSizing: "border-box",
      }}
    >
      {alert?.type === "success" && <SuccessAlert key={alert.message} message={alert.message} />}
      {alert?.type === "error" && <ErrorAlert key={alert.message} message={alert.message} />}

      {/* HEADER */}
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={2} mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1e293b">Product Management</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>Manage your pharmacy products and inventory.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd} sx={{ bgcolor: "#2563eb", borderRadius: 2, textTransform: "none", boxShadow: "none", px: 2.5, whiteSpace: "nowrap", width: { xs: "100%", sm: "auto" } }}>
          Add New Product
        </Button>
      </Stack>

      {/* PRODUCT ENTRY FORM */}
      <Card elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, mb: 3, width: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}><MedicationOutlined /></Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>Product Entry</Typography>
              <Typography variant="caption" color="text.secondary">Add new medicine or product information.</Typography>
            </Box>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          {/* FORM GRID: minmax(0, 1fr) prevents inputs from overflowing */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { 
                xs: "minmax(0, 1fr)", 
                sm: "repeat(2, minmax(0, 1fr))", 
                lg: "repeat(3, minmax(0, 1fr))" 
              },
              gap: 2,
              width: "100%", // Ensure it doesn't exceed parent
            }}
          >
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography fontWeight={700} color="#2563eb">Basic Information</Typography>
            </Box>
            <TextField fullWidth size="small" label="Product Name *" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Panadol" />
            <TextField fullWidth size="small" label="Generic Name *" name="genericName" value={form.genericName} onChange={handleChange} placeholder="e.g. Paracetamol" />
            <TextField fullWidth size="small" label="SKU / Product Code *" name="sku" value={form.sku} onChange={handleChange} />
            <TextField fullWidth size="small" label="Barcode" name="barcode" value={form.barcode} onChange={handleChange} />
            
            <TextField fullWidth size="small" select label="Category *" name="category" value={form.category} onChange={handleChange}>
              {["Tablet", "Capsule", "Syrup", "Injection", "Drops", "Cream", "Other"].map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </TextField>
            
            <TextField fullWidth size="small" label="Strength" name="strength" value={form.strength} onChange={handleChange} placeholder="e.g. 500mg" />
            <TextField fullWidth size="small" label="Manufacturer" name="manufacturer" value={form.manufacturer} onChange={handleChange} />
            <TextField fullWidth size="small" label="Batch Number" name="batchNumber" value={form.batchNumber} onChange={handleChange} />

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography fontWeight={700} color="#2563eb">Pricing & Stock Information</Typography>
            </Box>

            <TextField fullWidth size="small" label="Purchase Price *" name="purchasePrice" type="number" value={form.purchasePrice} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} />
            <TextField fullWidth size="small" label="Sale Price *" name="salePrice" type="number" value={form.salePrice} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} />
            <TextField fullWidth size="small" label="Opening Stock *" name="stock" type="number" value={form.stock} onChange={handleChange} />
            <TextField fullWidth size="small" label="Minimum Stock" name="minStock" type="number" value={form.minStock} onChange={handleChange} />
            <TextField fullWidth size="small" label="Expiry Date *" name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            
            <TextField fullWidth size="small" select label="Product Status" name="status" value={form.status} onChange={handleChange}>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" spacing={1.5}>
                <Button variant="outlined" color="inherit" onClick={() => setForm(emptyForm)} startIcon={<Refresh />} sx={{ textTransform: "none", borderRadius: 2 }}>
                  Reset Form
                </Button>
                <Button variant="contained" startIcon={<Add />} onClick={handleSave} sx={{ bgcolor: "#2563eb", textTransform: "none", borderRadius: 2, boxShadow: "none" }}>
                  Save Product
                </Button>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* PRODUCT DATA TABLE */}
      <Card elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, width: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box mb={2.5}>
            <Typography variant="h6" fontWeight={700}>Product List</Typography>
            <Typography variant="body2" color="text.secondary">Search, sort, filter and manage your products.</Typography>
          </Box>

          {/* SEARCH AND FILTER GRID */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { 
                xs: "minmax(0, 1fr)", 
                sm: "repeat(2, minmax(0, 1fr))", 
                md: "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) auto" 
              },
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search name, generic, SKU..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
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
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  {columns.map((column) => (
                    <TableCell key={column.id} sx={{ fontWeight: 700, color: "#475569", whiteSpace: "nowrap" }}>
                      <TableSortLabel active={orderBy === column.id} direction={orderBy === column.id ? order : "asc"} onClick={() => handleSort(column.id)}>
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>Stock Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <TableRow key={product.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar variant="rounded" sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}><MedicationOutlined /></Avatar>
                          <Box>
                            <Typography fontWeight={700} variant="body2">{product.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{product.genericName} · {product.strength}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{product.sku}</Typography>
                        <Typography variant="caption" color="text.secondary">{product.barcode || "-"}</Typography>
                      </TableCell>
                      <TableCell><Chip size="small" label={product.category} variant="outlined" /></TableCell>
                      <TableCell>Rs. {product.purchasePrice.toLocaleString()}</TableCell>
                      <TableCell><Typography color="#2563eb" fontWeight={700}>Rs. {product.salePrice.toLocaleString()}</Typography></TableCell>
                      <TableCell><Typography fontWeight={700}>{product.stock}</Typography></TableCell>
                      <TableCell>{product.expiryDate}</TableCell>
                      <TableCell><Chip size="small" color={stockStatus.color} label={stockStatus.label} /></TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleEdit(product)} sx={{ color: "#2563eb" }}><EditOutlined fontSize="small" /></IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(product.id)} sx={{ color: "#dc2626" }}><DeleteOutline fontSize="small" /></IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                      <Inventory2Outlined sx={{ fontSize: 45, color: "#94a3b8", mb: 1 }} />
                      <Typography fontWeight={700}>No Products Found</Typography>
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
            count={filteredProducts.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{ ".MuiTablePagination-toolbar": { flexWrap: "wrap", justifyContent: { xs: "center", sm: "flex-end" } } }}
          />
        </CardContent>
      </Card>

      {/* EDIT PRODUCT DIALOG */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 3, mx: 2, width: "100%" } }}>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography fontWeight={700} variant="h6">Edit Product</Typography>
              <Typography variant="caption" color="text.secondary">Update product information.</Typography>
            </Box>
            <IconButton onClick={() => setDialogOpen(false)}><Close /></IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
            {[{ label: "Product Name", name: "name" }, { label: "Generic Name", name: "genericName" }, { label: "SKU", name: "sku" }, { label: "Barcode", name: "barcode" }, { label: "Strength", name: "strength" }, { label: "Manufacturer", name: "manufacturer" }, { label: "Batch Number", name: "batchNumber" }].map((field) => (
              <TextField key={field.name} fullWidth size="small" label={field.label} name={field.name} value={form[field.name]} onChange={handleChange} />
            ))}
            <TextField fullWidth size="small" select label="Category" name="category" value={form.category} onChange={handleChange}>
              {["Tablet", "Capsule", "Syrup", "Injection", "Drops", "Cream", "Other"].map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </TextField>
            {[{ label: "Purchase Price", name: "purchasePrice" }, { label: "Sale Price", name: "salePrice" }, { label: "Stock", name: "stock" }, { label: "Minimum Stock", name: "minStock" }].map((field) => (
              <TextField key={field.name} fullWidth size="small" type="number" label={field.label} name={field.name} value={form[field.name]} onChange={handleChange} />
            ))}
            <TextField fullWidth size="small" type="date" label="Expiry Date" name="expiryDate" value={form.expiryDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth size="small" select label="Status" name="status" value={form.status} onChange={handleChange}>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#2563eb", textTransform: "none", boxShadow: "none" }}>Update Product</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}