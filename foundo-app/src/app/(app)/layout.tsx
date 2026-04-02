"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Flame, 
  MessageSquare, 
  User,
  LogOut
} from "lucide-react";
import styles from "./layout.module.css";

const NAV_ITEMS = [
  { href: "/deck", icon: <LayoutDashboard size={20} />, label: "Deck" },
  { href: "/matches", icon: <Flame size={20} />, label: "Matches" },
  { href: "/chat", icon: <MessageSquare size={20} />, label: "Chat", badge: 0 },
  { href: "/perfil", icon: <User size={20} />, label: "Perfil" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={styles.appLayout}>
      <aside className={styles.sidebar}>
        <Link href="/deck" className={styles.sidebarLogo}>
          clip
        </Link>

        <ul className={styles.navList}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.navItem} ${
                  pathname === item.href ? styles.active : ""
                }`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={styles.navBadge}>{item.badge}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.sidebarFooter}>
          <div className={styles.userAvatar}><User size={20} /></div>
          <div>
            <div className={styles.userName}>Usuário</div>
            <div className={styles.userRole}>Founder</div>
          </div>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
