"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type FormType = "ssm" | "lhdn-cp204";

type ExtractedData = {
  company_name?: string;
  reg_no?: string;
  amount?: number;
};

type BusinessProfile = {
  name: string;
  location: string;
  type: string;
};

type Props = {
  formType: FormType;
  extractedData: ExtractedData;
  businessProfile: BusinessProfile;
  onSubmitted: () => void;
};

type FieldConfig = {
  key: string;
  label: string;
  placeholder?: string;
};

const FORM_FIELDS: Record<FormType, FieldConfig[]> = {
  ssm: [
    { key: "company_name", label: "Company Name" },
    { key: "company_reg_no", label: "Company Registration No" },
    { key: "registered_address", label: "Registered Address" },
    { key: "business_nature", label: "Business Nature" },
    { key: "annual_return_date", label: "Annual Return Date", placeholder: "Fill in manually" },
    { key: "directors_list", label: "Directors List", placeholder: "Fill in manually" },
  ],
  "lhdn-cp204": [
    { key: "company_name", label: "Company Name" },
    { key: "tax_ref_no", label: "Tax Reference No" },
    { key: "accounting_period_start", label: "Accounting Period Start", placeholder: "Fill in manually" },
    { key: "accounting_period_end", label: "Accounting Period End", placeholder: "Fill in manually" },
    { key: "estimated_tax_payable", label: "Estimated Tax Payable" },
    { key: "installment_amount", label: "Installment Amount (Auto / 12)" },
  ],
};

function buildInitialState(
  formType: FormType,
  extractedData: ExtractedData,
  businessProfile: BusinessProfile,
): { values: Record<string, string>; prefilled: Record<string, boolean> } {
  if (formType === "ssm") {
    const values: Record<string, string> = {
      company_name: extractedData.company_name ?? businessProfile.name ?? "",
      company_reg_no: extractedData.reg_no ?? "",
      registered_address: businessProfile.location ?? "",
      business_nature: businessProfile.type ?? "",
      annual_return_date: "",
      directors_list: "",
    };

    const prefilled: Record<string, boolean> = {
      company_name: Boolean(extractedData.company_name ?? businessProfile.name),
      company_reg_no: Boolean(extractedData.reg_no),
      registered_address: Boolean(businessProfile.location),
      business_nature: Boolean(businessProfile.type),
      annual_return_date: false,
      directors_list: false,
    };

    return { values, prefilled };
  }

  const estimated = extractedData.amount ? String(extractedData.amount) : "";
  const installment = extractedData.amount ? String(Math.round((extractedData.amount / 12) * 100) / 100) : "";

  const values: Record<string, string> = {
    company_name: extractedData.company_name ?? businessProfile.name ?? "",
    tax_ref_no: extractedData.reg_no ?? "",
    accounting_period_start: "",
    accounting_period_end: "",
    estimated_tax_payable: estimated,
    installment_amount: installment,
  };

  const prefilled: Record<string, boolean> = {
    company_name: Boolean(extractedData.company_name ?? businessProfile.name),
    tax_ref_no: Boolean(extractedData.reg_no),
    accounting_period_start: false,
    accounting_period_end: false,
    estimated_tax_payable: Boolean(extractedData.amount),
    installment_amount: Boolean(extractedData.amount),
  };

  return { values, prefilled };
}

export default function FormAutofillPanel({ formType, extractedData, businessProfile, onSubmitted }: Props): JSX.Element {
  const [fields, setFields] = useState<Record<string, string>>({});
  const [prefilledMap, setPrefilledMap] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const initial = buildInitialState(formType, extractedData, businessProfile);
    setFields(initial.values);
    setPrefilledMap(initial.prefilled);
    setSubmitted(false);
  }, [formType, extractedData, businessProfile]);

  useEffect(() => {
    if (formType !== "lhdn-cp204") return;

    const estimatedRaw = fields.estimated_tax_payable;
    const estimated = Number(estimatedRaw);
    if (!Number.isFinite(estimated) || estimated <= 0) return;

    const nextInstallment = String(Math.round((estimated / 12) * 100) / 100);
    if (fields.installment_amount !== nextInstallment) {
      setFields((prev) => ({ ...prev, installment_amount: nextInstallment }));
    }
  }, [formType, fields.estimated_tax_payable, fields.installment_amount]);

  const formLabel = formType === "ssm" ? "SSM Annual Return" : "LHDN CP204";
  const configs = useMemo(() => FORM_FIELDS[formType], [formType]);

  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-white">Form Autofill - {formLabel}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          {configs.map((field) => {
            const prefilled = prefilledMap[field.key];
            return (
              <div key={field.key} className="space-y-1">
                <label className="text-xs uppercase tracking-wide text-neutral-400">{field.label}</label>
                <Input
                  value={fields[field.key] ?? ""}
                  onChange={(e) => setFields((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder ?? "Fill in manually"}
                  className={
                    prefilled
                      ? "border-neutral-700 bg-emerald-950/40 text-neutral-100 placeholder:text-neutral-500 focus-visible:ring-emerald-500"
                      : "border-neutral-700 bg-neutral-950 text-neutral-100 placeholder:text-neutral-500"
                  }
                  style={prefilled ? { borderLeft: "3px solid #22c55e" } : undefined}
                />
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
            setSubmitted(true);
            onSubmitted();
          }}>
            Simulate Submit
          </Button>
          <p className="text-xs text-neutral-500">This does not submit to the real portal</p>
        </div>

        {submitted ? (
          <div className="flex items-center gap-2 rounded-md border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            <span>Form simulated successfully. Done! Form simulated.</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}