"use client";

import React, { useMemo, useState } from "react";
import {
  Alert as MuiAlert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Close,
  Inventory2Outlined,
  SaveOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
// Your custom toast Alert (auto-hides after 2s). Adjust path if needed.
import Alert from "@/app/components/Alert";

import {
  type Product,
  type ProductHistoryStatus,
  type ProductHistoryType,
  type ProductStatus,
  products,
  productHistory,
  productSortOptions,
  productStatusOptions,
  productTypeOptions,
  productUnitOptions,
} from "@/app/data/demodata";

/* =========================================================================
   SHARED STYLES / HELPERS
   ========================================================================= */

const fieldSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#fff" },
  "& .MuiInputLabel-root": { fontSize: 14 },
  "& .MuiFormHelperText-root": { mx: 0, fontSize: 11 },
};

const gridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(2, minmax(0, 1fr))",
  },
  gap: 2,
  "& > *": { minWidth: 0 },
};

const money = (value: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2,
  }).format(value || 0);

const statusChipSx = (status: ProductHistoryStatus) => {
  switch (status) {
    case "Completed":
      return { bgcolor: "#dcfce7", color: "#166534", fontWeight: 700 };
    case "Pending":
      return { bgcolor: "#fef3c7", color: "#92400e", fontWeight: 700 };
    case "Cancelled":
      return { bgcolor: "#e5e7eb", color: "#374151", fontWeight: 700 };
  }
};

const typeChipSx = (type: ProductHistoryType) => {
  switch (type) {
    case "Purchase":
      return { bgcolor: "#dbeafe", color: "#1e40af", fontWeight: 700 };
    case "Sale":
      return { bgcolor: "#dcfce7", color: "#166534", fontWeight: 700 };
    case "Return In":
      return { bgcolor: "#fef3c7", color: "#92400e", fontWeight: 700 };
    case "Return Out":
      return { bgcolor: "#fee2e2", color: "#991b1b", fontWeight: 700 };
    case "Adjustment":
      return { bgcolor: "#e5e7eb", color: "#374151", fontWeight: 700 };
  }
};

const productStatusChipSx = (status: ProductStatus) => {
  switch (status) {
    case "In Stock":
      return { bgcolor: "#dcfce7", color: "#166534", fontWeight: 700 };
    case "Low Stock":
      return { bgcolor: "#fef3c7", color: "#92400e", fontWeight: 700 };
    case "Out of Stock":
      return { bgcolor: "#fee2e2", color: "#991b1b", fontWeight: 700 };
    case "Discontinued":
      return { bgcolor: "#e5e7eb", color: "#374151", fontWeight: 700 };
  }
};

const productStatusOrder: Record<ProductStatus, number> = {
  "Out of Stock": 0,
  "Low Stock": 1,
  "In Stock": 2,
  Discontinued: 3,
};

type SectionProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

function Section({ icon, title, subtitle, children }: SectionProps) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={2.5}>
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: "#eff6ff",
            color: "#2563eb",
            width: 42,
            height: 42,
            borderRadius: 2,
          }}
        >
          {icon}
        </Avatar>
        <Box minWidth={0}>
          <Typography fontWeight={700} fontSize={16}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Stack>
      {children}
    </Box>
  );
}

/* =========================================================================
   EDIT FORM STATE (all product fields as strings for smooth typing)
   ========================================================================= */

type ProductFormState = {
  id: string;
  name: string;
  type: string;
  category: string;
  unit: string;
  manufacturer: string;
  currentStock: string;
  reorderLevel: string;
  purchasePrice: string;
  sellingPrice: string;
  status: ProductStatus;
};

const toFormState = (product: Product): ProductFormState => ({
  id: product.id,
  name: product.name,
  type: product.type,
  category: product.category,
  unit: product.unit,
  manufacturer: product.manufacturer,
  currentStock: String(product.currentStock),
  reorderLevel: String(product.reorderLevel),
  purchasePrice: String(product.purchasePrice),
  sellingPrice: String(product.sellingPrice),
  status: product.status,
});

/* =========================================================================
   PAGE — Product History
   ========================================================================= */

