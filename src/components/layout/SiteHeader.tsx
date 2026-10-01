"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { mainNav, type NavItem } from "@/content/navigation";
import { cn } from "@/lib/site";
import { photos } from "@/content/images";

function isActive(item: NavItem, pathname: string) {
  const match = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  return match(item.href) || (item.children?.some((c) => match(c.href)) ?? false);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [lastPath, setLastPath] = useState(pathname);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  // Close every menu when the route changes (adjusting state during render, per React docs).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Desktop dropdowns: close on Escape or a click outside the nav.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    const onPointer = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openMenu]);

  // Mobile menu: lock scroll, make the page behind it inert, close on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const behind = [document.getElementById("main"), document.getElementById("site-footer")].filter(Boolean) as HTMLElement[];
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    behind.forEach((el) => (el.inert = true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previousOverflow;
      behind.forEach((el) => (el.inert = false));
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140);
  }, []);
  const openNow = useCallback((label: string) => {
    window.clearTimeout(closeTimer.current);
    setOpenMenu(label);
  }, []);

  const solid = scrolled || openMenu !== null || mobileOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500",
        solid ? "bg-ink-950/90 shadow-[0_1px_0_rgb(255_255_255/0.07)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <Container className={cn("relative flex items-center justify-between gap-6 transition-[height] duration-500", scrolled ? "h-18" : "h-20 lg:h-24")}>
        <Link href="/" className="relative z-10 shrink-0" aria-label="Raghav Buildcon — home">
          <Logo variant="light" preload />
        </Link>

        <nav ref={navRef} aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {mainNav.map((item) => {
              const active = isActive(item, pathname);
              const linkClass = cn(
                "relative inline-flex items-center gap-1.5 rounded-sm px-3.5 py-2 text-[0.92rem] font-semibold transition-colors",
                "after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-gold-400 after:transition-transform after:duration-300",
                active ? "text-white after:scale-x-100" : "text-white/75 after:scale-x-0 hover:text-white hover:after:scale-x-100",
              );
              if (!item.children) {
                return (
                  <li key={item.label}>
                    <Link href={item.href} className={linkClass} aria-current={pathname === item.href ? "page" : undefined}>
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const open = openMenu === item.label;
              const panelId = `menu-${item.label.toLowerCase()}`;
              return (
                <li
                  key={item.label}
                  className={item.mega ? undefined : "relative"}
                  onMouseEnter={() => openNow(item.label)}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    className={linkClass}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenMenu(open ? null : item.label)}
                  >
                    {item.label}
                    <Icon name="chevron-down" className={cn("size-4 transition-transform duration-300", open && "rotate-180")} />
                  </button>
                  <div
                    id={panelId}
                    hidden={!open}
                    className={cn("absolute top-full pt-3", item.mega ? "inset-x-5 sm:inset-x-8 lg:inset-x-12" : "left-0 w-[380px]")}
                  >
                    {item.mega ? <MegaPanel item={item} /> : <ListPanel item={item} />}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="relative z-10 flex items-center gap-3">
          <div className="hidden sm:block">
            <ButtonLink href="/contact">Contact us</ButtonLink>
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-sm border border-white/20 text-white transition-colors hover:border-gold-400 hover:text-gold-300 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Icon name={mobileOpen ? "close" : "menu"} className="size-6" />
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!mobileOpen}
        className="fixed inset-x-0 top-0 -z-10 h-dvh overflow-y-auto bg-ink-950 bg-blueprint pt-24 pb-10 lg:hidden"
      >
        <Container as="nav" aria-label="Mobile">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {mainNav.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-4 text-left font-display text-xl font-semibold text-white"
                      aria-expanded={mobileGroup === item.label}
                      onClick={() => setMobileGroup(mobileGroup === item.label ? null : item.label)}
                    >
                      {item.label}
                      <Icon name="chevron-down" className={cn("size-5 text-gold-400 transition-transform", mobileGroup === item.label && "rotate-180")} />
                    </button>
                    <ul hidden={mobileGroup !== item.label} className="space-y-1 pb-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} className="flex items-center gap-3 rounded-sm px-2 py-2.5 text-ink-200 hover:bg-white/5 hover:text-white">
                            {child.icon ? <Icon name={child.icon} className="size-5 text-gold-400" /> : null}
                            {child.label}
                          </Link>
                        </li>
                      ))}
                      {item.mega ? (
                        <li>
                          <Link href={item.href} className="flex items-center gap-3 rounded-sm px-2 py-2.5 font-semibold text-gold-300 hover:bg-white/5">
                            <Icon name="arrow-right" className="size-5" />
                            All {item.label.toLowerCase()}
                          </Link>
                        </li>
                      ) : null}
                    </ul>
                  </>
                ) : (
                  <Link href={item.href} className="block py-4 font-display text-xl font-semibold text-white">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <ButtonLink href="/contact" size="lg" className="mt-8 w-full">
            Contact us
          </ButtonLink>
        </Container>
      </div>
    </header>
  );
}

function MegaPanel({ item }: { item: NavItem }) {
  return (
    <div className="grid grid-cols-12 gap-0 overflow-hidden rounded-sm border border-white/10 bg-ink-900 shadow-2xl shadow-black/40">
      <ul className="col-span-8 grid grid-cols-2 gap-1 p-4">
        {item.children?.map((child) => (
          <li key={child.href}>
            <Link href={child.href} className="group flex gap-4 rounded-sm p-4 transition-colors hover:bg-white/[0.05]">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-white/10 bg-white/[0.03] text-gold-400 transition-colors group-hover:border-gold-400/40">
                {child.icon ? <Icon name={child.icon} className="size-5.5" /> : null}
              </span>
              <span>
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  {child.label}
                  <Icon name="arrow-right" className="size-4 -translate-x-1 text-gold-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-300">{child.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href={item.href} className="group relative col-span-4 flex min-h-64 flex-col justify-end overflow-hidden p-7">
        <Image src={photos.aerial.src} alt={photos.aerial.alt} fill sizes="420px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/70 to-ink-950/10" />
        <span className="relative">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Our expertise</span>
          <span className="mt-2 flex items-center gap-2 font-display text-xl font-semibold text-white">
            Explore every vertical
            <Icon name="arrow-right" className="size-5 transition-transform group-hover:translate-x-1" />
          </span>
        </span>
      </Link>
    </div>
  );
}

function ListPanel({ item }: { item: NavItem }) {
  return (
    <ul className="space-y-1 rounded-sm border border-white/10 bg-ink-900 p-3 shadow-2xl shadow-black/40">
      {item.children?.map((child) => (
        <li key={child.href}>
          <Link href={child.href} className="group flex gap-4 rounded-sm p-3.5 transition-colors hover:bg-white/[0.05]">
            {child.icon ? <Icon name={child.icon} className="mt-0.5 size-5.5 shrink-0 text-gold-400" /> : null}
            <span>
              <span className="block font-semibold text-white">{child.label}</span>
              <span className="mt-0.5 block text-sm text-ink-300">{child.description}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
