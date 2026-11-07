"use client";

import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl px-4 py-6 md:px-6">
        <p className="font-mono text-xs tracking-wide text-dim">{t.footer.line}</p>
      </div>
    </footer>
  );
}
