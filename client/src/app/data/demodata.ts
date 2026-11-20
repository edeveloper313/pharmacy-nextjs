/** Shared demo data and matching TypeScript types for the Purchase Invoice page. */

export type Supplier = {
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

export type PurchaseHistoryInvoice = {
  invoiceNo: string;
  date: string;
  paidAmount: number;
  grandTotal: number;
  products: PurchaseHistoryProduct[];
};

/** Invoice row used by the "All Purchase Invoices" grid (invoice + owning supplier). */
export type InvoiceRecord = PurchaseHistoryInvoice & {
  supplierId: string;
  supplierName: string;
};

export type InvoiceItem = {
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

export type FormState = {
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
  paidAmount: string;
};

export const emptyForm: FormState = {
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
  paidAmount: "",
};

// Demo suppliers and history. Replace these with supplier and purchase-history API data.
export const suppliers: Supplier[] = [
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

export const supplierHistory: Record<string, PurchaseHistoryInvoice[]> = {
  "SUP-001": [
    {
      invoiceNo: "SUP-INV-1042",
      date: "2026-10-28",

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

export const batchOptions = [
  { batchNumber: "BATCH-001" },
  { batchNumber: "BATCH-002" },
  { batchNumber: "BATCH-003" },
  { batchNumber: "BATCH-004" },
  { batchNumber: "BATCH-005" },
];

export const paymentTypeOptions = [
  "Cash",
  "Credit",
  "Bank Transfer",
  "Cheque",
  "Online",
];

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

export type PartyType = "Supplier" | "Customer" | "Internal";

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
      partyType: "Supplier",
      quantity: 500,
      unit: "Box",
      rate: 420,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 210000,
      status: "Completed",
      notes: "Opening stock from supplier.",
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
      partyType: "Supplier",
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
      partyType: "Supplier",
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
      partyType: "Supplier",
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
      partyType: "Supplier",
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
      partyType: "Supplier",
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
      partyType: "Supplier",
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
      partyType: "Supplier",
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
      partyType: "Supplier",
      quantity: 40,
      unit: "Piece",
      rate: 850,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 34000,
      status: "Completed",
      notes: "Restocked from supplier.",
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
      partyType: "Supplier",
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
      partyType: "Supplier",
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
      partyType: "Supplier",
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
      partyType: "Supplier",
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
      partyType: "Supplier",
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
