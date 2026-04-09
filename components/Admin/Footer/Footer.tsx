"use client";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <p className="text-dark font-medium text-center bg-gray-4 py-4 mt-auto">
      &copy; {year}. All rights reserved by Man Nguyen.
    </p>
  );
}
