import { gsap } from "@scripts/utils/gsap";

const historySection = document.getElementById("history-01") as HTMLElement;
const paragraph = historySection.querySelector("p") as HTMLParagraphElement;

gsap.set(historySection, {
  x: "100%",
  y: "-200vh",
});

const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: historySection,
    start: "top top",
    end: `+=${historySection.scrollWidth}`,
    scrub: 1,
    pin: true,
    markers: true,
  },
});

timeline.to(historySection, { x: "-100%" });
