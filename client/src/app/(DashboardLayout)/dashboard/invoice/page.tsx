"use client";

import React, { useMemo, useState } from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
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
  BusinessOutlined,
  CloseOutlined,
  EditOutlined,
  Inventory2Outlined,
  ReceiptLongOutlined,
  SaveOutlined,
  PrintOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import Alert from "@/app/components/Alert";

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
type Product = {
  id: string;
  name: string;
  stock: number;
  defaultPrice: number;
};

type InvoiceEntry = {
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

type PurchaseOrder = {
  id: string;
  serialNumber: string;
  customerId: string;
  orderDate: string;
  entries: InvoiceEntry[];
};

type PrintOptions = {
  customerType: boolean;
  customerName: boolean;
  customerPhone: boolean;
  customerCity: boolean;
  purchaseSerial: boolean;
  invoiceDate: boolean;
  productSerial: boolean;
  productName: boolean;
  productId: boolean;
  productType: boolean;
  quantity: boolean;
  price: boolean;
  discount: boolean;
  lineTotal: boolean;
  grandTotal: boolean;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  customer: Customer;
  purchaseSerialNumber: string;
  invoiceDate: string;
  entries: InvoiceEntry[];
  printOptions: PrintOptions;
  printed: boolean;
  createdAt: string;
};

type PrintPreviewData = {
  invoiceNumber: string;
  invoiceDate: string;
  customer: Customer;
  po: PurchaseOrder;
  entries: InvoiceEntry[];
  printOptions: PrintOptions;
};

type Message = { type: "success" | "error" | "warning" | "info"; text: string };

const customerTypes: CustomerType[] = [
  "Clinic",
  "Doctor",
  "Hospital",
  "Pharmacy / Medical Store",
  "Wholesale Distributor",
];

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

const masterProductsByCustomer: Record<string, string[]> = {
  "CUS-001": ["PRD-1001", "PRD-1004", "PRD-1007"],
  "CUS-002": ["PRD-1002", "PRD-1003"],
  "CUS-003": ["PRD-1001", "PRD-1006"],
  "CUS-004": ["PRD-1003", "PRD-1008"],
  "CUS-005": ["PRD-1004", "PRD-1005"],
  "CUS-006": ["PRD-1002", "PRD-1007"],
};

const masterPricesByCustomer: Record<string, Record<string, number>> = {
  "CUS-001": { "PRD-1001": 175, "PRD-1004": 825, "PRD-1007": 20 },
  "CUS-002": { "PRD-1002": 310, "PRD-1003": 230 },
  "CUS-003": { "PRD-1001": 170, "PRD-1006": 395 },
  "CUS-004": { "PRD-1003": 225, "PRD-1008": 925 },
  "CUS-005": { "PRD-1004": 810, "PRD-1005": 4100 },
  "CUS-006": { "PRD-1002": 300, "PRD-1007": 19 },
};

const purchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-001",
    serialNumber: "PO-2026-1001",
    customerId: "CUS-001",
    orderDate: "2026-11-05",
    entries: [
      {
        id: 1,
        serialNumber: "SR-81001",
        productName: "Paracetamol 500mg",
        productId: "PRD-1001",
        currentStock: 420,
        isMasterProduct: true,
        regularPrice: null,
        quantity: 100,
        tp: 175,
        discountPercent: 0,
        discountAmount: 0,
        lineTotal: 17500,
      },
      {
        id: 2,
        serialNumber: "SR-81002",
        productName: "Surgical Gloves (Box)",
        productId: "PRD-1004",
        currentStock: 60,
        isMasterProduct: true,
        regularPrice: null,
        quantity: 30,
        tp: 825,
        discountPercent: 0,
        discountAmount: 0,
        lineTotal: 24750,
      },
      {
        id: 3,
        serialNumber: "SR-81003",
        productName: "Disposable Syringe 5ml",
        productId: "PRD-1007",
        currentStock: 900,
        isMasterProduct: true,
        regularPrice: null,
        quantity: 200,
        tp: 20,
        discountPercent: 0,
        discountAmount: 0,
        lineTotal: 4000,
      },
    ],
  },
  {
    id: "PO-002",
    serialNumber: "PO-2026-1002",
    customerId: "CUS-001",
    orderDate: "2026-11-12",
    entries: [
      {
        id: 4,
        serialNumber: "SR-81004",
        productName: "Paracetamol 500mg",
        productId: "PRD-1001",
        currentStock: 420,
        isMasterProduct: true,
        regularPrice: null,
        quantity: 50,
        tp: 175,
        discountPercent: 0,
        discountAmount: 0,
        lineTotal: 8750,
      },
      {
        id: 5,
        serialNumber: "SR-81005",
        productName: "Vitamin C 500mg",
        productId: "PRD-1003",
        currentStock: 95,
        isMasterProduct: false,
        regularPrice: 240,
        quantity: 40,
        tp: 260,
        discountPercent: 5,
        discountAmount: 520,
        lineTotal: 9880,
      },
    ],
  },
  {
    id: "PO-003",
    serialNumber: "PO-2026-1003",
    customerId: "CUS-002",
    orderDate: "2026-11-08",
    entries: [
      {
        id: 6,
        serialNumber: "SR-81006",
        productName: "Amoxicillin 250mg",
        productId: "PRD-1002",
        currentStock: 180,
        isMasterProduct: true,
        regularPrice: null,
        quantity: 60,
        tp: 310,
        discountPercent: 0,
        discountAmount: 0,
        lineTotal: 18600,
      },
      {
        id: 7,
        serialNumber: "SR-81007",
        productName: "Vitamin C 500mg",
        productId: "PRD-1003",
        currentStock: 95,
        isMasterProduct: true,
        regularPrice: null,
        quantity: 30,
        tp: 230,
        discountPercent: 0,
        discountAmount: 0,
        lineTotal: 6900,
      },
    ],
  },
  {
    id: "PO-004",
    serialNumber: "PO-2026-1004",
    customerId: "CUS-003",
    orderDate: "2026-11-15",
    entries: [
      {
        id: 8,
        serialNumber: "SR-81008",
        productName: "Paracetamol 500mg",
        productId: "PRD-1001",
        currentStock: 420,
        isMasterProduct: true,
        regularPrice: null,
        quantity: 40,
        tp: 170,
        discountPercent: 0,
        discountAmount: 0,
        lineTotal: 6800,
      },
      {
        id: 9,
        serialNumber: "SR-81009",
        productName: "Antiseptic Solution 500ml",
        productId: "PRD-1006",
        currentStock: 130,
        isMasterProduct: true,
        regularPrice: null,
        quantity: 25,
        tp: 395,
        discountPercent: 0,
        discountAmount: 0,
        lineTotal: 9875,
      },
    ],
  },
  {
    id: "PO-005",
    serialNumber: "PO-2026-1005",
    customerId: "CUS-004",
    orderDate: "2026-11-09",
    entries: [
      {
        id: 10,
        serialNumber: "SR-81010",
        productName: "Vitamin C 500mg",
        productId: "PRD-1003",
        currentStock: 95,
        isMasterProduct: true,
        regularPrice: null,
        quantity: 50,
        tp: 225,
        discountPercent: 0,
        discountAmount: 0,
        lineTotal: 11250,
      },
      {
        id: 11,
        serialNumber: "SR-81011",
        productName: "Digital Thermometer",
        productId: "PRD-1008",
        currentStock: 45,
        isMasterProduct: true,
        regularPrice: null,
        quantity: 10,
        tp: 925,
        discountPercent: 2,
        discountAmount: 185,
        lineTotal: 9065,
      },
    ],
  },
  {
    id: "PO-006",
    serialNumber: "PO-2026-1006",
    customerId: "CUS-005",
    orderDate: "2026-11-11",
    entries: [
      {
        id: 12,
        serialNumber: "SR-81012",
        productName: "Surgical Gloves (Box)",
        productId: "PRD-1004",
        currentStock: 60,
        isMasterProduct: true,
        regularPrice: null,
        quantity: 25,
        tp: 810,
        discountPercent: 0,
        discountAmount: 0,
        lineTotal: 20250,
      },
      {
        id: 13,
        serialNumber: "SR-81013",
        productName: "Blood Pressure Monitor",
        productId: "PRD-1005",
        currentStock: 24,
        isMasterProduct: true,
        regularPrice: null,
        quantity: 8,
        tp: 4100,
        discountPercent: 0,
        discountAmount: 0,
        lineTotal: 32800,
      },
    ],
  },
  {
    id: "PO-007",
    serialNumber: "PO-2026-1007",
    customerId: "CUS-006",
    orderDate: "2026-11-13",
    entries: [
      {
        id: 14,
        serialNumber: "SR-81014",
        productName: "Amoxicillin 250mg",
        productId: "PRD-1002",
        currentStock: 180,
        isMasterProduct: true,
        regularPrice: null,
        quantity: 20,
        tp: 300,
        discountPercent: 0,
        discountAmount: 0,
        lineTotal: 6000,
      },
      {
        id: 15,
        serialNumber: "SR-81015",
        productName: "Disposable Syringe 5ml",
        productId: "PRD-1007",
        currentStock: 900,
        isMasterProduct: true,
        regularPrice: null,
        quantity: 100,
        tp: 19,
        discountPercent: 0,
        discountAmount: 0,
        lineTotal: 1900,
      },
    ],
  },
];

