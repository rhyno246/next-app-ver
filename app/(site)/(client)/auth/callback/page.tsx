// app/auth/callback/page.tsx  ← tạo file này
"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Author } from "@/types/type";
import { useUserStore } from "@/store/user-store";
import LoadingComponent from "@/components/Common/LoadingComponent";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const authorParam = searchParams.get("author");
    console.log("authorParam:", authorParam); // ✅ log xem có data không

    if (authorParam) {
      try {
        const author = JSON.parse(decodeURIComponent(authorParam)) as Author;
        setUser(author);
        router.replace("/");
      } catch {
        router.replace("/signin");
      }
    }
  }, [searchParams, setUser, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingComponent />
    </div>
  );
}
