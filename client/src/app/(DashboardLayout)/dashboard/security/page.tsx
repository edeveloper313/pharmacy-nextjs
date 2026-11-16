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
  SecurityOutlined,
  AdminPanelSettingsOutlined,
  Close,
  Refresh,
  LockOutlined,
  ShieldOutlined,
} from "@mui/icons-material";

// Make sure these paths match your project structure
import SuccessAlert from "@/app/components/SuccessAlert";
import ErrorAlert from "@/app/components/ErrorAlert";
import { AlertState } from "@/app/components/types/types";

// ============================================
// INITIAL DATA
// ============================================
const initialUsers = [
  {
    id: 1,
    name: "Dr. Sarah Ahmed",
    email: "sarah.ahmed@rxpilot.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2026-10-28 09:15 AM",
    ipAddress: "192.168.1.45",
  },
  {
    id: 2,
    name: "Ahmed Ali",
    email: "ahmed.ali@rxpilot.com",
    role: "Pharmacist",
    status: "Active",
    lastLogin: "2026-10-28 08:30 AM",
    ipAddress: "192.168.1.102",
  },
  {
    id: 3,
    name: "Usman Khan",
    email: "usman.khan@rxpilot.com",
    role: "Cashier",
    status: "Active",
    lastLogin: "2026-10-27 05:45 PM",
    ipAddress: "192.168.1.88",
  },
  {
    id: 4,
    name: "Bilal Ahmed",
    email: "bilal.ahmed@rxpilot.com",
    role: "Pharmacist",
    status: "Suspended",
    lastLogin: "2026-10-20 11:20 AM",
    ipAddress: "192.168.1.75",
  },
  {
    id: 5,
    name: "John Doe",
    email: "john.doe@rxpilot.com",
    role: "Manager",
    status: "Active",
    lastLogin: "2026-10-28 10:00 AM",
    ipAddress: "192.168.1.12",
  },
];

