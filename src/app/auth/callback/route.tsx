import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const cookieStore = await cookies();
      const pendingInviteCode = cookieStore.get("pending_invite_code")?.value;

      if (pendingInviteCode) {
        await supabase
          .from("invite_codes")
          .update({
            used_by: user.id,
            used_at: new Date().toISOString(),
            is_active: false,
          })
          .eq("code", pendingInviteCode);

        // Clear the cookie after processing
        const response = NextResponse.redirect(`${origin}/onboarding`);
        response.cookies.delete("pending_invite_code");
        return response;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      // If no username set, send to onboarding
      if (!profile?.username) {
        return NextResponse.redirect(`${origin}/onboarding`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
