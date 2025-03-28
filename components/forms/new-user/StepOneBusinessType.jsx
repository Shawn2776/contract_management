"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";

const businessTypes = [
  {
    id: "sole-proprietorship",
    name: "Sole Proprietorship",
    icon: Briefcase,
  },
  {
    id: "partnership",
    name: "Partnership",
    icon: Users,
  },
  {
    id: "llc",
    name: "Limited Liability Company",
    icon: Building2,
  },
  {
    id: "corporation",
    name: "Corporation",
    icon: Building,
  },
  {
    id: "unincorporated",
    name: "Unincorporated Business Association or Organization",
    icon: UsersRound,
  },
  {
    id: "individual",
    name: "Individual / Sole Trader",
    icon: Briefcase, // or swap for a “person” icon
  },
];

import {
  Briefcase,
  Users,
  Building2,
  Building,
  UsersRound,
} from "lucide-react";

import { useMultiStepForm } from "@/stores/useMultiStepForm";
import { useRouter } from "next/navigation";

const StepOneBusinessType = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [selected, setSelected] = useState("");
  const { setFormData, nextStep, setStep } = useMultiStepForm();

  const router = useRouter();

  const handleSelect = async (type) => {
    setSelected(type.id);
    setErrorMessage("");

    // Example backend validation (optional)
    try {
      const res = await fetch("/api/validate-business-type", {
        method: "POST",
        body: JSON.stringify({ businessType: type.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.message || "Invalid selection");
        return;
      }

      // Save to global state
      setFormData({ businessType: type.id });
      setStep(2);
      router.push("/new-user/2");
    } catch (err) {
      setErrorMessage("Server error. Please try again.");
    }
  };

  return (
    <Card className="rounded-none shadow-lg p-0 mb-0 gap-0">
      <CardContent className="w-full p-0 mb-0">
        {businessTypes.map((type) => (
          <button
            key={type.id}
            className={`w-full h-20 flex px-4 justify-between items-center border-b transition-all duration-200 ${
              selected === type.id
                ? "bg-primary text-white"
                : "bg-card text-card-foreground"
            } hover:bg-primary/50 hover:text-black hover:cursor-pointer ${
              type.id === "individual" ? "" : ""
            }`}
            onClick={() => handleSelect(type)}
          >
            <div className="flex items-center gap-8">
              <type.icon className="w-6 h-6" />
              <span className="text-left">{type.name}</span>
            </div>
            <FaChevronRight />
          </button>
        ))}
      </CardContent>
      <CardFooter>
        {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
      </CardFooter>
    </Card>
  );
};

export default StepOneBusinessType;
