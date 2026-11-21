"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  AddOutlined,
  BusinessOutlined,
  DeleteOutline,
  Inventory2Outlined,
  LocalHospitalOutlined,
  ReceiptLongOutlined,
  RestartAltOutlined,
  SaveOutlined,
} from "@mui/icons-material";
// Your custom toast Alert (auto-hides). Adjust path if needed.
import Alert from "@/app/components/Alert";

/* =========================================================================
   TYPES
   ========================================================================= */

type CustomerType =
  | "Clinic"
  | "Doctor"
  | "Hospital"
  | "Pharmacy / Medical Store"
  | "Wholesale Distributor";

type Customer = {
  id: string;
  name: string;
  type: CustomerType;
  phone: string;
  city: string;
};

/** One line item in the sales order (the 6 required fields + computed). */
type SalesEntry = {
  id: number;
  serialNumber: string;
  productName: string;
  productId: string;
  currentStock: number;
  isMasterProduct: boolean;
  regularPrice: number | null;
  quantity: number;
  tp: number;
  discountPercent: number;
  discountAmount: number;
  lineTotal: number;
};

/** Raw entry-form state (string-typed — no defaults, only placeholders). */
type FormState = {
  serialNumber: string;
  productName: string;
  productId: string;
  currentStock: string;
  isMasterProduct: boolean;
  regularPrice: string;
  quantity: string;
  tp: string;
  discount: string;
};

const emptyForm: FormState = {
  serialNumber: "",
  productName: "",
  productId: "",
  currentStock: "",
  isMasterProduct: false,
  regularPrice: "",
  quantity: "",
  tp: "",
  discount: "",
};

/* =========================================================================
   DEMO DATA (replace with API)
   ========================================================================= */

const customers: Customer[] = [
  {
    id: "CUS-001",
    name: "Aga Khan University Hospital",
    type: "Hospital",
    phone: "021-111-911-911",
    city: "Karachi",
  },
  {
    id: "CUS-002",
    name: "Shaukat Khanum Memorial",
    type: "Hospital",
    phone: "042-111-111-111",
    city: "Lahore",
  },
  {
    id: "CUS-003",
    name: "Al-Noor Clinic",
    type: "Clinic",
    phone: "021-34567890",
    city: "Karachi",
  },
  {
    id: "CUS-004",
    name: "MedPlus Pharmacy",
    type: "Pharmacy / Medical Store",
    phone: "0300-1234567",
    city: "Islamabad",
  },
  {
    id: "CUS-005",
    name: "Wellness Wholesale",
    type: "Wholesale Distributor",
    phone: "042-35678901",
    city: "Lahore",
  },
  {
    id: "CUS-006",
    name: "Dr. Ahmed Raza",
    type: "Doctor",
    phone: "0321-9876543",
    city: "Karachi",
  },
];

type Product = {
  id: string;
  name: string;
  stock: number;
  defaultPrice: number;
};

const products: Product[] = [
  { id: "PRD-1001", name: "Paracetamol 500mg", stock: 420, defaultPrice: 180 },
  { id: "PRD-1002", name: "Amoxicillin 250mg", stock: 180, defaultPrice: 320 },
  { id: "PRD-1003", name: "Vitamin C 500mg", stock: 95, defaultPrice: 240 },
  {
    id: "PRD-1004",
    name: "Surgical Gloves (Box)",
    stock: 60,
    defaultPrice: 850,
  },
  {
    id: "PRD-1005",
    name: "Blood Pressure Monitor",
    stock: 24,
    defaultPrice: 4200,
  },
  {
    id: "PRD-1006",
    name: "Antiseptic Solution 500ml",
    stock: 130,
    defaultPrice: 410,
  },
  {
    id: "PRD-1007",
    name: "Disposable Syringe 5ml",
    stock: 900,
    defaultPrice: 22,
  },
  { id: "PRD-1008", name: "Digital Thermometer", stock: 45, defaultPrice: 950 },
];

