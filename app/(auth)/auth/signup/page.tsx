import React from "react"
import { Metadata } from "next";

import Steps from "./Steps";
export const metadata: Metadata = {
  title: "Signup Page | Next.js E-commerce Dashboard Template",
  description: "This is Signup page for TailAdmin Next.js",
  // other metadata
};

const page: React.FC = () => {
  return (
    <>
      <Steps />
    </>
  );
};

export default page;
