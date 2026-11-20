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
  Link as MuiLink,
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
  Print,
} from "@mui/icons-material";
import Alert from "@/app/components/Alert";

import {
  type vendor,
  type PurchaseHistoryProduct,
  type PurchaseHistoryInvoice,
  type InvoiceRecord,
  type InvoiceItem,
  type FormState,
  emptyForm,
  vendors,
  vendorHistory,
  productBatchCatalog,
  sortOptions,
  UNIT_OPTIONS,
} from "@/app/data/demodata";

// ==================== Shared Field & Grid Styles ====================

const fieldSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#fff" },
  "& .MuiInputLabel-root": { fontSize: 14 },
  "& .MuiFormHelperText-root": { mx: 0, fontSize: 11 },
};

// Readonly / auto-filled field style (keeps dark readable text just like Vendor NTN)
const readonlyFieldSx = {
  ...fieldSx,
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#1e293b",
    color: "#1e293b",
    opacity: 1,
  },
  "& .MuiInputLabel-root.Mui-disabled": {
    color: "#64748b",
  },
  "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e8edf3",
  },
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

// ==================== Reusable Section Wrapper ====================

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

// ==================== Formatting & Status Helpers ====================

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

// ==================== Main Purchase Order Component ====================

export default function PurchaseInvoicePage() {
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [selectedvendor, setSelectedvendor] = useState<vendor | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [viewInvoice, setViewInvoice] = useState<PurchaseHistoryInvoice | null>(
    null,
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [messageId, setMessageId] = useState(0);

  // Vendor purchase history is kept in state so the "All Purchase Invoices"
  // grid stays in sync after an invoice is edited.
  const [historyData, setHistoryData] =
    useState<Record<string, PurchaseHistoryInvoice[]>>(vendorHistory);

  // Search / sort state for the all-invoices grid
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [invoiceSort, setInvoiceSort] = useState("date-desc");

  // Edit invoice dialog state
  const [editDraft, setEditDraft] = useState<InvoiceRecord | null>(null);
  const [editOriginalNo, setEditOriginalNo] = useState<string>("");
  const [editError, setEditError] = useState<string | null>(null);

  // Helper to show a toast. messageId forces Alert to re-mount on every trigger.
  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setMessageId((id) => id + 1);
  };

  // ==================== Product & Batch Filtering / Auto-Fill ====================

  // 1. Filter Product list:
  //    - If a Batch is already selected, show ONLY products belonging to that batch.
  //    - Otherwise, show all unique products from the catalog.
  const availableProductOptions = useMemo(() => {
    const source = form.batchNumber
      ? productBatchCatalog.filter(
          (item) => item.batchNumber === form.batchNumber,
        )
      : productBatchCatalog;

    return Array.from(new Set(source.map((item) => item.productName)));
  }, [form.batchNumber]);

  // 2. Filter Batch list:
  //    - If a Product is already selected, show ONLY batches containing that product.
  //    - Otherwise, show all unique batches from the catalog.
  const availableBatchOptions = useMemo(() => {
    const source = form.productName
      ? productBatchCatalog.filter(
          (item) => item.productName === form.productName,
        )
      : productBatchCatalog;

    return Array.from(new Set(source.map((item) => item.batchNumber)));
  }, [form.productName]);

  // Helper to resolve matching catalog record and auto-fill readonly fields
  const applyProductAndBatchSelection = (
    nextProductName: string,
    nextBatchNumber: string,
  ) => {
    const matched =
      nextProductName && nextBatchNumber
        ? productBatchCatalog.find(
            (item) =>
              item.productName === nextProductName &&
              item.batchNumber === nextBatchNumber,
          )
        : undefined;

    setForm((prev) => ({
      ...prev,
      productName: nextProductName,
      batchNumber: nextBatchNumber,
      // Auto-fill readonly fields when both product & batch match; clear otherwise
      expiryDate: matched ? matched.expiryDate : "",
      currentQty: matched ? String(matched.currentQty) : "",
      unit: matched ? matched.unit : "",
      purchaseRate: matched ? String(matched.purchaseRate) : "",
      sellingPrice: matched ? String(matched.sellingPrice) : "",
    }));
    setMessage(null);
  };

  // When user selects/clears Product from dropdown
  const handleProductSelect = (
    _: React.SyntheticEvent,
    newValue: string | null,
  ) => {
    const nextProduct = newValue ?? "";
    applyProductAndBatchSelection(nextProduct, form.batchNumber);
  };

  // When user selects/clears Batch from dropdown
  const handleBatchSelect = (
    _: React.SyntheticEvent,
    newValue: string | null,
  ) => {
    const nextBatch = newValue ?? "";
    applyProductAndBatchSelection(form.productName, nextBatch);
  };

  // ==================== Vendor Purchase History & Matching ====================

  const history = useMemo(
    () => (selectedvendor ? (historyData[selectedvendor.id] ?? []) : []),
    [selectedvendor, historyData],
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

  // ==================== Line & Invoice Totals ====================

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

  // ==================== All Invoices Grid (Filter + Search + Sort) ====================

  const allInvoices = useMemo(() => {
    const rows: InvoiceRecord[] = [];
    for (const vendorItem of vendors) {
      for (const invoice of historyData[vendorItem.id] ?? []) {
        rows.push({
          ...invoice,
          vendorId: vendorItem.id,
          vendorName: vendorItem.name,
        });
      }
    }
    return rows;
  }, [historyData]);

  const visibleInvoices = useMemo(() => {
    const query = invoiceSearch.trim().toLocaleLowerCase();

    let rows = allInvoices;
    if (selectedvendor) {
      rows = rows.filter((row) => row.vendorId === selectedvendor.id);
    }
    if (query) {
      rows = rows.filter((row) => {
        const haystack = [
          row.invoiceNo,
          row.vendorName,
          row.date,
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
  }, [allInvoices, selectedvendor, invoiceSearch, invoiceSort]);

  // ==================== Form & List Handlers ====================

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setMessage(null);
  };

  const handleVendorChange = (
    _: React.SyntheticEvent,
    vendorItem: vendor | null,
  ) => {
    if (items.length > 0 && vendorItem?.id !== selectedvendor?.id) {
      showMessage(
        "error",
        "Remove the current invoice items before changing vendor. One Purchase order can contain items from one vendor.",
      );
      return;
    }
    setSelectedvendor(vendorItem);
    setForm((previous) => ({
      ...previous,
      vendorName: vendorItem?.name ?? "",
      vendorNtn: vendorItem?.ntn ?? "",
    }));
    setMessage(null);
  };

  const handleAddToList = () => {
    if (!selectedvendor) {
      showMessage("error", "Please search and select a vendor first.");
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
      vendorName: selectedvendor.name,
      vendorNtn: selectedvendor.ntn,
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

    // Clear all product detail fields EXCEPT batchNumber
    setForm((previous) => ({
      ...previous,
      productName: "",
      // Keep previous.batchNumber intact
      expiryDate: "",
      currentQty: "",
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
    setSelectedvendor(null);
    setItems([]);
    setMessage(null);
  };

  const handleSaveInvoice = () => {
    if (!selectedvendor || items.length === 0) {
      showMessage(
        "error",
        "Select a vendor and add at least one product to the list.",
      );
      return;
    }

    if (paidAmount < 0 || paidAmount > grandTotal) {
      showMessage(
        "error",
        "Paid amount must be between zero and the grand total.",
      );
      return;
    }

    // Save invoice logic here...

    showMessage("success", "Purchase order saved successfully");
  };

  // ==================== Edit Invoice Dialog Handlers ====================

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
    field: "invoiceNo" | "date" | "paidAmount",
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
        return recalcProduct({
          ...product,
          [field]: value,
        } as PurchaseHistoryProduct);
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

    const vendorInvoices = historyData[editDraft.vendorId] ?? [];
    const isDuplicate = vendorInvoices.some(
      (invoice) =>
        invoice.invoiceNo !== editOriginalNo &&
        invoice.invoiceNo.toLocaleLowerCase() === invoiceNo.toLocaleLowerCase(),
    );
    if (isDuplicate) {
      setEditError(
        `Invoice number ${invoiceNo} already exists for ${editDraft.vendorName}.`,
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

    const updatedInvoice: PurchaseHistoryInvoice = {
      invoiceNo,
      date: editDraft.date,
      paidAmount: rawPaid,
      grandTotal: newGrandTotal,
      products,
    };

    setHistoryData((previous) => ({
      ...previous,
      [editDraft.vendorId]: (previous[editDraft.vendorId] ?? []).map(
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

  // ==================== Render ====================

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
      {/* Page Header */}
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
            Create vendor Purchase orders, add product details and manage
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
            {/* ==================== Section 1: Vendor & Invoice Info ==================== */}
            <Section
              icon={<BusinessOutlined />}
              title="Purchase order"
              subtitle="Select a vendor and enter invoice details, products, quantities and payment information."
            >
              <Box sx={gridSx}>
                <Autocomplete
                  fullWidth
                  options={vendors}
                  value={selectedvendor}
                  onChange={handleVendorChange}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      size="small"
                      label="vendor Name"
                      placeholder="Search vendor by name..."
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
                  label="vendor NTN"
                  value={form.vendorNtn}
                  placeholder="Auto-filled after vendor selection"
                  disabled
                  sx={readonlyFieldSx}
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
              {selectedvendor && (
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
                    Selected vendor Details
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
                      <b>vendor:</b> {selectedvendor.name}
                    </Typography>
                    <Typography variant="body2">
                      <b>NTN:</b> {selectedvendor.ntn}
                    </Typography>
                    <Typography variant="body2">
                      <b>Phone:</b> {selectedvendor.phone}
                    </Typography>
                    <Typography variant="body2">
                      <b>Address:</b> {selectedvendor.address}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Section>

            <Divider />

            {/* ==================== Section 2: Product Details ==================== */}
            <Section
              icon={<Inventory2Outlined />}
              title="Product Details"
              subtitle="Enter one product at a time, then use Add to List to include it in this invoice."
            >
              <Box sx={gridSx}>
                {/* Searchable Product Dropdown (filtered by Batch if Batch is selected) */}
                <Autocomplete
                  fullWidth
                  size="small"
                  options={availableProductOptions}
                  value={form.productName || null}
                  onChange={handleProductSelect}
                  noOptionsText={
                    <Box
                      onMouseDown={(e) => e.preventDefault()}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        py: 0.5,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Product not found, plz create a product first.
                      </Typography>
                      <MuiLink
                        href="http://localhost:3000/dashboard/product-order"
                        underline="hover"
                        sx={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#2563eb",
                        }}
                      >
                        http://localhost:3000/dashboard/product-order
                      </MuiLink>
                    </Box>
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Product Name"
                      placeholder="Search and select product"
                      sx={fieldSx}
                    />
                  )}
                />

                {/* Batch Dropdown (filtered by Product if Product is selected) */}
                <Autocomplete
                  fullWidth
                  size="small"
                  options={availableBatchOptions}
                  value={form.batchNumber || null}
                  onChange={handleBatchSelect}
                  noOptionsText="No batch found"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Batch Number"
                      placeholder="Select batch number"
                      sx={fieldSx}
                    />
                  )}
                />

                {/* Auto-filled Readonly: Expiry Date */}
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="date"
                  label="Expiry Date"
                  name="expiryDate"
                  value={form.expiryDate}
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={readonlyFieldSx}
                />

                {/* Auto-filled Readonly: Current Stock Quantity in Selected Batch */}
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Current Qty"
                  name="currentQty"
                  value={form.currentQty}
                  placeholder="Auto-filled"
                  disabled
                  sx={readonlyFieldSx}
                />

                {/* Auto-filled Readonly: Unit */}
                <TextField
                  fullWidth
                  required
                  select
                  size="small"
                  label="Unit"
                  name="unit"
                  value={form.unit}
                  disabled
                  sx={readonlyFieldSx}
                >
                  <MenuItem value="" disabled>
                    Select unit
                  </MenuItem>
                  {UNIT_OPTIONS.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Auto-filled Readonly: Purchasing Price */}
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="number"
                  label="Purchase Rate (PKR / Unit)"
                  name="purchaseRate"
                  value={form.purchaseRate}
                  placeholder="Auto-filled"
                  disabled
                  sx={readonlyFieldSx}
                />

                {/* Editable: Purchase Order Quantity */}
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

                {/* Editable: Discount */}
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

                {/* Editable: Tax / GST */}
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

              {selectedvendor && matchingHistory.length > 0 && (
                <MuiAlert severity="warning" sx={{ mt: 2 }}>
                  <b>Previous purchase check:</b> {form.productName} was
                  previously purchased from {selectedvendor.name} in{" "}
                  {matchingHistory.length} record(s), total quantity{" "}
                  <b>{previousProductQty}</b>. Check current stock before adding
                  more.
                </MuiAlert>
              )}

              {/* Line Totals Summary */}
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

            {/* ==================== Section 3: Purchase Previous History ==================== */}
            <Section
              icon={<HistoryOutlined />}
              title="Purchase Previous History"
              subtitle="Review previous Purchase orders from this vendor and open an invoice to view complete details."
            >
              {!selectedvendor ? (
                <MuiAlert severity="info">
                  Select a vendor to view their previous Purchase orders.
                </MuiAlert>
              ) : history.length === 0 ? (
                <MuiAlert severity="info">
                  No previous purchase history found for {selectedvendor.name}.
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
                      {selectedvendor.name}
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

            {/* ==================== Section 4: Current Purchase List ==================== */}
            <Section
              icon={<ReceiptLongOutlined />}
              title="Purchase List"
              subtitle="Products added to this invoice, each saved against the selected vendor."
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
                          "vendor",
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
                            {item.vendorName}
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

            {/* ==================== Section 5: All Purchase Invoices ==================== */}
            <Section
              icon={<AccountBalanceWalletOutlined />}
              title="All Purchase Invoices"
              subtitle={
                selectedvendor
                  ? `All invoices of ${selectedvendor.name}. Clear the vendor filter to see invoices of every vendor.`
                  : "Invoices of all vendors. Select a vendor above to filter this grid."
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
                  placeholder="Search by invoice no., vendor, product or payment type..."
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
                  {selectedvendor ? selectedvendor.name : "All vendors"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {visibleInvoices.length} invoice(s)
                  {selectedvendor ? " (vendor filter active)" : ""}
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
                          "vendor",
                          "Invoice No.",
                          "Date",
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
                            key={`${invoice.vendorId}-${invoice.invoiceNo}`}
                            hover
                          >
                            <TableCell sx={{ fontSize: 12, minWidth: 150 }}>
                              {invoice.vendorName}
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
                                <Tooltip title="Print Invoice">
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="success"
                                    startIcon={<Print fontSize="small" />}
                                    sx={{
                                      borderRadius: 1.5,
                                      textTransform: "none",
                                      minWidth: 78,
                                      fontSize: 12,
                                    }}
                                  >
                                    Print
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

            {/* Footer Action Buttons */}
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
                Add Purchase order
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
                Invoice
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* ==================== Previous Invoice Detail Popup ==================== */}
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
              {selectedvendor && (
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
                    vendor Details
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
                      <b>vendor:</b> {selectedvendor.name}
                    </Typography>
                    <Typography variant="body2">
                      <b>NTN:</b> {selectedvendor.ntn}
                    </Typography>
                    <Typography variant="body2">
                      <b>Phone:</b> {selectedvendor.phone}
                    </Typography>
                    <Typography variant="body2">
                      <b>Address:</b> {selectedvendor.address}
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
                      <TableRow key={`${product.batchNumber}-${index}`} hover>
                        <TableCell sx={{ fontSize: 11, minWidth: 150 }}>
                          {product.productName}
                        </TableCell>
                        <TableCell sx={{ fontSize: 11 }}>
                          {product.batchNumber}
                        </TableCell>
                        <TableCell sx={{ fontSize: 11, whiteSpace: "nowrap" }}>
                          {product.expiryDate}
                        </TableCell>
                        <TableCell sx={{ fontSize: 11 }}>
                          {product.quantity}
                        </TableCell>
                        <TableCell sx={{ fontSize: 11 }}>
                          {product.unit}
                        </TableCell>
                        <TableCell sx={{ fontSize: 11, whiteSpace: "nowrap" }}>
                          {money(product.purchaseRate)}
                        </TableCell>
                        <TableCell sx={{ fontSize: 11, whiteSpace: "nowrap" }}>
                          {money(product.discount)}
                        </TableCell>
                        <TableCell sx={{ fontSize: 11, whiteSpace: "nowrap" }}>
                          {money(product.subTotal)}
                        </TableCell>
                        <TableCell sx={{ fontSize: 11, whiteSpace: "nowrap" }}>
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
                      color={viewInvoiceRemaining > 0 ? "#b45309" : "#15803d"}
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

      {/* ==================== Edit Invoice Popup ==================== */}
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
                  {editDraft.vendorName} · NTN{" "}
                  {vendors.find((s) => s.id === editDraft.vendorId)?.ntn ?? "-"}
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
                  label="vendor"
                  value={editDraft.vendorName}
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
                        <TableCell sx={{ fontSize: 11, whiteSpace: "nowrap" }}>
                          {money(product.subTotal)}
                        </TableCell>
                        <TableCell sx={{ fontSize: 11, whiteSpace: "nowrap" }}>
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
