import { gsap } from "@scripts/utils/gsap";

const SLIDE_IN_DELAY = 1; // segundos

const hero = document.getElementById("hero") as HTMLElement;
const heroVideo = hero.querySelector("#hero-video") as HTMLVideoElement;
const heroTitleCheese = hero.querySelector("#hero-title-cheese") as HTMLHeadingElement;
const heroTitlePorkRinds = hero.querySelector("#hero-title-pork-rinds") as HTMLHeadingElement;
const formSection = hero.querySelector(".newsletter") as HTMLElement;
const topLeftCorner = hero.querySelector(".corner__decoration.top__left") as HTMLDivElement;
const topRightCorner = hero.querySelector(".corner__decoration.top__right") as HTMLDivElement;
const bottomLeftCorner = hero.querySelector(".corner__decoration.bottom__left") as HTMLDivElement;
const bottomRightCorner = hero.querySelector(".corner__decoration.bottom__right") as HTMLDivElement;

// gsap.from(heroTitleCheese, {
//   x: "-100vw",
//   opacity: 0,
//   ease: "power4.out",
// });

// gsap.set(heroTitlePorkRinds, {
//   y: "100vh",
//   opacity: 0,
//   duration: SLIDE_IN_DELAY,
//   ease: "power4.out",
// });

// gsap.set(formSection, {
//   x: "100vw",
//   opacity: 0,
//   duration: SLIDE_IN_DELAY,
//   ease: "power4.out",
// });

// gsap.set(topLeftCorner, {
//   x: "-100vw",
//   y: "-100vh",
//   opacity: 0,
//   duration: SLIDE_IN_DELAY,
//   ease: "power4.out",
// });

// gsap.set(topRightCorner, {
//   x: "100vw",
//   y: "-100vh",
//   opacity: 0,
//   duration: SLIDE_IN_DELAY,
//   ease: "power4.out",
// });

// gsap.set(bottomLeftCorner, {
//   x: "-100vw",
//   y: "100vh",
//   opacity: 0,
//   duration: SLIDE_IN_DELAY,
//   ease: "power4.out",
// });

// gsap.set(bottomRightCorner, {
//   x: "100vw",
//   y: "100vh",
//   opacity: 0,
//   duration: SLIDE_IN_DELAY,
//   ease: "power4.out",
// });

const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: hero,
    start: "top top", // Inicia al cargar viewport
    // end: "bottom center",
    end: "+=50%",
    scrub: 1,
    pin: true,
    // markers: true,
  },
});

timeline
  .to(heroTitleCheese, {
    x: "-100vw",
    opacity: 0,
    ease: "power4.out",
  })
  .to(
    heroTitlePorkRinds,
    {
      y: "100vh",
      opacity: 0,
      ease: "power4.out",
    },
    "<",
  )
  .to(
    formSection,
    {
      x: "100vw",
      opacity: 0,
      ease: "power4.out",
    },
    "<",
  )
  .to(
    heroVideo,
    {
      scale: 1.5,
      opacity: 0,
      ease: "power4.out",
    },
    "<",
  )
  .to(
    [topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner],
    {
      x: (i) => (i % 2 === 0 ? "-100vw" : "100vw"),
      y: (i) => (i < 2 ? "-100vh" : "100vh"),
      ease: "power4.out",
    },
    "<",
  );
