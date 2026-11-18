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
  DownloadOutlined,
  DescriptionOutlined,
  Close,
  Refresh,
  CloudDownloadOutlined,
} from "@mui/icons-material";

// Make sure these paths match your project structure
import Alert from "@/app/components/Alert";

import { AlertState } from "@/app/components/types/types";

// ============================================
// INITIAL DATA
// ============================================
const initialExports = [
  {
    id: 1,
    fileName: "October_Invoices_2026",
    format: "PDF",
    dateRange: "2026-10-01 to 2026-10-31",
    totalRecords: 145,
    exportDate: "2026-11-01",
    status: "Completed",
  },
  {
    id: 2,
    fileName: "Q3_Sales_Report",
    format: "Excel",
    dateRange: "2026-07-01 to 2026-09-30",
    totalRecords: 892,
    exportDate: "2026-10-05",
    status: "Completed",
  },
  {
    id: 3,
    fileName: "Pending_Invoices_List",
    format: "CSV",
    dateRange: "All Time",
    totalRecords: 23,
    exportDate: "2026-10-28",
    status: "Completed",
  },
  {
    id: 4,
    fileName: "VIP_Clients_Invoices",
    format: "PDF",
    dateRange: "2026-01-01 to 2026-10-27",
    totalRecords: 56,
    exportDate: "2026-10-27",
    status: "Failed",
  },
  {
    id: 5,
    fileName: "Daily_Sales_25Oct",
    format: "Excel",
    dateRange: "2026-10-25 to 2026-10-25",
    totalRecords: 12,
    exportDate: "2026-10-26",
    status: "Completed",
  },
];

const emptyForm = {
  fileName: "",
  format: "PDF",
  dateRange: "",
  totalRecords: "",
};

