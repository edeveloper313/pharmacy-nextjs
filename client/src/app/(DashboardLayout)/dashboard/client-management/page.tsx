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
  PeopleOutlined,
  PersonAddOutlined,
  Close,
  Refresh,
} from "@mui/icons-material";

// Make sure these paths match your project structure
import SuccessAlert from "@/app/components/SuccessAlert";
import ErrorAlert from "@/app/components/ErrorAlert";
import { AlertState } from "@/app/components/types/types";

// ============================================
// INITIAL DATA
// ============================================
const initialClients = [
  {
    id: 1,
    name: "John Doe",
    phone: "0300-1234567",
    email: "john.doe@example.com",
    cnic: "42101-1234567-1",
    address: "House 123, Street 4, Clifton, Karachi",
    type: "Regular",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "0321-7654321",
    email: "jane.smith@example.com",
    cnic: "35202-7654321-2",
    address: "Flat 4B, Gulberg III, Lahore",
    type: "VIP",
    status: "Active",
  },
  {
    id: 3,
    name: "Ali Khan",
    phone: "0333-5555555",
    email: "ali.khan@example.com",
    cnic: "61101-5555555-3",
    address: "Sector F-10, Islamabad",
    type: "Regular",
    status: "Active",
  },
  {
    id: 4,
    name: "Dr. Sarah Ahmed",
    phone: "0345-9998888",
    email: "sarah.ahmed@hospital.com",
    cnic: "37405-9998888-4",
    address: "CMH Rawalpindi",
    type: "Corporate",
    status: "Active",
  },
  {
    id: 5,
    name: "Bilal Hussain",
    phone: "0311-4443333",
    email: "bilal.h@example.com",
    cnic: "38403-4443333-5",
    address: "Satellite Town, Gujranwala",
    type: "Regular",
    status: "Inactive",
  },
];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  cnic: "",
  address: "",
  type: "Regular",
  status: "Active",
};

