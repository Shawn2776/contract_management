import { states } from "@/components/states/States";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMultiStepForm } from "@/stores/useMultiStepForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdOutlineKeyboardReturn } from "react-icons/md";

const StepFourBusinessDetails = () => {
  const router = useRouter();
  const { step, setStep, setFormData, data: formData } = useMultiStepForm();

  const [legalBusinessName, setLegalBusinessName] = useState(
    formData.legalBusinessName || ""
  );
  const [doingBusinessAs, setDoingBusinessAs] = useState(
    formData.doingBusinessAs || ""
  );
  const [ein, setEin] = useState(formData.ein || "");
  const [selectedState, setSelectedState] = useState(
    formData.businessState || ""
  );
  const [onlineStatus, setOnlineStatus] = useState(
    formData.onlineStatus || "notOnline"
  );
  const [onlineLink, setOnlineLink] = useState(formData.onlineLink || "");
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleBack = () => {
    setStep(step - 1);
    router.push(`/new-user/${step - 1}`);
  };

  const verifyBusiness = async () => {
    if (!legalBusinessName.trim() || !selectedState) {
      setMessage("Please enter a business name and select a state.");
      return false;
    }

    setIsVerifying(true);
    setMessage("");

    try {
      const normalizedInput = normalizeName(legalBusinessName);

      if (selectedState === "Alabama") {
        const res = await fetch("/api/validate/alabama", {
          method: "POST",
          body: JSON.stringify({ name: legalBusinessName }),
        });
        const results = await res.json();
        const exactMatch = results.find(
          (r) => normalizeName(r.entityName) === normalizedInput
        );
        setMessage(exactMatch ? "Results verified" : "No exact match found.");
        setIsVerified(!!exactMatch);
        return !!exactMatch;
      }

      if (selectedState === "Arizona") {
        const res = await fetch("/api/validate/az", {
          method: "POST",
          body: JSON.stringify({ name: legalBusinessName }),
        });
        const results = await res.json();
        const exactMatch = results.Results?.find(
          (r) => normalizeName(r.Name) === normalizedInput
        );
        setMessage(
          exactMatch ? "Results verified (AZ)" : "No exact AZ match found."
        );
        setIsVerified(!!exactMatch);
        return !!exactMatch;
      }

      // All other states pass for now
      setMessage("Verified (no check for non-AZ/AL states).");
      setIsVerified(true);
      return true;
    } catch (err) {
      console.error(err);
      setMessage("Error during verification.");
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNext = async () => {
    if (onlineStatus === "online" && !onlineLink.trim()) {
      setMessage("Please provide an online link.");
      return;
    }

    let verified = isVerified;
    if (!verified) {
      verified = await verifyBusiness();
    }

    if (verified) {
      setFormData({
        legalBusinessName,
        doingBusinessAs,
        ein,
        businessState: selectedState,
        onlineStatus,
        onlineLink,
      });
      setStep(step + 1);
      router.push(`/new-user/${step + 1}`);
    }
  };

  return (
    <Card className="rounded-none shadow-lg p-2 mb-0 gap-0">
      <CardContent className="w-full p-0 mb-0 space-y-4">
        <Label className="block text-sm font-medium text-gray-700">
          Legal Business Name
        </Label>
        <Input
          value={legalBusinessName}
          onChange={(e) => setLegalBusinessName(e.target.value)}
          placeholder="Registered name of company"
          className="mt-1 block w-full border border-gray-300 rounded-none p-2"
        />
        {message && (
          <p
            className={`text-xs mt-1 ${
              message.toLowerCase().includes("verified")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <Label className="block text-sm font-medium text-gray-700">
          Doing Business As (Optional)
        </Label>
        <Input
          value={doingBusinessAs}
          onChange={(e) => setDoingBusinessAs(e.target.value)}
          placeholder="Name on receipts"
          className="mt-1 block w-full border border-gray-300 rounded-none p-2"
        />

        <Label className="block text-sm font-medium text-gray-700">EIN</Label>
        <Input
          value={ein}
          onChange={(e) => setEin(e.target.value)}
          placeholder="Format: 123456789 or 12-3456789"
          className="mt-1 block w-full border border-gray-300 rounded-none p-2"
        />

        <div className="w-full">
          <Label className="block text-sm font-medium text-gray-700 w-full">
            Business State
          </Label>
          <Select
            value={selectedState}
            onValueChange={(value) => setSelectedState(value)}
            className="w-full"
          >
            <SelectTrigger value="" className="w-full">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Label className="block text-sm font-medium text-gray-700 mb-1">
          Where to find your business online
        </Label>
        <div className="flex gap-6">
          <Label className="inline-flex items-center">
            <input
              type="radio"
              value="online"
              checked={onlineStatus === "online"}
              onChange={() => setOnlineStatus("online")}
              className="form-radio"
            />
            <span className="ml-2">Social Media or Website</span>
          </Label>
          <Label className="inline-flex items-center">
            <input
              type="radio"
              value="notOnline"
              checked={onlineStatus === "notOnline"}
              onChange={() => setOnlineStatus("notOnline")}
              className="form-radio"
            />
            <span className="ml-2">Not online</span>
          </Label>
        </div>
        {onlineStatus === "online" && (
          <input
            value={onlineLink}
            onChange={(e) => setOnlineLink(e.target.value)}
            placeholder="https://yourcompany.com"
            className="mt-2 block w-full border border-gray-300 rounded-md p-2"
          />
        )}

        <div className="flex items-center">
          <Button
            onClick={handleBack}
            className="w-1/2 rounded-none border-r cursor-pointer"
          >
            <MdOutlineKeyboardReturn className="mr-1" /> Back
          </Button>
          <Button
            onClick={handleNext}
            className="w-1/2 rounded-none cursor-pointer"
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Next"}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 px-6 pb-6"></CardFooter>
    </Card>
  );
};

export default StepFourBusinessDetails;
