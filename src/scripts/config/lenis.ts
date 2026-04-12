import { gsap, ScrollTrigger } from "@scripts/config/gsap";
import Lenis from "lenis";

const lenis = new Lenis({
  duration: 1.2,
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
