// app/components/forms/new-user/StepFiveReviewSubmit.js
"use client";

import { useMultiStepForm } from "@/stores/useMultiStepForm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function StepFiveReviewSubmit() {
  const { data, step, setStep, resetForm } = useMultiStepForm();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleBack = () => {
    setStep(step - 1);
    router.push(`/new-user/${step - 1}`);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/new-user/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Something went wrong.");
      }

      resetForm();
      router.push("/new-user/success");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="rounded-none shadow-lg p-2 mb-0 gap-0">
      <CardContent className="w-full p-0 mb-0 space-y-4">
        <div className="space-y-2 text-sm">
          <p>
            <strong>Business Type:</strong> {data.businessType}
          </p>
          <p>
            <strong>Category:</strong> {data.businessCategory}
          </p>
          <p>
            <strong>Subcategory:</strong> {data.businessSubcategory}
          </p>
          <p>
            <strong>Legal Name:</strong> {data.legalBusinessName}
          </p>
          <p>
            <strong>Doing Business As:</strong> {data.doingBusinessAs || "—"}
          </p>
          <p>
            <strong>EIN:</strong> {data.ein}
          </p>
          <p>
            <strong>State:</strong> {data.businessState}
          </p>
          <p>
            <strong>Online Status:</strong> {data.onlineStatus}
          </p>
          {data.onlineLink && (
            <p>
              <strong>Online Link:</strong> {data.onlineLink}
            </p>
          )}
        </div>

        {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}

        <div className="flex mt-6">
          <Button onClick={handleBack} className="w-1/2 rounded-none border-r">
            <MdOutlineKeyboardReturn className="mr-1" /> Back
          </Button>
          <Button
            onClick={handleSubmit}
            className="w-1/2 rounded-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