// ============================================
// SORTING FUNCTIONS
// ============================================
const descendingComparator = (a, b, orderBy) => {
  const first = a[orderBy] ?? "";
  const second = b[orderBy] ?? "";

  return String(second).localeCompare(String(first), undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export default function ClientManagementPage() {
  const [clients, setClients] = useState(initialClients);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

    const [order, setOrder] = useState<"asc" | "desc">("desc");

  const [orderBy, setOrderBy] = useState("name");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

   const [alert, setAlert] = useState<{ type: AlertColor; message: string } | null>(null);

  const showAlert = (type: AlertState['type'], message: string) => {
    setAlert({ type, message });
  };

  // ==========================================
  // FILTERING & SORTING
  // ==========================================
  const filteredClients = useMemo(() => {
    const result = clients.filter((c) => {
      const keyword = search.toLowerCase();
      const searchMatch = [
        c.name,
        c.phone,
        c.email,
        c.cnic,
        c.address,
      ].some((value) => String(value || "").toLowerCase().includes(keyword));

      const typeMatch = typeFilter === "all" || c.type === typeFilter;
      const statusMatch = statusFilter === "all" || c.status === statusFilter;

      return searchMatch && typeMatch && statusMatch;
    });

    return [...result].sort(getComparator(order, orderBy));
  }, [clients, search, typeFilter, statusFilter, order, orderBy]);

  const paginatedClients = filteredClients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setForm({ ...client });
    setDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const requiredFields = ["name", "phone"];
    if (requiredFields.some((key) => String(form[key] ?? "").trim() === "")) {
      return showAlert("error", "Name and Phone are required fields.");
    }

    // Optional: Prevent duplicate phone numbers
    if (clients.some((c) => c.phone === form.phone.trim() && c.id !== editingId)) {
      return showAlert("error", "A client with this phone number already exists.");
    }

    const clientData = {
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      cnic: form.cnic.trim(),
      address: form.address.trim(),
    };

    if (editingId !== null) {
      setClients((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...clientData } : c)));
      showAlert("success", "Client updated successfully!");
    } else {
      setClients((prev) => [{ ...clientData, id: Date.now() }, ...prev]);
      setPage(0);
      showAlert("success", "Client added successfully!");
    }

    setDialogOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    setClients((prev) => prev.filter((c) => c.id !== id));
    setPage(0);
    showAlert("success", "Client deleted successfully!");
  };

  const handleReset = () => {
    setSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
    setOrder("asc");
    setOrderBy("name");
    setPage(0);
  };

  // ==========================================
  // TABLE COLUMNS
  // ==========================================
  const columns = [
    { id: "name", label: "Client Name" },
    { id: "phone", label: "Contact Info" },
    { id: "cnic", label: "CNIC" },
    { id: "type", label: "Client Type" },
    { id: "status", label: "Status" },
  ];

  return (
    <Box
      sx={{
        pb: 4,
        width: "100%",
        maxWidth: "100%",
        minWidth: 0, // Prevents flexbox overflow
        overflowX: "hidden", // Forces no horizontal scrollbar on the page
        boxSizing: "border-box",
      }}
    >
      {alert?.type === "success" && <SuccessAlert key={alert.message} message={alert.message} />}
      {alert?.type === "error" && <ErrorAlert key={alert.message} message={alert.message} />}

      {/* HEADER */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1e293b">
            Client Management
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Manage your customers, contact details, and records.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          sx={{
            bgcolor: "#2563eb",
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "none",
            px: 2.5,
            whiteSpace: "nowrap",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Add New Client
        </Button>
      </Stack>

      {/* CLIENT ENTRY FORM */}
      <Card elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, mb: 3, width: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}>
              <PeopleOutlined />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Client Entry
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Add new customer information.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* CSS GRID FOR RESPONSIVE LAYOUT WITHOUT SCROLLBARS */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography fontWeight={700} color="#2563eb">
                Basic Information
              </Typography>
            </Box>

            <TextField fullWidth size="small" label="Full Name *" name="name" value={form.name} onChange={handleChange} placeholder="e.g. John Doe" />
            <TextField fullWidth size="small" label="Phone Number *" name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 0300-1234567" />
            <TextField fullWidth size="small" label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. example@mail.com" />
            <TextField fullWidth size="small" label="CNIC / ID Number" name="cnic" value={form.cnic} onChange={handleChange} placeholder="e.g. 42101-1234567-1" />
            
            <Box sx={{ gridColumn: "1 / -1" }}>
              <TextField fullWidth size="small" label="Residential Address" name="address" value={form.address} onChange={handleChange} placeholder="e.g. House 123, Street 4, City" />
            </Box>

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography fontWeight={700} color="#2563eb">
                Classification
              </Typography>
            </Box>

            <TextField fullWidth size="small" select label="Client Type" name="type" value={form.type} onChange={handleChange}>
              <MenuItem value="Regular">Regular</MenuItem>
              <MenuItem value="VIP">VIP</MenuItem>
              <MenuItem value="Corporate">Corporate</MenuItem>
            </TextField>
            
            <TextField fullWidth size="small" select label="Status" name="status" value={form.status} onChange={handleChange}>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" spacing={1.5}>
                <Button variant="outlined" color="inherit" onClick={() => setForm(emptyForm)} startIcon={<Refresh />} sx={{ textTransform: "none", borderRadius: 2 }}>
                  Reset Form
                </Button>
                <Button variant="contained" startIcon={<PersonAddOutlined />} onClick={handleSave} sx={{ bgcolor: "#2563eb", textTransform: "none", borderRadius: 2, boxShadow: "none" }}>
                  Save Client
                </Button>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* CLIENT DATA TABLE */}
      <Card elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, width: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box mb={2.5}>
            <Typography variant="h6" fontWeight={700}>
              Client List
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search, sort, filter and manage your clients.
            </Typography>
          </Box>

          {/* SEARCH AND FILTER */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "2fr 1fr 1fr auto" },
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search name, phone, email, CNIC..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Client Type</InputLabel>
              <Select value={typeFilter} label="Client Type" onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="Regular">Regular</MenuItem>
                <MenuItem value="VIP">VIP</MenuItem>
                <MenuItem value="Corporate">Corporate</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Reset Filters">
                <Button fullWidth variant="outlined" onClick={handleReset} sx={{ height: 40, minWidth: 40 }}>
                  <Refresh />
                </Button>
              </Tooltip>
            </Box>
          </Box>

          {/* TABLE */}
          <TableContainer
            sx={{
              overflowX: "auto",
              maxWidth: "100%",
              "&::-webkit-scrollbar": { height: 8 },
              "&::-webkit-scrollbar-thumb": { bgcolor: "#cbd5e1", borderRadius: 4 },
            }}
          >
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  {columns.map((column) => (
                    <TableCell key={column.id} sx={{ fontWeight: 700, color: "#475569", whiteSpace: "nowrap" }}>
                      <TableSortLabel active={orderBy === column.id} direction={orderBy === column.id ? order : "asc"} onClick={() => handleSort(column.id)}>
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedClients.map((client) => {
                  const isActive = client.status === "Active";
                  return (
                    <TableRow key={client.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}>
                            {client.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={700} variant="body2">{client.name}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "block", md: "none" } }}>
                              {client.phone}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{client.phone}</Typography>
                        <Typography variant="caption" color="text.secondary">{client.email || "-"}</Typography>
                      </TableCell>
                      
                      <TableCell>{client.cnic || "-"}</TableCell>
                      
                      <TableCell>
                        <Chip 
                          size="small" 
                          label={client.type} 
                          variant="outlined" 
                          color={client.type === "VIP" ? "warning" : client.type === "Corporate" ? "secondary" : "default"}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Chip size="small" color={isActive ? "success" : "default"} label={client.status} />
                      </TableCell>
                      
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleEdit(client)} sx={{ color: "#2563eb" }}>
                              <EditOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(client.id)} sx={{ color: "#dc2626" }}>
                              <DeleteOutline fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {filteredClients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <PeopleOutlined sx={{ fontSize: 45, color: "#94a3b8", mb: 1 }} />
                      <Typography fontWeight={700}>No Clients Found</Typography>
                      <Typography variant="body2" color="text.secondary">Try another search or filter.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* PAGINATION */}
          <TablePagination
            component="div"
            count={filteredClients.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
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

      {/* EDIT CLIENT DIALOG */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 3, mx: 2, width: "100%" } }}>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography fontWeight={700} variant="h6">Edit Client</Typography>
              <Typography variant="caption" color="text.secondary">Update client information.</Typography>
            </Box>
            <IconButton onClick={() => setDialogOpen(false)}><Close /></IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField fullWidth size="small" label="Full Name *" name="name" value={form.name} onChange={handleChange} />
            <TextField fullWidth size="small" label="Phone Number *" name="phone" value={form.phone} onChange={handleChange} />
            <TextField fullWidth size="small" label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} />
            <TextField fullWidth size="small" label="CNIC / ID Number" name="cnic" value={form.cnic} onChange={handleChange} />
            
            <Box sx={{ gridColumn: "1 / -1" }}>
              <TextField fullWidth size="small" label="Residential Address" name="address" value={form.address} onChange={handleChange} />
            </Box>

            <TextField fullWidth size="small" select label="Client Type" name="type" value={form.type} onChange={handleChange}>
              <MenuItem value="Regular">Regular</MenuItem>
              <MenuItem value="VIP">VIP</MenuItem>
              <MenuItem value="Corporate">Corporate</MenuItem>
            </TextField>
            
            <TextField fullWidth size="small" select label="Status" name="status" value={form.status} onChange={handleChange}>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#2563eb", textTransform: "none", boxShadow: "none" }}>Update Client</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}