const defaultPrintOptions: PrintOptions = {
  customerType: true,
  customerName: true,
  customerPhone: true,
  customerCity: true,
  purchaseSerial: true,
  invoiceDate: true,
  productSerial: true,
  productName: true,
  productId: true,
  productType: true,
  quantity: true,
  price: true,
  discount: true,
  lineTotal: true,
  grandTotal: true,
};

const printOptionFields: Array<{ key: keyof PrintOptions; label: string }> = [
  { key: "customerType", label: "Customer Type" },
  { key: "customerName", label: "Customer Name" },
  { key: "customerPhone", label: "Customer Phone" },
  { key: "customerCity", label: "Customer City" },
  { key: "purchaseSerial", label: "Purchase Serial #" },
  { key: "invoiceDate", label: "Invoice Date" },
  { key: "productSerial", label: "Product Serial #" },
  { key: "productName", label: "Product Name" },
  { key: "productId", label: "Product ID" },
  { key: "productType", label: "Product Type" },
  { key: "quantity", label: "Quantity" },
  { key: "price", label: "Unit Price" },
  { key: "discount", label: "Discount" },
  { key: "lineTotal", label: "Line Total" },
  { key: "grandTotal", label: "Grand Total" },
];

const demoInvoices: Invoice[] = [
  {
    id: "INV-001",
    invoiceNumber: "INV-2026-001",
    customer: customers[0],
    purchaseSerialNumber: "PO-2026-1001",
    invoiceDate: "2026-11-10",
    entries: purchaseOrders[0].entries,
    printOptions: defaultPrintOptions,
    printed: true,
    createdAt: "2026-11-10T10:00:00",
  },
  {
    id: "INV-002",
    invoiceNumber: "INV-2026-002",
    customer: customers[1],
    purchaseSerialNumber: "PO-2026-1003",
    invoiceDate: "2026-11-12",
    entries: purchaseOrders[2].entries,
    printOptions: { ...defaultPrintOptions, customerPhone: false },
    printed: false,
    createdAt: "2026-11-12T14:30:00",
  },
];

