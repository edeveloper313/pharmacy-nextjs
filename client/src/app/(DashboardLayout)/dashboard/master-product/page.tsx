"use client";

import React, { useMemo, useState } from "react";
import {
  Alert as MuiAlert,
  AlertColor,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add,
  CategoryOutlined,
  DeleteOutline,
  EditOutlined,
  Inventory2Outlined,
  Refresh,
  Search,
} from "@mui/icons-material";

type Customer = { id: number; name: string };
type Product = { id: number; name: string; defaultPrice: number };
type SpecialPrice = {
  id: number;
  customerId: number;
  customerName: string;
  productId: number;
  productName: string;
  defaultPrice: number;
  customPrice: number;
  updatedAt: string;
};

const CUSTOMERS: Customer[] = [
  { id: 1, name: "Ayesha Medical Store" },
  { id: 2, name: "City Pharmacy" },
  { id: 3, name: "HealthPlus Clinic" },
  { id: 4, name: "New Life Pharmacy" },
  { id: 5, name: "Al-Shifa Medical Centre" },
  { id: 6, name: "Carewell Distributors" },
];

const PRODUCTS: Product[] = [
  { id: 1, name: "Panadol 500mg Tablets", defaultPrice: 25 },
  { id: 2, name: "Augmentin 625mg Tablets", defaultPrice: 450 },
  { id: 3, name: "Vitamin C 500mg Tablets", defaultPrice: 350 },
  { id: 4, name: "Digital Blood Pressure Monitor", defaultPrice: 4500 },
  { id: 5, name: "Surgical Disposable Gloves", defaultPrice: 850 },
  { id: 6, name: "Digital Thermometer", defaultPrice: 650 },
];

const INITIAL_SPECIAL_PRICES: SpecialPrice[] = [
  {
    id: 1,
    customerId: 1,
    customerName: "Ayesha Medical Store",
    productId: 1,
    productName: "Panadol 500mg Tablets",
    defaultPrice: 25,
    customPrice: 22,
    updatedAt: "2026-11-12",
  },
  {
    id: 2,
    customerId: 2,
    customerName: "City Pharmacy",
    productId: 2,
    productName: "Augmentin 625mg Tablets",
    defaultPrice: 450,
    customPrice: 425,
    updatedAt: "2026-11-15",
  },
  {
    id: 3,
    customerId: 3,
    customerName: "HealthPlus Clinic",
    productId: 4,
    productName: "Digital Blood Pressure Monitor",
    defaultPrice: 4500,
    customPrice: 4300,
    updatedAt: "2026-11-18",
  },
];

type SortKey =
  | "customerName"
  | "productName"
  | "defaultPrice"
  | "customPrice"
  | "updatedAt";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2,
  }).format(value);