// Demo configuration: each customer has an independent Master Product list.
const masterProductsByCustomer: Record<string, string[]> = {
  "CUS-001": ["PRD-1001", "PRD-1004", "PRD-1007"],
  "CUS-002": ["PRD-1002", "PRD-1003"],
  "CUS-003": ["PRD-1001", "PRD-1006"],
  "CUS-004": ["PRD-1003", "PRD-1008"],
  "CUS-005": ["PRD-1004", "PRD-1005"],
  "CUS-006": ["PRD-1002", "PRD-1007"],
};

// Fixed Master Product prices are also customer-specific (demo values in PKR).
const masterPricesByCustomer: Record<string, Record<string, number>> = {
  "CUS-001": { "PRD-1001": 175, "PRD-1004": 825, "PRD-1007": 20 },
  "CUS-002": { "PRD-1002": 310, "PRD-1003": 230 },
  "CUS-003": { "PRD-1001": 170, "PRD-1006": 395 },
  "CUS-004": { "PRD-1003": 225, "PRD-1008": 925 },
  "CUS-005": { "PRD-1004": 810, "PRD-1005": 4100 },
  "CUS-006": { "PRD-1002": 300, "PRD-1007": 19 },
};

const customerTypes: CustomerType[] = [
  "Clinic",
  "Doctor",
  "Hospital",
  "Pharmacy / Medical Store",
  "Wholesale Distributor",
];

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
   PAGE — Sales Order Entry (Hospital Recovery Entries)
   ========================================================================= */

