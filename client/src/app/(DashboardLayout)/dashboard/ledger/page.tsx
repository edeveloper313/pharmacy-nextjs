"use client";

import React, { useMemo, useState } from "react";
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
  VisibilityOutlined,
  ReceiptLongOutlined,
  AccountBalanceWalletOutlined,
  Close,
  Refresh,
} from "@mui/icons-material";

// Make sure these paths match your project structure
import Alert from "@/app/components/Alert";
import { AlertState } from "@/app/components/types/types";

// ============================================
// [BLOCK 1 START: TYPES, HELPERS & DUMMY DATA]
// ============================================
type CustomerType =
  | "Pharmacies / Medical Stores"
  | "Hospitals"
  | "Clinics"
  | "Wholesale Distributors"
  | "Doctors";

interface PendingInvoice {
  id: number;
  customerType: CustomerType | "";
  hospitalName: string;
  clientName: string;
  groupName: string;
  totalPayable: number;
  totalReceived: number;
  totalBalance: number;
}

interface InvoiceFormState {
  customerType: CustomerType | "";
  hospitalName: string;
  clientName: string;
  groupName: string;
  totalPayable: string;
  totalReceived: string;
}

const CUSTOMER_TYPES: CustomerType[] = [
  "Pharmacies / Medical Stores",
  "Hospitals",
  "Clinics",
  "Wholesale Distributors",
  "Doctors",
];

const formatPKR = (amount: number) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-PK")}`;

// Realistic Pharmacy Distribution Pending Invoices
const initialInvoices: PendingInvoice[] = [
  {
    id: 1,
    customerType: "Hospitals",
    hospitalName: "Aga Khan University Hospital",
    clientName: "AKUH Central Pharmacy",
    groupName: "Institutional - Karachi South",
    totalPayable: 480000,
    totalReceived: 300000,
    totalBalance: 180000,
  },
  {
    id: 2,
    customerType: "Pharmacies / Medical Stores",
    hospitalName: "N/A (Retail Outlet)",
    clientName: "Al-Shifa Medical Store",
    groupName: "Retail Chain - Lahore",
    totalPayable: 145000,
    totalReceived: 95000,
    totalBalance: 50000,
  },
  {
    id: 3,
    customerType: "Wholesale Distributors",
    hospitalName: "Multi-Hospital Supply",
    clientName: "MedLink Pharma Distributors",
    groupName: "Wholesale Tier-A",
    totalPayable: 950000,
    totalReceived: 620000,
    totalBalance: 330000,
  },
  {
    id: 4,
    customerType: "Clinics",
    hospitalName: "Shifa Care Poly Clinic",
    clientName: "Shifa Care Clinic",
    groupName: "Clinics Network - Islamabad",
    totalPayable: 85000,
    totalReceived: 85000,
    totalBalance: 0,
  },
  {
    id: 5,
    customerType: "Doctors",
    hospitalName: "Liaquat National Hospital",
    clientName: "Dr. Kamran Siddiqui",
    groupName: "Key Opinion Leaders (KOL)",
    totalPayable: 62000,
    totalReceived: 22000,
    totalBalance: 40000,
  },
];

// Strictly NO default values — placeholders show exact format
const emptyForm: InvoiceFormState = {
  customerType: "",
  hospitalName: "",
  clientName: "",
  groupName: "",
  totalPayable: "",
  totalReceived: "",
};
// [BLOCK 1 END: TYPES, HELPERS & DUMMY DATA]

