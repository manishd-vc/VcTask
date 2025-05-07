"use server";
import { ErrorHandler, errorHandler } from "@/lib/error-handler";
import fetcher from "@/lib/fetcher/server";
import { roleType, SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface LoginResponse {
  _id: string;
  name: string;
  token: string;
  email: string;
  role: roleType;
  maxUsers: number;
  profile: string;
}

export async function login<Response extends LoginResponse>({
  request,
  payload,
}: {
  request: string;
  payload: string;
}): Promise<ErrorHandler<Response>> {
  return errorHandler(async () => {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    const res = await fetcher<Response>({
      request,
      method: "POST",
      token: true,
      payload: {
        ...JSON.parse(payload),
      },
    });
    session.user = {
      isLoggedIn: true,
      companyId: res.data?._id,
      name: res.data?.name,
      token: res.data?.token,
      email: res.data?.email,
      role: res.data?.role,
      maxUsers: res.data?.maxUsers,
      profile: res.data?.profile,
    };
    await session.save();
    return res.data;
  });
}