export default function HospitalRecoveryEntryPage() {
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  // Header state
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDate, setOrderDate] = useState(getTodayDate());

  // Entry-form state
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [entries, setEntries] = useState<SalesEntry[]>([]);

  // Toast (your custom Alert auto-hides after 2s)
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [messageId, setMessageId] = useState(0);
  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setMessageId((id) => id + 1);
  };

  /* ------- Filtered customer list by CRM type ------- */
  const filteredCustomers = useMemo(
    () =>
      customerTypeFilter
        ? customers.filter((c) => c.type === customerTypeFilter)
        : customers,
    [customerTypeFilter],
  );

  /* ------- Live calculations (current line) ------- */
  const qty = Number(form.quantity) || 0;
  const tp = Number(form.tp) || 0;
  const discountPercent = Number(form.discount) || 0;
  const grossAmount = qty * tp;
  const discountAmount = grossAmount * (discountPercent / 100);
  const lineTotal = Math.max(0, grossAmount - discountAmount);
  const isMasterProduct = Boolean(
    customer &&
    selectedProduct &&
    (masterProductsByCustomer[customer.id] || []).includes(selectedProduct.id),
  );
  const alreadyAddedQty = selectedProduct
    ? entries
        .filter((entry) => entry.productId === selectedProduct.id)
        .reduce((sum, entry) => sum + entry.quantity, 0)
    : 0;
  const availableStock = selectedProduct
    ? Math.max(0, selectedProduct.stock - alreadyAddedQty)
    : 0;
  const stockExceeded = Boolean(selectedProduct && qty > availableStock);
  const belowRegularPrice = Boolean(
    selectedProduct &&
    !isMasterProduct &&
    form.tp !== "" &&
    tp < Number(form.regularPrice),
  );

  /* ------- Totals ------- */
  const totalQuantity = entries.reduce((s, e) => s + e.quantity, 0);
  const totalDiscount = entries.reduce((s, e) => s + e.discountAmount, 0);
  const grandTotal = entries.reduce((s, e) => s + e.lineTotal, 0);

  /* ------- Handlers ------- */
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleProductSelect = (product: Product | null) => {
    setSelectedProduct(product);
    if (!product) {
      setForm((prev) => ({
        ...prev,
        productName: "",
        productId: "",
        currentStock: "",
        tp: "",
        regularPrice: "",
        quantity: "",
        isMasterProduct: false,
      }));
      return;
    }
    const master = Boolean(
      customer &&
      (masterProductsByCustomer[customer.id] || []).includes(product.id),
    );
    const customerMasterPrice = customer
      ? masterPricesByCustomer[customer.id]?.[product.id]
      : undefined;
    const selectedPrice = master
      ? (customerMasterPrice ?? product.defaultPrice)
      : product.defaultPrice;
    const remainingStock = Math.max(
      0,
      product.stock -
        entries
          .filter((entry) => entry.productId === product.id)
          .reduce((sum, entry) => sum + entry.quantity, 0),
    );
    setForm((prev) => ({
      ...prev,
      productName: product.name,
      productId: product.id,
      currentStock: String(remainingStock),
      isMasterProduct: master,
      regularPrice: master ? "" : String(product.defaultPrice),
      tp: String(selectedPrice),
      quantity: "",
    }));
    setMessage(null);
  };

  const handleAddEntry = () => {
    if (!customer) {
      showMessage("error", "Please select a hospital / customer first.");
      return;
    }
    if (
      !form.serialNumber.trim() ||
      !form.productName.trim() ||
      !form.productId.trim() ||
      !form.quantity ||
      !form.tp
    ) {
      showMessage("error", "Please complete all required entry fields.");
      return;
    }
    if (!selectedProduct) {
      showMessage("error", "Please select a product from the product search.");
      return;
    }
    if (stockExceeded) {
      showMessage("error", "Selected quantity exceeds current stock quantity.");
      return;
    }
    if (belowRegularPrice) {
      showMessage(
        "error",
        `Price cannot be less than the regular price (${money(Number(form.regularPrice))}).`,
      );
      return;
    }
    if (qty <= 0 || tp < 0 || discountPercent < 0 || discountPercent > 100) {
      showMessage("error", "Check quantity, TP and discount values.");
      return;
    }
    if (
      entries.some(
        (e) =>
          e.serialNumber.trim().toLowerCase() ===
          form.serialNumber.trim().toLowerCase(),
      )
    ) {
      showMessage(
        "error",
        "This serial number is already used. Please use a unique value.",
      );
      return;
    }

    const newEntry: SalesEntry = {
      id: Date.now(),
      serialNumber: form.serialNumber.trim(),
      productName: form.productName.trim(),
      productId: form.productId.trim(),
      currentStock: availableStock,
      isMasterProduct,
      regularPrice: isMasterProduct ? null : Number(form.regularPrice),
      quantity: qty,
      tp,
      discountPercent,
      discountAmount,
      lineTotal,
    };
    setEntries((prev) => [...prev, newEntry]);
    setSelectedProduct(null);
    setForm({
      ...emptyForm,
      productId: ``,
      serialNumber: `SR-${Math.floor(10000 + Math.random() * 90000)}`,
    });
    showMessage("success", "Entry added to the sales order.");
  };

  const handleRemoveEntry = (id: number) =>
    setEntries((prev) => prev.filter((e) => e.id !== id));

  const handleReset = () => {
    setCustomerTypeFilter("");
    setCustomer(null);
    setOrderNumber("");
    setOrderDate("");
    setForm({ ...emptyForm });
    setSelectedProduct(null);
    setEntries([]);
    setMessage(null);
  };

  const handleSave = () => {
    if (!customer) {
      showMessage("error", "Please select a hospital / customer.");
      return;
    }
    if (!orderNumber.trim() || !orderDate) {
      showMessage("error", "Please fill order number and order date.");
      return;
    }
    if (entries.length === 0) {
      showMessage("error", "Add at least one entry before saving.");
      return;
    }

    // Demo only — connect to your sales-order API.
    console.log("Sales Order (Hospital Recovery):", {
      customer,
      orderNumber,
      orderDate,
      entries,
      totalQuantity,
      totalDiscount,
      grandTotal,
    });
    // Generate new Order Number
    setOrderNumber(`SO-${Math.floor(100000 + Math.random() * 900000)}`);

    // Clear Customer & Order Date
    setCustomer(null);
    setSelectedProduct(null);
    setCustomerTypeFilter("");
    setOrderDate("");

    // Generate new Product IDs
    setForm({
      ...emptyForm,
      productId: `PRD-${Math.floor(10000 + Math.random() * 90000)}`,
      serialNumber: `SR-${Math.floor(10000 + Math.random() * 90000)}`,
    });

    // Clear Product List
    setEntries([]);
    showMessage("success", "Sales order saved successfully.");
    setOrderNumber(`SO-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  // Genrate Order Number
  useEffect(() => {
    setOrderNumber(`SO-${Math.floor(100000 + Math.random() * 900000)}`);
  }, []);

  // Genrate serialNumber

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      serialNumber: `SR-${Math.floor(10000 + Math.random() * 90000)}`,
    }));
  }, []);

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
            Sales Order Entry
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Hospital recovery entries — record product-wise sales for hospital
            customers.
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
            NEW ORDER ENTRY
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
            {/* ---------- Hospital / Customer & Order Info ---------- */}
            <Section
              icon={<BusinessOutlined />}
              title="Hospital / Customer Information"
              subtitle="Select the customer and enter order header details."
            >
              <Box sx={gridSx}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Customer Type"
                  value={customerTypeFilter}
                  onChange={(e) => setCustomerTypeFilter(e.target.value)}
                  sx={fieldSx}
                >
                  <MenuItem value="">All Customer Types</MenuItem>
                  {customerTypes.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>

                <Autocomplete
                  fullWidth
                  options={filteredCustomers}
                  value={customer}
                  onChange={(_, value) => {
                    setCustomer(value);
                    setSelectedProduct(null);
                    setForm({ ...emptyForm, serialNumber: form.serialNumber });
                    setMessage(null);
                  }}
                  getOptionLabel={(o) => o.name}
                  isOptionEqualToValue={(o, v) => o.id === v.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      size="small"
                      label="Hospital / Customer Name"
                      placeholder="Search by name..."
                      sx={fieldSx}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      {...props}
                      key={option.id}
                      sx={{ display: "block !important" }}
                    >
                      <Typography fontWeight={600} fontSize={13}>
                        {option.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.type} · {option.phone} · {option.city}
                      </Typography>
                    </Box>
                  )}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Order Number"
                  value={orderNumber}
                  InputProps={{
                    readOnly: true,
                  }}
                  placeholder="Auto Generated"
                  sx={fieldSx}
                />

                <TextField
                  fullWidth
                  required
                  size="small"
                  type="date"
                  label="Order Date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={fieldSx}
                />
              </Box>

              {customer && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    border: "1px solid #dbeafe",
                    bgcolor: "#f8fbff",
                    borderRadius: 2,
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    mb={1}
                    flexWrap="wrap"
                  >
                    <Typography fontSize={13} fontWeight={700} color="#1e40af">
                      Selected Customer
                    </Typography>
                    <Chip
                      size="small"
                      label={customer.type}
                      sx={{
                        bgcolor: "#dbeafe",
                        color: "#1e40af",
                        fontWeight: 600,
                      }}
                    />
                  </Stack>
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
                    <Typography variant="body2">
                      <b>Name:</b> {customer.name}
                    </Typography>
                    <Typography variant="body2">
                      <b>Phone:</b> {customer.phone}
                    </Typography>
                    <Typography variant="body2">
                      <b>City:</b> {customer.city}
                    </Typography>
                    <Typography variant="body2">
                      <b>Customer ID:</b> {customer.id}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Section>

            <Divider />

            {/* ---------- Product Entry — the 6 required fields ---------- */}
            <Section
              icon={<Inventory2Outlined />}
              title="Product Entry"
              subtitle="Search products for the selected customer. Master Product rules and stock are customer-specific."
            >
              <Box sx={gridSx}>
                <TextField
                  fullWidth
                  size="small"
                  label="Serial Number / ID"
                  name="serialNumber"
                  value={form.serialNumber}
                  InputProps={{ readOnly: true }}
                  placeholder="Auto Generated"
                  sx={fieldSx}
                />
                <Autocomplete
                  fullWidth
                  options={products}
                  value={selectedProduct}
                  onChange={(_, value) => handleProductSelect(value)}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  filterOptions={(options, state) => {
                    const keyword = state.inputValue.trim().toLowerCase();
                    return keyword
                      ? options.filter(
                          (product) =>
                            product.name.toLowerCase().includes(keyword) ||
                            product.id.toLowerCase().includes(keyword),
                        )
                      : options;
                  }}
                  disabled={!customer}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      size="small"
                      label="Search Product"
                      placeholder={
                        customer
                          ? "Type product name or ID..."
                          : "Select customer first"
                      }
                      sx={fieldSx}
                    />
                  )}
                  renderOption={(props, option) => {
                    const isMaster = Boolean(
                      customer &&
                      (masterProductsByCustomer[customer.id] || []).includes(
                        option.id,
                      ),
                    );
                    return (
                      <Box
                        component="li"
                        {...props}
                        key={option.id}
                        sx={{
                          display: "flex !important",
                          justifyContent: "space-between !important",
                          gap: 1,
                        }}
                      >
                        <Box minWidth={0}>
                          <Typography fontWeight={600} fontSize={13}>
                            {option.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.id}
                          </Typography>
                        </Box>
                        {isMaster && (
                          <Chip size="small" color="primary" label="Master" />
                        )}
                      </Box>
                    );
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Product ID"
                  name="productId"
                  value={form.productId}
                  InputProps={{ readOnly: true }}
                  placeholder="Auto Generated"
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Current Stock Qty"
                  value={form.currentStock}
                  InputProps={{ readOnly: true }}
                  placeholder="Select a product"
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="number"
                  label="Quantity"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleFormChange}
                  placeholder="e.g. 100"
                  inputProps={{ min: 1, max: availableStock || undefined }}
                  error={stockExceeded}
                  helperText={
                    stockExceeded ? `Available stock: ${availableStock}` : " "
                  }
                  sx={fieldSx}
                />
                {!isMasterProduct && selectedProduct && (
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Regular Price (PKR)"
                    value={form.regularPrice}
                    InputProps={{ readOnly: true }}
                    sx={fieldSx}
                    helperText="Minimum selling price for this customer."
                  />
                )}
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="number"
                  label={
                    isMasterProduct ? "Price (PKR)" : "Selling Price (PKR)"
                  }
                  name="tp"
                  value={form.tp}
                  onChange={handleFormChange}
                  placeholder="e.g. 250.00"
                  InputProps={{ readOnly: isMasterProduct }}
                  inputProps={{
                    min: isMasterProduct ? 0 : Number(form.regularPrice) || 0,
                    step: "0.01",
                  }}
                  helperText={
                    isMasterProduct
                      ? "Master Product price is fixed."
                      : "Cannot be lower than Regular Price."
                  }
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Discount (%)"
                  name="discount"
                  value={form.discount}
                  onChange={handleFormChange}
                  placeholder="e.g. 5"
                  inputProps={{ min: 0, max: 100, step: "0.01" }}
                  helperText="Applied on gross amount (Qty × TP)."
                  sx={fieldSx}
                />
              </Box>

              {(isMasterProduct || stockExceeded || belowRegularPrice) && (
                <Stack direction="row" flexWrap="wrap" gap={1} mt={1.5}>
                  {isMasterProduct && (
                    <Chip
                      color="primary"
                      size="small"
                      label="Master Product Selected"
                    />
                  )}
                  {stockExceeded && (
                    <Chip
                      color="error"
                      size="small"
                      label="You have selected a quantity greater than the available quantity."
                    />
                  )}
                  {belowRegularPrice && (
                    <Chip
                      color="error"
                      size="small"
                      label="The price cannot be lower than the regular price."
                    />
                  )}
                </Stack>
              )}

              {/* Live line preview */}
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "#f8fafc",
                  border: "1px solid #e8edf3",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr 1fr",
                      sm: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Gross Amount
                    </Typography>
                    <Typography fontWeight={700}>
                      {money(grossAmount)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Discount
                    </Typography>
                    <Typography fontWeight={700}>
                      {money(discountAmount)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Line Total
                    </Typography>
                    <Typography fontWeight={800} color="#2563eb">
                      {money(lineTotal)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="flex-end"
                mt={2}
              >
                <Button
                  type="button"
                  variant="contained"
                  startIcon={<AddOutlined />}
                  onClick={handleAddEntry}
                  sx={{
                    bgcolor: "#2563eb",
                    borderRadius: 2,
                    textTransform: "none",
                    boxShadow: "none",
                    minHeight: 42,
                    px: 3,
                    "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
                  }}
                >
                  Add to List
                </Button>
              </Stack>
            </Section>

            <Divider />

            {/* ---------- Entries List ---------- */}
            <Section
              icon={<ReceiptLongOutlined />}
              title="Sales Order Entries"
              subtitle="All products added to this hospital recovery entry."
            >
              {entries.length === 0 ? (
                <Box
                  sx={{
                    border: "1px dashed #cbd5e1",
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                    bgcolor: "#f8fafc",
                  }}
                >
                  <Typography fontWeight={600} fontSize={14} color="#475569">
                    No entries added yet
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Complete the product entry form and click Add to List.
                  </Typography>
                </Box>
              ) : (
                <TableContainer
                  sx={{
                    width: "100%",
                    border: "1px solid #e8edf3",
                    borderRadius: 2,
                    overflowX: "auto",
                  }}
                >
                  <Table size="small" sx={{ minWidth: 860 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f8fafc" }}>
                        {[
                          "Serial #",
                          "Product Name",
                          "Product ID",
                          "Stock at Entry",
                          "Qty",
                          "TP",
                          "Discount",
                          "Line Total",
                          "",
                        ].map((h, i) => (
                          <TableCell
                            key={`${h}-${i}`}
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
                      {entries.map((entry) => (
                        <TableRow key={entry.id} hover>
                          <TableCell
                            sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                          >
                            {entry.serialNumber}
                          </TableCell>
                          <TableCell sx={{ fontSize: 12, minWidth: 140 }}>
                            {entry.productName}
                            {entry.isMasterProduct && (
                              <Chip
                                size="small"
                                color="primary"
                                label="Master"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                          >
                            {entry.productId}
                          </TableCell>
                          <TableCell sx={{ fontSize: 12 }}>
                            {entry.currentStock}
                          </TableCell>
                          <TableCell sx={{ fontSize: 12 }}>
                            {entry.quantity}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                          >
                            {money(entry.tp)}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                          >
                            {entry.discountPercent}% (
                            {money(entry.discountAmount)})
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: 12,
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {money(entry.lineTotal)}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Remove entry">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveEntry(entry.id)}
                              >
                                <DeleteOutline fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Section>

            <Divider />

            {/* ---------- Summary ---------- */}
            <Section
              icon={<LocalHospitalOutlined />}
              title="Order Summary"
              subtitle="Totals for this hospital recovery sales order."
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f8fafc",
                  border: "1px solid #e8edf3",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr 1fr",
                      sm: "repeat(4, minmax(0, 1fr))",
                    },
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Items
                    </Typography>
                    <Typography fontWeight={700}>{entries.length}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Quantity
                    </Typography>
                    <Typography fontWeight={700}>{totalQuantity}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Discount
                    </Typography>
                    <Typography fontWeight={700}>
                      {money(totalDiscount)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Grand Total
                    </Typography>
                    <Typography fontWeight={800} color="#2563eb">
                      {money(grandTotal)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Section>

            {/* Custom toast (auto-hide). messageId re-mounts for repeated messages. */}
            {message && (
              <Alert
                key={messageId}
                message={message.text}
                type={message.type}
              />
            )}

            <Divider />

            {/* Actions */}
            <Stack
              direction={{ xs: "column-reverse", sm: "row" }}
              justifyContent="flex-end"
              spacing={1.5}
            >
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<RestartAltOutlined />}
                onClick={handleReset}
                sx={{ borderRadius: 2, textTransform: "none", minHeight: 42 }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveOutlined />}
                onClick={handleSave}
                sx={{
                  bgcolor: "#2563eb",
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "none",
                  minHeight: 42,
                  px: 3,
                  "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
                }}
              >
                Save Sales Order
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
