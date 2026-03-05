import { gsap } from "@scripts/utils/gsap";

const sections = gsap.utils.toArray(".history-section") as HTMLElement[];

sections.forEach((section) => {
  gsap.set(section, {
    x: "100%",
  });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${section.scrollWidth}`,
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
    },
  });

  timeline.to(section, { x: "-100%" });
});
