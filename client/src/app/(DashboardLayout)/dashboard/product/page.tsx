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
  DownloadOutlined,
  Close,
  Refresh,
  CloudDownloadOutlined,
  Inventory2Outlined,
  CategoryOutlined,
} from "@mui/icons-material";

import SuccessAlert from "@/app/components/SuccessAlert";
import ErrorAlert from "@/app/components/ErrorAlert";
import { AlertState } from "@/app/components/types/types"; 

// ============================================
// INITIAL DATA - PRODUCTS
// ============================================
const initialProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    sku: "WBH-2026-001",
    category: "Electronics",
    price: 89.99,
    stock: 145,
    status: "In Stock",
    createdAt: "2026-10-01",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    sku: "EOC-2026-002",
    category: "Furniture",
    price: 249.0,
    stock: 32,
    status: "In Stock",
    createdAt: "2026-09-15",
    description: "Adjustable ergonomic office chair with lumbar support and breathable mesh.",
  },
  {
    id: 3,
    name: "Stainless Steel Water Bottle",
    sku: "SSW-2026-003",
    category: "Home & Kitchen",
    price: 24.5,
    stock: 0,
    status: "Out of Stock",
    createdAt: "2026-08-20",
    description: "Insulated 32oz water bottle keeps drinks cold for 24 hours.",
  },
  {
    id: 4,
    name: "Mechanical Gaming Keyboard",
    sku: "MGK-2026-004",
    category: "Electronics",
    price: 129.99,
    stock: 78,
    status: "In Stock",
    createdAt: "2026-10-10",
    description: "RGB backlit mechanical keyboard with hot-swappable switches.",
  },
  {
    id: 5,
    name: "Organic Cotton T-Shirt",
    sku: "OCT-2026-005",
    category: "Apparel",
    price: 19.99,
    stock: 12,
    status: "Low Stock",
    createdAt: "2026-09-28",
    description: "Soft organic cotton crew neck t-shirt available in multiple colors.",
  },
  {
    id: 6,
    name: "Smart Fitness Watch",
    sku: "SFW-2026-006",
    category: "Electronics",
    price: 199.0,
    stock: 56,
    status: "In Stock",
    createdAt: "2026-10-05",
    description: "Fitness tracker with heart rate monitor, GPS, and 7-day battery.",
  },
];

