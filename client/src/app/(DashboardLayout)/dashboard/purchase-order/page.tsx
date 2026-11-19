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
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  AccountBalanceWalletOutlined,
  AddOutlined,
  BusinessOutlined,
  Close,
  DeleteOutline,
  EditOutlined,
  HistoryOutlined,
  Inventory2Outlined,
  ReceiptLongOutlined,
  RestartAltOutlined,
  SaveOutlined,
  SearchOutlined,
  VisibilityOutlined,
  PostAdd,
} from "@mui/icons-material";
import Alert from "@/app/components/Alert";

type Supplier = {
  id: string;
  name: string;
  ntn: string;
  address: string;
  phone: string;
};

type PurchaseHistoryProduct = {
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

type PurchaseHistoryInvoice = {
  invoiceNo: string;
  date: string;
  dueDate?: string;
  paymentType: string;
  paidAmount: number;
  grandTotal: number;
  products: PurchaseHistoryProduct[];
};

/** Invoice row used by the "All Purchase Invoices" grid (invoice + owning supplier). */
type InvoiceRecord = PurchaseHistoryInvoice & {
  supplierId: string;
  supplierName: string;
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

const supplierHistory: Record<string, PurchaseHistoryInvoice[]> = {
  "SUP-001": [
    {
      invoiceNo: "SUP-INV-1042",
      date: "2026-10-28",
      dueDate: "2026-11-27",
      paymentType: "Credit",
      paidAmount: 200000,
      grandTotal: 346000,
      products: [
        {
          productName: "Paracetamol 500mg",
          batchNumber: "PCM-25A",
          expiryDate: "2027-12-31",
          quantity: 500,
          unit: "Box",
          purchaseRate: 420,
          discount: 0,
          taxPercent: 0,
          taxAmount: 0,
          subTotal: 210000,
          grandTotal: 210000,
        },
        {
          productName: "Amoxicillin 500mg",
          batchNumber: "AMX-25A",
          expiryDate: "2027-08-31",
          quantity: 200,
          unit: "Pack",
          purchaseRate: 680,
          discount: 0,
          taxPercent: 0,
          taxAmount: 0,
          subTotal: 136000,
          grandTotal: 136000,
        },
      ],
    },
    {
      invoiceNo: "SUP-INV-0998",
      date: "2026-09-12",
      dueDate: "2026-10-12",
      paymentType: "Bank Transfer",
      paidAmount: 136000,
      grandTotal: 136000,
      products: [
        {
          productName: "Amoxicillin 500mg",
          batchNumber: "AMX-24B",
          expiryDate: "2027-08-31",
          quantity: 200,
          unit: "Pack",
          purchaseRate: 680,
          discount: 0,
          taxPercent: 0,
          taxAmount: 0,
          subTotal: 136000,
          grandTotal: 136000,
        },
      ],
    },
    {
      invoiceNo: "SUP-INV-0941",
      date: "2026-08-04",
      dueDate: "2026-09-03",
      paymentType: "Credit",
      paidAmount: 0,
      grandTotal: 123000,
      products: [
        {
          productName: "Paracetamol 500mg",
          batchNumber: "PCM-24C",
          expiryDate: "2027-05-31",
          quantity: 300,
          unit: "Box",
          purchaseRate: 410,
          discount: 0,
          taxPercent: 0,
          taxAmount: 0,
          subTotal: 123000,
          grandTotal: 123000,
        },
      ],
    },
  ],
  "SUP-002": [
    {
      invoiceNo: "PPS-7781",
      date: "2026-10-17",
      dueDate: "2026-11-16",
      paymentType: "Cash",
      paidAmount: 14250,
      grandTotal: 14250,
      products: [
        {
          productName: "Normal Saline 500ml",
          batchNumber: "NS-610",
          expiryDate: "2028-02-28",
          quantity: 150,
          unit: "Bottle",
          purchaseRate: 95,
          discount: 0,
          taxPercent: 0,
          taxAmount: 0,
          subTotal: 14250,
          grandTotal: 14250,
        },
      ],
    },
    {
      invoiceNo: "PPS-7702",
      date: "2026-09-22",
      dueDate: "2026-10-22",
      paymentType: "Credit",
      paidAmount: 40000,
      grandTotal: 96000,
      products: [
        {
          productName: "Dextrose 5% 1000ml",
          batchNumber: "DX-118",
          expiryDate: "2028-05-31",
          quantity: 320,
          unit: "Bottle",
          purchaseRate: 300,
          discount: 0,
          taxPercent: 0,
          taxAmount: 0,
          subTotal: 96000,
          grandTotal: 96000,
        },
      ],
    },
  ],
  "SUP-003": [
    {
      invoiceNo: "HCA-3320",
      date: "2026-10-05",
      dueDate: "2026-11-04",
      paymentType: "Credit",
      paidAmount: 25000,
      grandTotal: 118000,
      products: [
        {
          productName: "Surgical Gloves (Medium)",
          batchNumber: "SG-442",
          expiryDate: "2029-01-31",
          quantity: 100,
          unit: "Box",
          purchaseRate: 1180,
          discount: 0,
          taxPercent: 0,
          taxAmount: 0,
          subTotal: 118000,
          grandTotal: 118000,
        },
      ],
    },
  ],
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

const editCellFieldSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 1, bgcolor: "#fff" },
  "& .MuiInputBase-input": { fontSize: 11, py: 0.75, px: 1 },
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

const batchOptions = [
  { batchNumber: "BATCH-001" },
  { batchNumber: "BATCH-002" },
  { batchNumber: "BATCH-003" },
  { batchNumber: "BATCH-004" },
  { batchNumber: "BATCH-005" },
];
const money = (value: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2,
  }).format(value || 0);

const getInvoiceStatus = (
  invoice: PurchaseHistoryInvoice,
): "Pending" | "Partial" | "Paid" => {
  if (invoice.paidAmount >= invoice.grandTotal) return "Paid";
  if (invoice.paidAmount > 0) return "Partial";
  return "Pending";
};

const statusChipColor = (
  status: "Pending" | "Partial" | "Paid",
): "success" | "warning" | "error" => {
  if (status === "Paid") return "success";
  if (status === "Partial") return "warning";
  return "error";
};

const statusOrder: Record<"Pending" | "Partial" | "Paid", number> = {
  Pending: 0,
  Partial: 1,
  Paid: 2,
};

const paymentTypeOptions = [
  "Cash",
  "Credit",
  "Bank Transfer",
  "Cheque",
  "Online",
];

const sortOptions = [
  { value: "date-desc", label: "Date (Newest first)" },
  { value: "date-asc", label: "Date (Oldest first)" },
  { value: "invoice-asc", label: "Invoice No. (A - Z)" },
  { value: "total-desc", label: "Grand Total (High to Low)" },
  { value: "total-asc", label: "Grand Total (Low to High)" },
  { value: "status", label: "Status (Pending first)" },
];

/** Recalculate a single invoice line (qty, rate, discount, GST). */
const recalcProduct = (
  product: PurchaseHistoryProduct,
): PurchaseHistoryProduct => {
  const quantity = Number(product.quantity) || 0;
  const purchaseRate = Number(product.purchaseRate) || 0;
  const discount = Number(product.discount) || 0;
  const taxPercent = Number(product.taxPercent) || 0;
  const subTotal = Math.max(0, quantity * purchaseRate - discount);
  const taxAmount = subTotal * (taxPercent / 100);
  return {
    ...product,
    quantity,
    purchaseRate,
    discount,
    taxPercent,
    subTotal,
    taxAmount,
    grandTotal: subTotal + taxAmount,
  };
};

const emptyProduct: PurchaseHistoryProduct = {
  productName: "",
  batchNumber: "",
  expiryDate: "",
  quantity: 0,
  unit: "Piece",
  purchaseRate: 0,
  discount: 0,
  taxPercent: 0,
  taxAmount: 0,
  subTotal: 0,
  grandTotal: 0,
};

export default function PurchaseInvoicePage() {
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [viewInvoice, setViewInvoice] = useState<PurchaseHistoryInvoice | null>(
    null,
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [messageId, setMessageId] = useState(0);

  // Supplier purchase history is kept in state so the "All Purchase Invoices"
  // grid stays in sync after an invoice is edited.
  const [historyData, setHistoryData] =
    useState<Record<string, PurchaseHistoryInvoice[]>>(supplierHistory);

  // Search / sort state for the all-invoices grid
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [invoiceSort, setInvoiceSort] = useState("date-desc");

  // Edit invoice dialog state
  const [editDraft, setEditDraft] = useState<InvoiceRecord | null>(null);
  const [editOriginalNo, setEditOriginalNo] = useState<string>("");
  const [editError, setEditError] = useState<string | null>(null);

  // Use this helper to show a toast. The messageId forces your Alert to re-mount
  // so the same error/success toast re-appears every time it is triggered.
  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setMessageId((id) => id + 1);
  };

  const history = useMemo(
    () => (selectedSupplier ? (historyData[selectedSupplier.id] ?? []) : []),
    [selectedSupplier, historyData],
  );
  const matchingHistory = useMemo(() => {
    const query = form.productName.trim().toLocaleLowerCase();
    if (!query) return [];
    const matched: {
      invoiceNo: string;
      date: string;
      product: PurchaseHistoryProduct;
    }[] = [];
    for (const invoice of history) {
      for (const product of invoice.products) {
        if (product.productName.toLocaleLowerCase().includes(query)) {
          matched.push({
            invoiceNo: invoice.invoiceNo,
            date: invoice.date,
            product,
          });
        }
      }
    }
    return matched;
  }, [form.productName, history]);
  const previousProductQty = matchingHistory.reduce(
    (sum, record) => sum + record.product.quantity,
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

  // ---------- All invoices grid data (supplier filtered + search + sort) ----------
  const allInvoices = useMemo(() => {
    const rows: InvoiceRecord[] = [];
    for (const supplier of suppliers) {
      for (const invoice of historyData[supplier.id] ?? []) {
        rows.push({
          ...invoice,
          supplierId: supplier.id,
          supplierName: supplier.name,
        });
      }
    }
    return rows;
  }, [historyData]);

  const visibleInvoices = useMemo(() => {
    const query = invoiceSearch.trim().toLocaleLowerCase();

    let rows = allInvoices;
    if (selectedSupplier) {
      rows = rows.filter((row) => row.supplierId === selectedSupplier.id);
    }
    if (query) {
      rows = rows.filter((row) => {
        const haystack = [
          row.invoiceNo,
          row.supplierName,
          row.paymentType,
          row.date,
          row.dueDate ?? "",
          ...row.products.map((product) => product.productName),
        ]
          .join(" ")
          .toLocaleLowerCase();
        return haystack.includes(query);
      });
    }

    const sorted = [...rows];
    switch (invoiceSort) {
      case "date-asc":
        sorted.sort((a, b) => a.date.localeCompare(b.date));
        break;
      case "date-desc":
        sorted.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case "invoice-asc":
        sorted.sort((a, b) => a.invoiceNo.localeCompare(b.invoiceNo));
        break;
      case "total-desc":
        sorted.sort((a, b) => b.grandTotal - a.grandTotal);
        break;
      case "total-asc":
        sorted.sort((a, b) => a.grandTotal - b.grandTotal);
        break;
      case "status":
        sorted.sort(
          (a, b) =>
            statusOrder[getInvoiceStatus(a)] - statusOrder[getInvoiceStatus(b)],
        );
        break;
      default:
        break;
    }
    return sorted;
  }, [allInvoices, selectedSupplier, invoiceSearch, invoiceSort]);

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
        "Remove the current invoice items before changing supplier. One Purchase order can contain items from one supplier.",
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

    showMessage("success", "Purchase order saved successfully");
  };

  // ---------- Edit invoice handlers ----------
  const openEditInvoice = (invoice: InvoiceRecord) => {
    setEditOriginalNo(invoice.invoiceNo);
    setEditError(null);
    setEditDraft({
      ...invoice,
      products: invoice.products.map((product) => ({ ...product })),
    });
  };

  const closeEditInvoice = () => {
    setEditDraft(null);
    setEditError(null);
  };

  const updateDraftField = (
    field: "invoiceNo" | "date" | "dueDate" | "paymentType" | "paidAmount",
    value: string | number,
  ) => {
    setEditDraft((previous) =>
      previous ? { ...previous, [field]: value } : previous,
    );
    setEditError(null);
  };

  const updateDraftProduct = (
    index: number,
    field: keyof PurchaseHistoryProduct,
    value: string | number,
  ) => {
    setEditDraft((previous) => {
      if (!previous) return previous;
      const products = previous.products.map((product, productIndex) => {
        if (productIndex !== index) return product;
        return recalcProduct({ ...product, [field]: value } as PurchaseHistoryProduct);
      });
      return { ...previous, products };
    });
    setEditError(null);
  };

  const addDraftProduct = () => {
    setEditDraft((previous) =>
      previous
        ? { ...previous, products: [...previous.products, { ...emptyProduct }] }
        : previous,
    );
  };

  const removeDraftProduct = (index: number) => {
    setEditDraft((previous) =>
      previous
        ? {
            ...previous,
            products: previous.products.filter(
              (_, productIndex) => productIndex !== index,
            ),
          }
        : previous,
    );
  };

  const editGrandTotal =
    editDraft?.products.reduce((sum, product) => sum + product.grandTotal, 0) ??
    0;
  const editRemaining = editDraft
    ? Math.max(0, editGrandTotal - (Number(editDraft.paidAmount) || 0))
    : 0;

  const handleSaveEditedInvoice = () => {
    if (!editDraft) return;
    const invoiceNo = editDraft.invoiceNo.trim();
    if (!invoiceNo) {
      setEditError("Invoice number is required.");
      return;
    }
    if (!editDraft.date) {
      setEditError("Invoice date is required.");
      return;
    }
    const products = editDraft.products.map(recalcProduct);
    if (products.length === 0) {
      setEditError("At least one product is required in the invoice.");
      return;
    }
    if (products.some((product) => !product.productName.trim())) {
      setEditError("Product name is required for every line item.");
      return;
    }
    if (products.some((product) => product.quantity <= 0)) {
      setEditError("Quantity must be greater than zero for every line item.");
      return;
    }

    const supplierInvoices = historyData[editDraft.supplierId] ?? [];
    const isDuplicate = supplierInvoices.some(
      (invoice) =>
        invoice.invoiceNo !== editOriginalNo &&
        invoice.invoiceNo.toLocaleLowerCase() === invoiceNo.toLocaleLowerCase(),
    );
    if (isDuplicate) {
      setEditError(
        `Invoice number ${invoiceNo} already exists for ${editDraft.supplierName}.`,
      );
      return;
    }

    const newGrandTotal = products.reduce(
      (sum, product) => sum + product.grandTotal,
      0,
    );
    const rawPaid = Number(editDraft.paidAmount) || 0;
    if (rawPaid < 0 || rawPaid > newGrandTotal) {
      setEditError(
        "Paid amount must be between zero and the invoice grand total.",
      );
      return;
    }
    if (newGrandTotal - rawPaid > 0 && !editDraft.dueDate) {
      setEditError("Please provide a due date for the remaining balance.");
      return;
    }

    const updatedInvoice: PurchaseHistoryInvoice = {
      invoiceNo,
      date: editDraft.date,
      dueDate: editDraft.dueDate || undefined,
      paymentType: editDraft.paymentType,
      paidAmount: rawPaid,
      grandTotal: newGrandTotal,
      products,
    };

    setHistoryData((previous) => ({
      ...previous,
      [editDraft.supplierId]: (previous[editDraft.supplierId] ?? []).map(
        (invoice) =>
          invoice.invoiceNo === editOriginalNo ? updatedInvoice : invoice,
      ),
    }));

    setEditDraft(null);
    setEditError(null);
    showMessage("success", `Invoice ${invoiceNo} updated successfully.`);
  };

  const viewInvoiceStatus = viewInvoice ? getInvoiceStatus(viewInvoice) : null;
  const viewInvoiceRemaining = viewInvoice
    ? Math.max(0, viewInvoice.grandTotal - viewInvoice.paidAmount)
    : 0;

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
            Purchase order
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Create supplier Purchase orders, add product details and manage
            purchase payments.
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
            NEW Purchase order
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
              title="Purchase order"
              subtitle="Select a supplier and enter invoice details, products, quantities and payment information."
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
                  disabled
                  sx={{
                    ...fieldSx,
                    // input text dark rahe
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#1e293b",
                      color: "#1e293b",
                      opacity: 1,
                    },
                    // label thoda visible rahe (optional)
                    "& .MuiInputLabel-root.Mui-disabled": {
                      color: "#64748b",
                    },
                    // border halka rahe (optional)
                    "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#e8edf3",
                      },
                  }}
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

                <Autocomplete
                  fullWidth
                  size="small"
                  options={batchOptions}
                  freeSolo
                  value={
                    batchOptions.find(
                      (item) => item.batchNumber === form.batchNumber,
                    ) ||
                    (form.batchNumber
                      ? {
                          batchNumber: form.batchNumber,
                        }
                      : null)
                  }
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.batchNumber
                  }
                  onChange={(_, newValue) => {
                    setForm((prev) => ({
                      ...prev,
                      batchNumber:
                        typeof newValue === "string"
                          ? newValue
                          : newValue?.batchNumber || "",
                    }));
                  }}
                  onInputChange={(_, newInputValue, reason) => {
                    if (reason === "input") {
                      setForm((prev) => ({
                        ...prev,
                        batchNumber: newInputValue,
                      }));
                    }
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option.batchNumber}>
                      <div className="flex w-full flex-col py-1">
                        <span className="font-semibold text-slate-800">
                          {option.batchNumber}
                        </span>
                      </div>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Batch Number"
                      placeholder="Select or enter batch number"
                      sx={fieldSx}
                    />
                  )}
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
              title="Purchase Previous History"
              subtitle="Review previous Purchase orders from this supplier and open an invoice to view complete details."
            >
              {!selectedSupplier ? (
                <MuiAlert severity="info">
                  Select a supplier to view their previous Purchase orders.
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
                      {history.length} previous invoice(s)
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
                            "Items",
                            "Grand Total",
                            "Paid",
                            "Status",
                            "Action",
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
                        {history.map((invoice) => {
                          const status = getInvoiceStatus(invoice);
                          return (
                            <TableRow key={invoice.invoiceNo} hover>
                              <TableCell
                                sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                              >
                                {invoice.invoiceNo}
                              </TableCell>
                              <TableCell
                                sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                              >
                                {invoice.date}
                              </TableCell>
                              <TableCell sx={{ fontSize: 12 }}>
                                {invoice.products.length} item(s)
                              </TableCell>
                              <TableCell
                                sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                              >
                                {money(invoice.grandTotal)}
                              </TableCell>
                              <TableCell
                                sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                              >
                                {money(invoice.paidAmount)}
                              </TableCell>
                              <TableCell sx={{ whiteSpace: "nowrap" }}>
                                <Chip
                                  label={status}
                                  size="small"
                                  color={statusChipColor(status)}
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: 11,
                                    height: 22,
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{ whiteSpace: "nowrap" }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={
                                    <VisibilityOutlined fontSize="small" />
                                  }
                                  onClick={() => setViewInvoice(invoice)}
                                  sx={{
                                    borderRadius: 1.5,
                                    textTransform: "none",
                                    minWidth: 82,
                                    fontSize: 12,
                                  }}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
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

            {/* ---------- All Purchase Invoices grid (supplier filtered + search + sort + edit) ---------- */}
            <Section
              icon={<AccountBalanceWalletOutlined />}
              title="All Purchase Invoices"
              subtitle={
                selectedSupplier
                  ? `All invoices of ${selectedSupplier.name}. Clear the supplier filter to see invoices of every supplier.`
                  : "Invoices of all suppliers. Select a supplier above to filter this grid."
              }
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                mb={2}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by invoice no., supplier, product or payment type..."
                  value={invoiceSearch}
                  onChange={(event) => setInvoiceSearch(event.target.value)}
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
                  value={invoiceSort}
                  onChange={(event) => setInvoiceSort(event.target.value)}
                  sx={{ ...fieldSx, minWidth: { sm: 230 } }}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
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
                  {selectedSupplier
                    ? selectedSupplier.name
                    : "All suppliers"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {visibleInvoices.length} invoice(s)
                  {selectedSupplier ? " (supplier filter active)" : ""}
                </Typography>
              </Stack>

              {visibleInvoices.length === 0 ? (
                <MuiAlert severity="info">
                  No invoices found for the current filter or search.
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
                  <Table size="small" sx={{ minWidth: 1100 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f8fafc" }}>
                        {[
                          "Supplier",
                          "Invoice No.",
                          "Date",
                          "Due Date",
                          
                          "Items",
                          "Grand Total",
                          "Paid",
                          "Remaining",
                          
                          
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
                      {visibleInvoices.map((invoice) => {
                        const status = getInvoiceStatus(invoice);
                        const remaining = Math.max(
                          0,
                          invoice.grandTotal - invoice.paidAmount,
                        );
                        return (
                          <TableRow
                            key={`${invoice.supplierId}-${invoice.invoiceNo}`}
                            hover
                          >
                            <TableCell sx={{ fontSize: 12, minWidth: 150 }}>
                              {invoice.supplierName}
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                            >
                              {invoice.invoiceNo}
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                            >
                              {invoice.date}
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                            >
                              {invoice.dueDate || "-"}
                            </TableCell>
                      
                            <TableCell sx={{ fontSize: 12 }}>
                              {invoice.products.length} item(s)
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                            >
                              {money(invoice.grandTotal)}
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                            >
                              {money(invoice.paidAmount)}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: 12,
                                whiteSpace: "nowrap",
                                fontWeight: remaining > 0 ? 700 : 400,
                                color: remaining > 0 ? "#b45309" : "#15803d",
                              }}
                            >
                              {money(remaining)}
                            </TableCell>
                            <TableCell sx={{ whiteSpace: "nowrap" }}>
                              <Chip
                                label={status}
                                size="small"
                                color={statusChipColor(status)}
                                sx={{
                                  fontWeight: 700,
                                  fontSize: 11,
                                  height: 22,
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ whiteSpace: "nowrap" }}>
                              <Stack direction="row" spacing={1}>
                                <Tooltip title="View invoice">
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={
                                      <VisibilityOutlined fontSize="small" />
                                    }
                                    onClick={() => setViewInvoice(invoice)}
                                    sx={{
                                      borderRadius: 1.5,
                                      textTransform: "none",
                                      minWidth: 82,
                                      fontSize: 12,
                                    }}
                                  >
                                    View
                                  </Button>
                                </Tooltip>
                                <Tooltip title="Edit invoice">
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={
                                      <EditOutlined fontSize="small" />
                                    }
                                    onClick={() => openEditInvoice(invoice)}
                                    sx={{
                                      borderRadius: 1.5,
                                      textTransform: "none",
                                      minWidth: 78,
                                      fontSize: 12,
                                    }}
                                  >
                                    Edit
                                  </Button>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Section>

            <Divider />

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
                Save Purchase order
              </Button>
              <Button
                variant="contained"
                startIcon={<PostAdd />}
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
                Create Invoice
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Previous invoice detail popup */}
      <Dialog
        open={!!viewInvoice}
        onClose={() => setViewInvoice(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {viewInvoice && (
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
                    Invoice {viewInvoice.invoiceNo}
                  </Typography>
                  {viewInvoiceStatus && (
                    <Chip
                      label={viewInvoiceStatus}
                      size="small"
                      color={statusChipColor(viewInvoiceStatus)}
                      sx={{ fontWeight: 700, fontSize: 11, height: 22 }}
                    />
                  )}
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {viewInvoice.date}
                  {viewInvoice.dueDate
                    ? ` · Due ${viewInvoice.dueDate}`
                    : ""}
                  {viewInvoice.paymentType
                    ? ` · ${viewInvoice.paymentType}`
                    : ""}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => setViewInvoice(null)}
                aria-label="close"
              >
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {selectedSupplier && (
                <Box
                  sx={{
                    p: 2,
                    mb: 2,
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
                    Supplier Details
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

              <Typography fontWeight={700} fontSize={14} mb={1}>
                Products ({viewInvoice.products.length})
              </Typography>
              <TableContainer
                sx={{
                  border: "1px solid #e8edf3",
                  borderRadius: 2,
                  overflowX: "auto",
                }}
              >
                <Table size="small" sx={{ minWidth: 950 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                      {[
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
                      ].map((heading) => (
                        <TableCell
                          key={heading}
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
                    {viewInvoice.products.map((product, index) => (
                      <TableRow
                        key={`${product.batchNumber}-${index}`}
                        hover
                      >
                        <TableCell sx={{ fontSize: 11, minWidth: 150 }}>
                          {product.productName}
                        </TableCell>
                        <TableCell sx={{ fontSize: 11 }}>
                          {product.batchNumber}
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: 11, whiteSpace: "nowrap" }}
                        >
                          {product.expiryDate}
                        </TableCell>
                        <TableCell sx={{ fontSize: 11 }}>
                          {product.quantity}
                        </TableCell>
                        <TableCell sx={{ fontSize: 11 }}>
                          {product.unit}
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: 11, whiteSpace: "nowrap" }}
                        >
                          {money(product.purchaseRate)}
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: 11, whiteSpace: "nowrap" }}
                        >
                          {money(product.discount)}
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: 11, whiteSpace: "nowrap" }}
                        >
                          {money(product.subTotal)}
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: 11, whiteSpace: "nowrap" }}
                        >
                          {money(product.taxAmount)}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {money(product.grandTotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

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
                      {money(
                        viewInvoice.products.reduce(
                          (sum, product) => sum + product.subTotal,
                          0,
                        ),
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      GST
                    </Typography>
                    <Typography fontWeight={700}>
                      {money(
                        viewInvoice.products.reduce(
                          (sum, product) => sum + product.taxAmount,
                          0,
                        ),
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Grand Total
                    </Typography>
                    <Typography fontWeight={800} color="#2563eb">
                      {money(viewInvoice.grandTotal)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Paid Amount
                    </Typography>
                    <Typography fontWeight={700}>
                      {money(viewInvoice.paidAmount)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Remaining Balance
                    </Typography>
                    <Typography
                      fontWeight={800}
                      color={
                        viewInvoiceRemaining > 0 ? "#b45309" : "#15803d"
                      }
                    >
                      {money(viewInvoiceRemaining)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setViewInvoice(null)}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Edit invoice popup */}
      <Dialog
        open={!!editDraft}
        onClose={closeEditInvoice}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {editDraft && (
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
                <Typography fontWeight={800} fontSize={16}>
                  Edit Invoice {editDraft.invoiceNo || "-"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {editDraft.supplierName} · NTN{" "}
                  {suppliers.find((s) => s.id === editDraft.supplierId)?.ntn ??
                    "-"}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={closeEditInvoice}
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

              <Box sx={{ ...gridSx, mb: 2 }}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Invoice Number"
                  value={editDraft.invoiceNo}
                  onChange={(event) =>
                    updateDraftField("invoiceNo", event.target.value)
                  }
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="date"
                  label="Invoice Date"
                  value={editDraft.date}
                  onChange={(event) =>
                    updateDraftField("date", event.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Due Date"
                  value={editDraft.dueDate ?? ""}
                  onChange={(event) =>
                    updateDraftField("dueDate", event.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Payment Type"
                  value={editDraft.paymentType}
                  onChange={(event) =>
                    updateDraftField("paymentType", event.target.value)
                  }
                  sx={fieldSx}
                >
                  {paymentTypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Paid Amount (PKR)"
                  value={editDraft.paidAmount}
                  onChange={(event) =>
                    updateDraftField("paidAmount", Number(event.target.value))
                  }
                  inputProps={{ min: 0, step: "0.01" }}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Supplier"
                  value={editDraft.supplierName}
                  disabled
                  sx={fieldSx}
                />
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={1}
                mb={1.5}
              >
                <Typography fontWeight={700} fontSize={14}>
                  Products ({editDraft.products.length})
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddOutlined />}
                  onClick={addDraftProduct}
                  sx={{ borderRadius: 1.5, textTransform: "none" }}
                >
                  Add Product
                </Button>
              </Stack>

              <TableContainer
                sx={{
                  border: "1px solid #e8edf3",
                  borderRadius: 2,
                  overflowX: "auto",
                }}
              >
                <Table size="small" sx={{ minWidth: 1150 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                      {[
                        "Product",
                        "Batch",
                        "Expiry",
                        "Qty",
                        "Rate",
                        "Discount",
                        "GST %",
                        "Sub Total",
                        "GST",
                        "Grand Total",
                        "",
                      ].map((heading) => (
                        <TableCell
                          key={heading}
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
                    {editDraft.products.map((product, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ minWidth: 160 }}>
                          <TextField
                            fullWidth
                            size="small"
                            value={product.productName}
                            onChange={(event) =>
                              updateDraftProduct(
                                index,
                                "productName",
                                event.target.value,
                              )
                            }
                            sx={editCellFieldSx}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 120 }}>
                          <TextField
                            fullWidth
                            size="small"
                            value={product.batchNumber}
                            onChange={(event) =>
                              updateDraftProduct(
                                index,
                                "batchNumber",
                                event.target.value,
                              )
                            }
                            sx={editCellFieldSx}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 130 }}>
                          <TextField
                            fullWidth
                            size="small"
                            type="date"
                            value={product.expiryDate}
                            onChange={(event) =>
                              updateDraftProduct(
                                index,
                                "expiryDate",
                                event.target.value,
                              )
                            }
                            InputLabelProps={{ shrink: true }}
                            sx={editCellFieldSx}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 80 }}>
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={product.quantity}
                            onChange={(event) =>
                              updateDraftProduct(
                                index,
                                "quantity",
                                Number(event.target.value),
                              )
                            }
                            inputProps={{ min: 1 }}
                            sx={editCellFieldSx}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 100 }}>
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={product.purchaseRate}
                            onChange={(event) =>
                              updateDraftProduct(
                                index,
                                "purchaseRate",
                                Number(event.target.value),
                              )
                            }
                            inputProps={{ min: 0, step: "0.01" }}
                            sx={editCellFieldSx}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 100 }}>
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={product.discount}
                            onChange={(event) =>
                              updateDraftProduct(
                                index,
                                "discount",
                                Number(event.target.value),
                              )
                            }
                            inputProps={{ min: 0, step: "0.01" }}
                            sx={editCellFieldSx}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 80 }}>
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={product.taxPercent}
                            onChange={(event) =>
                              updateDraftProduct(
                                index,
                                "taxPercent",
                                Number(event.target.value),
                              )
                            }
                            inputProps={{ min: 0, step: "0.01" }}
                            sx={editCellFieldSx}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: 11, whiteSpace: "nowrap" }}
                        >
                          {money(product.subTotal)}
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: 11, whiteSpace: "nowrap" }}
                        >
                          {money(product.taxAmount)}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {money(product.grandTotal)}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Remove product">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeDraftProduct(index)}
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
                      {money(
                        editDraft.products.reduce(
                          (sum, product) => sum + product.subTotal,
                          0,
                        ),
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      GST
                    </Typography>
                    <Typography fontWeight={700}>
                      {money(
                        editDraft.products.reduce(
                          (sum, product) => sum + product.taxAmount,
                          0,
                        ),
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Grand Total
                    </Typography>
                    <Typography fontWeight={800} color="#2563eb">
                      {money(editGrandTotal)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Paid Amount
                    </Typography>
                    <Typography fontWeight={700}>
                      {money(Number(editDraft.paidAmount) || 0)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Remaining Balance
                    </Typography>
                    <Typography
                      fontWeight={800}
                      color={editRemaining > 0 ? "#b45309" : "#15803d"}
                    >
                      {money(editRemaining)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={closeEditInvoice}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveOutlined />}
                onClick={handleSaveEditedInvoice}
                sx={{
                  bgcolor: "#2563eb",
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
                }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}