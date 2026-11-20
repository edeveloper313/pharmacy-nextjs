"use client";

import React, { useEffect, useMemo, useState } from "react";

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
  Close,
  Refresh,
  CloudDownloadOutlined,
  Inventory2Outlined,
  CategoryOutlined,
} from "@mui/icons-material";

import Alert from "@/app/components/Alert";

import { AlertState } from "@/app/components/types/types";

// ============================================
// GENERIC LOOKUP STORAGE
// ============================================
const GENERIC_STORAGE_KEY = "dashboard_generics";

type StoredGeneric = {
  id: string;
  name: string;
};

const getStoredGenerics = (): StoredGeneric[] => {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(GENERIC_STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("LocalStorage read error:", error);
    return [];
  }
};

// ============================================
// UNIT OPTIONS
// ============================================
const UNIT_OPTIONS = [
  "Piece",
  "Strip",
  "Box",
  "Pack",
  "Bottle",
  "Vial",
  "Carton",
];

// ============================================
// INITIAL DATA - PRODUCTS
// ============================================
const initialProducts = [
  {
    id: 1,
    name: "Panadol 500mg Tablets",
    generic: "Paracetamol",
    category: "OTC Medicines",
    unit: "Box",
    price: 25.0,
    stock: 145,
    status: "In Stock",
    createdAt: "2026-10-01",
    description:
      "Paracetamol 500mg tablets used for temporary relief of pain and fever.",
  },
  {
    id: 2,
    name: "Augmentin 625mg Tablets",
    generic: "Amoxicillin + Clavulanic Acid",
    category: "Antibiotics",
    unit: "Pack",
    price: 450.0,
    stock: 32,
    status: "In Stock",
    createdAt: "2026-09-15",
    description:
      "Prescription antibiotic combination used to treat certain bacterial infections.",
  },
  {
    id: 3,
    name: "Vitamin C 500mg Tablets",
    generic: "Ascorbic Acid",
    category: "Vitamins & Supplements",
    unit: "Bottle",
    price: 350.0,
    stock: 0,
    status: "Out of Stock",
    createdAt: "2026-08-20",
    description:
      "Vitamin C supplement to support normal immune system function.",
  },
  {
    id: 4,
    name: "Digital Blood Pressure Monitor",
    generic: "Automatic BP Monitor",
    category: "Medical Devices",
    unit: "Piece",
    price: 4500.0,
    stock: 78,
    status: "In Stock",
    createdAt: "2026-10-10",
    description:
      "Automatic digital blood pressure monitor for measuring blood pressure at home.",
  },
  {
    id: 5,
    name: "Surgical Disposable Gloves",
    generic: "Latex Examination Gloves",
    category: "Surgical Supplies",
    unit: "Box",
    price: 850.0,
    stock: 12,
    status: "Low Stock",
    createdAt: "2026-09-28",
    description: "Disposable medical gloves for hygiene and infection control.",
  },
  {
    id: 6,
    name: "Digital Thermometer",
    generic: "Digital Clinical Thermometer",
    category: "Medical Devices",
    unit: "Piece",
    price: 650.0,
    stock: 56,
    status: "In Stock",
    createdAt: "2026-10-05",
    description: "Digital thermometer for measuring body temperature.",
  },
];

