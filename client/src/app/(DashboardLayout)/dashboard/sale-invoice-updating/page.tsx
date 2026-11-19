"use client";

import React, { useState } from "react";
import {
  Alert as MuiAlert,
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
} from "@mui/material";
import {
  EditOutlined,
  ReceiptLongOutlined,
  RestartAltOutlined,
  SaveOutlined,
  SearchOutlined,
  UpdateOutlined,
} from "@mui/icons-material";
// Your custom toast Alert (auto-hides after 2s). Adjust path if needed.
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

type InvoiceStatus = "Paid" | "Partial" | "Unpaid" | "Cancelled";

/** One product line on a saved invoice (read-only after creation). */
type InvoiceItem = {
  id: number;
  productName: string;
  productId: string;
  quantity: number;
  tp: number;
  discountPercent: number;
  discountAmount: number;
  lineTotal: number;
};

/** A saved sales invoice (demo). */
type DemoInvoice = {
  invoiceNo: string;
  purchasingId: string;
  customerName: string;
  customerType: CustomerType;
  customerPhone: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  totalDiscount: number;
  grandTotal: number;
  paidAmount: number;
  paymentType: string;
  status: InvoiceStatus;
  notes: string;
};

/** Editable fields on the update form. */
type UpdateForm = {
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  paymentType: string;
  paidAmount: string;
  notes: string;
};

const emptyUpdateForm: UpdateForm = {
  invoiceDate: "",
  dueDate: "",
  status: "Unpaid",
  paymentType: "",
  paidAmount: "",
  notes: "",
};

/* =========================================================================
   DEMO INVOICES (6 invoices — any Purchasing ID returns a subset)
   ========================================================================= */

