import Navbar from "@/components/core/navbar";
import ProfileMenu from "@/components/core/profile-menu";
import { SessionData, sessionOptions } from "@/lib/session";

import { User } from "@/types/user";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import Image from "next/image";
import logo from "@/public/fruit-erp-logo.svg";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );
  const { user } = session;
  return (
    <main className="relative h-[100dvh] flex flex-wrap w-full bg-zircon overflow-hidden">
      <aside className="relative w-[90px] bg-white shadow h-full overflow-y-auto">
        <div className="logo py-2.5 px-5 flex items-center justify-center border-b border-zircon">
          <Image src={logo} alt="icon" width={40} height={40} />
        </div>
        <Navbar user={user as unknown as User} />
      </aside>
      <div className="w-full max-w-[calc(100%-90px)] h-full overflow-y-auto">
        <header className="w-full bg-white py-2 lg:px-7 px-4 flex items-center gap-3 justify-end min-h-[60px] sticky top-0 z-10">
          <ProfileMenu user={user} />
        </header>
        <div className="main-content lg:px-8 px-4 lg:py-6 py-4">{children}</div>
      </div>
    </main>
  );
}