const emptyForm = {
  name: "",
  email: "",
  role: "Cashier",
  status: "Active",
  password: "",
  confirmPassword: "",
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

export default function SecurityPage() {
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [order, setOrder] = useState("asc");
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
  const filteredUsers = useMemo(() => {
    const result = users.filter((u) => {
      const keyword = search.toLowerCase();
      const searchMatch = [
        u.name,
        u.email,
        u.ipAddress,
      ].some((value) => String(value || "").toLowerCase().includes(keyword));

      const roleMatch = roleFilter === "all" || u.role === roleFilter;
      const statusMatch = statusFilter === "all" || u.status === statusFilter;

      return searchMatch && roleMatch && statusMatch;
    });

    return [...result].sort(getComparator(order, orderBy));
  }, [users, search, roleFilter, statusFilter, order, orderBy]);

  const paginatedUsers = filteredUsers.slice(
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

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({
      ...user,
      password: "",
      confirmPassword: "",
    });
    setDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const requiredFields = ["name", "email", "role"];
    if (requiredFields.some((key) => String(form[key] ?? "").trim() === "")) {
      return showAlert("error", "Please fill all required fields.");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      return showAlert("error", "Please enter a valid email address.");
    }

    // Check for duplicate email
    if (users.some((u) => u.email.toLowerCase() === form.email.trim().toLowerCase() && u.id !== editingId)) {
      return showAlert("error", "This email is already registered.");
    }

    // Password validation for new users
    if (editingId === null && !form.password) {
      return showAlert("error", "Password is required for new users.");
    }

    if (form.password && form.password.length < 6) {
      return showAlert("error", "Password must be at least 6 characters long.");
    }

    if (form.password !== form.confirmPassword) {
      return showAlert("error", "Passwords do not match.");
    }

    const userData = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: form.status,
    };

    if (editingId !== null) {
      setUsers((prev) => prev.map((u) => (u.id === editingId ? { ...u, ...userData } : u)));
      showAlert("success", form.password ? "User and password updated successfully!" : "User details updated successfully!");
    } else {
      const newUser = {
        ...userData,
        id: Date.now(),
        lastLogin: "Never",
        ipAddress: "N/A",
      };
      setUsers((prev) => [newUser, ...prev]);
      setPage(0);
      showAlert("success", "User created successfully!");
    }

    setDialogOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to revoke access for this user?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setPage(0);
    showAlert("success", "User access revoked!");
  };

  const handleReset = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
    setOrder("asc");
    setOrderBy("name");
    setPage(0);
  };

  // ==========================================
  // TABLE COLUMNS
  // ==========================================
  const columns = [
    { id: "name", label: "User" },
    { id: "role", label: "Role" },
    { id: "status", label: "Status" },
    { id: "lastLogin", label: "Last Login" },
    { id: "ipAddress", label: "IP Address" },
  ];

  const getRoleColor = (role) => {
    if (role === "Admin") return "error";
    if (role === "Manager") return "warning";
    if (role === "Pharmacist") return "primary";
    if (role === "Cashier") return "default";
    return "default";
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
            Security & Access
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Manage user accounts, roles, and security permissions.
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
          Add New User
        </Button>
      </Stack>

      {/* SECURITY ENTRY FORM */}
      <Card elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, mb: 3, width: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}>
              <SecurityOutlined />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                User Entry
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Create a new user or update permissions.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* CSS GRID FOR RESPONSIVE LAYOUT */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography fontWeight={700} color="#2563eb">
                User Information
              </Typography>
            </Box>

            <TextField fullWidth size="small" label="Full Name *" name="name" value={form.name} onChange={handleChange} placeholder="e.g. John Doe" />
            <TextField fullWidth size="small" label="Email Address *" name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. user@rxpilot.com" />
            
            <TextField fullWidth size="small" select label="Role *" name="role" value={form.role} onChange={handleChange}>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Pharmacist">Pharmacist</MenuItem>
              <MenuItem value="Cashier">Cashier</MenuItem>
            </TextField>
            
            <TextField fullWidth size="small" select label="Account Status" name="status" value={form.status} onChange={handleChange}>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Suspended">Suspended</MenuItem>
            </TextField>

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography fontWeight={700} color="#2563eb">
                {editingId ? "Reset Password (Optional)" : "Set Password"}
              </Typography>
            </Box>

            <TextField fullWidth size="small" label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" InputProps={{ startAdornment: <InputAdornment position="start"><LockOutlined fontSize="small" /></InputAdornment> }} />
            <TextField fullWidth size="small" label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Re-type password" InputProps={{ startAdornment: <InputAdornment position="start"><LockOutlined fontSize="small" /></InputAdornment> }} />

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" spacing={1.5}>
                <Button variant="outlined" color="inherit" onClick={() => setForm(emptyForm)} startIcon={<Refresh />} sx={{ textTransform: "none", borderRadius: 2 }}>
                  Reset Form
                </Button>
                <Button variant="contained" startIcon={<AdminPanelSettingsOutlined />} onClick={handleSave} sx={{ bgcolor: "#2563eb", textTransform: "none", borderRadius: 2, boxShadow: "none" }}>
                  Save User
                </Button>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* SECURITY DATA TABLE */}
      <Card elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, width: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box mb={2.5}>
            <Typography variant="h6" fontWeight={700}>
              System Users
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search, sort, filter and manage user access.
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
              placeholder="Search name, email, IP address..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select value={roleFilter} label="Role" onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Pharmacist">Pharmacist</MenuItem>
                <MenuItem value="Cashier">Cashier</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
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
            <Table sx={{ minWidth: 850 }}>
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
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}>
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700} variant="body2">{user.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    
                    <TableCell>
                      <Chip size="small" color={getRoleColor(user.role)} label={user.role} />
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        size="small" 
                        variant={user.status === "Active" ? "filled" : "outlined"}
                        color={user.status === "Active" ? "success" : "error"} 
                        label={user.status} 
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{user.lastLogin}</Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
                        {user.ipAddress}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Edit Permissions">
                          <IconButton size="small" onClick={() => handleEdit(user)} sx={{ color: "#2563eb" }}>
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Revoke Access">
                          <IconButton size="small" onClick={() => handleDelete(user.id)} sx={{ color: "#dc2626" }}>
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <ShieldOutlined sx={{ fontSize: 45, color: "#94a3b8", mb: 1 }} />
                      <Typography fontWeight={700}>No Users Found</Typography>
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
            count={filteredUsers.length}
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

      {/* EDIT USER DIALOG */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 3, mx: 2, width: "100%" } }}>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography fontWeight={700} variant="h6">Edit User</Typography>
              <Typography variant="caption" color="text.secondary">Update user details and permissions.</Typography>
            </Box>
            <IconButton onClick={() => setDialogOpen(false)}><Close /></IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField fullWidth size="small" label="Full Name *" name="name" value={form.name} onChange={handleChange} />
            <TextField fullWidth size="small" label="Email Address *" name="email" type="email" value={form.email} onChange={handleChange} />
            
            <TextField fullWidth size="small" select label="Role *" name="role" value={form.role} onChange={handleChange}>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Pharmacist">Pharmacist</MenuItem>
              <MenuItem value="Cashier">Cashier</MenuItem>
            </TextField>
            
            <TextField fullWidth size="small" select label="Account Status" name="status" value={form.status} onChange={handleChange}>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Suspended">Suspended</MenuItem>
            </TextField>

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography fontWeight={700} color="#2563eb">
                Change Password (Leave blank to keep current)
              </Typography>
            </Box>

            <TextField fullWidth size="small" label="New Password" name="password" type="password" value={form.password} onChange={handleChange} />
            <TextField fullWidth size="small" label="Confirm New Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#2563eb", textTransform: "none", boxShadow: "none" }}>Update User</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}