const emptyForm = {
  name: "",
  generic: "",
  category: "OTC Medicines",
  unit: "",
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
    case "Prescription Medicines":
      return "#2563eb";
    case "OTC Medicines":
      return "#7c3aed";
    case "Antibiotics":
      return "#0891b2";
    case "Vitamins & Supplements":
      return "#db2777";
    case "Medical Devices":
      return "#059669";
    case "Surgical Supplies":
      return "#ea580c";
    case "Personal Care & Hygiene":
      return "#0d9488";
    case "Baby & Mother Care":
      return "#9333ea";
    case "First Aid":
      return "#dc2626";
    case "Healthcare & Wellness":
      return "#ca8a04";
    default:
      return "#64748b";
  }
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function ProductPage() {
  const [products, setProducts] = useState(initialProducts);
  const [storedGenerics, setStoredGenerics] = useState<StoredGeneric[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [genericFilter, setGenericFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState("createdAt");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [alert, setAlert] = useState<{
    id: number;
    type: AlertColor;
    message: string;
  } | null>(null);

  const showAlert = (type: AlertColor, message: string) => {
    setAlert({ id: Date.now(), type, message });
  };

  // ==========================================
  // LOAD GENERICS FROM LOCAL STORAGE
  // ==========================================
  useEffect(() => {
    const loadGenerics = () => {
      setStoredGenerics(getStoredGenerics());
    };

    loadGenerics();

    window.addEventListener("storage", loadGenerics);
    window.addEventListener("dashboard-lookups-updated", loadGenerics);

    return () => {
      window.removeEventListener("storage", loadGenerics);
      window.removeEventListener("dashboard-lookups-updated", loadGenerics);
    };
  }, []);

  const genericOptions = useMemo(() => {
    const seen = new Set<string>();
    const options: string[] = [];

    const addOption = (val?: string) => {
      const trimmed = String(val || "").trim();
      if (!trimmed || trimmed === "No Generic Name") return;
      const key = trimmed.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        options.push(trimmed);
      }
    };

    storedGenerics.forEach((g) => addOption(g.name));
    products.forEach((p) => addOption(p.generic));
    addOption(form.generic);

    return options;
  }, [storedGenerics, products, form.generic]);

  // ==========================================
  // FILTERING & SORTING
  // ==========================================
  const filteredProducts = useMemo(() => {
    const result = products.filter((p) => {
      const keyword = search.toLowerCase();
      const searchMatch = [
        p.name,
        p.generic,
        p.category,
        p.unit,
        p.description,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(keyword),
      );

      const genericMatch =
        genericFilter === "all" || p.generic === genericFilter;
      const categoryMatch =
        categoryFilter === "all" || p.category === categoryFilter;
      const statusMatch = statusFilter === "all" || p.status === statusFilter;

      return searchMatch && genericMatch && categoryMatch && statusMatch;
    });

    return [...result].sort(getComparator(order, orderBy));
  }, [
    products,
    search,
    genericFilter,
    categoryFilter,
    statusFilter,
    order,
    orderBy,
  ]);

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
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
      generic: item.generic === "No Generic Name" ? "" : item.generic,
      unit: item.unit ?? "",
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
    // Unit is required along with name, generic, and category
    const requiredFields = ["name", "generic", "category", "unit"];
    if (requiredFields.some((key) => String(form[key] ?? "").trim() === "")) {
      return showAlert("error", "Please fill all required fields.");
    }

    const stockNum = Number(form.stock);
    const computedStatus =
      stockNum === 0
        ? "Out of Stock"
        : stockNum <= 20
          ? "Low Stock"
          : "In Stock";

    const productData = {
      ...form,
      name: form.name.trim(),
      generic: form.generic.trim() || "No Generic Name",
      unit: form.unit.trim(),
      price: Number(form.price),
      stock: stockNum,
      status: computedStatus,
      createdAt: new Date().toISOString().split("T")[0],
    };

    if (editingId !== null) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...productData } : p)),
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
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setPage(0);
    showAlert("success", "Product deleted successfully!");
  };

  const handleReset = () => {
    setSearch("");
    setGenericFilter("all");
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
    { id: "generic", label: "Generic" },
    { id: "category", label: "Category" },
    { id: "unit", label: "Unit" },
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
            Products
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Manage your product catalog, inventory, and pricing.
          </Typography>
        </Box>
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
              select
              label="Generic"
              name="generic"
              value={form.generic}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Select Generic</em>
              </MenuItem>
              {genericOptions.map((gen) => (
                <MenuItem key={gen} value={gen}>
                  {gen}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              size="small"
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <MenuItem value="Prescription Medicines">
                Prescription Medicines
              </MenuItem>
              <MenuItem value="OTC Medicines">OTC Medicines</MenuItem>
              <MenuItem value="Antibiotics">Antibiotics</MenuItem>
              <MenuItem value="Vitamins & Supplements">
                Vitamins & Supplements
              </MenuItem>
              <MenuItem value="Medical Devices">Medical Devices</MenuItem>
              <MenuItem value="Surgical Supplies">Surgical Supplies</MenuItem>
              <MenuItem value="Personal Care & Hygiene">
                Personal Care & Hygiene
              </MenuItem>
              <MenuItem value="Baby & Mother Care">Baby & Mother Care</MenuItem>
              <MenuItem value="First Aid">First Aid</MenuItem>
              <MenuItem value="Healthcare & Wellness">
                Healthcare & Wellness
              </MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            {/* <TextField
              fullWidth
              size="small"
              label="Price ($) "
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              inputProps={{ min: 0, step: "0.01" }}
            /> */}

            {/* <TextField
              fullWidth
              size="small"
              label="Stock Quantity"
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            /> */}

            {/* Required Unit Field */}
            <TextField
              fullWidth
              required
              size="small"
              select
              label="Unit *"
              name="unit"
              value={form.unit}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Select Unit</em>
              </MenuItem>
              {UNIT_OPTIONS.map((unitOption) => (
                <MenuItem key={unitOption} value={unitOption}>
                  {unitOption}
                </MenuItem>
              ))}
            </TextField>

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
                md: "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) auto",
              },
              gap: 2,
              mb: 3,
              "& > *": { minWidth: 0 },
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search product name, Generic, category..."
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
              <InputLabel>Generic</InputLabel>
              <Select
                value={genericFilter}
                label="Generic"
                onChange={(e) => {
                  setGenericFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">All Generics</MenuItem>
                {genericOptions.map((gen) => (
                  <MenuItem key={gen} value={gen}>
                    {gen}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
                <MenuItem value="Prescription Medicines">
                  Prescription Medicines
                </MenuItem>
                <MenuItem value="OTC Medicines">OTC Medicines</MenuItem>
                <MenuItem value="Antibiotics">Antibiotics</MenuItem>
                <MenuItem value="Vitamins & Supplements">
                  Vitamins & Supplements
                </MenuItem>
                <MenuItem value="Medical Devices">Medical Devices</MenuItem>
                <MenuItem value="Surgical Supplies">Surgical Supplies</MenuItem>
                <MenuItem value="Personal Care & Hygiene">
                  Personal Care & Hygiene
                </MenuItem>
                <MenuItem value="Baby & Mother Care">
                  Baby & Mother Care
                </MenuItem>
                <MenuItem value="First Aid">First Aid</MenuItem>
                <MenuItem value="Healthcare & Wellness">
                  Healthcare & Wellness
                </MenuItem>
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
                        label={item.generic}
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
                      <Chip
                        size="small"
                        label={item.unit}
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
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
                    <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                      <Inventory2Outlined
                        sx={{ fontSize: 45, color: "#94a3b8", mb: 1 }}
                      />
                      <Typography fontWeight={700}>
                        No Products Found
                      </Typography>
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
              select
              label="Generic"
              name="generic"
              value={form.generic}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Select Generic</em>
              </MenuItem>
              {genericOptions.map((gen) => (
                <MenuItem key={gen} value={gen}>
                  {gen}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              size="small"
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <MenuItem value="Prescription Medicines">
                Prescription Medicines
              </MenuItem>
              <MenuItem value="OTC Medicines">OTC Medicines</MenuItem>
              <MenuItem value="Antibiotics">Antibiotics</MenuItem>
              <MenuItem value="Vitamins & Supplements">
                Vitamins & Supplements
              </MenuItem>
              <MenuItem value="Medical Devices">Medical Devices</MenuItem>
              <MenuItem value="Surgical Supplies">Surgical Supplies</MenuItem>
              <MenuItem value="Personal Care & Hygiene">
                Personal Care & Hygiene
              </MenuItem>
              <MenuItem value="Baby & Mother Care">Baby & Mother Care</MenuItem>
              <MenuItem value="First Aid">First Aid</MenuItem>
              <MenuItem value="Healthcare & Wellness">
                Healthcare & Wellness
              </MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            {/* Required Unit Field in Edit Dialog */}
            <TextField
              fullWidth
              required
              size="small"
              select
              label="Unit *"
              name="unit"
              value={form.unit}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Select Unit</em>
              </MenuItem>
              {UNIT_OPTIONS.map((unitOption) => (
                <MenuItem key={unitOption} value={unitOption}>
                  {unitOption}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              size="small"
              label="Price ($)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              inputProps={{ min: 0, step: "0.01" }}
            />

            <TextField
              fullWidth
              size="small"
              label="Stock Quantity "
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
