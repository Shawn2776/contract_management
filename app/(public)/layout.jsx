// import ProgressBar from "@/components/forms/new-user/ProgressBar";
import Navbar from "@/components/Navbar";
// import { FormProvider } from "@/contexts/FormContext";
import React from "react";

const PublicLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="w-full h-full mx-auto">{children}</div>
    </div>
  );
};

export default PublicLayout;
