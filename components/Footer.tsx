"use client";

import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="shell py-5">
        <p className="text-xs leading-relaxed font-bold text-dim sm:text-sm">{t.footer.line}</p>
      </div>
    </footer>
  );
}
