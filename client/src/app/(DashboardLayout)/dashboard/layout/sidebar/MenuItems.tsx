import {
  IconLayoutDashboard,
  IconUserCircle,
  IconSettings,
  IconPackage,
  IconUsers,
  IconShoppingCart,
  IconPackages,
  IconReceipt,
  IconFileExport,
  IconTruckDelivery,
  IconChartBar,
  IconShieldLock,
  IconLogin,
  IconUserPlus,
  IconAddressBook
} from "@tabler/icons-react";

import { uniqueId } from "lodash";
const Menuitems = [
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
    title: "Profile",
    icon: IconUserCircle,
    href: "/dashboard/profile",
  },
 
  {
    id: uniqueId(),
    title: "Product",
    icon: IconPackage,
    href: "/dashboard/product",
  },
  {
    id: uniqueId(),
    title: "Customer Entry",
    icon: IconAddressBook,
    href: "/dashboard/customer-entry",
  },
    {
    id: uniqueId(),
    title: "Purchase Invoice",
    icon: IconUserPlus,
    href: "/dashboard/purchase-invoice",
  },  {
    id: uniqueId(),
    title: "Sale Order Entry",
    icon: IconShoppingCart,
    href: "/dashboard/sale-order-entry",
  },
   {
    id: uniqueId(),
    title: "Sales Invoice Updating",
    icon: IconReceipt,
    href: "/dashboard/sale-invoice-updating",
  },
   {
    id: uniqueId(),
    title: "Sales Order Status",
    icon: IconChartBar,
    href: "/dashboard/sales-order-status",
  },
  {
    id: uniqueId(),
    title: "Client Management",
    icon: IconUsers,
    href: "/dashboard/client-management",
  },
    {
    id: uniqueId(),
    title: "Master Product Entry",
    icon: IconPackage,
    href: "/dashboard/master-product-entry",
  },
  {
    id: uniqueId(),
    title: "Smart Purchase",
    icon: IconShoppingCart,
    href: "/dashboard/smart-purchase",
  },
  {
    id: uniqueId(),
    title: "Inventory Management",
    icon: IconPackages,
    href: "/dashboard/inventory-management",
  },
  {
    id: uniqueId(),
    title: "Billing System",
    icon: IconReceipt,
    href: "/dashboard/billing-system",
  },
  {
    id: uniqueId(),
    title: "Invoice Export",
    icon: IconFileExport,
    href: "/dashboard/invoice-export",
  },
  // {
  //   id: uniqueId(),
  //   title: "Digital Delivery",
  //   icon: IconTruckDelivery,
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
  //   icon: IconShieldLock,
  //   href: "/dashboard/security",
  // },

  
];

export default Menuitems;


