import {
  IconLayoutDashboard,
  IconUserCircle,
  IconFileInvoice,
  IconPackage,
  IconShoppingCart,
  IconChartBar,
  IconAddressBook,
  IconTruck,
  IconShoppingBag,
  IconUserPlus,
  IconHeartHandshake,
  IconHistory,
  IconListDetails,
  IconReceipt,
  IconFile,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  // =========================
  // 1. HOME
  // =========================
  {
    navlabel: true,
    subheader: "HOME",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard",
  },

  {
    id: uniqueId(),
    title: "Vendor",
    icon: IconHeartHandshake,
    href: "/dashboard/vendor",
  },

  // =========================
  // 2. SALES MANAGEMENT
  // =========================
  {
    navlabel: true,
    subheader: "PRODUCT MANAGEMENT",
  },
  {
    id: uniqueId(),
    title: "Product Order",
    icon: IconPackage,
    href: "/dashboard/product-order",
  },
  {
    id: uniqueId(),
    title: "Master Product",
    icon: IconPackage,
    href: "/dashboard/master-product",
  },

  {
    id: uniqueId(),
    title: "All Products",
    icon: IconShoppingBag,
    href: "/dashboard/all-products",
  },
  // =========================
  // 3. PURCHASE PORDUCT
  // =========================
  {
    navlabel: true,
    subheader: "PURCHASE MANAGEMENT ",
  },
  {
    id: uniqueId(),
    title: "Purchase Order",
    icon: IconFile,
    href: "/dashboard/purchase-order",
  },
  {
    id: uniqueId(),
    title: "Purchase Order List",
    icon: IconListDetails,
    href: "/dashboard/purchase-order-list",
  },

  // =========================
  // 3. INVOICE MANAGEMENT
  // =========================
  {
    navlabel: true,
    subheader: "INVOICE MANAGEMENT",
  },
  {
    id: uniqueId(),
    title: "Invoice",
    icon: IconReceipt,
    href: "/dashboard/invoice",
  },

  // =========================
  // 4. MASTER DATA
  // =========================
  {
    navlabel: true,
    subheader: "MASTER DATA",
  },

  {
    id: uniqueId(),
    title: "Customer",
    icon: IconAddressBook,
    href: "/dashboard/customer",
  },
  {
    id: uniqueId(),
    title: "Client Management",
    icon: IconAddressBook,
    href: "/dashboard/client-management",
  },
  {
    id: uniqueId(),
    title: "Master Client Entry",
    icon: IconUserPlus,
    href: "/dashboard/master-client-entry",
  },

  // =========================
  // 5. ACCOUNTS
  // =========================
  {
    navlabel: true,
    subheader: "ACCOUNTS",
  },
  {
    id: uniqueId(),
    title: "Ledger",
    icon: IconFileInvoice,
    href: "/dashboard/ledger",
  },

  // =========================
  // 6. ACCOUNT SETTINGS
  // =========================
  {
    navlabel: true,
    subheader: "ACCOUNT SETTINGS",
  },
  {
    id: uniqueId(),
    title: "Profile",
    icon: IconUserCircle,
    href: "/dashboard/profile",
  },

  // =========================
  // FUTURE MODULES
  // =========================

  // {
  //   id: uniqueId(),
  //   title: "Smart Purchase",
  //   icon: IconShoppingCart,
  //   href: "/dashboard/smart-purchase",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Inventory Management",
  //   icon: IconPackage,
  //   href: "/dashboard/inventory-management",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Billing System",
  //   icon: IconFileInvoice,
  //   href: "/dashboard/billing-system",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Invoice Export",
  //   icon: IconFileInvoice,
  //   href: "/dashboard/invoice-export",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Digital Delivery",
  //   icon: IconTruck,
  //   href: "/dashboard/digital-delivery",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Reports",
  //   icon: IconChartBar,
  //   href: "/dashboard/reports",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Security",
  //   icon: IconUserCircle,
  //   href: "/dashboard/security",
  // },
];

export default Menuitems;
