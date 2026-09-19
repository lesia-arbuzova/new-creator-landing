"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";

type Props = {
  links: ReadonlyArray<readonly [string, string]>;
  menuLabel: string;
  openLabel: string;
  closeLabel: string;
};

export default function MobileMenu({ links, menuLabel, openLabel, closeLabel }: Props) {
  const menuId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const destinationRef = useRef<string | null>(null);
  const [open, setOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    const header = trigger?.closest("header");
    if (!open || !dialog || !header) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousGutter = root.style.scrollbarGutter;
    const position = { left: window.scrollX, top: window.scrollY, behavior: "instant" as const };
    // Keep the page width and scroll position stable when the modal opens.
    if (window.innerWidth > root.clientWidth) root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";

    const positionMenu = () => {
      dialog.style.setProperty("--menu-top", `${header.getBoundingClientRect().bottom + 8}px`);
    };
    positionMenu();
    const resize = new ResizeObserver(positionMenu);
    resize.observe(header);
    const desktop = window.matchMedia("(min-width: 1081px)");
    const closeOnDesktop = () => { if (desktop.matches) dialog.close(); };
    desktop.addEventListener("change", closeOnDesktop);
    dialog.showModal();
    // Preserve the underlying section while the dialog takes focus.
    window.scrollTo(position);

    return () => {
      resize.disconnect();
      desktop.removeEventListener("change", closeOnDesktop);
      if (dialog.open) dialog.close();
      root.style.overflow = previousOverflow;
      root.style.scrollbarGutter = previousGutter;
      trigger?.focus({ preventScroll: true });
      const destination = destinationRef.current;
      destinationRef.current = null;
      if (destination) {
        document.getElementById(destination)?.scrollIntoView({ behavior: "instant", block: "start" });
      } else {
        window.scrollTo(position);
      }
    };
  }, [open]);

  const closeMenu = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        className="burger"
        ref={triggerRef}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="dialog"
        aria-label={openLabel}
        onClick={() => {
          setCurrentHash(window.location.hash);
          setOpen(true);
        }}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <dialog
        id={menuId}
        ref={dialogRef}
        className="mobile-menu"
        aria-labelledby={`${menuId}-title`}
        onClose={(event) => { if (!event.currentTarget.open) setOpen(false); }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]");
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const box = event.currentTarget.getBoundingClientRect();
          if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeMenu();
        }}
      >
        <div className="mobile-menu-heading">
          <p id={`${menuId}-title`}>{menuLabel}</p>
          <button
            type="button"
            className="mobile-menu-close"
            aria-label={closeLabel}
            autoFocus
            onClick={closeMenu}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="mobile-menu-nav" aria-label={menuLabel}>
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                destinationRef.current = new URL(event.currentTarget.href).hash.slice(1);
                closeMenu();
              }}
              aria-current={currentHash && href.endsWith(currentHash) ? "location" : undefined}
            >
              <span>{label}</span>
              <span className="mobile-menu-arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </nav>
      </dialog>
    </>
  );
}