const money = (value: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2,
  }).format(value || 0);

const formatDate = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const sumEntries = (entries: InvoiceEntry[]) => ({
  quantity: entries.reduce((s, e) => s + e.quantity, 0),
  discount: entries.reduce((s, e) => s + e.discountAmount, 0),
  total: entries.reduce((s, e) => s + e.lineTotal, 0),
});

const fieldSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#fff" },
  "& .MuiInputLabel-root": { fontSize: 14 },
  "& .MuiFormHelperText-root": { mx: 0, fontSize: 11 },
};

const cardSx = {
  border: "1px solid #e8edf3",
  borderRadius: 3,
  boxShadow: "none",
};

// ============ Shared heading ============
function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
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
  );
}

// ============ Printable invoice body (used by dialog preview + hidden print area) ============
type InvoicePrintableProps = {
  invoiceNumber: string;
  invoiceDate: string;
  customer: Customer;
  poSerial: string;
  entries: InvoiceEntry[];
  printOptions: PrintOptions;
};

function InvoicePrintable({
  invoiceNumber,
  invoiceDate,
  customer,
  poSerial,
  entries,
  printOptions,
}: InvoicePrintableProps) {
  const totals = sumEntries(entries);

  const columns: Array<{
    key: string;
    label: string;
    align?: "right" | "left";
    render: (e: InvoiceEntry) => React.ReactNode;
  }> = [];
  if (printOptions.productSerial)
    columns.push({
      key: "serial",
      label: "Serial #",
      render: (e) => e.serialNumber,
    });
  if (printOptions.productName)
    columns.push({
      key: "name",
      label: "Product",
      render: (e) => e.productName,
    });
  if (printOptions.productId)
    columns.push({
      key: "pid",
      label: "Product ID",
      render: (e) => e.productId,
    });
  if (printOptions.productType)
    columns.push({
      key: "ptype",
      label: "Type",
      render: (e) => (e.isMasterProduct ? "Master" : "Normal"),
    });
  if (printOptions.quantity)
    columns.push({
      key: "qty",
      label: "Qty",
      align: "right",
      render: (e) => e.quantity,
    });
  if (printOptions.price)
    columns.push({
      key: "price",
      label: "Price",
      align: "right",
      render: (e) => money(e.tp),
    });
  if (printOptions.discount)
    columns.push({
      key: "disc",
      label: "Discount",
      align: "right",
      render: (e) => `${e.discountPercent}%`,
    });
  if (printOptions.lineTotal)
    columns.push({
      key: "total",
      label: "Line Total",
      align: "right",
      render: (e) => money(e.lineTotal),
    });

  const showHeaderCustomerBlock =
    printOptions.customerName ||
    printOptions.customerType ||
    printOptions.customerPhone ||
    printOptions.customerCity ||
    printOptions.purchaseSerial;

  return (
    <Box>
      {/* Invoice header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={3}
        pb={2}
        sx={{ borderBottom: "2px solid #2563eb" }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color="#2563eb">
            INVOICE
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {invoiceNumber}
          </Typography>
        </Box>
        {printOptions.invoiceDate && (
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary">
              Invoice Date
            </Typography>
            <Typography fontWeight={700}>{formatDate(invoiceDate)}</Typography>
          </Box>
        )}
      </Stack>

      {/* Customer info */}
      {showHeaderCustomerBlock && (
        <Box mb={3}>
          <Typography fontWeight={700} fontSize={14} mb={1}>
            Bill To
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1,
            }}
          >
            {printOptions.customerName && (
              <Typography fontSize={13}>
                <b>Customer:</b> {customer.name}
              </Typography>
            )}
            {printOptions.customerType && (
              <Typography fontSize={13}>
                <b>Type:</b> {customer.type}
              </Typography>
            )}
            {printOptions.customerPhone && (
              <Typography fontSize={13}>
                <b>Phone:</b> {customer.phone}
              </Typography>
            )}
            {printOptions.customerCity && (
              <Typography fontSize={13}>
                <b>City:</b> {customer.city}
              </Typography>
            )}
            {printOptions.purchaseSerial && (
              <Typography fontSize={13}>
                <b>PO #:</b> {poSerial}
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {/* Products table */}
      {columns.length > 0 ? (
        <TableContainer sx={{ border: "1px solid #e8edf3", borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    align={col.align}
                    sx={{ fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      align={col.align}
                      sx={{ fontSize: 12 }}
                    >
                      {col.render(entry)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          py={3}
        >
          No columns selected for printing.
        </Typography>
      )}

      {/* Totals */}
      {printOptions.grandTotal && (
        <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Box sx={{ minWidth: 260, borderTop: "2px solid #2563eb", pt: 1.5 }}>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
              <Typography fontSize={13}>Total Quantity:</Typography>
              <Typography fontSize={13} fontWeight={600}>
                {totals.quantity}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
              <Typography fontSize={13}>Total Discount:</Typography>
              <Typography fontSize={13} fontWeight={600}>
                {money(totals.discount)}
              </Typography>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={800} fontSize={14}>
                Grand Total:
              </Typography>
              <Typography fontWeight={800} fontSize={14} color="#2563eb">
                {money(totals.total)}
              </Typography>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ============ Print preview / view dialog ============
function InvoicePreviewDialog({
  data,
  mode,
  onClose,
  onPrint,
}: {
  data: InvoicePrintableProps;
  mode: "preview" | "view";
  onClose: () => void;
  onPrint: () => void;
}) {
  return (
    <>
      <DialogTitle sx={{ pr: 7 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography fontWeight={800} fontSize={18}>
              {mode === "preview" ? "Print Preview" : "Invoice Details"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {data.invoiceNumber}
            </Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="Close dialog">
            <CloseOutlined />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            bgcolor: "#fff",
            p: { xs: 2, sm: 3 },
            border: "1px solid #e8edf3",
            borderRadius: 2,
          }}
        >
          <InvoicePrintable {...data} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ textTransform: "none" }}
        >
          {mode === "preview" ? "Cancel" : "Close"}
        </Button>
        <Button
          onClick={onPrint}
          variant="contained"
          startIcon={<PrintOutlined />}
          sx={{
            bgcolor: "#2563eb",
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
          }}
        >
          {mode === "preview" ? "Print Now" : "Print"}
        </Button>
      </DialogActions>
    </>
  );
}

// ============ Update entry dialog ============
function UpdateEntryDialog({
  entry,
  onCancel,
  onSave,
}: {
  entry: InvoiceEntry;
  onCancel: () => void;
  onSave: (entry: InvoiceEntry) => void;
}) {
  const isMaster = entry.isMasterProduct;
  const regularPrice = entry.regularPrice ?? 0;

  const [quantity, setQuantity] = useState(String(entry.quantity));
  const [price, setPrice] = useState(String(entry.tp));
  const [discount, setDiscount] = useState(String(entry.discountPercent));
  const [error, setError] = useState("");

  const qty = Number(quantity) || 0;
  const p = Number(price) || 0;
  const d = Number(discount) || 0;
  const previewGross = qty * (isMaster ? entry.tp : p);
  const previewLineTotal = Math.max(0, previewGross * (1 - d / 100));

  const handleSave = () => {
    if (qty <= 0) return setError("Quantity must be greater than 0.");
    if (qty > entry.currentStock)
      return setError(
        `Quantity cannot exceed available stock (${entry.currentStock}).`,
      );
    if (!isMaster && p < regularPrice)
      return setError(
        `Sale price cannot be less than regular price (${money(regularPrice)}).`,
      );
    if (!isMaster && p < 0) return setError("Sale price cannot be negative.");
    if (d < 0 || d > 100)
      return setError("Discount must be between 0 and 100.");

    const finalPrice = isMaster ? entry.tp : p;
    const finalGross = qty * finalPrice;
    const finalDiscAmount = (finalGross * d) / 100;
    const finalLineTotal = Math.max(0, finalGross - finalDiscAmount);

    onSave({
      ...entry,
      quantity: qty,
      tp: finalPrice,
      discountPercent: d,
      discountAmount: finalDiscAmount,
      lineTotal: finalLineTotal,
    });
  };

  return (
    <>
      <DialogTitle sx={{ pr: 7 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography fontWeight={800} fontSize={18}>
              Update Product
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {entry.serialNumber}
            </Typography>
          </Box>
          <IconButton onClick={onCancel} aria-label="Close update dialog">
            <CloseOutlined />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            size="small"
            label="Product Name"
            value={entry.productName}
            InputProps={{ readOnly: true }}
            sx={fieldSx}
          />
          <TextField
            fullWidth
            size="small"
            label="Product ID"
            value={entry.productId}
            InputProps={{ readOnly: true }}
            sx={fieldSx}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">
              <b>Type:</b>
            </Typography>
            <Chip
              size="small"
              label={isMaster ? "Master" : "Normal"}
              color={isMaster ? "primary" : "default"}
            />
          </Box>
          <TextField
            fullWidth
            size="small"
            label="Available Stock"
            value={entry.currentStock}
            InputProps={{ readOnly: true }}
            sx={fieldSx}
          />
          {!isMaster && (
            <TextField
              fullWidth
              size="small"
              label="Regular Price"
              value={money(regularPrice)}
              InputProps={{ readOnly: true }}
              sx={fieldSx}
            />
          )}
          <TextField
            fullWidth
            size="small"
            type="number"
            label={isMaster ? "Price (Fixed)" : "Sale Price"}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            InputProps={{
              readOnly: isMaster,
              startAdornment: (
                <InputAdornment position="start">Rs</InputAdornment>
              ),
            }}
            helperText={
              isMaster
                ? "Master Product price cannot be changed."
                : "Price must be equal to or greater than regular price."
            }
            sx={fieldSx}
          />
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Quantity"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            inputProps={{ min: 1 }}
            sx={fieldSx}
          />
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Discount (%)"
            value={discount}
            onChange={(event) => setDiscount(event.target.value)}
            inputProps={{ min: 0, max: 100, step: "0.01" }}
            sx={fieldSx}
          />
          <Box
            sx={{
              gridColumn: { xs: "auto", sm: "1 / -1" },
              p: 2,
              bgcolor: "#f8fafc",
              border: "1px solid #e8edf3",
              borderRadius: 2,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" fontWeight={600}>
                Line Total (Preview)
              </Typography>
              <Typography fontWeight={800} color="#2563eb">
                {money(previewLineTotal)}
              </Typography>
            </Stack>
          </Box>
        </Box>
        {error && (
          <Box mt={2}>
            <Alert message={error} type="error" />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onCancel}
          color="inherit"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveOutlined />}
          sx={{
            bgcolor: "#2563eb",
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
          }}
        >
          Save Product
        </Button>
      </DialogActions>
    </>
  );
}

// ============ Main page ============
export default function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>(demoInvoices);

  const [customerType, setCustomerType] = useState<string>("All Types");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [entries, setEntries] = useState<InvoiceEntry[]>([]);
  const [printOptions, setPrintOptions] =
    useState<PrintOptions>(defaultPrintOptions);

  const [editingEntry, setEditingEntry] = useState<InvoiceEntry | null>(null);
  const [printPreview, setPrintPreview] = useState<PrintPreviewData | null>(
    null,
  );
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [messageId, setMessageId] = useState(0);

  const availableCustomers = useMemo(() => {
    if (customerType === "All Types") return customers;
    return customers.filter((c) => c.type === customerType);
  }, [customerType]);

  const availablePOs = useMemo(() => {
    if (!selectedCustomer) return [];
    return purchaseOrders.filter((po) => po.customerId === selectedCustomer.id);
  }, [selectedCustomer]);

  const canSubmit = Boolean(
    selectedCustomer && selectedPO && entries.length > 0,
  );

  const totalPreview = sumEntries(entries);

  const notify = (type: Message["type"], text: string) => {
    setMessage({ type, text });
    setMessageId((value) => value + 1);
  };

  const handleCustomerTypeChange = (newType: string) => {
    setCustomerType(newType);
    setSelectedCustomer(null);
    setSelectedPO(null);
    setEntries([]);
  };

  const handleCustomerChange = (newCustomer: Customer | null) => {
    setSelectedCustomer(newCustomer);
    setEntries([]);
    if (!newCustomer) {
      setSelectedPO(null);
      return;
    }
    const pos = purchaseOrders.filter((po) => po.customerId === newCustomer.id);
    if (pos.length === 1) {
      setSelectedPO(pos[0]);
      setEntries(pos[0].entries.map((e) => ({ ...e })));
    } else {
      setSelectedPO(null);
    }
  };

  const handlePOChange = (newPO: PurchaseOrder | null) => {
    setSelectedPO(newPO);
    setEntries(newPO ? newPO.entries.map((e) => ({ ...e })) : []);
  };

  const togglePrintOption = (key: keyof PrintOptions) => {
    setPrintOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetForm = () => {
    setCustomerType("All Types");
    setSelectedCustomer(null);
    setSelectedPO(null);
    setEntries([]);
    setPrintOptions(defaultPrintOptions);
  };

  const generateInvoiceNumber = () => {
    const maxNum = invoices.reduce((max, inv) => {
      const parts = inv.invoiceNumber.split("-");
      const num = parseInt(parts[parts.length - 1] || "0", 10);
      return Math.max(max, num);
    }, 0);
    return `INV-2026-${String(maxNum + 1).padStart(3, "0")}`;
  };

  const saveEntry = (updated: InvoiceEntry) => {
    setEntries((current) =>
      current.map((e) => (e.id === updated.id ? updated : e)),
    );
    setEditingEntry(null);
  };

  const handlePrintClick = () => {
    if (!canSubmit || !selectedCustomer || !selectedPO) return;
    setPrintPreview({
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: new Date().toISOString().slice(0, 10),
      customer: selectedCustomer,
      po: selectedPO,
      entries: entries.map((e) => ({ ...e })),
      printOptions: { ...printOptions },
    });
  };

  const handleSaveInvoice = () => {
    if (!canSubmit || !selectedCustomer || !selectedPO) return;
    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
      customer: selectedCustomer,
      purchaseSerialNumber: selectedPO.serialNumber,
      invoiceDate: new Date().toISOString().slice(0, 10),
      entries: entries.map((e) => ({ ...e })),
      printOptions: { ...printOptions },
      printed: false,
      createdAt: new Date().toISOString(),
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    resetForm();
    notify("warning", "Invoice Saved But Not Printed.");
  };

  const handleConfirmPrintFromPreview = () => {
    if (!printPreview) return;
    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber: printPreview.invoiceNumber,
      customer: printPreview.customer,
      purchaseSerialNumber: printPreview.po.serialNumber,
      invoiceDate: printPreview.invoiceDate,
      entries: printPreview.entries,
      printOptions: printPreview.printOptions,
      printed: true,
      createdAt: new Date().toISOString(),
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    // Sync in desktop browsers: print dialog blocks here
    window.print();

    setPrintPreview(null);
    resetForm();
    notify("success", "Invoice printed and saved successfully.");
  };

  const handlePrintFromView = () => {
    if (!viewingInvoice) return;
    window.print();
    if (!viewingInvoice.printed) {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === viewingInvoice.id ? { ...inv, printed: true } : inv,
        ),
      );
      setViewingInvoice({ ...viewingInvoice, printed: true });
      notify("success", "Invoice printed successfully.");
    } else {
      notify("info", "Invoice printed again.");
    }
  };

  // Prepare the printable data for the hidden print area
  const printAreaData: InvoicePrintableProps | null = printPreview
    ? {
        invoiceNumber: printPreview.invoiceNumber,
        invoiceDate: printPreview.invoiceDate,
        customer: printPreview.customer,
        poSerial: printPreview.po.serialNumber,
        entries: printPreview.entries,
        printOptions: printPreview.printOptions,
      }
    : viewingInvoice
      ? {
          invoiceNumber: viewingInvoice.invoiceNumber,
          invoiceDate: viewingInvoice.invoiceDate,
          customer: viewingInvoice.customer,
          poSerial: viewingInvoice.purchaseSerialNumber,
          entries: viewingInvoice.entries,
          printOptions: viewingInvoice.printOptions,
        }
      : null;

  return (
    <Box sx={{ width: "100%", minWidth: 0, overflowX: "hidden", pb: 4 }}>
      {/* Print styles: hide everything except the print area */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .invoice-print-area, .invoice-print-area * { visibility: visible !important; }
          .invoice-print-area {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 24px !important;
            background: #fff !important;
          }
          @page { margin: 12mm; }
        }
      `}</style>

      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={1.5}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color="#1e293b">
            Invoice Management
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Generate, print, and track invoices against customer purchase
            orders.
          </Typography>
        </Box>
        <Chip
          label={`${invoices.length} INVOICES`}
          sx={{
            bgcolor: "#eff6ff",
            color: "#2563eb",
            fontWeight: 700,
            width: "fit-content",
            borderRadius: 2,
          }}
        />
      </Stack>

      {/* Invoice Form */}
      <Card sx={cardSx}>
        <CardContent
          sx={{ p: { xs: 2, sm: 3, md: 3.5 }, "&:last-child": { pb: 3.5 } }}
        >
          <Stack spacing={2.5}>
            <SectionHeading
              icon={<BusinessOutlined />}
              title="Invoice Details"
              subtitle="Select customer type, customer, and the related purchase order to load invoice products."
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                select
                fullWidth
                size="small"
                label="Customer Type"
                value={customerType}
                onChange={(e) => handleCustomerTypeChange(e.target.value)}
                sx={fieldSx}
              >
                <MenuItem value="All Types">All Types</MenuItem>
                {customerTypes.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>

              <Autocomplete
                fullWidth
                size="small"
                options={availableCustomers}
                value={selectedCustomer}
                onChange={(_, value) => handleCustomerChange(value)}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Customer Name"
                    placeholder="Search customer..."
                    sx={fieldSx}
                  />
                )}
              />

              <Autocomplete
                fullWidth
                size="small"
                options={availablePOs}
                value={selectedPO}
                onChange={(_, value) => handlePOChange(value)}
                disabled={!selectedCustomer}
                getOptionLabel={(option) => option.serialNumber}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option) => {
                  const { key, ...rest } = props;
                  return (
                    <Box
                      component="li"
                      key={key}
                      {...rest}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.25,
                        py: 1,
                      }}
                    >
                      <Typography fontWeight={600} fontSize={13}>
                        {option.serialNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(option.orderDate)} · {option.entries.length}{" "}
                        products
                      </Typography>
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Purchase Serial Number"
                    placeholder={
                      selectedCustomer
                        ? "Select purchase order..."
                        : "Select customer first"
                    }
                    sx={fieldSx}
                  />
                )}
                noOptionsText={
                  selectedCustomer
                    ? "No purchase orders for this customer."
                    : "Select a customer first."
                }
              />
            </Box>

            {(selectedCustomer || selectedPO) && (
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                alignItems="center"
              >
                {selectedCustomer && (
                  <Chip
                    size="small"
                    label={`Customer: ${selectedCustomer.name}`}
                    sx={{
                      bgcolor: "#eff6ff",
                      color: "#1d4ed8",
                      fontWeight: 600,
                    }}
                  />
                )}
                {selectedCustomer && (
                  <Chip
                    size="small"
                    label={`Type: ${selectedCustomer.type}`}
                    sx={{
                      bgcolor: "#f0fdf4",
                      color: "#15803d",
                      fontWeight: 600,
                    }}
                  />
                )}
                {selectedPO && (
                  <Chip
                    size="small"
                    label={`PO: ${selectedPO.serialNumber}`}
                    sx={{
                      bgcolor: "#fef9c3",
                      color: "#a16207",
                      fontWeight: 600,
                    }}
                  />
                )}
                {selectedPO && (
                  <Chip
                    size="small"
                    label={`Date: ${formatDate(selectedPO.orderDate)}`}
                    sx={{
                      bgcolor: "#f1f5f9",
                      color: "#475569",
                      fontWeight: 600,
                    }}
                  />
                )}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Products Table */}
      {entries.length > 0 && (
        <Card sx={{ ...cardSx, mt: 3 }}>
          <CardContent
            sx={{ p: { xs: 2, sm: 3, md: 3.5 }, "&:last-child": { pb: 3.5 } }}
          >
            <SectionHeading
              icon={<Inventory2Outlined />}
              title="Products"
              subtitle="Review and update individual product lines before printing or saving the invoice."
            />
            <TableContainer
              sx={{
                border: "1px solid #e8edf3",
                borderRadius: 2,
                overflowX: "auto",
              }}
            >
              <Table size="small" sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8fafc" }}>
                    {[
                      "Serial #",
                      "Product",
                      "Product ID",
                      "Type",
                      "Stock",
                      "Qty",
                      "Price",
                      "Discount",
                      "Line Total",
                      "Actions",
                    ].map((label) => (
                      <TableCell
                        key={label}
                        sx={{
                          fontWeight: 700,
                          color: "#475569",
                          fontSize: 12,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id} hover>
                      <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>
                        {entry.serialNumber}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, minWidth: 160 }}>
                        {entry.productName}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>
                        {entry.productId}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={entry.isMasterProduct ? "Master" : "Normal"}
                          color={entry.isMasterProduct ? "primary" : "default"}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>
                        {entry.currentStock}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>
                        {entry.quantity}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>
                        {money(entry.tp)}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>
                        {entry.discountPercent}%
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 12,
                          whiteSpace: "nowrap",
                          fontWeight: 700,
                        }}
                      >
                        {money(entry.lineTotal)}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Tooltip title="Update product">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => setEditingEntry({ ...entry })}
                          >
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              mt={2}
              sx={{
                p: 2,
                bgcolor: "#f8fafc",
                border: "1px solid #e8edf3",
                borderRadius: 2,
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Quantity
                  </Typography>
                  <Typography fontWeight={700}>
                    {totalPreview.quantity}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Discount
                  </Typography>
                  <Typography fontWeight={700}>
                    {money(totalPreview.discount)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Grand Total
                  </Typography>
                  <Typography fontWeight={800} color="#2563eb">
                    {money(totalPreview.total)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Print Options */}
      <Card sx={{ ...cardSx, mt: 3 }}>
        <CardContent
          sx={{ p: { xs: 2, sm: 3, md: 3.5 }, "&:last-child": { pb: 3.5 } }}
        >
          <SectionHeading
            icon={<PrintOutlined />}
            title="Print Options"
            subtitle="Tick the fields to include in the printed invoice. All fields are ticked by default."
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                sm: "1fr 1fr 1fr",
                md: "1fr 1fr 1fr 1fr 1fr",
              },
              gap: 1,
            }}
          >
            {printOptionFields.map(({ key, label }) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    size="small"
                    checked={printOptions[key]}
                    onChange={() => togglePrintOption(key)}
                  />
                }
                label={<Typography fontSize={13}>{label}</Typography>}
                sx={{ mr: 0, "& .MuiFormControlLabel-label": { ml: 0.5 } }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="flex-end"
        mt={3}
      >
        <Button
          variant="outlined"
          startIcon={<SaveOutlined />}
          onClick={handleSaveInvoice}
          disabled={!canSubmit}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            borderColor: "#cbd5e1",
            color: "#334155",
            height: 42,
          }}
        >
          Save Invoice
        </Button>
        <Button
          variant="contained"
          startIcon={<PrintOutlined />}
          onClick={handlePrintClick}
          disabled={!canSubmit}
          sx={{
            bgcolor: "#2563eb",
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "none",
            height: 42,
            "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
          }}
        >
          Print Invoice
        </Button>
      </Stack>

      {/* Invoice History */}
      <Card sx={{ ...cardSx, mt: 3 }}>
        <CardContent
          sx={{ p: { xs: 2, sm: 3, md: 3.5 }, "&:last-child": { pb: 3.5 } }}
        >
          <SectionHeading
            icon={<ReceiptLongOutlined />}
            title="Invoice History"
            subtitle="All saved invoices — whether printed or not printed."
          />
          <TableContainer
            sx={{
              width: "100%",
              maxWidth: "100%",
              overflowX: "auto",
              border: "1px solid #e8edf3",
              borderRadius: 2,
              "& .MuiTable-root": {
                width: "100%",
                minWidth: 820,
                tableLayout: "fixed",
              },
              "& .MuiTableCell-root": {
                px: { xs: 1, sm: 1.5, md: 2 },
                py: { xs: 1.25, sm: 1.5 },
                borderColor: "#e8edf3",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                verticalAlign: "middle",
              },
            }}
          >
            <Table size="small" aria-label="Invoice history">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  {[
                    ["Invoice #", "18%"],
                    ["Customer", "24%"],
                    ["PO Serial", "16%"],
                    ["Date", "14%"],
                    ["Total", "12%"],
                    ["Status", "8%"],
                    ["Actions", "8%"],
                  ].map(([label, width]) => (
                    <TableCell
                      key={label}
                      sx={{
                        width,
                        fontWeight: 700,
                        color: "#475569",
                        fontSize: 12,
                      }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((inv) => {
                  const totals = sumEntries(inv.entries);
                  return (
                    <TableRow key={inv.id} hover>
                      <TableCell>
                        <Typography
                          fontWeight={800}
                          color="#1e293b"
                          fontSize={13}
                        >
                          {inv.invoiceNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={700} fontSize={13}>
                          {inv.customer.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {inv.customer.id} · {inv.customer.city}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>
                        {inv.purchaseSerialNumber}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>
                        {formatDate(inv.invoiceDate)}
                      </TableCell>
                      <TableCell>
                        <Typography
                          fontWeight={800}
                          color="#2563eb"
                          fontSize={13}
                        >
                          {money(totals.total)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={inv.printed ? "Printed" : "Not Printed"}
                          sx={{
                            height: 22,
                            fontWeight: 700,
                            bgcolor: inv.printed ? "#dcfce7" : "#fef3c7",
                            color: inv.printed ? "#15803d" : "#b45309",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View invoice">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => setViewingInvoice(inv)}
                            sx={{
                              border: "1px solid #dbeafe",
                              borderRadius: 2,
                            }}
                          >
                            <VisibilityOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography fontWeight={700} color="#475569">
                        No invoices yet
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Create and save an invoice to see it here.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Hidden print-only area */}
      {printAreaData && (
        <Box className="invoice-print-area" sx={{ display: "none" }}>
          <InvoicePrintable {...printAreaData} />
        </Box>
      )}

      {/* Update Entry Dialog */}
      <Dialog
        open={Boolean(editingEntry)}
        onClose={() => setEditingEntry(null)}
        fullWidth
        maxWidth="sm"
      >
        {editingEntry && (
          <UpdateEntryDialog
            entry={editingEntry}
            onCancel={() => setEditingEntry(null)}
            onSave={saveEntry}
          />
        )}
      </Dialog>

      {/* Print Preview Dialog */}
      <Dialog
        open={Boolean(printPreview)}
        onClose={() => setPrintPreview(null)}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        {printPreview && (
          <InvoicePreviewDialog
            mode="preview"
            data={{
              invoiceNumber: printPreview.invoiceNumber,
              invoiceDate: printPreview.invoiceDate,
              customer: printPreview.customer,
              poSerial: printPreview.po.serialNumber,
              entries: printPreview.entries,
              printOptions: printPreview.printOptions,
            }}
            onClose={() => setPrintPreview(null)}
            onPrint={handleConfirmPrintFromPreview}
          />
        )}
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog
        open={Boolean(viewingInvoice)}
        onClose={() => setViewingInvoice(null)}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        {viewingInvoice && (
          <InvoicePreviewDialog
            mode="view"
            data={{
              invoiceNumber: viewingInvoice.invoiceNumber,
              invoiceDate: viewingInvoice.invoiceDate,
              customer: viewingInvoice.customer,
              poSerial: viewingInvoice.purchaseSerialNumber,
              entries: viewingInvoice.entries,
              printOptions: viewingInvoice.printOptions,
            }}
            onClose={() => setViewingInvoice(null)}
            onPrint={handlePrintFromView}
          />
        )}
      </Dialog>

      
      {/* Custom Alert popup */}
      {message && (
        <Alert
          key={messageId}
          id={messageId}
          message={message.text}
          type={message.type}
        />
      )}
    </Box>
  );
}
