import { SessionOptions } from "iron-session";
export type roleType =
  | "company-user"
  | "company-admin"
  | "super-admin"
  | "company";
export interface SessionData {
  user: {
    companyId: string;
    isLoggedIn: boolean;
    name: string;
    token: string;
    email: string;
    maxUsers: number;
    profile: string;
    role: roleType;
  };
}
export const defaultSession: SessionData = {
  user: {
    companyId: "",
    name: "",
    isLoggedIn: false,
    token: "",
    email: "",
    maxUsers: 10,
    profile: "",
    role: "company-user",
  },
};
export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: process.env.NEXT_PUBLIC_COOKIE_NAME as string,
  cookieOptions: {
    // secure only works in HTTPS environments
    secure: process.env.NODE_ENV === "production",
  },
};

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user?: {
      isLoggedIn: boolean;
      name: string;
      token: string;
      email: string;
      maxUsers: number;
      profile: string;
    };
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
