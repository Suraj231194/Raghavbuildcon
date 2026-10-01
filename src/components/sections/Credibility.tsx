import { Icon } from "@/components/ui/Icon";
import { Pending } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { credentialSlots, credentials, leadership } from "@/content/company";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Leadership profiles. Unconfirmed profiles render as clearly-marked placeholders. */
export function LeadershipGrid({ showBio = false }: { showBio?: boolean }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {leadership.map((leader, i) => (
        <Reveal as="li" key={i} delay={i * 90} className="group rounded-sm border border-ink-100 bg-white p-7">
          <div className="flex items-center gap-5">
            <span
              aria-hidden="true"
              className="relative flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-ink-950 font-display text-xl font-semibold text-gold-400"
            >
              {leader.name ? initials(leader.name) : <Icon name="users" className="size-7 text-ink-500" />}
              <span className="absolute inset-x-0 bottom-0 h-1 bg-gold-500" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-lg font-semibold text-ink-950">{leader.name ?? <Pending>Name to be updated</Pending>}</h3>
              <p className="mt-1.5 text-sm text-ink-500">{leader.role ?? <Pending>Designation to be updated</Pending>}</p>
            </div>
          </div>
          {showBio ? (
            <p className="mt-6 border-t border-ink-100 pt-5 text-[0.95rem] leading-relaxed text-ink-500">
              {leader.bio ?? <Pending>Profile to be updated</Pending>}
            </p>
          ) : null}
        </Reveal>
      ))}
    </ul>
  );
}

/** Registrations / certifications, padded with placeholder slots. */
export function CredentialSlots() {
  const slots = Math.max(credentialSlots, credentials.length);
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: slots }, (_, i) => {
        const c = credentials[i];
        return (
          <Reveal
            as="li"
            key={i}
            delay={i * 70}
            className={c ? "flex items-start gap-4 rounded-sm border border-ink-100 bg-white p-5" : "flex items-start gap-4 rounded-sm border border-dashed border-ink-200 bg-sand-50 p-5"}
          >
            <Icon name="award" className={c ? "size-7 shrink-0 text-gold-600" : "size-7 shrink-0 text-ink-300"} />
            <div>
              <p className={c ? "font-semibold text-ink-900" : "font-medium text-ink-400 italic"}>{c ? c.title : "Certification to be listed"}</p>
              <p className="mt-1 text-sm text-ink-400">{c ? (c.issuer ?? <Pending>Issuer to be updated</Pending>) : "Registration, certification or empanelment"}</p>
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}
