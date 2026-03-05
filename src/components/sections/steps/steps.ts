import { gsap } from "@scripts/utils/gsap";

const stepsSection = document.getElementById("steps-section") as HTMLElement;
const stepsTitle = stepsSection.querySelector("#steps-title") as HTMLElement;
const stepsContainer = stepsSection.querySelector("#steps-container") as HTMLElement;

const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: stepsSection,
    start: "top 10%",
    end: "bottom bottom",
    scrub: true,
    pin: true,
    pinSpacing: true,
  },
});

timeline
  .to(
    stepsTitle,
    {
      scale: 1,
      duration: 5,
    },
    0.5
  )
  .to(
    stepsTitle,
    {
      scale: 50,
      duration: 5,
    },
    0.5
  )
  .to(stepsContainer, {
    transform: "translateX(0%)",
  });