export default function ProductHistoryPage() {
  // Products in state so modal edits reflect in the grid immediately.
  const [productsState, setProductsState] = useState<Product[]>(products);

  // Grid search/sort
  const [productGridSearch, setProductGridSearch] = useState("");
  const [productGridSort, setProductGridSort] = useState("name-asc");

  // Modal (Update Purchase form)
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editDraft, setEditDraft] = useState<ProductFormState | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  // Toast
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [messageId, setMessageId] = useState(0);
  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setMessageId((id) => id + 1);
  };

  /* ------- All products grid (search + sort) ------- */
  const visibleProducts = useMemo(() => {
    const query = productGridSearch.trim().toLocaleLowerCase();

    let rows = productsState;
    if (query) {
      rows = rows.filter((p) => {
        const haystack = [
          p.id,
          p.name,
          p.type,
          p.category,
          p.status,
          p.manufacturer,
          p.unit,
        ]
          .join(" ")
          .toLocaleLowerCase();
        return haystack.includes(query);
      });
    }

    const sorted = [...rows];
    switch (productGridSort) {
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "qty-desc":
        sorted.sort((a, b) => b.currentStock - a.currentStock);
        break;
      case "qty-asc":
        sorted.sort((a, b) => a.currentStock - b.currentStock);
        break;
      case "purchase-desc":
        sorted.sort((a, b) => b.purchasePrice - a.purchasePrice);
        break;
      case "purchase-asc":
        sorted.sort((a, b) => a.purchasePrice - b.purchasePrice);
        break;
      case "status":
        sorted.sort(
          (a, b) => productStatusOrder[a.status] - productStatusOrder[b.status],
        );
        break;
      default:
        break;
    }
    return sorted;
  }, [productsState, productGridSearch, productGridSort]);

  /* ------- Handlers ------- */

  /** Opens the Update Purchase modal with all product fields editable. */
  const handleUpdatePurchase = (product: Product) => {
    setEditProduct(product);
    setEditDraft(toFormState(product));
    setEditError(null);
  };

  const closeUpdateModal = () => {
    setEditProduct(null);
    setEditDraft(null);
    setEditError(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditDraft((prev) => (prev ? { ...prev, [name]: value } : prev));
    setEditError(null);
  };

  const handleSaveProduct = () => {
    if (!editDraft || !editProduct) return;

    if (!editDraft.name.trim()) {
      setEditError("Product name is required.");
      return;
    }
    if (!editDraft.type) {
      setEditError("Please select a product type.");
      return;
    }
    if (!editDraft.unit) {
      setEditError("Please select a unit.");
      return;
    }

    const stock = Number(editDraft.currentStock) || 0;
    const reorder = Number(editDraft.reorderLevel) || 0;
    const purchase = Number(editDraft.purchasePrice) || 0;
    const selling = Number(editDraft.sellingPrice) || 0;

    if (stock < 0) {
      setEditError("Quantity cannot be negative.");
      return;
    }
    if (reorder < 0) {
      setEditError("Reorder level cannot be negative.");
      return;
    }
    if (purchase < 0) {
      setEditError("Purchase price cannot be negative.");
      return;
    }
    if (selling < 0) {
      setEditError("Selling price cannot be negative.");
      return;
    }
    if (selling < purchase) {
      setEditError("Selling price cannot be less than purchase price.");
      return;
    }

    setProductsState((prev) =>
      prev.map((p) =>
        p.id === editDraft.id
          ? {
              ...p,
              name: editDraft.name.trim(),
              type: editDraft.type,
              category: editDraft.category.trim(),
              unit: editDraft.unit,
              manufacturer: editDraft.manufacturer.trim(),
              currentStock: stock,
              reorderLevel: reorder,
              purchasePrice: purchase,
              sellingPrice: selling,
              status: editDraft.status,
            }
          : p,
      ),
    );

    showMessage(
      "success",
      `Product ${editDraft.id} — ${editDraft.name.trim()} updated successfully.`,
    );
    closeUpdateModal();
  };

  /* ------- Recent purchase history (for the modal context) ------- */
  const recentPurchases = useMemo(() => {
    if (!editProduct) return [];
    const records = productHistory[editProduct.id] ?? [];
    return records
      .filter((r) => r.type === "Purchase")
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  }, [editProduct]);

  /* ------- UI ------- */
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflowX: "hidden",
        pb: 4,
      }}
    >
      {/* Page header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={1.5}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color="#1e293b">
            Product History
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Browse products, search and sort, then use Update Purchase to edit
            product details in a modal.
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "#eff6ff",
            color: "#2563eb",
            borderRadius: 2,
            px: 1.5,
            py: 0.8,
            width: "fit-content",
          }}
        >
          <Typography fontSize={12} fontWeight={700}>
            PRODUCT HISTORY
          </Typography>
        </Box>
      </Stack>

      <Card
        elevation={0}
        sx={{
          width: "100%",
          border: "1px solid #e8edf3",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <CardContent
          sx={{ p: { xs: 2, sm: 3, md: 3.5 }, "&:last-child": { pb: 3.5 } }}
        >
          <Stack spacing={3.5}>
            {/* ---------- All Products grid ---------- */}
            <Section
              icon={<Inventory2Outlined />}
              title="All Products"
              subtitle="Browse every product with current stock, pricing and status. Use Update Purchase to edit any field."
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                mb={2}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by product ID, name, type, category or status..."
                  value={productGridSearch}
                  onChange={(e) => setProductGridSearch(e.target.value)}
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlined fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  select
                  size="small"
                  label="Sort by"
                  value={productGridSort}
                  onChange={(e) => setProductGridSort(e.target.value)}
                  sx={{ ...fieldSx, minWidth: { sm: 240 } }}
                >
                  {productSortOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                spacing={0.5}
                mb={1.5}
              >
                <Typography fontWeight={700} fontSize={14}>
                  Products
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {visibleProducts.length} product(s)
                </Typography>
              </Stack>

              {visibleProducts.length === 0 ? (
                <MuiAlert severity="info">
                  No products match the current search.
                </MuiAlert>
              ) : (
                <TableContainer
                  sx={{
                    width: "100%",
                    border: "1px solid #e8edf3",
                    borderRadius: 2,
                    overflowX: "auto",
                  }}
                >
                  <Table size="small" sx={{ minWidth: 950 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f8fafc" }}>
                        {[
                          "Product ID",
                          "Product Name",
                          "Type",
                          "Qty",
                          "Purchasing Price",
                          "Selling Price",
                          "Status",
                          "Action",
                        ].map((h) => (
                          <TableCell
                            key={h}
                            sx={{
                              fontWeight: 700,
                              color: "#475569",
                              fontSize: 12,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {visibleProducts.map((product) => (
                        <TableRow key={product.id} hover>
                          <TableCell
                            sx={{
                              fontSize: 12,
                              whiteSpace: "nowrap",
                              fontWeight: 600,
                            }}
                          >
                            {product.id}
                          </TableCell>
                          <TableCell sx={{ fontSize: 12, minWidth: 160 }}>
                            {product.name}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                          >
                            {product.type}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                          >
                            {product.currentStock} {product.unit}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                          >
                            {money(product.purchasePrice)}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                          >
                            {money(product.sellingPrice)}
                          </TableCell>
                          <TableCell sx={{ fontSize: 12 }}>
                            <Chip
                              size="small"
                              label={product.status}
                              sx={productStatusChipSx(product.status)}
                            />
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<ShoppingCartOutlined />}
                              onClick={() => handleUpdatePurchase(product)}
                              sx={{
                                bgcolor: "#2563eb",
                                borderRadius: 1.5,
                                textTransform: "none",
                                boxShadow: "none",
                                fontSize: 12,
                                minWidth: 150,
                                "&:hover": {
                                  bgcolor: "#1d4ed8",
                                  boxShadow: "none",
                                },
                              }}
                            >
                              Update Purchase
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Section>

            {/* Custom toast */}
            {message && (
              <Alert
                key={messageId}
                message={message.text}
                type={message.type}
              />
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* ---------- Update Purchase modal ---------- */}
      <Dialog
        open={!!editProduct}
        onClose={closeUpdateModal}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {editProduct && editDraft && (
          <>
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                pb: 1.5,
              }}
            >
              <Box minWidth={0}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  flexWrap="wrap"
                >
                  <Typography fontWeight={800} fontSize={16}>
                    Update Purchase — {editProduct.id}
                  </Typography>
                  <Chip
                    size="small"
                    label={editDraft.status}
                    sx={productStatusChipSx(editDraft.status)}
                  />
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Edit any product field and save. Changes reflect in the grid
                  instantly.
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={closeUpdateModal}
                aria-label="close"
              >
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              {editError && (
                <MuiAlert severity="error" sx={{ mb: 2 }}>
                  {editError}
                </MuiAlert>
              )}

              {/* Recent purchases (read-only context) */}
              {recentPurchases.length > 0 && (
                <Box
                  sx={{
                    mb: 2,
                    p: 2,
                    border: "1px solid #dbeafe",
                    bgcolor: "#f8fbff",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    fontSize={13}
                    fontWeight={700}
                    color="#1e40af"
                    mb={1}
                  >
                    Recent Purchases
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, minmax(0, 1fr))",
                      },
                      gap: 1,
                    }}
                  >
                    {recentPurchases.map((rec) => (
                      <Box
                        key={rec.transactionNo}
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: "#fff",
                          border: "1px solid #e8edf3",
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={1}
                          flexWrap="wrap"
                        >
                          <Typography fontSize={11} fontWeight={700}>
                            {rec.transactionNo}
                          </Typography>
                          <Chip
                            size="small"
                            label={rec.status}
                            sx={statusChipSx(rec.status)}
                          />
                        </Stack>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {rec.date} · {rec.partyName}
                        </Typography>
                        <Typography fontSize={11}>
                          {rec.quantity} {rec.unit} @ {money(rec.rate)} ={" "}
                          <b>{money(rec.totalAmount)}</b>
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* All editable product fields */}
              <Box sx={gridSx}>
                <TextField
                  fullWidth
                  size="small"
                  label="Product ID"
                  value={editDraft.id}
                  disabled
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Product Name"
                  name="name"
                  value={editDraft.name}
                  onChange={handleEditChange}
                  placeholder="e.g. Paracetamol 500mg"
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  required
                  select
                  size="small"
                  label="Type"
                  name="type"
                  value={editDraft.type}
                  onChange={handleEditChange}
                  sx={fieldSx}
                >
                  {productTypeOptions.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  size="small"
                  label="Category"
                  name="category"
                  value={editDraft.category}
                  onChange={handleEditChange}
                  placeholder="e.g. Analgesic"
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  required
                  select
                  size="small"
                  label="Unit"
                  name="unit"
                  value={editDraft.unit}
                  onChange={handleEditChange}
                  sx={fieldSx}
                >
                  {productUnitOptions.map((u) => (
                    <MenuItem key={u} value={u}>
                      {u}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  size="small"
                  label="Manufacturer"
                  name="manufacturer"
                  value={editDraft.manufacturer}
                  onChange={handleEditChange}
                  placeholder="e.g. GSK Pakistan"
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="number"
                  label="Quantity (Current Stock)"
                  name="currentStock"
                  value={editDraft.currentStock}
                  onChange={handleEditChange}
                  placeholder="e.g. 100"
                  inputProps={{ min: 0, step: "1" }}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Reorder Level"
                  name="reorderLevel"
                  value={editDraft.reorderLevel}
                  onChange={handleEditChange}
                  placeholder="e.g. 50"
                  inputProps={{ min: 0, step: "1" }}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="number"
                  label="Purchasing Price (PKR / Unit)"
                  name="purchasePrice"
                  value={editDraft.purchasePrice}
                  onChange={handleEditChange}
                  placeholder="e.g. 410"
                  inputProps={{ min: 0, step: "0.01" }}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="number"
                  label="Selling Price (PKR / Unit)"
                  name="sellingPrice"
                  value={editDraft.sellingPrice}
                  onChange={handleEditChange}
                  placeholder="e.g. 550"
                  inputProps={{ min: 0, step: "0.01" }}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  required
                  select
                  size="small"
                  label="Status"
                  name="status"
                  value={editDraft.status}
                  onChange={handleEditChange}
                  sx={fieldSx}
                >
                  {productStatusOptions.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={closeUpdateModal}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Cancel
              </Button>
              <Tooltip title="Save updates">
                <Button
                  variant="contained"
                  startIcon={<SaveOutlined />}
                  onClick={handleSaveProduct}
                  sx={{
                    bgcolor: "#2563eb",
                    borderRadius: 2,
                    textTransform: "none",
                    boxShadow: "none",
                    px: 3,
                    "&:hover": {
                      bgcolor: "#1d4ed8",
                      boxShadow: "none",
                    },
                  }}
                >
                  Save Updates
                </Button>
              </Tooltip>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