// ============================================
// SORTING FUNCTIONS
// ============================================
const descendingComparator = (a, b, orderBy) => {
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

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export default function InvoiceExportPage() {
  const [exports, setExports] = useState(initialExports);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [formatFilter, setFormatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [order, setOrder] = useState<"asc" | "desc">("desc");
  
  const [orderBy, setOrderBy] = useState("exportDate");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

   const [alert, setAlert] = useState<{ type: AlertColor; message: string } | null>(null);

  const showAlert = (type: AlertState['type'], message: string) => {
    setAlert({ type, message });
  };

  // ==========================================
  // FILTERING & SORTING
  // ==========================================
  const filteredExports = useMemo(() => {
    const result = exports.filter((e) => {
      const keyword = search.toLowerCase();
      const searchMatch = [
        e.fileName,
        e.dateRange,
        e.exportDate,
      ].some((value) => String(value || "").toLowerCase().includes(keyword));

      const formatMatch = formatFilter === "all" || e.format === formatFilter;
      const statusMatch = statusFilter === "all" || e.status === statusFilter;

      return searchMatch && formatMatch && statusMatch;
    });

    return [...result].sort(getComparator(order, orderBy));
  }, [exports, search, formatFilter, statusFilter, order, orderBy]);

  const paginatedExports = filteredExports.slice(
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

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      ...item,
      totalRecords: String(item.totalRecords),
    });
    setDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const requiredFields = ["fileName", "dateRange", "totalRecords"];
    if (requiredFields.some((key) => String(form[key] ?? "").trim() === "")) {
      return showAlert("error", "Please fill all required fields.");
    }

    if (Number(form.totalRecords) < 0) {
      return showAlert("error", "Total records cannot be negative.");
    }

    const exportData = {
      ...form,
      fileName: form.fileName.trim(),
      totalRecords: Number(form.totalRecords),
      exportDate: new Date().toISOString().split("T")[0],
      status: "Completed", // Default status for new exports
    };

    if (editingId !== null) {
      setExports((prev) => prev.map((e) => (e.id === editingId ? { ...e, ...exportData } : e)));
      showAlert("success", "Export record updated successfully!");
    } else {
      setExports((prev) => [{ ...exportData, id: Date.now() }, ...prev]);
      setPage(0);
      showAlert("success", "Export generated successfully!");
    }

    setDialogOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this export record?")) return;
    setExports((prev) => prev.filter((e) => e.id !== id));
    setPage(0);
    showAlert("success", "Export record deleted successfully!");
  };

  const handleReset = () => {
    setSearch("");
    setFormatFilter("all");
    setStatusFilter("all");
    setOrder("desc");
    setOrderBy("exportDate");
    setPage(0);
  };

  // ==========================================
  // TABLE COLUMNS
  // ==========================================
  const columns = [
    { id: "fileName", label: "File Name" },
    { id: "format", label: "Format" },
    { id: "dateRange", label: "Date Range" },
    { id: "totalRecords", label: "Total Records" },
    { id: "exportDate", label: "Export Date" },
    { id: "status", label: "Status" },
  ];

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
    key={alert.message}
    type={alert.type}
    message={alert.message}
  />
)}


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
            Invoice Export
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Generate and download invoice reports in various formats.
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
          New Export
        </Button>
      </Stack>

      {/* EXPORT ENTRY FORM */}
      <Card elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, mb: 3, width: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}>
              <CloudDownloadOutlined />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Export Details
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Configure your export parameters.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* CSS GRID FOR RESPONSIVE LAYOUT */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
              gap: 2,
            }}
          >
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography fontWeight={700} color="#2563eb">
                Export Configuration
              </Typography>
            </Box>

            <TextField fullWidth size="small" label="File Name *" name="fileName" value={form.fileName} onChange={handleChange} placeholder="e.g. October_Invoices" sx={{ gridColumn: { xs: "1 / -1", sm: "span 2", lg: "span 2" } }} />
            
            <TextField fullWidth size="small" select label="Export Format" name="format" value={form.format} onChange={handleChange}>
              <MenuItem value="PDF">PDF Document</MenuItem>
              <MenuItem value="Excel">Excel (XLSX)</MenuItem>
              <MenuItem value="CSV">CSV File</MenuItem>
            </TextField>
            
            <TextField fullWidth size="small" label="Total Records *" name="totalRecords" type="number" value={form.totalRecords} onChange={handleChange} />

            <TextField 
              fullWidth 
              size="small" 
              label="Date Range *" 
              name="dateRange" 
              value={form.dateRange} 
              onChange={handleChange} 
              placeholder="e.g. 2026-10-01 to 2026-10-31"
              sx={{ gridColumn: { xs: "1 / -1", sm: "span 2", lg: "span 2" } }}
            />

            <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
              <Divider sx={{ mb: 2 }} />
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" spacing={1.5}>
                <Button variant="outlined" color="inherit" onClick={() => setForm(emptyForm)} startIcon={<Refresh />} sx={{ textTransform: "none", borderRadius: 2 }}>
                  Reset Form
                </Button>
                <Button variant="contained" startIcon={<DownloadOutlined />} onClick={handleSave} sx={{ bgcolor: "#2563eb", textTransform: "none", borderRadius: 2, boxShadow: "none" }}>
                  Generate Export
                </Button>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* EXPORT HISTORY TABLE */}
      <Card elevation={0} sx={{ border: "1px solid #e8edf3", borderRadius: 3, width: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box mb={2.5}>
            <Typography variant="h6" fontWeight={700}>
              Export History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View, search, and re-download your previously generated reports.
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
              placeholder="Search file name, date range..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Format</InputLabel>
              <Select value={formatFilter} label="Format" onChange={(e) => { setFormatFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Formats</MenuItem>
                <MenuItem value="PDF">PDF</MenuItem>
                <MenuItem value="Excel">Excel</MenuItem>
                <MenuItem value="CSV">CSV</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
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
            <Table sx={{ minWidth: 900 }}>
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
                {paginatedExports.map((item) => (
                  <TableRow key={item.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar variant="rounded" sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}>
                          <DescriptionOutlined />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700} variant="body2">{item.fileName}</Typography>
                          <Typography variant="caption" color="text.secondary">Exported on: {item.exportDate}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={item.format} 
                        variant="outlined" 
                        color={item.format === "PDF" ? "error" : item.format === "Excel" ? "success" : "default"}
                      />
                    </TableCell>
                    
                    <TableCell>{item.dateRange}</TableCell>
                    
                    <TableCell>
                      <Typography fontWeight={700}>{item.totalRecords}</Typography>
                    </TableCell>
                    
                    <TableCell>{item.exportDate}</TableCell>
                    
                    <TableCell>
                      <Chip 
                        size="small" 
                        color={item.status === "Completed" ? "success" : "error"} 
                        label={item.status} 
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Download">
                          <span>
                            <IconButton size="small" disabled={item.status !== "Completed"} sx={{ color: "#2563eb" }}>
                              <DownloadOutlined fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleEdit(item)} sx={{ color: "#475569" }}>
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDelete(item.id)} sx={{ color: "#dc2626" }}>
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredExports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <DescriptionOutlined sx={{ fontSize: 45, color: "#94a3b8", mb: 1 }} />
                      <Typography fontWeight={700}>No Exports Found</Typography>
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
            count={filteredExports.length}
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

      {/* EDIT EXPORT DIALOG */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 3, mx: 2, width: "100%" } }}>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography fontWeight={700} variant="h6">Edit Export</Typography>
              <Typography variant="caption" color="text.secondary">Update export parameters.</Typography>
            </Box>
            <IconButton onClick={() => setDialogOpen(false)}><Close /></IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField fullWidth size="small" label="File Name *" name="fileName" value={form.fileName} onChange={handleChange} />
            
            <TextField fullWidth size="small" select label="Export Format" name="format" value={form.format} onChange={handleChange}>
              <MenuItem value="PDF">PDF Document</MenuItem>
              <MenuItem value="Excel">Excel (XLSX)</MenuItem>
              <MenuItem value="CSV">CSV File</MenuItem>
            </TextField>
            
            <TextField fullWidth size="small" label="Total Records *" name="totalRecords" type="number" value={form.totalRecords} onChange={handleChange} />
            
            <TextField fullWidth size="small" label="Date Range *" name="dateRange" value={form.dateRange} onChange={handleChange} />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#2563eb", textTransform: "none", boxShadow: "none" }}>Update Export</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}