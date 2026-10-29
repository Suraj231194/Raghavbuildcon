import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { OrPending } from "@/components/ui/Placeholder";
import { company, contact, social } from "@/content/company";
import { footerNav } from "@/content/navigation";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer id="site-footer" className="relative isolate overflow-hidden bg-ink-950 text-ink-300">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold-500/60 to-transparent" />

      <Container className="pt-12 pb-6 lg:pt-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="Raghav Buildcon — home" className="inline-block">
              <Logo variant="light" size="lg" />
            </Link>
            <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-ink-300">{company.description}</p>
            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex gap-3">
                <Icon name="map-pin" className="mt-0.5 size-5 shrink-0 text-gold-400" />
                <div>
                  <dt className="sr-only">Address</dt>
                  <dd className="text-ink-200">
                    <span className="block font-semibold text-white">{contact.officeName}</span>
                    <OrPending value={contact.address} tone="light" label="Address to be updated" />
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Icon name="phone" className="mt-0.5 size-5 shrink-0 text-gold-400" />
                <div>
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    {contact.phone ? (
                      <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="text-ink-200 hover:text-gold-300">
                        {contact.phone}
                      </a>
                    ) : (
                      <OrPending value={null} tone="light" label="Phone to be updated" />
                    )}
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Icon name="mail" className="mt-0.5 size-5 shrink-0 text-gold-400" />
                <div>
                  <dt className="sr-only">Email</dt>
                  <dd>
                    {contact.email ? (
                      <a href={`mailto:${contact.email}`} className="text-ink-200 hover:text-gold-300">
                        {contact.email}
                      </a>
                    ) : (
                      <OrPending value={null} tone="light" label="Email to be updated" />
                    )}
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10 lg:col-span-8 lg:pl-10">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400 [font-stretch:100%]">{group.title}</h2>
                <ul className="mt-3.5 space-y-2">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.href}`}>
                      <Link href={link.href} className="text-[0.95rem] text-ink-200 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName ?? company.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {social.map((s) => (
              <a key={s.href} href={s.href} className="hover:text-white" rel="noopener noreferrer" target="_blank">
                {s.label}
              </a>
            ))}
            <a href="/sitemap.xml" className="hover:text-white">
              Sitemap
            </a>
            <a href="#top" className="inline-flex items-center gap-2 hover:text-white">
              Back to top
              <Icon name="arrow-up" className="size-4" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
