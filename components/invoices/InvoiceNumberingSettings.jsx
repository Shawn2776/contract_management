"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function InvoiceNumberingSettings() {
  const [prefix, setPrefix] = useState("INV");
  const [format, setFormat] = useState("{prefix}-{counter}");
  const [counter, setCounter] = useState(1);
  const [isSetup, setIsSetup] = useState(false);
  const [preview, setPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings/invoice-numbering")
      .then((res) => res.json())
      .then((data) => {
        setPrefix(data.invoicePrefix || "INV");
        setFormat(data.invoiceFormat || "{prefix}-{counter}");
        setCounter(data.invoiceCounter || 1);
        setIsSetup(data.isInvoiceSetup);
        setPreview(data.preview);
      });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const res = await fetch("/api/settings/invoice-numbering", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prefix, format, counter, isInvoiceSetup: true }),
    });

    if (res.ok) {
      toast.success("Invoice settings saved");
      const updated = await res.json();
      setPreview(updated.preview);
    } else {
      toast.error("Error saving settings");
    }
    setIsSaving(false);
  };

  return (
    <Card className="max-w-2xl w-full">
      <CardHeader>
        <CardTitle>Invoice Numbering</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSetup && (
          <div className="bg-yellow-100 text-yellow-800 text-sm p-3 rounded">
            You're currently in <strong>Demo Mode</strong>. Invoice numbers are
            temporary until configured.
          </div>
        )}

        <div>
          <Label>Invoice Prefix</Label>
          <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} />
        </div>

        <div>
          <Label>Invoice Format</Label>
          <Input
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            placeholder="e.g. {prefix}-{year}-{counter}"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Use placeholders: <code>{"{prefix}"}</code>, <code>{"{year}"}</code>
            , <code>{"{month}"}</code>, <code>{"{counter}"}</code>
          </p>
        </div>

        <div>
          <Label>Current Counter</Label>
          <Input
            type="number"
            value={counter}
            onChange={(e) => setCounter(parseInt(e.target.value))}
            min={1}
          />
        </div>

        <div>
          <Label>Preview</Label>
          <div className="p-2 rounded border text-muted-foreground bg-muted text-sm">
            {preview || "Loading preview..."}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="go-live"
            checked={isSetup}
            onCheckedChange={setIsSetup}
            disabled={true}
          />
          <Label htmlFor="go-live">Invoice Numbering Configured</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
}
