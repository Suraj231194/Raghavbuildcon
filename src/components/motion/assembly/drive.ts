import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AUTOPLAY, HOLD_SECONDS } from "@/lib/motion";

export type Drive = {
  /** The 0 → 1 build tween. */
  tween: gsap.core.Tween;
  /** Its ScrollTrigger (in "scroll" mode, the scrubbed range). */
  trigger: ScrollTrigger | null;
  /** Jump to a progress: "auto" mode plays on from there, "scroll" mode scrolls there. */
  seek(p: number): void;
  /** Build again from the start at once ("auto" mode). */
  replay(): void;
};

type DriveOptions = {
  trigger: Element;
  onUpdate: (p: number) => void;
  /** "scroll" mode: the scrubbed range (and pin) for the trigger. */
  scroll: Omit<ScrollTrigger.Vars, "trigger">;
  /** "auto" mode: how long the full build takes… */
  seconds: number;
  /** …and the screen positions of the trigger between which it plays. */
  start?: string;
  end?: string;
};

/**
 * Drives a build from 0 to 1 (lib/motion.ts decides how). In "auto" mode it plays over `seconds`
 * from the moment the trigger comes between `start` and `end`, pauses while the trigger is outside
 * them and resumes when it returns, so a model only builds while it can be seen; once finished it
 * holds for HOLD_SECONDS and builds again. In "scroll" mode the scroll position scrubs it through
 * the `scroll` range.
 */
export function driveProgress({ trigger, onUpdate, scroll, seconds, start = "top 75%", end = "bottom 25%" }: DriveOptions): Drive {
  gsap.registerPlugin(ScrollTrigger);
  const state = { p: 0 };
  const tween = gsap.fromTo(
    state,
    { p: 0 },
    {
      p: 1,
      ease: "none",
      onUpdate: () => onUpdate(state.p),
      ...(AUTOPLAY
        ? { duration: seconds, repeat: -1, repeatDelay: HOLD_SECONDS, scrollTrigger: { trigger, start, end, toggleActions: "play pause resume pause" } }
        : { scrollTrigger: { trigger, ...scroll } }),
    },
  );
  const st = tween.scrollTrigger ?? null;
  onUpdate(0);
  return {
    tween,
    trigger: st,
    seek(p) {
      if (AUTOPLAY) tween.progress(p).play();
      else if (st) window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: "smooth" });
    },
    replay() {
      if (AUTOPLAY) tween.restart();
    },
  };
}
