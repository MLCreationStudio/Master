"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./layout.module.css";

const NAV_ITEMS = [
  { href: "/deck", icon: "🃏", label: "Deck" },
  { href: "/matches", icon: "🤝", label: "Matches" },
  { href: "/chat", icon: "💬", label: "Chat", badge: 0 },
  { href: "/perfil", icon: "👤", label: "Perfil" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={styles.appLayout}>
      <aside className={styles.sidebar}>
        <Link href="/deck" className={styles.sidebarLogo}>
          found<span className={styles.sidebarLogoAccent}>o</span>
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
          <div className={styles.userAvatar}>👤</div>
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
