import { SideNavItem } from "@/types/types";
import {
  IconCheckupList,
  IconClipboardList,
  IconHome,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/user/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "Give Exam",
    path: "/user/exams",
    icon: <IconClipboardList width="24" height="24" />,
  },
  {
    title: "Check Results",
    path: "/user/results",
    icon: <IconCheckupList width="24" height="24" />,
  },
];