export default function MasterProductPage() {
  const [specialPrices, setSpecialPrices] = useState<SpecialPrice[]>(
    INITIAL_SPECIAL_PRICES,
  );
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<SortKey>("updatedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [toast, setToast] = useState<{
    open: boolean;
    type: AlertColor;
    message: string;
  }>({ open: false, type: "success", message: "" });

  const notify = (type: AlertColor, message: string) =>
    setToast({ open: true, type, message });

  // Existing customer/product pricing takes precedence over the catalog price.
  const selectedSpecialPrice = useMemo(() => {
    if (!customer || !product) return undefined;
    return specialPrices.find(
      (item) =>
        item.customerId === customer.id && item.productId === product.id,
    );
  }, [customer, product, specialPrices]);

  const handleCustomerChange = (value: Customer | null) => {
    setCustomer(value);
    setEditingId(null);
    if (!value || !product) {
      setPrice(product ? String(product.defaultPrice) : "");
      return;
    }
    const existing = specialPrices.find(
      (item) => item.customerId === value.id && item.productId === product.id,
    );
    setPrice(String(existing?.customPrice ?? product.defaultPrice));
    setEditingId(existing?.id ?? null);
  };

  const handleProductChange = (value: Product | null) => {
    setProduct(value);
    setEditingId(null);
    if (!value) {
      setPrice("");
      return;
    }
    if (!customer) {
      setPrice(String(value.defaultPrice));
      return;
    }
    const existing = specialPrices.find(
      (item) => item.customerId === customer.id && item.productId === value.id,
    );
    setPrice(String(existing?.customPrice ?? value.defaultPrice));
    setEditingId(existing?.id ?? null);
  };

  const resetForm = () => {
    setCustomer(null);
    setProduct(null);
    setPrice("");
    setEditingId(null);
  };

  const handleSave = () => {
    if (!customer || !product) {
      notify("error", "Please select both a customer and a product.");
      return;
    }
    const customPrice = Number(price);
    if (
      price.trim() === "" ||
      !Number.isFinite(customPrice) ||
      customPrice < 0
    ) {
      notify("error", "Enter a valid price greater than or equal to zero.");
      return;
    }

    const existing = specialPrices.find(
      (item) =>
        item.customerId === customer.id && item.productId === product.id,
    );
    const updated: SpecialPrice = {
      id: existing?.id ?? Date.now(),
      customerId: customer.id,
      customerName: customer.name,
      productId: product.id,
      productName: product.name,
      defaultPrice: product.defaultPrice,
      customPrice,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setSpecialPrices((current) =>
      existing
        ? current.map((item) => (item.id === existing.id ? updated : item))
        : [updated, ...current],
    );
    setPage(0);
    resetForm();
    notify(
      "success",
      existing ? "Special price updated." : "Special price added.",
    );
  };

  const handleEdit = (item: SpecialPrice) => {
    const nextCustomer =
      CUSTOMERS.find((entry) => entry.id === item.customerId) ?? null;
    const nextProduct =
      PRODUCTS.find((entry) => entry.id === item.productId) ?? null;
    setCustomer(nextCustomer);
    setProduct(nextProduct);
    setPrice(String(item.customPrice));
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    const item = specialPrices.find((entry) => entry.id === id);
    if (!item) return;
    if (
      !window.confirm(
        `Delete the special price for ${item.customerName} — ${item.productName}?`,
      )
    )
      return;
    setSpecialPrices((current) => current.filter((entry) => entry.id !== id));
    if (editingId === id) resetForm();
    notify("success", "Special price deleted.");
  };

  const handleSort = (key: SortKey) => {
    const isAsc = orderBy === key && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(key);
  };

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const rows = specialPrices.filter((item) =>
      [
        item.customerName,
        item.productName,
        String(item.defaultPrice),
        String(item.customPrice),
        item.updatedAt,
      ].some((value) => value.toLowerCase().includes(keyword)),
    );
    return [...rows].sort((a, b) => {
      const first = a[orderBy];
      const second = b[orderBy];
      const comparison =
        typeof first === "number" && typeof second === "number"
          ? first - second
          : String(first).localeCompare(String(second), undefined, {
              numeric: true,
              sensitivity: "base",
            });
      return order === "asc" ? comparison : -comparison;
    });
  }, [specialPrices, search, order, orderBy]);

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const columns: { id: SortKey; label: string }[] = [
    { id: "customerName", label: "Customer Name" },
    { id: "productName", label: "Product Name" },
    { id: "defaultPrice", label: "Default Price" },
    { id: "customPrice", label: "Custom Price" },
    { id: "updatedAt", label: "Updated Date" },
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
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          severity={toast.type}
          variant="filled"
          onClose={() => setToast((current) => ({ ...current, open: false }))}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </MuiAlert>
      </Snackbar>

      {/* PAGE HEADER */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1e293b">
            Master Product
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Set customer-specific product pricing and manage special rates.
          </Typography>
        </Box>
      </Stack>

      {/* MASTER PRODUCT ENTRY FORM */}
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
                Customer Product Pricing
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Select a customer and product to define a special price.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

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
                Pricing Information
              </Typography>
            </Box>

            <Autocomplete
              fullWidth
              options={CUSTOMERS}
              value={customer}
              onChange={(_, value) => handleCustomerChange(value)}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Customer *"
                  placeholder="Search or select customer"
                />
              )}
              noOptionsText="No customers found"
            />

            <Autocomplete
              fullWidth
              options={PRODUCTS}
              value={product}
              onChange={(_, value) => handleProductChange(value)}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Product *"
                  placeholder="Search or select product"
                />
              )}
              noOptionsText="No products found"
            />

            <TextField
              fullWidth
              size="small"
              label="Default Price"
              value={product ? formatPrice(product.defaultPrice) : ""}
              placeholder="Select a product"
              InputProps={{ readOnly: true }}
            />

            <TextField
              fullWidth
              size="small"
              label="Special Price *"
              type="number"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="Enter customer price"
              inputProps={{ min: 0, step: "0.01" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Rs</InputAdornment>
                ),
              }}
              helperText={
                selectedSpecialPrice
                  ? "Saved special price loaded for this customer and product."
                  : product
                    ? "Default price is loaded until a special price is saved."
                    : "Select a product to load its default price."
              }
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
                  onClick={resetForm}
                  startIcon={<Refresh />}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  Reset Form
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleSave}
                  sx={{
                    bgcolor: "#2563eb",
                    textTransform: "none",
                    borderRadius: 2,
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
                  }}
                >
                  {editingId !== null ? "Update Price" : "Add Special Price"}
                </Button>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* SPECIAL PRICING TABLE */}
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
              Customer Special Pricing
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and maintain all customer-specific product prices.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "minmax(0, 1fr) auto",
              },
              gap: 2,
              mb: 3,
              "& > *": { minWidth: 0 },
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search customer, product, or price..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
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
            <Tooltip title="Reset search and sorting">
              <Button
                variant="outlined"
                onClick={() => {
                  setSearch("");
                  setOrderBy("updatedAt");
                  setOrder("desc");
                  setPage(0);
                }}
                sx={{ height: 40, minWidth: 44 }}
              >
                <Refresh />
              </Button>
            </Tooltip>
          </Box>

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
            <Table sx={{ minWidth: 850 }}>
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
                  <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedRows.map((item) => (
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
                        <Typography fontWeight={700} variant="body2">
                          {item.customerName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {item.productName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>
                        {formatPrice(item.defaultPrice)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={formatPrice(item.customPrice)}
                        sx={{
                          bgcolor: "#eff6ff",
                          color: "#2563eb",
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {item.updatedAt}
                    </TableCell>
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

                {filteredRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Inventory2Outlined
                        sx={{ fontSize: 45, color: "#94a3b8", mb: 1 }}
                      />
                      <Typography fontWeight={700}>
                        No Special Prices Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add a customer-specific price or try another search.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredRows.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(Number(event.target.value));
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
    </Box>
  );
}
