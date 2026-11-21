"use client";

import React, { useMemo, useState } from "react";
import {
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
  GridLegacy,
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
  DeleteOutline,
  EditOutlined,
  Inventory2Outlined,
  SearchOutlined,
  VisibilityOutlined,
  ReceiptLongOutlined,
  SaveOutlined,
  AddOutlined,
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

type PuchaseEntry = {
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

type PuchaseOrder = {
  id: string;
  orderNumber: string;
  orderDate: string;
  customer: Customer;
  entries: PuchaseEntry[];
};

type EntryForm = {
  serialNumber: string;
  quantity: string;
  tp: string;
  discount: string;
};

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

const money = (value: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2,
  }).format(value || 0);

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

const sumOrder = (entries: PuchaseEntry[]) => ({
  totalQuantity: entries.reduce((sum, item) => sum + item.quantity, 0),
  totalDiscount: entries.reduce((sum, item) => sum + item.discountAmount, 0),
  grandTotal: entries.reduce((sum, item) => sum + item.lineTotal, 0),
});

const demoOrders: PuchaseOrder[] = [
  {
    id: "ORD-001",
    orderNumber: "SO-481205",
    orderDate: "2026-11-18",
    customer: customers[0],
    entries: [
      {
        id: 1,
        serialNumber: "SR-51001",
        productName: "Paracetamol 500mg",
        productId: "PRD-1001",
        currentStock: 420,
        isMasterProduct: true,
        regularPrice: null,
        quantity: 30,
        tp: 175,
        discountPercent: 0,
        discountAmount: 0,
        lineTotal: 5250,
      },
      {
        id: 2,
        serialNumber: "SR-51002",
        productName: "Vitamin C 500mg",
        productId: "PRD-1003",
        currentStock: 95,
        isMasterProduct: false,
        regularPrice: 240,
        quantity: 12,
        tp: 250,
        discountPercent: 5,
        discountAmount: 150,
        lineTotal: 2850,
      },
    ],
  },
  {
    id: "ORD-002",
    orderNumber: "SO-481206",
    orderDate: "2026-11-19",
    customer: customers[1],
    entries: [
      {
        id: 3,
        serialNumber: "SR-51003",
        productName: "Amoxicillin 250mg",
        productId: "PRD-1002",
        currentStock: 180,
        isMasterProduct: true,
        regularPrice: null,
        quantity: 20,
        tp: 310,
        discountPercent: 0,
        discountAmount: 0,
        lineTotal: 6200,
      },
      {
        id: 4,
        serialNumber: "SR-51004",
        productName: "Digital Thermometer",
        productId: "PRD-1008",
        currentStock: 45,
        isMasterProduct: false,
        regularPrice: 950,
        quantity: 4,
        tp: 980,
        discountPercent: 0,
        discountAmount: 0,
        lineTotal: 3920,
      },
    ],
  },
  {
    id: "ORD-003",
    orderNumber: "SO-481207",
    orderDate: "2026-11-20",
    customer: customers[3],
    entries: [
      {
        id: 5,
        serialNumber: "SR-51005",
        productName: "Vitamin C 500mg",
        productId: "PRD-1003",
        currentStock: 95,
        isMasterProduct: true,
        regularPrice: null,
        quantity: 15,
        tp: 225,
        discountPercent: 2,
        discountAmount: 67.5,
        lineTotal: 3307.5,
      },
    ],
  },
];

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

export default function PuchaseProductListPage() {
  const [orders, setOrders] = useState<PuchaseOrder[]>(demoOrders);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "date" | "customer" | "amount" | "items"
  >("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [viewOrder, setViewOrder] = useState<PuchaseOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<PuchaseOrder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PuchaseOrder | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [messageId, setMessageId] = useState(0);

  const notify = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setMessageId((value) => value + 1);
  };

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = orders.filter((order) =>
      [
        order.orderNumber,
        order.customer.name,
        order.customer.id,
        order.customer.city,
        ...order.entries.map(
          (entry) => `${entry.productName} ${entry.productId}`,
        ),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date")
        comparison = a.orderDate.localeCompare(b.orderDate);
      if (sortBy === "customer")
        comparison = a.customer.name.localeCompare(b.customer.name);
      if (sortBy === "amount")
        comparison =
          sumOrder(a.entries).grandTotal - sumOrder(b.entries).grandTotal;
      if (sortBy === "items") comparison = a.entries.length - b.entries.length;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [orders, search, sortBy, sortDirection]);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setOrders((current) =>
      current.filter((order) => order.id !== deleteTarget.id),
    );
    setDeleteTarget(null);
    notify("success", "Puchase order deleted successfully.");
  };

  const saveUpdatedOrder = (updated: PuchaseOrder) => {
    setOrders((current) =>
      current.map((order) => (order.id === updated.id ? updated : order)),
    );
    setEditingOrder(null);
    notify("success", "Puchase order updated successfully.");
  };

  return (
    <Box sx={{ width: "100%", minWidth: 0, overflowX: "hidden", pb: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={1.5}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color="#1e293b">
            Puchase Product List
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Browse purchase orders, review customer-wise details, and manage order
            entries.
          </Typography>
        </Box>
        <Chip
          label={`${orders.length} PURCHASE ORDERS`}
          sx={{
            bgcolor: "#eff6ff",
            color: "#2563eb",
            fontWeight: 700,
            width: "fit-content",
            borderRadius: 2,
          }}
        />
      </Stack>

      <Card sx={cardSx}>
        <CardContent
          sx={{ p: { xs: 2, sm: 3, md: 3.5 }, "&:last-child": { pb: 3.5 } }}
        >
          <Stack spacing={2.5}>
            <SectionHeading
              icon={<ReceiptLongOutlined />}
              title="Puchase Order Summary"
              subtitle="Search and sort orders. Open View to see complete customer and product details."
            />
            <GridLegacy container spacing={2}>
              <GridLegacy item xs={12} md={7}>
                <TextField
                  fullWidth
                  size="small"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search order number, customer, product or ID..."
                  aria-label="Search purchase orders"
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlined fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </GridLegacy>
              <GridLegacy item xs={8} md={3}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Sort By"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as typeof sortBy)
                  }
                  sx={fieldSx}
                  SelectProps={{ native: false }}
                >
                  <MenuItem value="date">Order Date</MenuItem>
                  <MenuItem value="customer">Customer Name</MenuItem>
                  <MenuItem value="amount">Grand Total</MenuItem>
                  <MenuItem value="items">Total Items</MenuItem>
                </TextField>
              </GridLegacy>
              <GridLegacy item xs={4} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() =>
                    setSortDirection((value) =>
                      value === "asc" ? "desc" : "asc",
                    )
                  }
                  sx={{
                    height: 40,
                    borderRadius: 2,
                    textTransform: "none",
                    borderColor: "#cbd5e1",
                    color: "#334155",
                  }}
                >
                  {sortDirection === "asc" ? "Ascending" : "Descending"}
                </Button>
              </GridLegacy>
            </GridLegacy>

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
              <Table size="small" aria-label="Puchase orders summary">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8fafc" }}>
                    {[
                      ["Order Details", "18%"],
                      ["Customer", "25%"],
                      ["Items / Quantity / Discount", "23%"],
                      ["Grand Total", "16%"],
                      ["Actions", "18%"],
                    ].map(([label, width]) => (
                      <TableCell
                        key={label}
                        sx={{
                          width,
                          fontWeight: 700,
                          color: "#475569",
                          fontSize: 12,
                          whiteSpace: "normal",
                        }}
                      >
                        {label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleOrders.map((order) => {
                    const summary = sumOrder(order.entries);
                    return (
                      <TableRow key={order.id} hover>
                        <TableCell>
                          <Typography
                            fontWeight={800}
                            color="#1e293b"
                            fontSize={13}
                          >
                            {order.orderNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.orderDate}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={700} fontSize={13}>
                            {order.customer.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.customer.id} · {order.customer.city}
                          </Typography>
                          <Box mt={0.5}>
                            <Chip
                              size="small"
                              label={order.customer.type}
                              sx={{
                                height: 22,
                                bgcolor: "#eff6ff",
                                color: "#1d4ed8",
                                fontWeight: 600,
                                maxWidth: "100%",
                                "& .MuiChip-label": {
                                  whiteSpace: "normal",
                                  px: 1,
                                },
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography fontSize={12}>
                            <b>Items:</b> {order.entries.length}
                          </Typography>
                          <Typography fontSize={12}>
                            <b>Quantity:</b> {summary.totalQuantity}
                          </Typography>
                          <Typography fontSize={12}>
                            <b>Discount:</b> {money(summary.totalDiscount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            fontWeight={800}
                            color="#2563eb"
                            fontSize={13}
                          >
                            {money(summary.grandTotal)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={0.75}
                            useFlexGap
                            flexWrap="wrap"
                            alignItems="center"
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<VisibilityOutlined />}
                              onClick={() => setViewOrder(order)}
                              sx={{
                                minWidth: 0,
                                px: 1,
                                borderRadius: 2,
                                textTransform: "none",
                                fontSize: 12,
                              }}
                            >
                              View
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<EditOutlined />}
                              onClick={() =>
                                setEditingOrder({
                                  ...order,
                                  entries: order.entries.map((entry) => ({
                                    ...entry,
                                  })),
                                })
                              }
                              sx={{
                                minWidth: 0,
                                px: 1,
                                bgcolor: "#2563eb",
                                borderRadius: 2,
                                textTransform: "none",
                                fontSize: 12,
                                boxShadow: "none",
                                "&:hover": {
                                  bgcolor: "#1d4ed8",
                                  boxShadow: "none",
                                },
                              }}
                            >
                              Update
                            </Button>
                            <Tooltip title="Delete purchase order">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setDeleteTarget(order)}
                                sx={{
                                  border: "1px solid #fecaca",
                                  borderRadius: 2,
                                }}
                                aria-label={`Delete ${order.orderNumber}`}
                              >
                                <DeleteOutline fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {visibleOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography fontWeight={700} color="#475569">
                          No purchase orders found
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Try another search term.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(viewOrder)}
        onClose={() => setViewOrder(null)}
        fullWidth
        maxWidth="md"
      >
        {viewOrder && (
          <>
            <DialogTitle sx={{ pr: 7 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography fontWeight={800} fontSize={18}>
                    Puchase Order Details
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {viewOrder.orderNumber}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setViewOrder(null)}
                  aria-label="Close details"
                >
                  <CloseOutlined />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2.5}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#f8fbff",
                    border: "1px solid #dbeafe",
                    borderRadius: 2,
                  }}
                >
                  <SectionHeading
                    icon={<BusinessOutlined />}
                    title="Customer Information"
                    subtitle="Customer and order header details"
                  />
                  <GridLegacy container spacing={1.5}>
                    <GridLegacy item xs={12} sm={6}>
                      <Typography variant="body2">
                        <b>Customer:</b> {viewOrder.customer.name}
                      </Typography>
                    </GridLegacy>
                    <GridLegacy item xs={12} sm={6}>
                      <Typography variant="body2">
                        <b>Customer ID:</b> {viewOrder.customer.id}
                      </Typography>
                    </GridLegacy>
                    <GridLegacy item xs={12} sm={6}>
                      <Typography variant="body2">
                        <b>Type:</b> {viewOrder.customer.type}
                      </Typography>
                    </GridLegacy>
                    <GridLegacy item xs={12} sm={6}>
                      <Typography variant="body2">
                        <b>Phone:</b> {viewOrder.customer.phone}
                      </Typography>
                    </GridLegacy>
                    <GridLegacy item xs={12} sm={6}>
                      <Typography variant="body2">
                        <b>City:</b> {viewOrder.customer.city}
                      </Typography>
                    </GridLegacy>
                    <GridLegacy item xs={12} sm={6}>
                      <Typography variant="body2">
                        <b>Order Date:</b> {viewOrder.orderDate}
                      </Typography>
                    </GridLegacy>
                  </GridLegacy>
                </Box>
                <Box>
                  <SectionHeading
                    icon={<Inventory2Outlined />}
                    title="Product Details"
                    subtitle="All products included in this purchase order"
                  />
                  <OrderEntriesTable entries={viewOrder.entries} />
                </Box>
                <OrderTotals entries={viewOrder.entries} />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setViewOrder(null)}
                variant="contained"
                sx={{
                  bgcolor: "#2563eb",
                  textTransform: "none",
                  borderRadius: 2,
                  boxShadow: "none",
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog
        open={Boolean(editingOrder)}
        onClose={() => setEditingOrder(null)}
        fullWidth
        maxWidth="lg"
        scroll="paper"
      >
        {editingOrder && (
          <OrderUpdateDialog
            order={editingOrder}
            onCancel={() => setEditingOrder(null)}
            onSave={saveUpdatedOrder}
          />
        )}
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this purchase order? This action cannot
            be undone.
          </Typography>
          {deleteTarget && (
            <Typography fontWeight={700} mt={1}>
              {deleteTarget.orderNumber} · {deleteTarget.customer.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            No, Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteOutline />}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {message && (
        <Box sx={{ mt: 2 }}>
          <Alert key={messageId} message={message.text} type={message.type} />
        </Box>
      )}
    </Box>
  );
}

function OrderEntriesTable({ entries }: { entries: PuchaseEntry[] }) {
  return (
    <TableContainer
      sx={{ border: "1px solid #e8edf3", borderRadius: 2, overflowX: "auto" }}
    >
      <Table size="small" sx={{ minWidth: 850 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: "#f8fafc" }}>
            {[
              "Serial #",
              "Product",
              "Product ID",
              "Product Type",
              "Qty",
              "Regular Price",
              "Puchase Price",
              "Discount",
              "Line Total",
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
              <TableCell sx={{ whiteSpace: "nowrap", fontSize: 12 }}>
                {entry.serialNumber}
              </TableCell>
              <TableCell sx={{ minWidth: 150, fontSize: 12 }}>
                {entry.productName}
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", fontSize: 12 }}>
                {entry.productId}
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={entry.isMasterProduct ? "Master" : "Normal"}
                  color={entry.isMasterProduct ? "primary" : "default"}
                />
              </TableCell>
              <TableCell sx={{ fontSize: 12 }}>{entry.quantity}</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", fontSize: 12 }}>
                {entry.regularPrice === null ? "—" : money(entry.regularPrice)}
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", fontSize: 12 }}>
                {money(entry.tp)}
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", fontSize: 12 }}>
                {entry.discountPercent}% ({money(entry.discountAmount)})
              </TableCell>
              <TableCell
                sx={{ whiteSpace: "nowrap", fontSize: 12, fontWeight: 700 }}
              >
                {money(entry.lineTotal)}
              </TableCell>
            </TableRow>
          ))}
          {entries.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} align="center">
                No product entries.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function OrderTotals({ entries }: { entries: PuchaseEntry[] }) {
  const totals = sumOrder(entries);
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#f8fafc",
        border: "1px solid #e8edf3",
        borderRadius: 2,
      }}
    >
      <GridLegacy container spacing={2}>
        <GridLegacy item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary">
            Total Items
          </Typography>
          <Typography fontWeight={700}>{entries.length}</Typography>
        </GridLegacy>
        <GridLegacy item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary">
            Total Quantity
          </Typography>
          <Typography fontWeight={700}>{totals.totalQuantity}</Typography>
        </GridLegacy>
        <GridLegacy item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary">
            Total Discount
          </Typography>
          <Typography fontWeight={700}>
            {money(totals.totalDiscount)}
          </Typography>
        </GridLegacy>
        <GridLegacy item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary">
            Grand Total
          </Typography>
          <Typography fontWeight={800} color="#2563eb">
            {money(totals.grandTotal)}
          </Typography>
        </GridLegacy>
      </GridLegacy>
    </Box>
  );
}

function OrderUpdateDialog({
  order,
  onCancel,
  onSave,
}: {
  order: PuchaseOrder;
  onCancel: () => void;
  onSave: (order: PuchaseOrder) => void;
}) {
  const [customer, setCustomer] = useState<Customer>(order.customer);
  const [orderDate, setOrderDate] = useState(order.orderDate);
  const [entries, setEntries] = useState<PuchaseEntry[]>(order.entries);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<EntryForm>({
    serialNumber: `SR-${Math.floor(10000 + Math.random() * 90000)}`,
    quantity: "",
    tp: "",
    discount: "",
  });
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const master = Boolean(
    customer &&
    selectedProduct &&
    (masterProductsByCustomer[customer.id] || []).includes(selectedProduct.id),
  );
  const regularPrice = selectedProduct?.defaultPrice ?? 0;
  const usedQty = selectedProduct
    ? entries
        .filter(
          (entry) =>
            entry.productId === selectedProduct.id &&
            entry.id !== editingEntryId,
        )
        .reduce((sum, entry) => sum + entry.quantity, 0)
    : 0;
  const stock = selectedProduct
    ? Math.max(0, selectedProduct.stock - usedQty)
    : 0;
  const qty = Number(form.quantity) || 0;
  const price = Number(form.tp) || 0;
  const discountPercent = Number(form.discount) || 0;
  const gross = qty * price;
  const discountAmount = (gross * discountPercent) / 100;
  const lineTotal = Math.max(0, gross - discountAmount);
  const stockExceeded = Boolean(selectedProduct && qty > stock);
  const belowRegularPrice = Boolean(
    selectedProduct && !master && form.tp !== "" && price < regularPrice,
  );

  const selectProduct = (product: Product | null) => {
    setSelectedProduct(product);
    setEditingEntryId(null);
    setError("");
    if (!product) {
      setForm((current) => ({
        ...current,
        quantity: "",
        tp: "",
        discount: "",
      }));
      return;
    }
    const isMaster = (masterProductsByCustomer[customer.id] || []).includes(
      product.id,
    );
    const fixedPrice =
      masterPricesByCustomer[customer.id]?.[product.id] ?? product.defaultPrice;
    setForm({
      serialNumber: `SR-${Math.floor(10000 + Math.random() * 90000)}`,
      quantity: "",
      tp: String(isMaster ? fixedPrice : product.defaultPrice),
      discount: "",
    });
  };

  const startEditEntry = (entry: PuchaseEntry) => {
    const product =
      products.find((item) => item.id === entry.productId) || null;
    if (!product) return;
    setSelectedProduct(product);
    setEditingEntryId(entry.id);
    setForm({
      serialNumber: entry.serialNumber,
      quantity: String(entry.quantity),
      tp: String(entry.tp),
      discount: String(entry.discountPercent),
    });
    setError("");
  };

  const saveLine = () => {
    if (!selectedProduct) {
      setError("Please select a product.");
      return;
    }
    if (
      !form.quantity ||
      !form.tp ||
      qty <= 0 ||
      price < 0 ||
      discountPercent < 0 ||
      discountPercent > 100
    ) {
      setError("Please enter a valid quantity, price and discount.");
      return;
    }
    if (stockExceeded) {
      setError("Selected quantity exceeds the available stock quantity.");
      return;
    }
    if (belowRegularPrice) {
      setError(
        `Puchase price cannot be less than the regular price (${money(regularPrice)}).`,
      );
      return;
    }
    const isMaster = (masterProductsByCustomer[customer.id] || []).includes(
      selectedProduct.id,
    );
    const masterPrice =
      masterPricesByCustomer[customer.id]?.[selectedProduct.id] ??
      selectedProduct.defaultPrice;
    const finalPrice = isMaster ? masterPrice : price;
    if (isMaster && price !== masterPrice) {
      setError("Master Product price is fixed and cannot be changed.");
      return;
    }
    const newEntry: PuchaseEntry = {
      id: editingEntryId ?? Date.now(),
      serialNumber: form.serialNumber,
      productName: selectedProduct.name,
      productId: selectedProduct.id,
      currentStock: stock,
      isMasterProduct: isMaster,
      regularPrice: isMaster ? null : regularPrice,
      quantity: qty,
      tp: finalPrice,
      discountPercent,
      discountAmount: (qty * finalPrice * discountPercent) / 100,
      lineTotal: Math.max(0, qty * finalPrice * (1 - discountPercent / 100)),
    };
    setEntries((current) =>
      editingEntryId === null
        ? [...current, newEntry]
        : current.map((entry) =>
            entry.id === editingEntryId ? newEntry : entry,
          ),
    );
    setSelectedProduct(null);
    setEditingEntryId(null);
    setForm({
      serialNumber: `SR-${Math.floor(10000 + Math.random() * 90000)}`,
      quantity: "",
      tp: "",
      discount: "",
    });
    setError("");
  };

  const removeLine = (id: number) =>
    setEntries((current) => current.filter((entry) => entry.id !== id));

  const saveOrder = () => {
    if (entries.length === 0) {
      setError("A purchase order must contain at least one product.");
      return;
    }
    onSave({ ...order, customer, orderDate, entries });
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
              Update Puchase Order
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {order.orderNumber}
            </Typography>
          </Box>
          <IconButton onClick={onCancel} aria-label="Close update dialog">
            <CloseOutlined />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          <Box>
            <SectionHeading
              icon={<BusinessOutlined />}
              title="Customer & Order Information"
              subtitle="Customer selection determines the Master Product rules."
            />
            <GridLegacy container spacing={2}>
              <GridLegacy item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  options={customers}
                  value={customer}
                  onChange={(_, value) => {
                    if (!value) return;
                    setCustomer(value);
                    setSelectedProduct(null);
                    setEditingEntryId(null);
                    setForm({
                      serialNumber: `SR-${Math.floor(10000 + Math.random() * 90000)}`,
                      quantity: "",
                      tp: "",
                      discount: "",
                    });
                    setEntries((current) =>
                      current.map((entry) => {
                        const product = products.find(
                          (item) => item.id === entry.productId,
                        );
                        if (!product) return entry;
                        const isMaster = (
                          masterProductsByCustomer[value.id] || []
                        ).includes(product.id);
                        const fixedPrice =
                          masterPricesByCustomer[value.id]?.[product.id] ??
                          product.defaultPrice;
                        const updatedPrice = isMaster
                          ? fixedPrice
                          : Math.max(entry.tp, product.defaultPrice);
                        const grossAmount = entry.quantity * updatedPrice;
                        const discountAmount =
                          (grossAmount * entry.discountPercent) / 100;
                        return {
                          ...entry,
                          isMasterProduct: isMaster,
                          regularPrice: isMaster ? null : product.defaultPrice,
                          tp: updatedPrice,
                          currentStock: product.stock,
                          discountAmount,
                          lineTotal: Math.max(0, grossAmount - discountAmount),
                        };
                      }),
                    );
                    setError(
                      "Customer changed. Product Master status and prices have been recalculated for the selected customer.",
                    );
                  }}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Customer"
                      sx={fieldSx}
                    />
                  )}
                />
              </GridLegacy>
              <GridLegacy item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Order Date"
                  value={orderDate}
                  onChange={(event) => setOrderDate(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={fieldSx}
                />
              </GridLegacy>
            </GridLegacy>
          </Box>
          <Divider />
          <Box>
            <SectionHeading
              icon={<Inventory2Outlined />}
              title="Product Entry"
              subtitle="Apply the same customer-wise Master Product, price and stock rules as Puchase Order Entry."
            />
            <GridLegacy container spacing={2}>
              <GridLegacy item xs={12} sm={6}>
                <Autocomplete
                  fullWidth
                  options={products}
                  value={selectedProduct}
                  onChange={(_, value) => selectProduct(value)}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  filterOptions={(options, state) =>
                    options.filter((option) =>
                      `${option.name} ${option.id}`
                        .toLowerCase()
                        .includes(state.inputValue.toLowerCase()),
                    )
                  }
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    const isMaster = (
                      masterProductsByCustomer[customer.id] || []
                    ).includes(option.id);
                    return (
                      <Box
                        component="li"
                        key={key}
                        {...optionProps}
                        sx={{
                          display: "flex !important",
                          flexDirection: "column",
                          alignItems: "stretch",
                          justifyContent: "center",
                          gap: 0.25,
                          px: 1.5,
                          py: 1,
                          width: "100%",
                          textAlign: "left",
                        }}
                      >
                        <Typography
                          fontWeight={600}
                          fontSize={13}
                          sx={{
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {option.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {option.id} · Stock: {option.stock}
                          {isMaster ? " · Master" : ""}
                        </Typography>
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      size="small"
                      label="Search Product"
                      placeholder="Type product name or ID..."
                      sx={fieldSx}
                    />
                  )}
                />
              </GridLegacy>
              <GridLegacy item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Serial Number / ID"
                  value={form.serialNumber}
                  InputProps={{ readOnly: true }}
                  sx={fieldSx}
                />
              </GridLegacy>
              {selectedProduct && (
                <>
                  <GridLegacy item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Product ID"
                      value={selectedProduct.id}
                      InputProps={{ readOnly: true }}
                      sx={fieldSx}
                    />
                  </GridLegacy>
                  <GridLegacy item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Current Stock Qty"
                      value={stock}
                      InputProps={{ readOnly: true }}
                      sx={fieldSx}
                    />
                  </GridLegacy>
                  {!master && (
                    <GridLegacy item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Regular Price"
                        value={money(regularPrice)}
                        InputProps={{ readOnly: true }}
                        sx={fieldSx}
                      />
                    </GridLegacy>
                  )}
                  <GridLegacy item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label={master ? "Price (Fixed)" : "Puchase Price"}
                      value={form.tp}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          tp: event.target.value,
                        }))
                      }
                      InputProps={{
                        readOnly: master,
                        startAdornment: (
                          <InputAdornment position="start">Rs</InputAdornment>
                        ),
                      }}
                      inputProps={{
                        min: master ? Number(form.tp) : regularPrice,
                        step: "0.01",
                      }}
                      helperText={
                        master
                          ? "Master Product price cannot be changed."
                          : "Puchase price must be equal to or greater than Regular Price."
                      }
                      sx={fieldSx}
                    />
                  </GridLegacy>
                  <GridLegacy item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Quantity"
                      value={form.quantity}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          quantity: event.target.value,
                        }))
                      }
                      inputProps={{ min: 1 }}
                      sx={fieldSx}
                    />
                  </GridLegacy>
                  <GridLegacy item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Discount (%)"
                      value={form.discount}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          discount: event.target.value,
                        }))
                      }
                      inputProps={{ min: 0, max: 100, step: "0.01" }}
                      sx={fieldSx}
                    />
                  </GridLegacy>
                  <GridLegacy item xs={12}>
                    <Stack
                      direction="row"
                      flexWrap="wrap"
                      gap={1}
                      alignItems="center"
                    >
                      {master && (
                        <Chip
                          size="small"
                          color="primary"
                          label="Master Product Selected"
                        />
                      )}
                      {stockExceeded && (
                        <Chip
                          size="small"
                          color="error"
                          label="Quantity exceeds available stock"
                        />
                      )}
                      {belowRegularPrice && (
                        <Chip
                          size="small"
                          color="error"
                          label="Price is below Regular Price"
                        />
                      )}
                    </Stack>
                  </GridLegacy>
                </>
              )}
              <GridLegacy item xs={12}>
                <Stack direction="row" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    startIcon={
                      editingEntryId === null ? (
                        <AddOutlined />
                      ) : (
                        <SaveOutlined />
                      )
                    }
                    onClick={saveLine}
                    disabled={!selectedProduct}
                    sx={{
                      bgcolor: "#2563eb",
                      borderRadius: 2,
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
                    }}
                  >
                    {editingEntryId === null ? "Add Product" : "Update Product"}
                  </Button>
                </Stack>
              </GridLegacy>
            </GridLegacy>
          </Box>
          <Divider />
          <Box>
            <SectionHeading
              icon={<ReceiptLongOutlined />}
              title="Order Products"
              subtitle="Edit or remove individual product lines before saving the order."
            />
            <TableContainer
              sx={{
                border: "1px solid #e8edf3",
                borderRadius: 2,
                overflowX: "auto",
              }}
            >
              <Table size="small" sx={{ minWidth: 820 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8fafc" }}>
                    {[
                      "Product",
                      "Product ID",
                      "Type",
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
                      <TableCell sx={{ fontSize: 12 }}>
                        {entry.productName}
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                        >
                          {entry.serialNumber}
                        </Typography>
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
                        <Tooltip title="Edit product">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => startEditEntry(entry)}
                          >
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove product">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeLine(entry.id)}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {entries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No products added to this order.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <OrderTotals entries={entries} />
          {error && <Alert message={error} type="error" />}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button
          onClick={onCancel}
          color="inherit"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={saveOrder}
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
          Save Changes
        </Button>
      </DialogActions>
    </>
  );
}
