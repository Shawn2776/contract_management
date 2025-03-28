// import ProgressBar from "@/components/forms/new-user/ProgressBar";
import Navbar from "@/components/Navbar";
// import { FormProvider } from "@/contexts/FormContext";
import React from "react";

const FormLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="w-full max-w-lg mx-auto">
        {/* <ProgressBar /> */}
        {children}
      </div>
    </div>
  );
};

export default FormLayout;
