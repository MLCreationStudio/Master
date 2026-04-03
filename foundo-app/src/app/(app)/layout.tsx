"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Flame, 
  MessageSquare, 
  User,
  LogOut,
  Zap
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import styles from "./layout.module.css";

const NAV_ITEMS = [
  { href: "/deck", icon: <LayoutDashboard size={20} />, label: "Deck" },
  { href: "/matches", icon: <Flame size={20} />, label: "Matches" },
  { href: "/chat", icon: <MessageSquare size={20} />, label: "Chat", badge: 0 },
  { href: "/perfil", icon: <User size={20} />, label: "Perfil" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<{ full_name: string; role: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("full_name, role")
          .eq("id", user.id)
          .single();
        
        if (profile) setUserProfile(profile);
      }
    }
    loadProfile();
  }, [supabase]);

  return (
    <div className={styles.appLayout}>
      <aside className={styles.sidebar}>
        <Link href="/deck" className={styles.sidebarLogo}>
          <Zap size={24} className={styles.sidebarLogoAccent} fill="var(--accent-primary)" />
          clip
        </Link>

        <nav className={styles.navList}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <div key={item.href} className={styles.navItemContainer}>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={styles.activeIndicator}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Link
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={styles.navBadge}>{item.badge}</span>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userAvatar}>
            <User size={20} />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>
              {userProfile?.full_name || "Carregando..."}
            </div>
            <div className={styles.userRole}>
              {userProfile?.role || "Founder"}
            </div>
          </div>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
