import { NextRequest, NextResponse } from "next/server";
import { hasSupabaseEnv, isSimulationMode } from "@/lib/supabase";
import type { FormField } from "@/lib/types";

function getMockFields(type: string): FormField[] {
  const forms: Record<string, FormField[]> = {
    "cp204": [
      { id: "company_name", label: "Company Name", label_bm: "Nama Syarikat", type: "text", required: true },
      { id: "reg_no", label: "Registration No", label_bm: "No Pendaftaran", type: "text", required: true },
      { id: "ya", label: "Year of Assessment", label_bm: "Tahun Taksiran", type: "number", required: true },
      { id: "estimate", label: "Tax Estimate", label_bm: "Anggaran Cukai", type: "number", required: true },
      { id: "address", label: "Address", label_bm: "Alamat", type: "textarea", required: true },
      { id: "contact", label: "Contact Person", label_bm: "Pegawai Dihubungi", type: "text", required: true },
      { id: "phone", label: "Phone", label_bm: "Telefon", type: "text", required: true },
      { id: "email", label: "Email", label_bm: "E-mel", type: "text", required: true },
      { id: "revenue", label: "Projected Revenue", label_bm: "Unjuran Hasil", type: "number", required: true },
      { id: "expenses", label: "Projected Expenses", label_bm: "Unjuran Belanja", type: "number", required: true },
      { id: "profit", label: "Projected Profit", label_bm: "Unjuran Untung", type: "number", required: true },
      { id: "signature", label: "Authorized Signatory", label_bm: "Penandatangan Sah", type: "text", required: true }
    ],
    "jakim-halal": [
      { id: "company_name", label: "Company Name", label_bm: "Nama Syarikat", type: "text", required: true },
      { id: "reg_no", label: "SSM No", label_bm: "No SSM", type: "text", required: true },
      { id: "product_name", label: "Product", label_bm: "Produk", type: "text", required: true },
      { id: "ingredients", label: "Ingredients", label_bm: "Ramuan", type: "textarea", required: true },
      { id: "premise", label: "Premise Address", label_bm: "Alamat Premis", type: "textarea", required: true },
      { id: "manager", label: "Halal Exec", label_bm: "Eksekutif Halal", type: "text", required: false },
      { id: "slaughter", label: "Slaughter Source", label_bm: "Sumber Sembelihan", type: "text", required: false },
      { id: "declaration", label: "Declaration", label_bm: "Akuan", type: "text", required: true }
    ],
    "ssm-renewal": [
      { id: "company_name", label: "Company Name", label_bm: "Nama Syarikat", type: "text", required: true },
      { id: "reg_no", label: "Registration No", label_bm: "No Pendaftaran", type: "text", required: true },
      { id: "business_address", label: "Business Address", label_bm: "Alamat Perniagaan", type: "textarea", required: true },
      { id: "owner_name", label: "Owner Name", label_bm: "Nama Pemilik", type: "text", required: true },
      { id: "renewal_period", label: "Renewal Period", label_bm: "Tempoh Pembaharuan", type: "text", required: true },
      { id: "payment_ref", label: "Payment Ref", label_bm: "Rujukan Bayaran", type: "text", required: false }
    ]
  };

  return forms[type] ?? [];
}

export async function GET(_req: NextRequest, { params }: { params: { type: string } }): Promise<NextResponse> {
  try {
    return NextResponse.json({ fields: getMockFields(params.type) });
  } catch (error) {
    console.error("/api/forms GET failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(_req: Request, { params }: { params: { type: string } }): Promise<NextResponse> {
  try {
    const fields = getMockFields(params.type).map((f) => ({
      ...f,
      value:
        f.id === "company_name"
          ? "Warung Mak Jah"
          : f.id === "reg_no"
            ? "202303223344"
            : f.id === "business_address"
              ? "Subang Jaya"
              : f.value ?? "",
    }));

    if (isSimulationMode || !hasSupabaseEnv) {
      return NextResponse.json({ fields });
    }

    return NextResponse.json({ fields });
  } catch (error) {
    console.error("/api/forms POST failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}