const demoInvoices: DemoInvoice[] = [
  {
    invoiceNo: "INV-2026-001",
    purchasingId: "PUR-HOSP-1001",
    customerName: "Aga Khan University Hospital",
    customerType: "Hospital",
    customerPhone: "021-111-911-911",
    invoiceDate: "2026-11-01",
    dueDate: "2026-11-30",
    items: [
      { id: 1, productName: "Paracetamol 500mg", productId: "PRD-001", quantity: 100, tp: 250, discountPercent: 5, discountAmount: 1250, lineTotal: 23750 },
      { id: 2, productName: "Amoxicillin 500mg", productId: "PRD-002", quantity: 50, tp: 680, discountPercent: 10, discountAmount: 3400, lineTotal: 30600 },
      { id: 3, productName: "Normal Saline 500ml", productId: "PRD-003", quantity: 200, tp: 95, discountPercent: 0, discountAmount: 0, lineTotal: 19000 },
    ],
    subtotal: 78000,
    totalDiscount: 4650,
    grandTotal: 73350,
    paidAmount: 50000,
    paymentType: "Bank Transfer",
    status: "Partial",
    notes: "First installment received.",
  },
  {
    invoiceNo: "INV-2026-002",
    purchasingId: "PUR-HOSP-1002",
    customerName: "Shaukat Khanum Memorial",
    customerType: "Hospital",
    customerPhone: "042-111-111-111",
    invoiceDate: "2026-11-03",
    dueDate: "2026-12-03",
    items: [
      { id: 1, productName: "Panadol Extra", productId: "PRD-004", quantity: 300, tp: 180, discountPercent: 5, discountAmount: 2700, lineTotal: 51300 },
      { id: 2, productName: "Brufen 400mg", productId: "PRD-005", quantity: 150, tp: 320, discountPercent: 8, discountAmount: 3840, lineTotal: 44160 },
    ],
    subtotal: 102000,
    totalDiscount: 6540,
    grandTotal: 95460,
    paidAmount: 95460,
    paymentType: "Online Transfer",
    status: "Paid",
    notes: "Fully settled.",
  },
  {
    invoiceNo: "INV-2026-003",
    purchasingId: "PUR-PHR-2001",
    customerName: "MedPlus Pharmacy",
    customerType: "Pharmacy / Medical Store",
    customerPhone: "0300-1234567",
    invoiceDate: "2026-11-05",
    dueDate: "2026-11-20",
    items: [
      { id: 1, productName: "Insulin Glargine", productId: "PRD-006", quantity: 20, tp: 2500, discountPercent: 5, discountAmount: 2500, lineTotal: 47500 },
    ],
    subtotal: 50000,
    totalDiscount: 2500,
    grandTotal: 47500,
    paidAmount: 0,
    paymentType: "Credit",
    status: "Unpaid",
    notes: "Awaiting payment.",
  },
  {
    invoiceNo: "INV-2026-004",
    purchasingId: "PUR-CLN-3001",
    customerName: "Al-Noor Clinic",
    customerType: "Clinic",
    customerPhone: "021-34567890",
    invoiceDate: "2026-11-07",
    dueDate: "2026-12-07",
    items: [
      { id: 1, productName: "Ventolin Inhaler", productId: "PRD-007", quantity: 40, tp: 850, discountPercent: 10, discountAmount: 3400, lineTotal: 30600 },
      { id: 2, productName: "Augmentin 625mg", productId: "PRD-008", quantity: 100, tp: 450, discountPercent: 5, discountAmount: 2250, lineTotal: 42750 },
    ],
    subtotal: 79000,
    totalDiscount: 5650,
    grandTotal: 73350,
    paidAmount: 73350,
    paymentType: "Cheque",
    status: "Paid",
    notes: "Cheque cleared.",
  },
  {
    invoiceNo: "INV-2026-005",
    purchasingId: "PUR-WHL-4001",
    customerName: "Wellness Wholesale",
    customerType: "Wholesale Distributor",
    customerPhone: "042-35678901",
    invoiceDate: "2026-11-09",
    dueDate: "2026-12-09",
    items: [
      { id: 1, productName: "Omeprazole 20mg", productId: "PRD-009", quantity: 200, tp: 180, discountPercent: 5, discountAmount: 1800, lineTotal: 34200 },
      { id: 2, productName: "Metformin 500mg", productId: "PRD-010", quantity: 250, tp: 120, discountPercent: 5, discountAmount: 1500, lineTotal: 28500 },
      { id: 3, productName: "Vitamin D3", productId: "PRD-011", quantity: 100, tp: 350, discountPercent: 8, discountAmount: 2800, lineTotal: 32200 },
    ],
    subtotal: 101000,
    totalDiscount: 6100,
    grandTotal: 94900,
    paidAmount: 40000,
    paymentType: "Cash",
    status: "Partial",
    notes: "Balance due by month end.",
  },
  {
    invoiceNo: "INV-2026-006",
    purchasingId: "PUR-DOC-5001",
    customerName: "Dr. Ahmed Raza",
    customerType: "Doctor",
    customerPhone: "0321-9876543",
    invoiceDate: "2026-11-10",
    dueDate: "2026-11-25",
    items: [
      { id: 1, productName: "Blood Pressure Monitor", productId: "PRD-012", quantity: 10, tp: 3500, discountPercent: 5, discountAmount: 1750, lineTotal: 33250 },
    ],
    subtotal: 35000,
    totalDiscount: 1750,
    grandTotal: 33250,
    paidAmount: 33250,
    paymentType: "Cash",
    status: "Paid",
    notes: "Paid in full.",
  },
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
  gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
  gap: 2,
  "& > *": { minWidth: 0 },
};

const money = (value: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2,
  }).format(value || 0);

const statusChipSx = (status: InvoiceStatus) => {
  switch (status) {
    case "Paid":      return { bgcolor: "#dcfce7", color: "#166534", fontWeight: 700 };
    case "Partial":   return { bgcolor: "#fef3c7", color: "#92400e", fontWeight: 700 };
    case "Unpaid":    return { bgcolor: "#fee2e2", color: "#991b1b", fontWeight: 700 };
    case "Cancelled": return { bgcolor: "#e5e7eb", color: "#374151", fontWeight: 700 };
  }
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
          sx={{ bgcolor: "#eff6ff", color: "#2563eb", width: 42, height: 42, borderRadius: 2 }}
        >
          {icon}
        </Avatar>
        <Box minWidth={0}>
          <Typography fontWeight={700} fontSize={16}>{title}</Typography>
          <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
        </Box>
      </Stack>
      {children}
    </Box>
  );
}

/* =========================================================================
   PAGE — Sales Invoice Entry (Sales Invoice Updating)
   ========================================================================= */

