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
  quantity: string;
  tp: string;
  discount: string;
};

const emptyForm: FormState = {
  serialNumber: "",
  productName: "",
  productId: "",
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
  // Header state
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDate, setOrderDate] = useState("");

  // Entry-form state
  const [form, setForm] = useState<FormState>({ ...emptyForm });
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
      quantity: qty,
      tp,
      discountPercent,
      discountAmount,
      lineTotal,
    };
    setEntries((prev) => [...prev, newEntry]);
    setForm({ ...emptyForm });
    showMessage("success", "Entry added to the sales order.");
    

    setForm({
      ...emptyForm,
      productId: `PRD-${Math.floor(10000 + Math.random() * 90000)}`,
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

  // Genrate Prodcut ID

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      productId: `PRD-${Math.floor(10000 + Math.random() * 90000)}`,
    }));
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
              subtitle="Enter one product at a time, then click Add to List."
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
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Product Name"
                  name="productName"
                  value={form.productName}
                  onChange={handleFormChange}
                  placeholder="e.g. Paracetamol 500mg"
                  sx={fieldSx}
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
                  required
                  size="small"
                  type="number"
                  label="Quantity"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleFormChange}
                  placeholder="e.g. 100"
                  inputProps={{ min: 1 }}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="number"
                  label="TP (Trade Price)"
                  name="tp"
                  value={form.tp}
                  onChange={handleFormChange}
                  placeholder="e.g. 250.00"
                  inputProps={{ min: 0, step: "0.01" }}
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
                  <Table size="small" sx={{ minWidth: 780 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f8fafc" }}>
                        {[
                          "Serial #",
                          "Product Name",
                          "Product ID",
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
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                          >
                            {entry.productId}
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
