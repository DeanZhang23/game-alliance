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
    <header className="sticky top-0 z-20 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 md:px-6">
        <Link href="/" className="mr-auto flex items-baseline gap-2">
          <span className="font-display text-2xl leading-none text-paper">{t.brand.mark}</span>
          <span className="font-mono text-[11px] tracking-[0.16em] text-mist uppercase">{t.brand.sub}</span>
        </Link>
        <nav className="order-3 flex w-full gap-1 sm:order-none sm:w-auto" aria-label={t.brand.sub}>
          {LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 text-sm ${active ? "bg-paper text-ink" : "text-mist hover:text-paper"}`}
              >
                {t.nav[link.key]}
              </Link>
            );
          })}
        </nav>
        <div className="flex rounded-full border border-line p-0.5" role="group" aria-label={t.nav.langLabel}>
          <LangButton current={lang} value="zh" onSelect={setLang}>
            中文
          </LangButton>
          <LangButton current={lang} value="en" onSelect={setLang}>
            EN
          </LangButton>
        </div>
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
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(value)}
      className={`rounded-full px-2.5 py-1 font-mono text-xs ${selected ? "bg-lime text-ink" : "text-mist"}`}
    >
      {children}
    </button>
  );
}
