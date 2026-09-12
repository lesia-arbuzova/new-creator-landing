"use client";

import { useEffect, useState } from "react";

type Props = {
  links: ReadonlyArray<readonly [string, string]>;
  openLabel: string;
  closeLabel: string;
};

export default function MobileMenu({ links, openLabel, closeLabel }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="burger"
        aria-expanded={open}
        aria-label={openLabel}
        onClick={() => setOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>
      {open && (
        <div
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={openLabel}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="mobile-menu-close"
            aria-label={closeLabel}
            autoFocus
            onClick={() => setOpen(false)}
          >
            ×
          </button>
          <nav className="mobile-menu-nav" aria-label={openLabel} onClick={(event) => event.stopPropagation()}>
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
