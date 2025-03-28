"use client";

import FormHeader from "@/components/forms/new-user/FormHeader";
import NewUserFormPageOne from "@/components/forms/new-user/StepOneBusinessType";
import NewUserFormPageFour from "@/components/forms/new-user/StepFourBusinessDetails";
import NewUserFormPageTwo from "@/components/forms/new-user/StepTwoCategory";
import NewUserFormPageThree from "@/components/forms/new-user/StepThreeSubcategory";
import { useMultiStepForm } from "@/stores/useMultiStepForm";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const NewUserPage = () => {
  const { step: currentStep, setStep } = useMultiStepForm();
  const { step } = useParams();
  const router = useRouter();

  const numericStep = parseInt(step);

  useEffect(() => {
    if (!isNaN(numericStep)) setStep(numericStep);
  }, [numericStep]);

  const renderStep = () => {
    switch (numericStep) {
      case 1:
        return (
          <>
            <FormHeader
              h2="Business Type"
              p="Select the legal type of your business"
            />
            <NewUserFormPageOne />
          </>
        );
      case 2:
        return (
          <>
            <FormHeader
              h2="Business Category"
              p="Select the category of your business"
            />
            <NewUserFormPageTwo />
          </>
        );
      case 3:
        return (
          <>
            <FormHeader
              h2="Business Subcategory"
              p="Select the subcategory of your business"
            />
            <NewUserFormPageThree />
          </>
        );
      case 4:
        return (
          <>
            <FormHeader
              h2="Business Information"
              p="Detialed business information"
            />
            <NewUserFormPageFour />
          </>
        );
      default:
        router.push("/new-user/1");
        return null;
    }
  };

  return <div className="w-full">{renderStep()}</div>;
};

export default NewUserPage;
