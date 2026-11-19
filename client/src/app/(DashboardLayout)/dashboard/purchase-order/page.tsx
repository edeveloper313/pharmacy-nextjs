"use client";

import React, { useMemo, useState } from "react";
import {
  Alert as MuiAlert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
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
  AccountBalanceWalletOutlined,
  AddOutlined,
  BusinessOutlined,
  DeleteOutline,
  HistoryOutlined,
  Inventory2Outlined,
  ReceiptLongOutlined,
  RestartAltOutlined,
  SaveOutlined,
} from "@mui/icons-material";
import Alert from "@/app/components/Alert";

type Supplier = {
  id: string;
  name: string;
  ntn: string;
  address: string;
  phone: string;
};

type PurchaseHistoryRecord = {
  invoiceNo: string;
  date: string;
  productName: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unit: string;
  purchaseRate: number;
};

type InvoiceItem = {
  id: number;
  supplierName: string;
  supplierNtn: string;
  invoiceNumber: string;
  invoiceDate: string;
  productName: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unit: string;
  purchaseRate: number;
  discount: number;
  taxPercent: number;
  taxAmount: number;
  subTotal: number;
  grandTotal: number;
};

type FormState = {
  supplierName: string;
  supplierNtn: string;
  invoiceNumber: string;
  invoiceDate: string;
  productName: string;
  batchNumber: string;
  expiryDate: string;
  quantity: string;
  unit: string;
  purchaseRate: string;
  discount: string;
  tax: string;
  paymentType: string;
  paidAmount: string;
  dueDate: string;
};

const emptyForm: FormState = {
  supplierName: "",
  supplierNtn: "",
  invoiceNumber: "",
  invoiceDate: "",
  productName: "",
  batchNumber: "",
  expiryDate: "",
  quantity: "",
  unit: "",
  purchaseRate: "",
  discount: "",
  tax: "",
  paymentType: "",
  paidAmount: "",
  dueDate: "",
};

// Demo suppliers and history. Replace these with supplier and purchase-history API data.
const suppliers: Supplier[] = [
  {
    id: "SUP-001",
    name: "Medico Distributors",
    ntn: "1234567-8",
    address: "Jodia Bazaar, Karachi",
    phone: "021-32345678",
  },
  {
    id: "SUP-002",
    name: "Pak Pharma Supply",
    ntn: "7654321-0",
    address: "Saddar, Karachi",
    phone: "021-35678901",
  },
  {
    id: "SUP-003",
    name: "HealthCare Agencies",
    ntn: "4567890-1",
    address: "Gulberg, Lahore",
    phone: "042-37890123",
  },
];

const supplierHistory: Record<string, PurchaseHistoryRecord[]> = {
  "SUP-001": [
    {
      invoiceNo: "SUP-INV-1042",
      date: "2026-10-28",
      productName: "Paracetamol 500mg",
      batchNumber: "PCM-25A",
      expiryDate: "2027-12-31",
      quantity: 500,
      unit: "Box",
      purchaseRate: 420,
    },
    {
      invoiceNo: "SUP-INV-0998",
      date: "2026-09-12",
      productName: "Amoxicillin 500mg",
      batchNumber: "AMX-24B",
      expiryDate: "2027-08-31",
      quantity: 200,
      unit: "Pack",
      purchaseRate: 680,
    },
    {
      invoiceNo: "SUP-INV-0941",
      date: "2026-08-04",
      productName: "Paracetamol 500mg",
      batchNumber: "PCM-24C",
      expiryDate: "2027-05-31",
      quantity: 300,
      unit: "Box",
      purchaseRate: 410,
    },
  ],
  "SUP-002": [
    {
      invoiceNo: "PPS-7781",
      date: "2026-10-17",
      productName: "Normal Saline 500ml",
      batchNumber: "NS-610",
      expiryDate: "2028-02-28",
      quantity: 150,
      unit: "Bottle",
      purchaseRate: 95,
    },
  ],
  "SUP-003": [],
};

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

