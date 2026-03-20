import { NextResponse } from "next/server";

type TaxType = "SST 6%" | "SST 0%" | "Exempt" | "None";

type LineItem = {
  description: string;
  quantity: number;
  unit_price: number;
  tax_type: TaxType;
  tax_rate: number;
  tax_amount: number;
  total: number;
};

type InvoiceFields = {
  supplier_name: string;
  supplier_tin: string;
  supplier_reg_no: string;
  supplier_msic: string;
  supplier_address: string;
  supplier_phone: string;
  supplier_email: string;
  buyer_name: string;
  buyer_tin: string;
  buyer_reg_no: string;
  buyer_address: string;
  invoice_number: string;
  invoice_date: string;
  invoice_time: string;
  currency: string;
  exchange_rate: string;
  line_items: LineItem[];
  subtotal: number;
  tax_total: number;
  grand_total: number;
};

type GenerateBody = { fields?: Partial<InvoiceFields> };

function toNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeTaxType(value: string): TaxType {
  if (value === "SST 0%") return "SST 0%";
  if (value === "Exempt") return "Exempt";
  if (value === "None") return "None";
  return "SST 6%";
}

function normalizeFields(input: Partial<InvoiceFields>): InvoiceFields {
  const lineItems = (input.line_items ?? []).map((line) => {
    const quantity = toNumber(line.quantity, 1);
    const unitPrice = toNumber(line.unit_price, 0);
    const taxType = normalizeTaxType(String(line.tax_type ?? "SST 6%"));
    const taxRate = taxType === "SST 6%" ? 0.06 : 0;
    const lineExtension = quantity * unitPrice;
    const taxAmount = Number((lineExtension * taxRate).toFixed(2));
    const total = Number((lineExtension + taxAmount).toFixed(2));
    return {
      description: String(line.description ?? ""),
      quantity,
      unit_price: unitPrice,
      tax_type: taxType,
      tax_rate: Number((line.tax_rate ?? taxRate).toFixed(2)),
      tax_amount: toNumber(line.tax_amount, taxAmount),
      total: toNumber(line.total, total),
    } satisfies LineItem;
  });

  const subtotal = Number(
    (lineItems.length > 0
      ? lineItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
      : toNumber(input.subtotal, 0)
    ).toFixed(2),
  );
  const taxTotal = Number(
    (lineItems.length > 0 ? lineItems.reduce((sum, item) => sum + item.tax_amount, 0) : toNumber(input.tax_total, 0)).toFixed(2),
  );
  const grandTotal = Number(
    (lineItems.length > 0 ? subtotal + taxTotal : toNumber(input.grand_total, subtotal + taxTotal)).toFixed(2),
  );

  return {
    supplier_name: String(input.supplier_name ?? ""),
    supplier_tin: String(input.supplier_tin ?? ""),
    supplier_reg_no: String(input.supplier_reg_no ?? ""),
    supplier_msic: String(input.supplier_msic ?? ""),
    supplier_address: String(input.supplier_address ?? ""),
    supplier_phone: String(input.supplier_phone ?? ""),
    supplier_email: String(input.supplier_email ?? ""),
    buyer_name: String(input.buyer_name ?? ""),
    buyer_tin: String(input.buyer_tin ?? ""),
    buyer_reg_no: String(input.buyer_reg_no ?? ""),
    buyer_address: String(input.buyer_address ?? ""),
    invoice_number: String(input.invoice_number ?? ""),
    invoice_date: String(input.invoice_date ?? ""),
    invoice_time: String(input.invoice_time ?? ""),
    currency: String(input.currency ?? "MYR"),
    exchange_rate: String(input.exchange_rate ?? "1.0"),
    line_items: lineItems,
    subtotal,
    tax_total: taxTotal,
    grand_total: grandTotal,
  };
}

function validate(fields: InvoiceFields): string | null {
  if (!fields.supplier_name.trim()) return "supplier_name is required";
  if (!fields.buyer_name.trim()) return "buyer_name is required";
  if (!fields.invoice_number.trim()) return "invoice_number is required";
  if (!fields.invoice_date.trim()) return "invoice_date is required";
  if (!fields.line_items.length) return "At least one line item is required";
  const invalidLine = fields.line_items.find(
    (item) => !item.description.trim() || item.quantity <= 0 || item.unit_price < 0,
  );
  if (invalidLine) return "Each line item needs description, quantity > 0 and non-negative unit price";
  return null;
}