// ============================================
// [BLOCK 2 START: SORTING HELPERS]
// ============================================
const descendingComparator = (
  a: PendingInvoice,
  b: PendingInvoice,
  orderBy: keyof PendingInvoice
) => {
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

const getComparator = (
  order: "asc" | "desc",
  orderBy: keyof PendingInvoice
) =>
  order === "desc"
    ? (a: PendingInvoice, b: PendingInvoice) =>
        descendingComparator(a, b, orderBy)
    : (a: PendingInvoice, b: PendingInvoice) =>
        -descendingComparator(a, b, orderBy);
// [BLOCK 2 END: SORTING HELPERS]

export default function PendingInvoicesPage() {
  // ============================================
  // [BLOCK 3 START: STATE & HANDLERS]
  // ============================================
  const [invoices, setInvoices] = useState<PendingInvoice[]>(initialInvoices);
  const [form, setForm] = useState<InvoiceFormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // View Payable & Received Modal (null item = overall summary, item = single row)
  const [amountsModal, setAmountsModal] = useState<{
    open: boolean;
    item: PendingInvoice | null;
  }>({ open: false, item: null });

  const [search, setSearch] = useState("");
  const [customerTypeFilter, setCustomerTypeFilter] = useState("all");
  const [balanceFilter, setBalanceFilter] = useState("all");

  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<keyof PendingInvoice>("totalBalance");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

const [alert, setAlert] = useState<
  { id: number; type: AlertColor; message: string } | null
>(null);

const showAlert = (type: AlertColor, message: string) => {
  setAlert({ id: Date.now(), type, message });
};

  // Filtered & Sorted Records
  const filteredInvoices = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const result = invoices.filter((item) => {
      const searchMatch = [
        item.hospitalName,
        item.clientName,
        item.groupName,
        item.customerType,
      ].some((val) => String(val).toLowerCase().includes(keyword));

      const typeMatch =
        customerTypeFilter === "all" ||
        item.customerType === customerTypeFilter;

      const balMatch =
        balanceFilter === "all" ||
        (balanceFilter === "pending" && item.totalBalance > 0) ||
        (balanceFilter === "settled" && item.totalBalance === 0);

      return searchMatch && typeMatch && balMatch;
    });

    return [...result].sort(getComparator(order, orderBy));
  }, [invoices, search, customerTypeFilter, balanceFilter, order, orderBy]);

  const paginatedInvoices = filteredInvoices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Overall Totals for filtered invoices
  const overallTotals = useMemo(
    () =>
      filteredInvoices.reduce(
        (acc, cur) => ({
          payable: acc.payable + cur.totalPayable,
          received: acc.received + cur.totalReceived,
          balance: acc.balance + cur.totalBalance,
        }),
        { payable: 0, received: 0, balance: 0 }
      ),
    [filteredInvoices]
  );

  const handleSort = (property: keyof PendingInvoice) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: PendingInvoice) => {
    setEditingId(item.id);
    setForm({
      customerType: item.customerType,
      hospitalName: item.hospitalName,
      clientName: item.clientName,
      groupName: item.groupName,
      totalPayable: String(item.totalPayable),
      totalReceived: String(item.totalReceived),
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const requiredKeys: (keyof InvoiceFormState)[] = [
      "customerType",
      "hospitalName",
      "clientName",
      "groupName",
      "totalPayable",
      "totalReceived",
    ];

    if (requiredKeys.some((k) => String(form[k]).trim() === "")) {
      return showAlert("error", "Please fill all required fields.");
    }

    const payable = Number(form.totalPayable);
    const received = Number(form.totalReceived);

    if (payable < 0 || received < 0) {
      return showAlert("error", "Amounts cannot be negative.");
    }
    if (received > payable) {
      return showAlert(
        "error",
        "Total Received cannot exceed Total Payable amount."
      );
    }

    const payload: Omit<PendingInvoice, "id"> = {
      customerType: form.customerType,
      hospitalName: form.hospitalName.trim(),
      clientName: form.clientName.trim(),
      groupName: form.groupName.trim(),
      totalPayable: payable,
      totalReceived: received,
      totalBalance: payable - received,
    };

    if (editingId !== null) {
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === editingId ? { ...inv, ...payload } : inv))
      );
      showAlert("success", "Pending invoice updated successfully!");
    } else {
      setInvoices((prev) => [{ ...payload, id: Date.now() }, ...prev]);
      setPage(0);
      showAlert("success", "Pending invoice added successfully!");
    }

    setDialogOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this invoice record?"))
      return;
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    setPage(0);
    showAlert("success", "Invoice record deleted successfully!");
  };

  const handleResetFilters = () => {
    setSearch("");
    setCustomerTypeFilter("all");
    setBalanceFilter("all");
    setOrder("desc");
    setOrderBy("totalBalance");
    setPage(0);
  };
  // [BLOCK 3 END: STATE & HANDLERS]

  const columns: { id: keyof PendingInvoice; label: string }[] = [
    { id: "hospitalName", label: "Hospital Name" },
    { id: "clientName", label: "Client Name" },
    { id: "groupName", label: "Group Name" },
    { id: "totalBalance", label: "Total Balance" },
  ];

  // Shared form fields helper
  const renderFormFields = (isDialog = false) => {
    const liveBalance =
      form.totalPayable !== "" && form.totalReceived !== ""
        ? Number(form.totalPayable) - Number(form.totalReceived)
        : null;

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isDialog
            ? { xs: "1fr", sm: "repeat(2, 1fr)" }
            : { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        {/* CRM Customer Type */}
        <TextField
          fullWidth
          size="small"
          select
          label="Customer Type *"
          name="customerType"
          value={form.customerType}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          SelectProps={{ displayEmpty: true }}
        >
          <MenuItem value="" disabled>
            <Typography variant="body2" color="text.disabled">
              Select type (Pharmacy, Hospital, Clinic...)
            </Typography>
          </MenuItem>
          {CUSTOMER_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        {/* i. Hospital Name */}
        <TextField
          fullWidth
          size="small"
          label="Hospital Name *"
          name="hospitalName"
          value={form.hospitalName}
          onChange={handleChange}
          placeholder="e.g. Aga Khan Hospital (or N/A)"
          InputLabelProps={{ shrink: true }}
        />

        {/* ii. Client Name */}
        <TextField
          fullWidth
          size="small"
          label="Client Name *"
          name="clientName"
          value={form.clientName}
          onChange={handleChange}
          placeholder="e.g. Al-Shifa Pharmacy / Dr. Tariq"
          InputLabelProps={{ shrink: true }}
        />

        {/* iii. Group Name */}
        <TextField
          fullWidth
          size="small"
          label="Group Name *"
          name="groupName"
          value={form.groupName}
          onChange={handleChange}
          placeholder="e.g. Institutional / Retail Chain"
          InputLabelProps={{ shrink: true }}
        />

        {/* Total Amount Payable */}
        <TextField
          fullWidth
          size="small"
          label="Total Amount Payable (Rs.) *"
          name="totalPayable"
          type="number"
          value={form.totalPayable}
          onChange={handleChange}
          placeholder="e.g. 250000"
          InputLabelProps={{ shrink: true }}
        />

        {/* Total Amount Received */}
        <TextField
          fullWidth
          size="small"
          label="Total Amount Received (Rs.) *"
          name="totalReceived"
          type="number"
          value={form.totalReceived}
          onChange={handleChange}
          placeholder="e.g. 100000"
          InputLabelProps={{ shrink: true }}
        />

        {liveBalance !== null && (
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography variant="caption" color="text.secondary">
              Calculated Total Balance:{" "}
              <strong style={{ color: liveBalance > 0 ? "#dc2626" : "#16a34a" }}>
                {formatPKR(liveBalance)}
              </strong>
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const activeModalData = amountsModal.item
    ? {
        title: amountsModal.item.clientName,
        subtitle: `${amountsModal.item.hospitalName} • ${amountsModal.item.groupName}`,
        payable: amountsModal.item.totalPayable,
        received: amountsModal.item.totalReceived,
        balance: amountsModal.item.totalBalance,
      }
    : {
        title: "Overall Sales Invoice Totals",
        subtitle: `Summary across ${filteredInvoices.length} filtered invoice(s)`,
        payable: overallTotals.payable,
        received: overallTotals.received,
        balance: overallTotals.balance,
      };

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

      {/* ============================================ */}
      {/* [BLOCK 4 START: PAGE HEADER]                 */}
      {/* ============================================ */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1e293b">
            Sales Invoice Listing (Pending Amount)
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Track hospital and client pending balances, payable, and received amounts.
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<AccountBalanceWalletOutlined />}
            onClick={() => setAmountsModal({ open: true, item: null })}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              whiteSpace: "nowrap",
              borderColor: "#cbd5e1",
              color: "#1e293b",
            }}
          >
            View Payable & Received
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAdd}
            sx={{
              bgcolor: "#2563eb",
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "none",
              px: 2.5,
              whiteSpace: "nowrap",
            }}
          >
            Add Invoice Entry
          </Button>
        </Stack>
      </Stack>
      {/* [BLOCK 4 END: PAGE HEADER] */}

      {/* ============================================ */}
      {/* [BLOCK 5 START: INVOICE ENTRY FORM CARD]     */}
      {/* ============================================ */}
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
          <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
            <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}>
              <ReceiptLongOutlined />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Pending Invoice Entry
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Record payable and received amounts to calculate pending balance.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Typography fontWeight={700} color="#2563eb" mb={2}>
            Client & Billing Details
          </Typography>

          {renderFormFields(false)}

          <Box sx={{ mt: 3 }}>
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
                startIcon={<Add />}
                onClick={handleSave}
                sx={{
                  bgcolor: "#2563eb",
                  textTransform: "none",
                  borderRadius: 2,
                  boxShadow: "none",
                }}
              >
                Save Invoice
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      {/* [BLOCK 5 END: INVOICE ENTRY FORM CARD] */}

      {/* ============================================ */}
      {/* [BLOCK 6 START: PENDING INVOICE TABLE]       */}
      {/* ============================================ */}
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
              Pending Amount Listing
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View pending balances or inspect total payable & received per client.
            </Typography>
          </Box>

          {/* Search & Filters */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "2fr 1fr 1fr auto",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search hospital, client, group..."
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
              <InputLabel>Customer Type</InputLabel>
              <Select
                value={customerTypeFilter}
                label="Customer Type"
                onChange={(e) => {
                  setCustomerTypeFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">All Customer Types</MenuItem>
                {CUSTOMER_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Balance Status</InputLabel>
              <Select
                value={balanceFilter}
                label="Balance Status"
                onChange={(e) => {
                  setBalanceFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">All Balances</MenuItem>
                <MenuItem value="pending">Pending (&gt; 0)</MenuItem>
                <MenuItem value="settled">Settled (0)</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Reset Filters">
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleResetFilters}
                  sx={{ height: 40, minWidth: 40 }}
                >
                  <Refresh />
                </Button>
              </Tooltip>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
            <Table sx={{ width: "100%" }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      sx={{
                        fontWeight: 700,
                        color: "#475569",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={orderBy === col.id ? order : "asc"}
                        onClick={() => handleSort(col.id)}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                    Payable / Received
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedInvoices.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{ "&:last-child td": { borderBottom: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {item.hospitalName}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography fontWeight={700} variant="body2">
                          {item.clientName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.customerType}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={item.groupName}
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography
                          fontWeight={700}
                          variant="body2"
                          color={
                            item.totalBalance > 0 ? "#dc2626" : "#16a34a"
                          }
                        >
                          {formatPKR(item.totalBalance)}
                        </Typography>
                        <Chip
                          size="small"
                          label={item.totalBalance > 0 ? "Pending" : "Settled"}
                          color={item.totalBalance > 0 ? "error" : "success"}
                        />
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityOutlined fontSize="small" />}
                        onClick={() => setAmountsModal({ open: true, item })}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          whiteSpace: "nowrap",
                        }}
                      >
                        View Amounts
                      </Button>
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

                {filteredInvoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <ReceiptLongOutlined
                        sx={{ fontSize: 45, color: "#94a3b8", mb: 1 }}
                      />
                      <Typography fontWeight={700}>
                        No Pending Invoices Found
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

          <TablePagination
            component="div"
            count={filteredInvoices.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              ".MuiTablePagination-toolbar": {
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-end" },
              },
            }}
          />
        </CardContent>
      </Card>
      {/* [BLOCK 6 END: PENDING INVOICE TABLE] */}

      {/* ============================================ */}
      {/* [BLOCK 7 START: ADD / EDIT & AMOUNTS DIALOGS]*/}
      {/* ============================================ */}
      {/* Add / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 3, mx: 2, width: "100%" } }}
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={700} variant="h6">
                {editingId !== null
                  ? "Edit Pending Invoice"
                  : "Add Pending Invoice"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {editingId !== null
                  ? "Update payable, received, or client details."
                  : "Add a new client pending invoice record."}
              </Typography>
            </Box>
            <IconButton onClick={() => setDialogOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>{renderFormFields(true)}</DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ bgcolor: "#2563eb", textTransform: "none", boxShadow: "none" }}
          >
            {editingId !== null ? "Update Invoice" : "Save Invoice"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Total Payable & Total Received Dialog */}
      <Dialog
        open={amountsModal.open}
        onClose={() => setAmountsModal({ open: false, item: null })}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3, mx: 2, width: "100%" } }}
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={700} variant="h6">
                {activeModalData.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {activeModalData.subtitle}
              </Typography>
            </Box>
            <IconButton
              onClick={() => setAmountsModal({ open: false, item: null })}
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#eff6ff",
                border: "1px solid #dbeafe",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Total Amount Payable
              </Typography>
              <Typography variant="h6" fontWeight={700} color="#2563eb">
                {formatPKR(activeModalData.payable)}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#f0fdf4",
                border: "1px solid #dcfce7",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Total Amount Received
              </Typography>
              <Typography variant="h6" fontWeight={700} color="#16a34a">
                {formatPKR(activeModalData.received)}
              </Typography>
            </Box>

            <Divider />

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Total Balance (Pending Amount)
              </Typography>
              <Typography
                variant="h6"
                fontWeight={700}
                color={activeModalData.balance > 0 ? "#dc2626" : "#16a34a"}
              >
                {formatPKR(activeModalData.balance)}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={() => setAmountsModal({ open: false, item: null })}
            sx={{ bgcolor: "#2563eb", textTransform: "none", boxShadow: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* [BLOCK 7 END: ADD / EDIT & AMOUNTS DIALOGS] */}
    </Box>
  );
}