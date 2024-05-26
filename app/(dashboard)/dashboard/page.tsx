
import Dashboard from "@/components/Dashboard";
import HeaderText from "@/components/Dashboard/HeaderText";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard"
};

export default function Home() {
  return (
    <>
      <HeaderText>Dashboard</HeaderText>
      <Dashboard />
    </>
  );
}  