export default function SalesInvoiceUpdatePage() {
  // Search state
  const [purchasingId, setPurchasingId] = useState("");
  const [searchedId, setSearchedId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedInvoices, setMatchedInvoices] = useState<DemoInvoice[]>([]);

  // Selected invoice + update form
  const [selectedInvoice, setSelectedInvoice] = useState<DemoInvoice | null>(null);
  const [updateForm, setUpdateForm] = useState<UpdateForm>({ ...emptyUpdateForm });

  // Toast (your custom Alert auto-hides after 2s)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [messageId, setMessageId] = useState(0);
  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setMessageId((id) => id + 1);
  };

  /* ------- Handlers ------- */
  const handleSearch = () => {
    const id = purchasingId.trim();
    if (!id) {
      showMessage("error", "Please enter a Purchasing ID to search.");
      return;
    }
    // Demo: any ID returns a deterministic subset (4–6 invoices) so it feels realistic.
    const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const count = 4 + (hash % 3); // 4, 5, or 6
    const found = demoInvoices.slice(0, count);
    setMatchedInvoices(found);
    setSearchedId(id);
    setHasSearched(true);
    setSelectedInvoice(null);
    setUpdateForm({ ...emptyUpdateForm });
    showMessage("success", `Found ${found.length} invoice(s) for Purchasing ID: ${id}`);
  };

  const handleSelectInvoice = (invoice: DemoInvoice) => {
    setSelectedInvoice(invoice);
    setUpdateForm({
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      paymentType: invoice.paymentType,
      paidAmount: String(invoice.paidAmount),
      notes: invoice.notes,
    });
    showMessage("success", `Invoice ${invoice.invoiceNo} loaded for editing.`);
  };

  const handleUpdateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleSave = () => {
    if (!selectedInvoice) {
      showMessage("error", "Please select an invoice to update.");
      return;
    }
    if (!updateForm.invoiceDate || !updateForm.dueDate || !updateForm.paymentType) {
      showMessage("error", "Please fill invoice date, due date and payment type.");
      return;
    }
    const paid = Number(updateForm.paidAmount) || 0;
    if (paid < 0 || paid > selectedInvoice.grandTotal) {
      showMessage("error", "Paid amount must be between 0 and grand total.");
      return;
    }

    // Demo only — connect to your sales-invoice API.
    console.log("Updated Sales Invoice:", {
      ...selectedInvoice,
      ...updateForm,
      paidAmount: paid,
      remainingBalance: Math.max(0, selectedInvoice.grandTotal - paid),
    });
    showMessage("success", `Invoice ${selectedInvoice.invoiceNo} updated successfully.`);
  };

  const handleReset = () => {
    setPurchasingId("");
    setSearchedId("");
    setHasSearched(false);
    setMatchedInvoices([]);
    setSelectedInvoice(null);
    setUpdateForm({ ...emptyUpdateForm });
    setMessage(null);
  };

  /* ------- Derived summary for selected invoice ------- */
  const paidAmount = Number(updateForm.paidAmount) || 0;
  const remainingBalance = selectedInvoice ? Math.max(0, selectedInvoice.grandTotal - paidAmount) : 0;

  /* ------- UI ------- */
  return (
    <Box sx={{ width: "100%", maxWidth: "100%", minWidth: 0, overflowX: "hidden", pb: 4 }}>
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
            Sales Invoice Entry
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Search by Purchasing ID, review invoices and update payment status.
          </Typography>
        </Box>
        <Box sx={{ bgcolor: "#eff6ff", color: "#2563eb", borderRadius: 2, px: 1.5, py: 0.8, width: "fit-content" }}>
          <Typography fontSize={12} fontWeight={700}>SALES INVOICE UPDATING</Typography>
        </Box>
      </Stack>

      <Card elevation={0} sx={{ width: "100%", border: "1px solid #e8edf3", borderRadius: 3, overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 3.5 }, "&:last-child": { pb: 3.5 } }}>
          <Stack spacing={3.5}>

            {/* ---------- Purchasing ID search ---------- */}
            <Section
              icon={<SearchOutlined />}
              title="Purchasing ID Search"
              subtitle="Enter the hospital's Purchasing ID to fetch the related sales invoices."
            >
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr auto" }, gap: 2, alignItems: "flex-end" }}>
                <TextField
                  fullWidth required size="small"
                  label="Purchasing ID"
                  value={purchasingId}
                  onChange={(e) => setPurchasingId(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                  placeholder="e.g. PUR-HOSP-1001"
                  helperText="Demo mode: any ID returns sample invoices."
                  sx={fieldSx}
                />
                <Button
                  variant="contained"
                  startIcon={<SearchOutlined />}
                  onClick={handleSearch}
                  sx={{
                    bgcolor: "#2563eb", borderRadius: 2, textTransform: "none",
                    boxShadow: "none", minHeight: 40, px: 3,
                    "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
                  }}
                >
                  Search
                </Button>
              </Box>
            </Section>

            {hasSearched && (
              <>
                <Divider />

                {/* ---------- Matched invoices ---------- */}
                <Section
                  icon={<ReceiptLongOutlined />}
                  title="Invoices Found"
                  subtitle={`Showing ${matchedInvoices.length} invoice(s) for Purchasing ID: ${searchedId}`}
                >
                  <MuiAlert severity="info" sx={{ mb: 2 }}>
                    <b>Demo notice:</b> sample invoices shown for any Purchasing ID. Real data will come from your sales-invoice API.
                  </MuiAlert>

                  <TableContainer sx={{ width: "100%", border: "1px solid #e8edf3", borderRadius: 2, overflowX: "auto" }}>
                    <Table size="small" sx={{ minWidth: 900 }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f8fafc" }}>
                          {["Invoice No", "Date", "Customer", "Type", "Items", "Grand Total", "Status", ""].map((h, i) => (
                            <TableCell
                              key={`${h}-${i}`}
                              sx={{ fontWeight: 700, color: "#475569", fontSize: 12, whiteSpace: "nowrap" }}
                            >
                              {h}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {matchedInvoices.map((inv) => {
                          const isSelected = selectedInvoice?.invoiceNo === inv.invoiceNo;
                          return (
                            <TableRow
                              key={inv.invoiceNo}
                              hover
                              selected={isSelected}
                              sx={isSelected ? { bgcolor: "#eff6ff !important" } : undefined}
                            >
                              <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap", fontWeight: 600 }}>{inv.invoiceNo}</TableCell>
                              <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{inv.invoiceDate}</TableCell>
                              <TableCell sx={{ fontSize: 12, minWidth: 160 }}>{inv.customerName}</TableCell>
                              <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{inv.customerType}</TableCell>
                              <TableCell sx={{ fontSize: 12 }}>{inv.items.length}</TableCell>
                              <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{money(inv.grandTotal)}</TableCell>
                              <TableCell sx={{ fontSize: 12 }}>
                                <Chip size="small" label={inv.status} sx={statusChipSx(inv.status)} />
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  variant={isSelected ? "contained" : "outlined"}
                                  startIcon={<EditOutlined />}
                                  onClick={() => handleSelectInvoice(inv)}
                                  sx={{
                                    textTransform: "none", borderRadius: 2,
                                    bgcolor: isSelected ? "#2563eb" : undefined,
                                    color: isSelected ? "#fff" : "#2563eb",
                                    borderColor: isSelected ? "#2563eb" : "#2563eb",
                                    "&:hover": { bgcolor: isSelected ? "#1d4ed8" : "#eff6ff" },
                                  }}
                                >
                                  {isSelected ? "Editing" : "Edit"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Section>
              </>
            )}

            {selectedInvoice && (
              <>
                <Divider />

                {/* ---------- Update form ---------- */}
                <Section
                  icon={<UpdateOutlined />}
                  title="Update Sales Invoice"
                  subtitle={`Editing ${selectedInvoice.invoiceNo} — update payment and status.`}
                >
                  {/* Customer card */}
                  <Box sx={{ mb: 2, p: 2, border: "1px solid #dbeafe", bgcolor: "#f8fbff", borderRadius: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1} flexWrap="wrap">
                      <Typography fontSize={13} fontWeight={700} color="#1e40af">Customer</Typography>
                      <Chip size="small" label={selectedInvoice.customerType} sx={{ bgcolor: "#dbeafe", color: "#1e40af", fontWeight: 600 }} />
                      <Chip size="small" label={selectedInvoice.status} sx={statusChipSx(selectedInvoice.status)} />
                    </Stack>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 1 }}>
                      <Typography variant="body2"><b>Name:</b> {selectedInvoice.customerName}</Typography>
                      <Typography variant="body2"><b>Phone:</b> {selectedInvoice.customerPhone}</Typography>
                      <Typography variant="body2"><b>Invoice No:</b> {selectedInvoice.invoiceNo}</Typography>
                      <Typography variant="body2"><b>Purchasing ID:</b> {selectedInvoice.purchasingId}</Typography>
                    </Box>
                  </Box>

                  <Box sx={gridSx}>
                    <TextField
                      fullWidth required size="small" type="date"
                      label="Invoice Date" name="invoiceDate"
                      value={updateForm.invoiceDate} onChange={handleUpdateChange}
                      InputLabelProps={{ shrink: true }} sx={fieldSx}
                    />
                    <TextField
                      fullWidth required size="small" type="date"
                      label="Due Date" name="dueDate"
                      value={updateForm.dueDate} onChange={handleUpdateChange}
                      InputLabelProps={{ shrink: true }} sx={fieldSx}
                    />
                    <TextField
                      fullWidth required select size="small"
                      label="Status" name="status"
                      value={updateForm.status} onChange={handleUpdateChange}
                      sx={fieldSx}
                    >
                      {(["Paid", "Partial", "Unpaid", "Cancelled"] as InvoiceStatus[]).map((s) => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth required select size="small"
                      label="Payment Type" name="paymentType"
                      value={updateForm.paymentType} onChange={handleUpdateChange}
                      sx={fieldSx}
                    >
                      <MenuItem value="" disabled>Select payment type</MenuItem>
                      {["Cash", "Bank Transfer", "Cheque", "Credit", "Online Transfer"].map((t) => (
                        <MenuItem key={t} value={t}>{t}</MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth size="small" type="number"
                      label="Paid Amount (PKR)" name="paidAmount"
                      value={updateForm.paidAmount} onChange={handleUpdateChange}
                      placeholder="e.g. 50000"
                      inputProps={{ min: 0, step: "0.01" }}
                      helperText={`Grand Total: ${money(selectedInvoice.grandTotal)}`}
                      sx={fieldSx}
                    />
                    <TextField
                      fullWidth size="small" multiline minRows={2}
                      label="Notes" name="notes"
                      value={updateForm.notes} onChange={handleUpdateChange}
                      placeholder="e.g. First installment received."
                      sx={fieldSx}
                    />
                  </Box>
                </Section>

                {/* ---------- Items (read-only) ---------- */}
                <Section
                  icon={<ReceiptLongOutlined />}
                  title="Invoice Items"
                  subtitle="Products on this invoice (read-only — manage them from the original Sales Order)."
                >
                  <TableContainer sx={{ width: "100%", border: "1px solid #e8edf3", borderRadius: 2, overflowX: "auto" }}>
                    <Table size="small" sx={{ minWidth: 720 }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f8fafc" }}>
                          {["Product Name", "Product ID", "Qty", "TP", "Discount", "Line Total"].map((h, i) => (
                            <TableCell
                              key={`${h}-${i}`}
                              sx={{ fontWeight: 700, color: "#475569", fontSize: 12, whiteSpace: "nowrap" }}
                            >
                              {h}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedInvoice.items.map((item) => (
                          <TableRow key={item.id} hover>
                            <TableCell sx={{ fontSize: 12, minWidth: 150 }}>{item.productName}</TableCell>
                            <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{item.productId}</TableCell>
                            <TableCell sx={{ fontSize: 12 }}>{item.quantity}</TableCell>
                            <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{money(item.tp)}</TableCell>
                            <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>
                              {item.discountPercent}% ({money(item.discountAmount)})
                            </TableCell>
                            <TableCell sx={{ fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>{money(item.lineTotal)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Summary */}
                  <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", border: "1px solid #e8edf3", borderRadius: 2 }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, minmax(0, 1fr))" }, gap: 1.5 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Sub Total</Typography>
                        <Typography fontWeight={700}>{money(selectedInvoice.subtotal)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Total Discount</Typography>
                        <Typography fontWeight={700}>{money(selectedInvoice.totalDiscount)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Grand Total</Typography>
                        <Typography fontWeight={800} color="#2563eb">{money(selectedInvoice.grandTotal)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Remaining Balance</Typography>
                        <Typography fontWeight={800} color={remainingBalance > 0 ? "#b45309" : "#15803d"}>
                          {money(remainingBalance)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Section>
              </>
            )}

            {/* Custom toast */}
            {message && <Alert key={messageId} message={message.text} type={message.type} />}

            <Divider />

            {/* Actions */}
            <Stack direction={{ xs: "column-reverse", sm: "row" }} justifyContent="flex-end" spacing={1.5}>
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
                disabled={!selectedInvoice}
                sx={{
                  bgcolor: "#2563eb", borderRadius: 2, textTransform: "none",
                  boxShadow: "none", minHeight: 42, px: 3,
                  "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
                  "&.Mui-disabled": { bgcolor: "#cbd5e1", color: "#fff" },
                }}
              >
                Save Updates
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}