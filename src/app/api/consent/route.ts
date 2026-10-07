import { NextRequest, NextResponse } from "next/server";
import { saveUserConsent, supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId") || searchParams.get("clientToken");

    if (!sessionId) {
      return NextResponse.json({ isGranted: false, status: "unknown" });
    }

    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from("user_consents")
        .select("id, status, consent_pdan, consent_oferta, consent_cookies, created_at")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        const latest = data[0];
        const isGranted = latest.status === "granted" && (latest.consent_pdan || latest.consent_oferta);
        return NextResponse.json({
          isGranted,
          status: latest.status,
          record: latest,
        });
      }
    }

    return NextResponse.json({ isGranted: false, status: "none" });
  } catch (error: any) {
    return NextResponse.json({ isGranted: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      sessionId,
      clientToken,
      consentPdan = false,
      consentOferta = false,
      consentCookies = false,
      status, // 'granted' | 'revoked'
      consentSource = "website_direct",
    } = body;

    const resolvedSessionId = sessionId || clientToken;

    if (!resolvedSessionId) {
      return NextResponse.json(
        { error: "Требуется идентификатор сессии (sessionId) для унификации пользователя" },
        { status: 400 }
      );
    }

    const consentStatus =
      status || (Boolean(consentPdan) || Boolean(consentOferta) ? "granted" : "revoked");

    // Extract client IP address
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const clientIp = (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp) || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const result = await saveUserConsent({
      sessionId: resolvedSessionId,
      consentPdan: consentStatus === "granted" ? Boolean(consentPdan) : false,
      consentOferta: consentStatus === "granted" ? Boolean(consentOferta) : false,
      consentCookies: Boolean(consentCookies),
      status: consentStatus,
      consentSource: String(consentSource),
      ipAddress: clientIp,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      id: result.id,
      status: result.status,
      timestamp: new Date().toISOString(),
      message:
        consentStatus === "granted"
          ? "Согласие успешно зафиксировано в реестре автосервиса"
          : "Согласие успешно отозвано в реестре автосервиса",
    });
  } catch (error: any) {
    console.error("[api/consent error]:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка при фиксации согласия" },
      { status: 500 }
    );
  }
}
