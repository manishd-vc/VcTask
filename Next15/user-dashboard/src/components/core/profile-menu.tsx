"use client";

import { logout } from "@/actions/logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SessionData } from "@/lib/session";
import { LogOut, Triangle, User } from "lucide-react";
import { useRouter } from "next/navigation";
import dummyProfile from "@/public/dummy.png";
export default function ProfileMenu({
  user,
}: Readonly<{ user: SessionData["user"] }>) {
  const router = useRouter();
  const { name, email } = user || {};
  const menuItems = [
    {
      label: "Profile",
      icon: User,
      onClick: () => router.push("/profile"),
    },
  ];
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none flex items-center gap-1 cursor-pointer">
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage
              src={
                user?.profile
                  ? `${process.env.NEXT_PUBLIC_AWS_BUCKET}/${user?.profile}`
                  : dummyProfile.src
              }
              alt={name}
              className="object-cover"
            />
            <AvatarFallback>
              {name
                ?.split(" ")
                ?.map((n: string) => n[0])
                ?.join("")
                ?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Triangle
            strokeWidth={0}
            className="size-2 rotate-180"
            fill="currentColor"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-44" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={item.onClick}
              className="cursor-pointer"
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
