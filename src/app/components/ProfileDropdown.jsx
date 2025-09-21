"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProfileDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <Image
          src={user.avatar || "/icons/profile-placeholder.png"}
          width={40}
          height={40}
          alt="User Avatar"
          className="rounded-full"
        />
        <span className="font-medium text-gray-700">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg p-4 flex flex-col space-y-2 z-50">
          <p className="text-gray-600 text-sm">{user.email}</p>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
