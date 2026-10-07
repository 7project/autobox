import { NextRequest, NextResponse } from "next/server";
import { saveUserConsent } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      consentPdan = false,
      consentOferta = false,
      consentCookies = false,
      consentSource = "website_direct",
      clientToken,
      clientPhone,
      clientName,
    } = body;

    // Check that at least one consent is given
    if (!consentPdan && !consentOferta && !consentCookies) {
      return NextResponse.json(
        { error: "Не выбрано ни одно согласие" },
        { status: 400 }
      );
    }

    // Extract client IP address
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const clientIp = (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp) || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const result = await saveUserConsent({
      clientToken: clientToken || undefined,
      ipAddress: clientIp,
      userAgent,
      consentPdan: Boolean(consentPdan),
      consentOferta: Boolean(consentOferta),
      consentCookies: Boolean(consentCookies),
      consentSource: String(consentSource),
      clientPhone: clientPhone ? String(clientPhone).trim() : undefined,
      clientName: clientName ? String(clientName).trim() : undefined,
    });

    return NextResponse.json({
      success: true,
      id: result.id,
      timestamp: new Date().toISOString(),
      message: "Согласие зафиксировано в реестре автосервиса",
    });
  } catch (error: any) {
    console.error("[api/consent error]:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка при фиксации согласия" },
      { status: 500 }
    );
  }
}
