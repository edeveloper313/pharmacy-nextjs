import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
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
  }
  ,
  {
    id: uniqueId(),
    title: "Profile ",
    icon: IconLayoutDashboard,
    href: "/dashboard/profile ",
  }, 
  {
    id: uniqueId(),
    title: "Setting",
    icon: IconLayoutDashboard,
    href: "/dashboard/setting ",
  }, 
    {
    id: uniqueId(),
    title: "Product",
    icon: IconLayoutDashboard,
    href: "/dashboard/product  ",
  }, 
    {
    id: uniqueId(),
    title: "Client Management ",
    icon: IconLayoutDashboard,
    href: "/dashboard/client-management ",
  }, 
    {
    id: uniqueId(),
    title: "Smart Purchase ",
    icon: IconLayoutDashboard,
    href: "/dashboard/smart-purchase ",
  }, 
    {
    id: uniqueId(),
    title: "Inventory Management",
    icon: IconLayoutDashboard,
    href: "/dashboard/inventory-management   ",
  }, 
      {
    id: uniqueId(),
    title: "Billing System",
    icon: IconLayoutDashboard,
    href: "/dashboard/billing-system   ",
  },     {
    id: uniqueId(),
    title: "Invoice Export ",
    icon: IconLayoutDashboard,
    href: "/dashboard/invoice-export ",
  },     {
    id: uniqueId(),
    title: "Digital Delivery",
    icon: IconLayoutDashboard,
    href: "/dashboard/digital-delivery ",
  },     {
    id: uniqueId(),
    title: "Reports ",
    icon: IconLayoutDashboard,
    href: "/dashboard/reports ",
  },     {
    id: uniqueId(),
    title: "Security",
    icon: IconLayoutDashboard,
    href: "/dashboard/security",
  },    
 
  {
    navlabel: true,
    subheader: "UTILITIES",
  },
  
  
  {
    navlabel: true,
    subheader: "AUTH",
  },
  {
    id: uniqueId(),
    title: "Login",
    icon: IconLogin,
    href: "/authentication/login",
  },
  {
    id: uniqueId(),
    title: "Register",
    icon: IconUserPlus,
    href: "/authentication/register",
  },
 
 
  

];

export default Menuitems;


