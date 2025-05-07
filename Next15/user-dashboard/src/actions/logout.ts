"use server";
import { ErrorHandler, errorHandler } from "@/lib/error-handler";
import { SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function logout(): Promise<ErrorHandler<{ ok: boolean }>> {
  return errorHandler(async () => {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );
    session.destroy();

    // Redirect to login page after destroying the session

    // This return won't actually be reached due to the redirect
    return {
      ok: true,
      data: {},
    };
  });
}
