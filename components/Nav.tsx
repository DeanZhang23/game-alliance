"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

const LINKS = [
  { href: "/", key: "home" },
  { href: "/games", key: "games" },
  { href: "/create", key: "create" },
  { href: "/economy", key: "economy" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const { lang, setLang, t } = useI18n();

  return (
    <header className="site-header">
      <div className="shell flex flex-wrap items-center gap-x-3 gap-y-2 py-3">
        <Link href="/" className="mr-auto flex items-center gap-2">
          <span className="brand-badge font-pixel uppercase">{t.brand.mark}</span>
          <span className="max-w-[8.5rem] text-xs leading-snug font-bold text-mist sm:max-w-none sm:text-sm">{t.brand.sub}</span>
        </Link>
        <div className="lang-switch" role="group" aria-label={t.nav.langLabel}>
          <LangButton current={lang} value="zh" onSelect={setLang}>
            中文
          </LangButton>
          <LangButton current={lang} value="en" onSelect={setLang}>
            EN
          </LangButton>
        </div>
        <nav className="nav-row order-3 sm:order-none" aria-label={t.brand.sub}>
          {LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className="nav-link">
                {t.nav[link.key]}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function LangButton({
  current,
  value,
  onSelect,
  children,
}: {
  current: Lang;
  value: Lang;
  onSelect: (lang: Lang) => void;
  children: string;
}) {
  const selected = current === value;
  return (
    <button type="button" aria-pressed={selected} onClick={() => onSelect(value)} className="lang-btn">
      {children}
    </button>
  );
}
