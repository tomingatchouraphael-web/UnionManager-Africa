"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, CreditCard, Calendar,
  Megaphone, AlertCircle, DollarSign, FileText,
  MessageSquare, Settings, Shield, LogOut,
  ChevronLeft, ChevronRight, Zap
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Tableau de Bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Membres", href: "/membres", icon: Users },
  { label: "Cotisations", href: "/cotisations", icon: CreditCard },
  { label: "Réunions", href: "/reunions", icon: Calendar },
  { label: "Actions Syndicales", href: "/actions", icon: Megaphone },
  { label: "Plaintes", href: "/plaintes", icon: AlertCircle },
  { label: "Finances", href: "/finances", icon: DollarSign },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Communication", href: "/communication", icon: MessageSquare },
];

const BOTTOM_ITEMS = [
  { label: "Utilisateurs", href: "/utilisateurs", icon: Shield },
  { label: "Paramètres", href: "/parametres", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 z-40 ${collapsed ? "w-16" : "w-64"}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-800 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Zap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold leading-tight">UnionManager</p>
            <p className="text-xs text-emerald-400 font-semibold">Africa</p>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
      >
        {collapsed ? <ChevronRight size={12} className="text-gray-400" /> : <ChevronLeft size={12} className="text-gray-400" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-none">
        {!collapsed && (
          <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Navigation</p>
        )}
        <ul className="space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                    active
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={17} className={`flex-shrink-0 ${active ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`} />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="py-4 border-t border-gray-800 px-2">
        {!collapsed && (
          <p className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Administration</p>
        )}
        <ul className="space-y-0.5 mb-2">
          {BOTTOM_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                    active ? "bg-emerald-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={17} className="flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User */}
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-800 cursor-pointer transition-colors group ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
            MC
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Moussa Camara</p>
              <p className="text-xs text-gray-500 truncate">Secrétaire Général</p>
            </div>
          )}
          {!collapsed && <LogOut size={15} className="text-gray-600 group-hover:text-red-400 transition-colors" />}
        </div>
      </div>
    </aside>
  );
}