const emptyForm = {
  name: "",
  sku: "",
  category: "Electronics",
  price: "",
  stock: "",
  description: "",
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

// ============================================
// STATUS HELPERS
// ============================================
const getStatusColor = (status) => {
  switch (status) {
    case "In Stock":
      return "success";
    case "Low Stock":
      return "warning";
    case "Out of Stock":
      return "error";
    default:
      return "default";
  }
};

const getCategoryColor = (category) => {
  switch (category) {
    case "Electronics":
      return "#2563eb";
    case "Furniture":
      return "#7c3aed";
    case "Home & Kitchen":
      return "#0891b2";
    case "Apparel":
      return "#db2777";
    default:
      return "#64748b";
  }
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function ProductPage() {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState("createdAt");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [alert, setAlert] = useState<{ type: AlertColor; message: string } | null>(null);

  const showAlert = (type: AlertState['type'], message: string) => {
    setAlert({ type, message });
  };

  // ==========================================
  // FILTERING & SORTING
  // ==========================================
  const filteredProducts = useMemo(() => {
    const result = products.filter((p) => {
      const keyword = search.toLowerCase();
      const searchMatch = [
        p.name,
        p.sku,
        p.category,
        p.description,
      ].some((value) => String(value || "").toLowerCase().includes(keyword));

      const categoryMatch =
        categoryFilter === "all" || p.category === categoryFilter;
      const statusMatch =
        statusFilter === "all" || p.status === statusFilter;

      return searchMatch && categoryMatch && statusMatch;
    });

    return [...result].sort(getComparator(order, orderBy));
  }, [products, search, categoryFilter, statusFilter, order, orderBy]);

  const paginatedProducts = filteredProducts.slice(
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
      price: String(item.price),
      stock: String(item.stock),
    });
    setDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const requiredFields = ["name", "sku", "price", "stock"];
    if (requiredFields.some((key) => String(form[key] ?? "").trim() === "")) {
      return showAlert("error", "Please fill all required fields.");
    }

    if (Number(form.price) < 0) {
      return showAlert("error", "Price cannot be negative.");
    }

    if (Number(form.stock) < 0) {
      return showAlert("error", "Stock cannot be negative.");
    }

    const stockNum = Number(form.stock);
    const computedStatus =
      stockNum === 0 ? "Out of Stock" : stockNum <= 20 ? "Low Stock" : "In Stock";

    const productData = {
      ...form,
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      price: Number(form.price),
      stock: stockNum,
      status: computedStatus,
      createdAt: new Date().toISOString().split("T")[0],
    };

    if (editingId !== null) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...productData } : p))
      );
      showAlert("success", "Product updated successfully!");
    } else {
      setProducts((prev) => [{ ...productData, id: Date.now() }, ...prev]);
      setPage(0);
      showAlert("success", "Product added successfully!");
    }

    setDialogOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setPage(0);
    showAlert("success", "Product deleted successfully!");
  };

  const handleReset = () => {
    setSearch("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setOrder("desc");
    setOrderBy("createdAt");
    setPage(0);
  };

  // ==========================================
  // TABLE COLUMNS
  // ==========================================
  const columns = [
    { id: "name", label: "Product" },
    { id: "sku", label: "SKU" },
    { id: "category", label: "Category" },
    { id: "price", label: "Price" },
    { id: "stock", label: "Stock" },
    { id: "status", label: "Status" },
    { id: "createdAt", label: "Created" },
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
      {alert?.type === "success" && (
        <SuccessAlert key={alert.message} message={alert.message} />
      )}
      {alert?.type === "error" && (
        <ErrorAlert key={alert.message} message={alert.message} />
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
            Products
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Manage your product catalog, inventory, and pricing.
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
          Add Product
        </Button>
      </Stack>

      {/* PRODUCT ENTRY FORM */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e8edf3",
          borderRadius: 3,
          mb: 3,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}>
              <Inventory2Outlined />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Product Details
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Enter the product information below.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* CSS GRID FOR RESPONSIVE LAYOUT — minmax(0,1fr) prevents track overflow */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: 2,
              "& > *": { minWidth: 0 },
            }}
          >
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography fontWeight={700} color="#2563eb">
                Product Information
              </Typography>
            </Box>

            <TextField
              fullWidth
              size="small"
              label="Product Name *"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Headphones"
              sx={{
                gridColumn: { xs: "1 / -1", sm: "span 2", lg: "span 2" },
              }}
            />

            <TextField
              fullWidth
              size="small"
              label="SKU *"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="e.g. WBH-2026-001"
            />

            <TextField
              fullWidth
              size="small"
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Furniture">Furniture</MenuItem>
              <MenuItem value="Home & Kitchen">Home & Kitchen</MenuItem>
              <MenuItem value="Apparel">Apparel</MenuItem>
              <MenuItem value="Sports">Sports</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            <TextField
              fullWidth
              size="small"
              label="Price ($) *"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              inputProps={{ min: 0, step: "0.01" }}
            />

            <TextField
              fullWidth
              size="small"
              label="Stock Quantity *"
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />

            <TextField
              fullWidth
              size="small"
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional product description"
              multiline
              rows={2}
              sx={{ gridColumn: "1 / -1" }}
            />

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="flex-end"
                spacing={1.5}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => setForm(emptyForm)}
                  startIcon={<Refresh />}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  Reset Form
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CloudDownloadOutlined />}
                  onClick={handleSave}
                  sx={{
                    bgcolor: "#2563eb",
                    textTransform: "none",
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                >
                  Save Product
                </Button>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* PRODUCT LIST TABLE */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e8edf3",
          borderRadius: 3,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box mb={2.5}>
            <Typography variant="h6" fontWeight={700}>
              Product Catalog
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View, search, and manage all products in your inventory.
            </Typography>
          </Box>

          {/* SEARCH AND FILTER — minmax(0, …) keeps columns inside the card */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) auto",
              },
              gap: 2,
              mb: 3,
              "& > *": { minWidth: 0 },
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search product name, SKU, category..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Furniture">Furniture</MenuItem>
                <MenuItem value="Home & Kitchen">Home & Kitchen</MenuItem>
                <MenuItem value="Apparel">Apparel</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="In Stock">In Stock</MenuItem>
                <MenuItem value="Low Stock">Low Stock</MenuItem>
                <MenuItem value="Out of Stock">Out of Stock</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Reset Filters">
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleReset}
                  sx={{ height: 40, minWidth: 40 }}
                >
                  <Refresh />
                </Button>
              </Tooltip>
            </Box>
          </Box>

          {/* TABLE — internal horizontal scroll only; card clips the rest */}
          <TableContainer
            sx={{
              width: "100%",
              maxWidth: "100%",
              overflowX: "auto",
              "&::-webkit-scrollbar": { height: 8 },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "#cbd5e1",
                borderRadius: 4,
              },
            }}
          >
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        fontWeight: 700,
                        color: "#475569",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : "asc"}
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedProducts.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{ "&:last-child td": { borderBottom: 0 } }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          variant="rounded"
                          sx={{
                            bgcolor: "#eff6ff",
                            color: "#2563eb",
                            width: 40,
                            height: 40,
                          }}
                        >
                          <CategoryOutlined fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700} variant="body2">
                            {item.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "block",
                              maxWidth: 240,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.description || "No description"}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={item.sku}
                        variant="outlined"
                        sx={{ fontFamily: "monospace", fontWeight: 600 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={item.category}
                        sx={{
                          bgcolor: `${getCategoryColor(item.category)}15`,
                          color: getCategoryColor(item.category),
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight={700}>
                        ${item.price.toFixed(2)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight={700}>{item.stock}</Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        color={getStatusColor(item.status)}
                        label={item.status}
                      />
                    </TableCell>

                    <TableCell>{item.createdAt}</TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Download">
                          <span>
                            <IconButton
                              size="small"
                              disabled={item.status === "Out of Stock"}
                              sx={{ color: "#2563eb" }}
                            >
                              <DownloadOutlined fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(item)}
                            sx={{ color: "#475569" }}
                          >
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(item.id)}
                            sx={{ color: "#dc2626" }}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Inventory2Outlined
                        sx={{ fontSize: 45, color: "#94a3b8", mb: 1 }}
                      />
                      <Typography fontWeight={700}>No Products Found</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try another search or filter.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* PAGINATION — constrained so the toolbar can never push width */}
          <TablePagination
            component="div"
            count={filteredProducts.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              width: "100%",
              overflow: "hidden",
              ".MuiTablePagination-toolbar": {
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-end" },
              },
            }}
          />
        </CardContent>
      </Card>

      {/* EDIT PRODUCT DIALOG — rely on MUI defaults for width/margins */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={700} variant="h6">
                Edit Product
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Update product information.
              </Typography>
            </Box>
            <IconButton onClick={() => setDialogOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
              "& > *": { minWidth: 0 },
            }}
          >
            <TextField
              fullWidth
              size="small"
              label="Product Name *"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              size="small"
              label="SKU *"
              name="sku"
              value={form.sku}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              size="small"
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Furniture">Furniture</MenuItem>
              <MenuItem value="Home & Kitchen">Home & Kitchen</MenuItem>
              <MenuItem value="Apparel">Apparel</MenuItem>
              <MenuItem value="Sports">Sports</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            <TextField
              fullWidth
              size="small"
              label="Price ($) *"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              inputProps={{ min: 0, step: "0.01" }}
            />

            <TextField
              fullWidth
              size="small"
              label="Stock Quantity *"
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />

            <TextField
              fullWidth
              size="small"
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={2}
              sx={{ gridColumn: "1 / -1" }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              bgcolor: "#2563eb",
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            Update Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}