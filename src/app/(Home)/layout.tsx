"use client";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/AuthProvider";

const Component = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" data-theme="nord">
      <head>
        <title>
          StenoSecure – Conduct Secure Online & Offline Stenography Exams
        </title>
        <meta
          name="description"
          content="StenoSecure is a cloud-integrated client-server examination platform designed for secure, offline-capable stenography assessments with role-based access and real-time monitoring."
        />
      </head>
      <body className={`antialiased`}>
        <Toaster />
        <Navbar />
        {children}
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <Component>{children}</Component>
    </UserProvider>
  );
}
