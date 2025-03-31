// import ProgressBar from "@/components/forms/new-user/ProgressBar";
import Navbar from "@/components/nav/Navbar";
// import { FormProvider } from "@/contexts/FormContext";
import React from "react";

const FormLayout = ({ children }) => {
  return (
    <div>
      <div className="border-b border-b-white md:border-none">
        <Navbar />
      </div>
      <div className="w-full max-w-lg mx-auto">
        {/* <ProgressBar /> */}
        {children}
      </div>
    </div>
  );
};

export default FormLayout;
