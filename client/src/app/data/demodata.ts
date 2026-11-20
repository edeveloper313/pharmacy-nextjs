/** Shared demo data and matching TypeScript types for the Purchase Invoice page. */

export type Vendor = {
  id: string;
  name: string;
  ntn: string;
  address: string;
  phone: string;
};

export type PurchaseHistoryProduct = {
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






// Demo vendors and history. Replace these with vendor and purchase-history API data.


export const sortOptions = [
  { value: "date-desc", label: "Date (Newest first)" },
  { value: "date-asc", label: "Date (Oldest first)" },
  { value: "invoice-asc", label: "Invoice No. (A - Z)" },
  { value: "total-desc", label: "Grand Total (High to Low)" },
  { value: "total-asc", label: "Grand Total (Low to High)" },
  { value: "status", label: "Status (Pending first)" },
];

export const UNIT_OPTIONS: string[] = [
  "Piece",
  "Pack",
  "Box",
  "Bottle",
  "Vial",
  "Strip",
  "Carton",
  "Kg",
  "Liter",
];
/** Shared demo data and matching TypeScript types for the Product History page. */

export type ProductStatus =
  | "In Stock"
  | "Low Stock"
  | "Out of Stock"
  | "Discontinued";

export type ProductHistoryStatus = "Completed" | "Pending" | "Cancelled";

export type ProductHistoryType =
  | "Purchase"
  | "Sale"
  | "Return In"
  | "Return Out"
  | "Adjustment";

export type PartyType = "Vendor" | "Customer" | "Internal";

/** Product master info (also used by the "All Products" grid). */
export type Product = {
  id: string;
  name: string;
  type: string; // Tablet, Capsule, Syrup, Injection, Infusion, etc.
  category: string;
  unit: string;
  manufacturer: string;
  currentStock: number;
  reorderLevel: number;
  purchasePrice: number;
  sellingPrice: number;
  status: ProductStatus;
};

/** One product-history transaction (purchase / sale / return / adjustment). */
export type ProductHistoryRecord = {
  id: number;
  transactionNo: string;
  productId: string;
  productName: string;
  batchNumber: string;
  expiryDate: string;
  type: ProductHistoryType;
  date: string;
  partyName: string;
  partyType: PartyType;
  quantity: number;
  unit: string;
  rate: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  status: ProductHistoryStatus;
  notes: string;
};

/** Editable fields on the update form. */
export type UpdateForm = {
  date: string;
  status: ProductHistoryStatus;
  quantity: string;
  rate: string;
  discountPercent: string;
  notes: string;
};

export const emptyUpdateForm: UpdateForm = {
  date: "",
  status: "Completed",
  quantity: "",
  rate: "",
  discountPercent: "",
  notes: "",
};

/* =========================================================================
   PRODUCTS (master list) — used by the "All Products" grid
   ========================================================================= */

export const products: Product[] = [
  {
    id: "PRD-001",
    name: "Paracetamol 500mg",
    type: "Tablet",
    category: "Analgesic",
    unit: "Box",
    manufacturer: "GSK Pakistan",
    currentStock: 500,
    reorderLevel: 100,
    purchasePrice: 410,
    sellingPrice: 550,
    status: "In Stock",
  },
  {
    id: "PRD-002",
    name: "Amoxicillin 500mg",
    type: "Capsule",
    category: "Antibiotic",
    unit: "Pack",
    manufacturer: "Searle Pakistan",
    currentStock: 200,
    reorderLevel: 50,
    purchasePrice: 680,
    sellingPrice: 850,
    status: "In Stock",
  },
  {
    id: "PRD-003",
    name: "Normal Saline 500ml",
    type: "Infusion",
    category: "IV Fluids",
    unit: "Bottle",
    manufacturer: "Otsuka Pakistan",
    currentStock: 320,
    reorderLevel: 80,
    purchasePrice: 95,
    sellingPrice: 150,
    status: "In Stock",
  },
  {
    id: "PRD-004",
    name: "Panadol Extra",
    type: "Tablet",
    category: "Analgesic",
    unit: "Strip",
    manufacturer: "GSK Pakistan",
    currentStock: 400,
    reorderLevel: 100,
    purchasePrice: 175,
    sellingPrice: 250,
    status: "In Stock",
  },
  {
    id: "PRD-005",
    name: "Ventolin Inhaler",
    type: "Inhaler",
    category: "Respiratory",
    unit: "Piece",
    manufacturer: "GSK Pakistan",
    currentStock: 40,
    reorderLevel: 50,
    purchasePrice: 850,
    sellingPrice: 1100,
    status: "Low Stock",
  },
  {
    id: "PRD-006",
    name: "Insulin Glargine",
    type: "Injection",
    category: "Diabetes",
    unit: "Vial",
    manufacturer: "Sanofi Pakistan",
    currentStock: 20,
    reorderLevel: 30,
    purchasePrice: 2500,
    sellingPrice: 3200,
    status: "Low Stock",
  },
  {
    id: "PRD-007",
    name: "Omeprazole 20mg",
    type: "Capsule",
    category: "Gastro",
    unit: "Strip",
    manufacturer: "Getz Pharma",
    currentStock: 0,
    reorderLevel: 100,
    purchasePrice: 180,
    sellingPrice: 240,
    status: "Out of Stock",
  },
  {
    id: "PRD-008",
    name: "Metformin 500mg",
    type: "Tablet",
    category: "Diabetes",
    unit: "Strip",
    manufacturer: "Getz Pharma",
    currentStock: 250,
    reorderLevel: 100,
    purchasePrice: 120,
    sellingPrice: 180,
    status: "In Stock",
  },
  {
    id: "PRD-009",
    name: "Brufen 400mg",
    type: "Tablet",
    category: "Analgesic",
    unit: "Strip",
    manufacturer: "Abbott Pakistan",
    currentStock: 180,
    reorderLevel: 80,
    purchasePrice: 320,
    sellingPrice: 420,
    status: "In Stock",
  },
  {
    id: "PRD-010",
    name: "Disprin 300mg",
    type: "Tablet",
    category: "Analgesic",
    unit: "Strip",
    manufacturer: "Reckitt Benckiser",
    currentStock: 0,
    reorderLevel: 50,
    purchasePrice: 40,
    sellingPrice: 60,
    status: "Discontinued",
  },
];

/* =========================================================================
   PRODUCT HISTORY (per-product transaction records)
   ========================================================================= */

export const productHistory: Record<string, ProductHistoryRecord[]> = {
  "PRD-001": [
    {
      id: 1,
      transactionNo: "TXN-PUR-1001",
      productId: "PRD-001",
      productName: "Paracetamol 500mg",
      batchNumber: "PCM-25A",
      expiryDate: "2027-12-31",
      type: "Purchase",
      date: "2026-08-04",
      partyName: "Medico Distributors",
      partyType: "Vendor",
      quantity: 500,
      unit: "Box",
      rate: 420,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 210000,
      status: "Completed",
      notes: "Opening stock from vendor.",
    },
    {
      id: 2,
      transactionNo: "TXN-SAL-1001",
      productId: "PRD-001",
      productName: "Paracetamol 500mg",
      batchNumber: "PCM-25A",
      expiryDate: "2027-12-31",
      type: "Sale",
      date: "2026-09-18",
      partyName: "Aga Khan University Hospital",
      partyType: "Customer",
      quantity: 100,
      unit: "Box",
      rate: 250,
      discountPercent: 5,
      discountAmount: 1250,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 23750,
      status: "Completed",
      notes: "Bulk hospital order.",
    },
    {
      id: 3,
      transactionNo: "TXN-SAL-1015",
      productId: "PRD-001",
      productName: "Paracetamol 500mg",
      batchNumber: "PCM-25A",
      expiryDate: "2027-12-31",
      type: "Sale",
      date: "2026-10-06",
      partyName: "Shaukat Khanum Memorial",
      partyType: "Customer",
      quantity: 150,
      unit: "Box",
      rate: 250,
      discountPercent: 5,
      discountAmount: 1875,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 35625,
      status: "Completed",
      notes: "Monthly requirement.",
    },
    {
      id: 4,
      transactionNo: "TXN-PUR-1042",
      productId: "PRD-001",
      productName: "Paracetamol 500mg",
      batchNumber: "PCM-24C",
      expiryDate: "2027-05-31",
      type: "Purchase",
      date: "2026-10-28",
      partyName: "Medico Distributors",
      partyType: "Vendor",
      quantity: 300,
      unit: "Box",
      rate: 410,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 123000,
      status: "Completed",
      notes: "New batch received.",
    },
    {
      id: 5,
      transactionNo: "TXN-ADJ-1001",
      productId: "PRD-001",
      productName: "Paracetamol 500mg",
      batchNumber: "PCM-24C",
      expiryDate: "2027-05-31",
      type: "Adjustment",
      date: "2026-11-05",
      partyName: "Warehouse",
      partyType: "Internal",
      quantity: 50,
      unit: "Box",
      rate: 0,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 0,
      status: "Completed",
      notes: "Stock written off (damaged units).",
    },
  ],
  "PRD-002": [
    {
      id: 1,
      transactionNo: "TXN-PUR-2001",
      productId: "PRD-002",
      productName: "Amoxicillin 500mg",
      batchNumber: "AMX-24B",
      expiryDate: "2027-08-31",
      type: "Purchase",
      date: "2026-07-12",
      partyName: "Pak Pharma Supply",
      partyType: "Vendor",
      quantity: 200,
      unit: "Pack",
      rate: 680,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 136000,
      status: "Completed",
      notes: "First consignment.",
    },
    {
      id: 2,
      transactionNo: "TXN-SAL-2001",
      productId: "PRD-002",
      productName: "Amoxicillin 500mg",
      batchNumber: "AMX-24B",
      expiryDate: "2027-08-31",
      type: "Sale",
      date: "2026-08-22",
      partyName: "Al-Noor Clinic",
      partyType: "Customer",
      quantity: 50,
      unit: "Pack",
      rate: 450,
      discountPercent: 10,
      discountAmount: 2250,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 20250,
      status: "Completed",
      notes: "Delivered to clinic.",
    },
    {
      id: 3,
      transactionNo: "TXN-PUR-2015",
      productId: "PRD-002",
      productName: "Amoxicillin 500mg",
      batchNumber: "AMX-25A",
      expiryDate: "2027-08-31",
      type: "Purchase",
      date: "2026-09-12",
      partyName: "Pak Pharma Supply",
      partyType: "Vendor",
      quantity: 200,
      unit: "Pack",
      rate: 680,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 136000,
      status: "Completed",
      notes: "Restock.",
    },
    {
      id: 4,
      transactionNo: "TXN-SAL-2042",
      productId: "PRD-002",
      productName: "Amoxicillin 500mg",
      batchNumber: "AMX-25A",
      expiryDate: "2027-08-31",
      type: "Sale",
      date: "2026-10-28",
      partyName: "Aga Khan University Hospital",
      partyType: "Customer",
      quantity: 150,
      unit: "Pack",
      rate: 450,
      discountPercent: 10,
      discountAmount: 6750,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 60750,
      status: "Pending",
      notes: "Payment awaited.",
    },
  ],
  "PRD-003": [
    {
      id: 1,
      transactionNo: "TXN-PUR-3001",
      productId: "PRD-003",
      productName: "Normal Saline 500ml",
      batchNumber: "NS-610",
      expiryDate: "2028-02-28",
      type: "Purchase",
      date: "2026-08-14",
      partyName: "Pak Pharma Supply",
      partyType: "Vendor",
      quantity: 150,
      unit: "Bottle",
      rate: 95,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 14250,
      status: "Completed",
      notes: "Regular stock purchase.",
    },
    {
      id: 2,
      transactionNo: "TXN-RTI-3001",
      productId: "PRD-003",
      productName: "Normal Saline 500ml",
      batchNumber: "NS-610",
      expiryDate: "2028-02-28",
      type: "Return In",
      date: "2026-09-05",
      partyName: "MedPlus Pharmacy",
      partyType: "Customer",
      quantity: 20,
      unit: "Bottle",
      rate: 120,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 2400,
      status: "Completed",
      notes: "Returned by customer.",
    },
    {
      id: 3,
      transactionNo: "TXN-PUR-3010",
      productId: "PRD-003",
      productName: "Normal Saline 500ml",
      batchNumber: "NS-618",
      expiryDate: "2028-05-31",
      type: "Purchase",
      date: "2026-10-02",
      partyName: "Pak Pharma Supply",
      partyType: "Vendor",
      quantity: 200,
      unit: "Bottle",
      rate: 95,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 19000,
      status: "Completed",
      notes: "New batch.",
    },
    {
      id: 4,
      transactionNo: "TXN-SAL-3020",
      productId: "PRD-003",
      productName: "Normal Saline 500ml",
      batchNumber: "NS-618",
      expiryDate: "2028-05-31",
      type: "Sale",
      date: "2026-10-17",
      partyName: "Shaukat Khanum Memorial",
      partyType: "Customer",
      quantity: 50,
      unit: "Bottle",
      rate: 120,
      discountPercent: 5,
      discountAmount: 300,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 5700,
      status: "Completed",
      notes: "Hospital usage.",
    },
  ],
  "PRD-004": [
    {
      id: 1,
      transactionNo: "TXN-PUR-4001",
      productId: "PRD-004",
      productName: "Panadol Extra",
      batchNumber: "PNX-11A",
      expiryDate: "2028-03-31",
      type: "Purchase",
      date: "2026-08-01",
      partyName: "Medico Distributors",
      partyType: "Vendor",
      quantity: 300,
      unit: "Strip",
      rate: 180,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 54000,
      status: "Completed",
      notes: "Seasonal stock.",
    },
    {
      id: 2,
      transactionNo: "TXN-SAL-4005",
      productId: "PRD-004",
      productName: "Panadol Extra",
      batchNumber: "PNX-11A",
      expiryDate: "2028-03-31",
      type: "Sale",
      date: "2026-09-14",
      partyName: "MedPlus Pharmacy",
      partyType: "Customer",
      quantity: 100,
      unit: "Strip",
      rate: 220,
      discountPercent: 5,
      discountAmount: 1100,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 20900,
      status: "Completed",
      notes: "Retail order.",
    },
    {
      id: 3,
      transactionNo: "TXN-PUR-4012",
      productId: "PRD-004",
      productName: "Panadol Extra",
      batchNumber: "PNX-11B",
      expiryDate: "2028-06-30",
      type: "Purchase",
      date: "2026-10-08",
      partyName: "Medico Distributors",
      partyType: "Vendor",
      quantity: 250,
      unit: "Strip",
      rate: 175,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 43750,
      status: "Completed",
      notes: "Fresh batch.",
    },
    {
      id: 4,
      transactionNo: "TXN-SAL-4018",
      productId: "PRD-004",
      productName: "Panadol Extra",
      batchNumber: "PNX-11B",
      expiryDate: "2028-06-30",
      type: "Sale",
      date: "2026-11-01",
      partyName: "Wellness Wholesale",
      partyType: "Customer",
      quantity: 50,
      unit: "Strip",
      rate: 220,
      discountPercent: 5,
      discountAmount: 550,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 10450,
      status: "Pending",
      notes: "Awaiting payment.",
    },
  ],
  "PRD-005": [
    {
      id: 1,
      transactionNo: "TXN-PUR-5001",
      productId: "PRD-005",
      productName: "Ventolin Inhaler",
      batchNumber: "VNT-12A",
      expiryDate: "2027-12-31",
      type: "Purchase",
      date: "2026-09-15",
      partyName: "Medico Distributors",
      partyType: "Vendor",
      quantity: 40,
      unit: "Piece",
      rate: 850,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 34000,
      status: "Completed",
      notes: "Restocked from vendor.",
    },
  ],
  "PRD-006": [
    {
      id: 1,
      transactionNo: "TXN-PUR-6001",
      productId: "PRD-006",
      productName: "Insulin Glargine",
      batchNumber: "INS-22B",
      expiryDate: "2027-06-30",
      type: "Purchase",
      date: "2026-10-01",
      partyName: "Pak Pharma Supply",
      partyType: "Vendor",
      quantity: 20,
      unit: "Vial",
      rate: 2500,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 50000,
      status: "Completed",
      notes: "Cold chain verified.",
    },
  ],
  "PRD-007": [
    {
      id: 1,
      transactionNo: "TXN-PUR-7001",
      productId: "PRD-007",
      productName: "Omeprazole 20mg",
      batchNumber: "OMP-19C",
      expiryDate: "2028-03-31",
      type: "Purchase",
      date: "2026-08-20",
      partyName: "Medico Distributors",
      partyType: "Vendor",
      quantity: 100,
      unit: "Strip",
      rate: 180,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 18000,
      status: "Completed",
      notes: "Stock consumed; reorder pending.",
    },
  ],
  "PRD-008": [
    {
      id: 1,
      transactionNo: "TXN-PUR-8001",
      productId: "PRD-008",
      productName: "Metformin 500mg",
      batchNumber: "MET-33A",
      expiryDate: "2028-01-31",
      type: "Purchase",
      date: "2026-09-10",
      partyName: "Pak Pharma Supply",
      partyType: "Vendor",
      quantity: 250,
      unit: "Strip",
      rate: 120,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 30000,
      status: "Completed",
      notes: "Regular stock.",
    },
  ],
  "PRD-009": [
    {
      id: 1,
      transactionNo: "TXN-PUR-9001",
      productId: "PRD-009",
      productName: "Brufen 400mg",
      batchNumber: "BRF-44D",
      expiryDate: "2027-11-30",
      type: "Purchase",
      date: "2026-10-12",
      partyName: "Medico Distributors",
      partyType: "Vendor",
      quantity: 180,
      unit: "Strip",
      rate: 320,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 57600,
      status: "Completed",
      notes: "In stock.",
    },
  ],
  "PRD-010": [
    {
      id: 1,
      transactionNo: "TXN-PUR-10001",
      productId: "PRD-010",
      productName: "Disprin 300mg",
      batchNumber: "DSP-05A",
      expiryDate: "2025-12-31",
      type: "Purchase",
      date: "2026-07-01",
      partyName: "Medico Distributors",
      partyType: "Vendor",
      quantity: 50,
      unit: "Strip",
      rate: 40,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 2000,
      status: "Cancelled",
      notes: "Discontinued — low demand.",
    },
  ],
};

/** Sort options for the "All Products" grid. */
export const productSortOptions = [
  { value: "name-asc", label: "Name (A - Z)" },
  { value: "name-desc", label: "Name (Z - A)" },
  { value: "qty-desc", label: "Qty (High to Low)" },
  { value: "qty-asc", label: "Qty (Low to High)" },
  { value: "purchase-desc", label: "Purchase Price (High to Low)" },
  { value: "purchase-asc", label: "Purchase Price (Low to High)" },
  { value: "status", label: "Status (Out of Stock first)" },
];

export const productTypeOptions: string[] = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Injection",
  "Infusion",
  "Inhaler",
  "Cream",
  "Ointment",
  "Drops",
  "Powder",
  "Piece",
];

