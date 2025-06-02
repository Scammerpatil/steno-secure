import { SideNavItem } from "@/types/types";
import {
  IconHome,
  IconUserCheck,
  IconFileText,
  IconUsers,
  IconGitPullRequest,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "Manage Candidates",
    path: "/admin/manage-candidates",
    icon: <IconUsers width="24" height="24" />,
  },
  {
    title: "Exams",
    path: "/admin/exams",
    icon: <IconFileText width="24" height="24" />,
  },
  {
    title: "Results",
    path: "/admin/results",
    icon: <IconUserCheck width="24" height="24" />,
  },
  {
    title: "Requests",
    path: "/admin/requests",
    icon: <IconGitPullRequest width="24" height="24" />,
  },
];
