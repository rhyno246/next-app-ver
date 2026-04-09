"use client";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LOGOUT_AUTHOR } from "@/graphql/mutations";
import { GET_ME } from "@/graphql/queries";
import { useUserStore } from "@/store/user-store";
import { MeResponse } from "@/types/type";
import { useMutation, useQuery } from "@apollo/client/react";
import { Home, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Header() {
  const { data: meData } = useQuery<MeResponse>(GET_ME);
  const [logout] = useMutation(LOGOUT_AUTHOR);
  const { logOut, setUser } = useUserStore();
  const user = meData?.me;
  const router = useRouter();
  const handleLogOut = async () => {
    logOut();
    logout();
    await signOut({ redirect: false });
    router.push("/");
  };

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);
  return (
    <nav className="p-4 flex items-center justify-between bg-gray-4">
      <SidebarTrigger />
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src={`${user?.image ? user?.image : "/images/users/user-04.jpg"}`}
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
              <AvatarBadge className="bg-green-600 dark:bg-green-800" />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8}>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Home className="h-[1.2rem] w-[1.2rem] mr-1" />
                <Link href="/">Client</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-[1.2rem] w-[1.2rem] mr-1" />
                <Link href="/admin/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={handleLogOut}>
                <LogOut className="h-[1.2rem] w-[1.2rem] mr-1" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