export const productUnitOptions: string[] = [
  "Piece",
  "Pack",
  "Box",
  "Bottle",
  "Vial",
  "Strip",
  "Carton",
  "Kg",
  "Liter",
];

export const productStatusOptions: ProductStatus[] = [
  "In Stock",
  "Low Stock",
  "Out of Stock",
  "Discontinued",
];

// Purchase page data:
// ==================== Types ====================

export type vendor = {
  id: string;
  name: string;
  ntn: string;
  phone: string;
  address: string;
};

export type PurchaseHistoryInvoice = {
  invoiceNo: string;
  date: string;
  paidAmount: number;
  grandTotal: number;
  products: PurchaseHistoryProduct[];
};

export type InvoiceRecord = PurchaseHistoryInvoice & {
  vendorId: string;
  vendorName: string;
};

export type InvoiceItem = {
  id: number;
  vendorName: string;
  vendorNtn: string;
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

export type FormState = {
  vendorName: string;
  vendorNtn: string;
  invoiceNumber: string;
  invoiceDate: string;
  productName: string;
  batchNumber: string;
  expiryDate: string;
  currentQty: string;
  quantity: string;
  unit: string;
  purchaseRate: string;
  sellingPrice: string;
  discount: string;
  tax: string;
  paidAmount: string;
};

// Product + Batch mapping used for search, bidirectional filtering, and auto-fill
export type ProductBatchItem = {
  id: string;
  productName: string;
  batchNumber: string;
  expiryDate: string;
  currentQty: number;
  unit: string;
  purchaseRate: number;
  sellingPrice: number;
};

// ==================== Initial Form State ====================

export const emptyForm: FormState = {
  vendorName: "",
  vendorNtn: "",
  invoiceNumber: "",
  invoiceDate: "",
  productName: "",
  batchNumber: "",
  expiryDate: "",
  currentQty: "",
  quantity: "",
  unit: "",
  purchaseRate: "",
  sellingPrice: "",
  discount: "",
  tax: "",
  paidAmount: "",
};

// ==================== Demo Vendors ====================

export const vendors: vendor[] = [
  {
    id: "v-1",
    name: "MedLife Distributors",
    ntn: "42101-8899123-1",
    phone: "0300-1122334",
    address: "Plot 14, Industrial Area, Lahore",
  },
  {
    id: "v-2",
    name: "CarePlus Pharma Traders",
    ntn: "35202-7744112-9",
    phone: "0321-9988776",
    address: "Suite 8, Medicine Market, Karachi",
  },
  {
    id: "v-3",
    name: "Sehat Supply Co.",
    ntn: "61101-5544332-5",
    phone: "0333-4455667",
    address: "Block C, Blue Area, Islamabad",
  },
];

// ==================== Demo Product & Batch Catalog ====================
// Multiple products can exist in the same batch, and one product can exist in multiple batches.

export const productBatchCatalog: ProductBatchItem[] = [
  {
    id: "pb-1",
    productName: "Panadol 500mg Tablet",
    batchNumber: "BATCH-101",
    expiryDate: "2027-08-15",
    currentQty: 250,
    unit: "Box",
    purchaseRate: 180,
    sellingPrice: 220,
  },
  {
    id: "pb-2",
    productName: "Panadol 500mg Tablet",
    batchNumber: "BATCH-102",
    expiryDate: "2028-01-20",
    currentQty: 120,
    unit: "Box",
    purchaseRate: 185,
    sellingPrice: 225,
  },
  {
    id: "pb-3",
    productName: "Augmentin 625mg Tablet",
    batchNumber: "BATCH-101",
    expiryDate: "2027-06-30",
    currentQty: 90,
    unit: "Pack",
    purchaseRate: 420,
    sellingPrice: 495,
  },
  {
    id: "pb-4",
    productName: "Augmentin 625mg Tablet",
    batchNumber: "BATCH-205",
    expiryDate: "2027-11-10",
    currentQty: 60,
    unit: "Pack",
    purchaseRate: 430,
    sellingPrice: 510,
  },
  {
    id: "pb-5",
    productName: "Brufen 400mg Tablet",
    batchNumber: "BATCH-102",
    expiryDate: "2027-09-25",
    currentQty: 300,
    unit: "Strip",
    purchaseRate: 65,
    sellingPrice: 85,
  },
  {
    id: "pb-6",
    productName: "Risek 20mg Capsule",
    batchNumber: "BATCH-205",
    expiryDate: "2028-03-12",
    currentQty: 145,
    unit: "Box",
    purchaseRate: 310,
    sellingPrice: 375,
  },
  {
    id: "pb-7",
    productName: "Calpol Syrup 120ml",
    batchNumber: "BATCH-309",
    expiryDate: "2027-05-18",
    currentQty: 80,
    unit: "Bottle",
    purchaseRate: 140,
    sellingPrice: 175,
  },
];

// Unique batch options derived from catalog
export const batchOptions = Array.from(
  new Set(productBatchCatalog.map((item) => item.batchNumber)),
).map((batchNumber) => ({ batchNumber }));

// ==================== Demo Vendor Purchase History ====================

export const vendorHistory: Record<string, PurchaseHistoryInvoice[]> = {
  "v-1": [
    {
      invoiceNo: "SUP-INV-1001",
      date: "2026-09-12",
      paidAmount: 15000,
      grandTotal: 21240,
      products: [
        {
          productName: "Panadol 500mg Tablet",
          batchNumber: "BATCH-101",
          expiryDate: "2027-08-15",
          quantity: 100,
          unit: "Box",
          purchaseRate: 180,
          discount: 0,
          taxPercent: 18,
          taxAmount: 3240,
          subTotal: 18000,
          grandTotal: 21240,
        },
      ],
    },
  ],
  "v-2": [
    {
      invoiceNo: "SUP-INV-2010",
      date: "2026-10-03",
      paidAmount: 25488,
      grandTotal: 25488,
      products: [
        {
          productName: "Augmentin 625mg Tablet",
          batchNumber: "BATCH-205",
          expiryDate: "2027-11-10",
          quantity: 50,
          unit: "Pack",
          purchaseRate: 430,
          discount: 0,
          taxPercent: 18,
          taxAmount: 3870,
          subTotal: 21500,
          grandTotal: 25370,
        },
      ],
    },
  ],
  "v-3": [],
};
  