function buildMyInvois(fields: InvoiceFields): Record<string, unknown> {
  return {
    _D: "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
    _A: "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
    _B: "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
    Invoice: [
      {
        ID: [{ _: fields.invoice_number }],
        IssueDate: [{ _: fields.invoice_date }],
        IssueTime: [{ _: fields.invoice_time || "00:00:00Z" }],
        InvoiceTypeCode: [{ _: "01", listVersionID: "1.0" }],
        DocumentCurrencyCode: [{ _: fields.currency || "MYR" }],
        TaxCurrencyCode: [{ _: "MYR" }],
        AccountingSupplierParty: [
          {
            Party: [
              {
                IndustryClassificationCode: [
                  {
                    _: fields.supplier_msic || "00000",
                    name: fields.supplier_name || "",
                  },
                ],
                PartyIdentification: [
                  { ID: [{ _: fields.supplier_tin || "", schemeID: "TIN" }] },
                  { ID: [{ _: fields.supplier_reg_no || "", schemeID: "BRN" }] },
                ],
                PostalAddress: [
                  {
                    AddressLine: [{ Line: [{ _: fields.supplier_address || "" }] }],
                    Country: [{ IdentificationCode: [{ _: "MYS" }] }],
                  },
                ],
                PartyLegalEntity: [{ RegistrationName: [{ _: fields.supplier_name || "" }] }],
                Contact: [
                  {
                    Telephone: [{ _: fields.supplier_phone || "" }],
                    ElectronicMail: [{ _: fields.supplier_email || "" }],
                  },
                ],
              },
            ],
          },
        ],
        AccountingCustomerParty: [
          {
            Party: [
              {
                PartyIdentification: [
                  { ID: [{ _: fields.buyer_tin || "", schemeID: "TIN" }] },
                  { ID: [{ _: fields.buyer_reg_no || "", schemeID: "BRN" }] },
                ],
                PostalAddress: [
                  {
                    AddressLine: [{ Line: [{ _: fields.buyer_address || "" }] }],
                    Country: [{ IdentificationCode: [{ _: "MYS" }] }],
                  },
                ],
                PartyLegalEntity: [{ RegistrationName: [{ _: fields.buyer_name || "" }] }],
              },
            ],
          },
        ],
        InvoiceLine: fields.line_items.map((item, index) => ({
          ID: [{ _: String(index + 1) }],
          InvoicedQuantity: [{ _: item.quantity, unitCode: "C62" }],
          LineExtensionAmount: [{ _: item.unit_price * item.quantity, currencyID: "MYR" }],
          TaxTotal: [
            {
              TaxAmount: [{ _: item.tax_amount, currencyID: "MYR" }],
              TaxSubtotal: [
                {
                  TaxableAmount: [{ _: item.unit_price * item.quantity, currencyID: "MYR" }],
                  TaxAmount: [{ _: item.tax_amount, currencyID: "MYR" }],
                  TaxCategory: [
                    {
                      ID: [{ _: item.tax_type === "Exempt" ? "E" : "S" }],
                      TaxExemptionReason: item.tax_type === "Exempt" ? [{ _: "Exempt Supply" }] : [],
                      Percent: [{ _: item.tax_rate }],
                      TaxScheme: [{ ID: [{ _: "OTH", schemeID: "UN/ECE 5153", schemeAgencyID: "6" }] }],
                    },
                  ],
                },
              ],
            },
          ],
          Item: [
            {
              CommodityClassification: [
                { ItemClassificationCode: [{ _: fields.supplier_msic || "00000", listID: "CLASS" }] },
              ],
            },
            { Description: [{ _: item.description }] },
          ],
          Price: [{ PriceAmount: [{ _: item.unit_price, currencyID: "MYR" }] }],
        })),
        TaxTotal: [
          {
            TaxAmount: [{ _: fields.tax_total || 0, currencyID: "MYR" }],
            TaxSubtotal: [
              {
                TaxableAmount: [{ _: fields.subtotal || 0, currencyID: "MYR" }],
                TaxAmount: [{ _: fields.tax_total || 0, currencyID: "MYR" }],
                TaxCategory: [
                  {
                    ID: [{ _: "S" }],
                    TaxScheme: [{ ID: [{ _: "OTH", schemeID: "UN/ECE 5153", schemeAgencyID: "6" }] }],
                  },
                ],
              },
            ],
          },
        ],
        LegalMonetaryTotal: [
          {
            LineExtensionAmount: [{ _: fields.subtotal || 0, currencyID: "MYR" }],
            TaxExclusiveAmount: [{ _: fields.subtotal || 0, currencyID: "MYR" }],
            TaxInclusiveAmount: [{ _: fields.grand_total || 0, currencyID: "MYR" }],
            PayableAmount: [{ _: fields.grand_total || 0, currencyID: "MYR" }],
          },
        ],
      },
    ],
  };
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as GenerateBody;
    const fields = normalizeFields(body.fields ?? {});
    const error = validate(fields);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const invoiceNumber = fields.invoice_number || `INV-${Date.now()}`;
    const today = new Date().toISOString().split("T")[0];
    const myinvois = buildMyInvois({ ...fields, invoice_number: invoiceNumber });
    const filename = `MyInvois_${invoiceNumber}_${today}.json`;

    return new NextResponse(JSON.stringify(myinvois, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("MyInvois generation error:", error);
    return NextResponse.json({ error: "Failed to generate MyInvois JSON." }, { status: 500 });
  }
}
