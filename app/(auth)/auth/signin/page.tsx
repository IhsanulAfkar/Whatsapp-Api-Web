import React from "react";
import Link from "next/link";
import Image from "next/image"
import { Metadata, NextPage } from "next";
import SignIn from "./SignIn";
export const metadata: Metadata = {
  title: "Signin"
};

const page: NextPage = () => {
  return (
    <>
      <SignIn />
    </>
  );
};

export default page;