const money = (value: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2,
  }).format(value || 0);

export default function PurchaseInvoicePage() {
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [messageId, setMessageId] = useState(0);

  // Use this helper to show a toast. The messageId forces your Alert to re-mount
  // so the same error/success toast re-appears every time it is triggered.
  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setMessageId((id) => id + 1);
  };

  const history = useMemo(
    () =>
      selectedSupplier ? (supplierHistory[selectedSupplier.id] ?? []) : [],
    [selectedSupplier],
  );
  const matchingHistory = useMemo(() => {
    const query = form.productName.trim().toLocaleLowerCase();
    return query
      ? history.filter((record) =>
          record.productName.toLocaleLowerCase().includes(query),
        )
      : [];
  }, [form.productName, history]);
  const previousProductQty = matchingHistory.reduce(
    (sum, record) => sum + record.quantity,
    0,
  );

  const qty = Number(form.quantity) || 0;
  const rate = Number(form.purchaseRate) || 0;
  const discount = Number(form.discount) || 0;
  const taxPercent = Number(form.tax) || 0;
  const lineSubTotal = Math.max(0, qty * rate - discount);
  const lineTax = lineSubTotal * (taxPercent / 100);
  const lineGrandTotal = lineSubTotal + lineTax;
  const itemsTotal = items.reduce((sum, item) => sum + item.grandTotal, 0);
  const paidAmount = Number(form.paidAmount) || 0;
  const grandTotal = itemsTotal;
  const remainingBalance = Math.max(0, grandTotal - paidAmount);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setMessage(null);
  };

  const handleSupplierChange = (
    _: React.SyntheticEvent,
    supplier: Supplier | null,
  ) => {
    if (items.length > 0 && supplier?.id !== selectedSupplier?.id) {
      showMessage(
        "error",
        "Remove the current invoice items before changing supplier. One purchase invoice can contain items from one supplier.",
      );
      return;
    }
    setSelectedSupplier(supplier);
    setForm((previous) => ({
      ...previous,
      supplierName: supplier?.name ?? "",
      supplierNtn: supplier?.ntn ?? "",
    }));
    setMessage(null);
  };

  const handleAddToList = () => {
    if (!selectedSupplier) {
      showMessage("error", "Please search and select a supplier first.");
      return;
    }
    if (
      !form.invoiceNumber.trim() ||
      !form.invoiceDate ||
      !form.productName.trim() ||
      !form.batchNumber.trim() ||
      !form.expiryDate ||
      !form.quantity ||
      !form.unit ||
      !form.purchaseRate
    ) {
      showMessage(
        "error",
        "Please complete the required invoice and product fields before adding to the list.",
      );
      return;
    }
    if (
      qty <= 0 ||
      rate < 0 ||
      discount < 0 ||
      taxPercent < 0 ||
      discount > qty * rate
    ) {
      showMessage(
        "error",
        "Check quantity, rate, discount and GST values. Discount cannot exceed the line amount.",
      );
      return;
    }

    const newItem: InvoiceItem = {
      id: Date.now(),
      supplierName: selectedSupplier.name,
      supplierNtn: selectedSupplier.ntn,
      invoiceNumber: form.invoiceNumber.trim(),
      invoiceDate: form.invoiceDate,
      productName: form.productName.trim(),
      batchNumber: form.batchNumber.trim(),
      expiryDate: form.expiryDate,
      quantity: qty,
      unit: form.unit,
      purchaseRate: rate,
      discount,
      taxPercent,
      taxAmount: lineTax,
      subTotal: lineSubTotal,
      grandTotal: lineGrandTotal,
    };
    setItems((previous) => [...previous, newItem]);
    setForm((previous) => ({
      ...previous,
      productName: "",
      batchNumber: "",
      expiryDate: "",
      quantity: "",
      unit: "",
      purchaseRate: "",
      discount: "",
      tax: "",
    }));
    showMessage("success", "Product added to purchase list.");
  };

  const handleRemoveItem = (id: number) =>
    setItems((previous) => previous.filter((item) => item.id !== id));

  const handleReset = () => {
    setForm({ ...emptyForm });
    setSelectedSupplier(null);
    setItems([]);
    setMessage(null);
  };

  const handleSaveInvoice = () => {
    if (!selectedSupplier || items.length === 0) {
      showMessage(
        "error",
        "Select a supplier and add at least one product to the list.",
      );
      return;
    }
    if (!form.paymentType) {
      showMessage("error", "Please select a payment type.");
      return;
    }
    if (paidAmount < 0 || paidAmount > grandTotal) {
      showMessage(
        "error",
        "Paid amount must be between zero and the grand total.",
      );
      return;
    }
    if (remainingBalance > 0 && !form.dueDate) {
      showMessage(
        "error",
        "Please select a due date for the remaining balance.",
      );
      return;
    }

    // Demo only: connect this payload to your purchase invoice API/database.
    console.log("Purchase Invoice:", {
      supplier: selectedSupplier,
      invoiceNumber: form.invoiceNumber,
      invoiceDate: form.invoiceDate,
      items,
      grandTotal,
      paymentType: form.paymentType,
      paidAmount,
      remainingBalance,
      dueDate: form.dueDate,
    });
    showMessage("success", "Purchase invoice saved successfully");
  };

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
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={1.5}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color="#1e293b">
            Purchase Invoice
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Record supplier purchases, review purchase history and manage
            payments.
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
            NEW PURCHASE INVOICE
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
            <Section
              icon={<BusinessOutlined />}
              title="Supplier & Invoice Information"
              subtitle="Search for a supplier and enter the supplier invoice details."
            >
              <Box sx={gridSx}>
                <Autocomplete
                  fullWidth
                  options={suppliers}
                  value={selectedSupplier}
                  onChange={handleSupplierChange}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      size="small"
                      label="Supplier Name"
                      placeholder="Search supplier by name..."
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
                        NTN: {option.ntn} · {option.phone}
                      </Typography>
                    </Box>
                  )}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Supplier NTN"
                  value={form.supplierNtn}
                  placeholder="Auto-filled after supplier selection"
                  InputProps={{ readOnly: true }}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Invoice Number"
                  name="invoiceNumber"
                  value={form.invoiceNumber}
                  onChange={handleChange}
                  placeholder="e.g. SUP-INV-1025"
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="date"
                  label="Invoice Date"
                  name="invoiceDate"
                  value={form.invoiceDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  sx={fieldSx}
                />
              </Box>
              {selectedSupplier && (
                <Box
                  sx={{
                    mt: 2,
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
                    Selected Supplier Details
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
                    <Typography variant="body2">
                      <b>Supplier:</b> {selectedSupplier.name}
                    </Typography>
                    <Typography variant="body2">
                      <b>NTN:</b> {selectedSupplier.ntn}
                    </Typography>
                    <Typography variant="body2">
                      <b>Phone:</b> {selectedSupplier.phone}
                    </Typography>
                    <Typography variant="body2">
                      <b>Address:</b> {selectedSupplier.address}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Section>

            <Divider />

            <Section
              icon={<Inventory2Outlined />}
              title="Product Details"
              subtitle="Enter one product at a time, then use Add to List to include it in this invoice."
            >
              <Box sx={gridSx}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Product Name"
                  name="productName"
                  value={form.productName}
                  onChange={handleChange}
                  placeholder="Search or enter product name"
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Batch Number"
                  name="batchNumber"
                  value={form.batchNumber}
                  onChange={handleChange}
                  placeholder="Enter batch / lot number"
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="date"
                  label="Expiry Date"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="number"
                  label="Quantity (Qty)"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  inputProps={{ min: 1 }}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  required
                  select
                  size="small"
                  label="Unit"
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  sx={fieldSx}
                >
                  <MenuItem value="" disabled>
                    Select unit
                  </MenuItem>
                  {[
                    "Piece",
                    "Pack",
                    "Box",
                    "Bottle",
                    "Vial",
                    "Strip",
                    "Carton",
                    "Kg",
                    "Liter",
                  ].map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="number"
                  label="Purchase Rate (PKR / Unit)"
                  name="purchaseRate"
                  value={form.purchaseRate}
                  onChange={handleChange}
                  placeholder="e.g. 125.50"
                  inputProps={{ min: 0, step: "0.01" }}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Discount (PKR)"
                  name="discount"
                  value={form.discount}
                  onChange={handleChange}
                  placeholder="Enter discount amount"
                  inputProps={{ min: 0, step: "0.01" }}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Tax / GST (%)"
                  name="tax"
                  value={form.tax}
                  onChange={handleChange}
                  placeholder="e.g. 18"
                  inputProps={{ min: 0, step: "0.01" }}
                  helperText="GST percentage applied after discount."
                  sx={fieldSx}
                />
              </Box>
              {selectedSupplier && matchingHistory.length > 0 && (
                <MuiAlert severity="warning" sx={{ mt: 2 }}>
                  <b>Previous purchase check:</b> {form.productName} was
                  previously purchased from {selectedSupplier.name} in{" "}
                  {matchingHistory.length} record(s), total quantity{" "}
                  <b>{previousProductQty}</b>. Check current stock before adding
                  more.
                </MuiAlert>
              )}
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
                      Sub Total
                    </Typography>
                    <Typography fontWeight={700}>
                      {money(lineSubTotal)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      GST Amount
                    </Typography>
                    <Typography fontWeight={700}>{money(lineTax)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Grand Total
                    </Typography>
                    <Typography fontWeight={800} color="#2563eb">
                      {money(lineGrandTotal)}
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
                  variant="contained"
                  startIcon={<AddOutlined />}
                  onClick={handleAddToList}
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

            <Section
              icon={<HistoryOutlined />}
              title="Supplier Previous Purchase History"
              subtitle="Review what was previously purchased from this supplier before ordering again."
            >
              {!selectedSupplier ? (
                <MuiAlert severity="info">
                  Select a supplier to view their previous purchase records.
                </MuiAlert>
              ) : history.length === 0 ? (
                <MuiAlert severity="info">
                  No previous purchase history found for {selectedSupplier.name}
                  .
                </MuiAlert>
              ) : (
                <>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    spacing={0.5}
                    mb={1.5}
                  >
                    <Typography fontWeight={700} fontSize={14}>
                      {selectedSupplier.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {history.length} previous record(s)
                    </Typography>
                  </Stack>
                  <TableContainer
                    sx={{
                      width: "100%",
                      border: "1px solid #e8edf3",
                      borderRadius: 2,
                      overflowX: "auto",
                    }}
                  >
                    <Table size="small" sx={{ minWidth: 850 }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f8fafc" }}>
                          {[
                            "Invoice No.",
                            "Date",
                            "Product Name",
                            "Batch No.",
                            "Expiry",
                            "Qty",
                            "Unit",
                            "Purchase Rate",
                          ].map((heading) => (
                            <TableCell
                              key={heading}
                              sx={{
                                fontWeight: 700,
                                color: "#475569",
                                fontSize: 12,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {heading}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {history.map((record) => (
                          <TableRow
                            key={`${record.invoiceNo}-${record.batchNumber}`}
                            hover
                          >
                            <TableCell
                              sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                            >
                              {record.invoiceNo}
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                            >
                              {record.date}
                            </TableCell>
                            <TableCell sx={{ fontSize: 12, minWidth: 160 }}>
                              {record.productName}
                            </TableCell>
                            <TableCell sx={{ fontSize: 12 }}>
                              {record.batchNumber}
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                            >
                              {record.expiryDate}
                            </TableCell>
                            <TableCell sx={{ fontSize: 12 }}>
                              {record.quantity}
                            </TableCell>
                            <TableCell sx={{ fontSize: 12 }}>
                              {record.unit}
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                            >
                              {money(record.purchaseRate)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </Section>

            <Divider />

            <Section
              icon={<ReceiptLongOutlined />}
              title="Purchase List"
              subtitle="Products added to this invoice, each saved against the selected supplier."
            >
              {items.length === 0 ? (
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
                    No products added yet
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Complete product details and click Add to List.
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
                  <Table size="small" sx={{ minWidth: 1050 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f8fafc" }}>
                        {[
                          "Supplier",
                          "Invoice No.",
                          "Product",
                          "Batch",
                          "Expiry",
                          "Qty",
                          "Unit",
                          "Rate",
                          "Discount",
                          "Sub Total",
                          "GST",
                          "Grand Total",
                          "",
                        ].map((heading, index) => (
                          <TableCell
                            key={`${heading}-${index}`}
                            sx={{
                              fontWeight: 700,
                              color: "#475569",
                              fontSize: 11,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {heading}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell sx={{ fontSize: 11, minWidth: 140 }}>
                            {item.supplierName}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 11, whiteSpace: "nowrap" }}
                          >
                            {item.invoiceNumber}
                          </TableCell>
                          <TableCell sx={{ fontSize: 11, minWidth: 140 }}>
                            {item.productName}
                          </TableCell>
                          <TableCell sx={{ fontSize: 11 }}>
                            {item.batchNumber}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 11, whiteSpace: "nowrap" }}
                          >
                            {item.expiryDate}
                          </TableCell>
                          <TableCell sx={{ fontSize: 11 }}>
                            {item.quantity}
                          </TableCell>
                          <TableCell sx={{ fontSize: 11 }}>
                            {item.unit}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 11, whiteSpace: "nowrap" }}
                          >
                            {money(item.purchaseRate)}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 11, whiteSpace: "nowrap" }}
                          >
                            {money(item.discount)}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 11, whiteSpace: "nowrap" }}
                          >
                            {money(item.subTotal)}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 11, whiteSpace: "nowrap" }}
                          >
                            {money(item.taxAmount)}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: 11,
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {money(item.grandTotal)}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Remove item">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveItem(item.id)}
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

            <Section
              icon={<AccountBalanceWalletOutlined />}
              title="Payment & Invoice Summary"
              subtitle="Review invoice total and record payment details."
            >
              <Box sx={gridSx}>
                <TextField
                  fullWidth
                  required
                  select
                  size="small"
                  label="Payment Type"
                  name="paymentType"
                  value={form.paymentType}
                  onChange={handleChange}
                  sx={fieldSx}
                >
                  <MenuItem value="" disabled>
                    Select payment type
                  </MenuItem>
                  {[
                    "Cash",
                    "Bank Transfer",
                    "Cheque",
                    "Credit",
                    "Online Transfer",
                  ].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Paid Amount (PKR)"
                  name="paidAmount"
                  value={form.paidAmount}
                  onChange={handleChange}
                  placeholder="Enter amount paid"
                  inputProps={{ min: 0, step: "0.01" }}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Due Date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  helperText="Required when an outstanding balance remains."
                  sx={fieldSx}
                />
              </Box>
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
                      Sub Total (All Items)
                    </Typography>
                    <Typography fontWeight={700}>
                      {money(
                        items.reduce((sum, item) => sum + item.subTotal, 0),
                      )}
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
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Remaining Balance
                    </Typography>
                    <Typography
                      fontWeight={800}
                      color={remainingBalance > 0 ? "#b45309" : "#15803d"}
                    >
                      {money(remainingBalance)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Section>

            {/* Custom toast alert (auto-hide after 2s). Key forces re-show on every new message. */}
            {message && (
              <Alert
                key={messageId}
                message={message.text}
                type={message.type}
              />
            )}

            <Divider />
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
                Reset Form
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveOutlined />}
                onClick={handleSaveInvoice}
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
                Save Purchase Invoice
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
