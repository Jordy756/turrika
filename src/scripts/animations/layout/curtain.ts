import { gsap } from '@scripts/config/gsap';

const REVEAL_DURATION = 0.8;

const initCourtainAnimation = (): void => {
  const curtain = document.getElementById('hero-curtain') as HTMLElement | null;
  if (!curtain) return;

  const panels = Array.from(curtain.querySelectorAll<HTMLElement>('[data-curtain-panel]'));

  if (!panels.length) {
    gsap.set(curtain, { autoAlpha: 0 });
    return;
  }

  gsap
    .timeline({
      defaults: {
        ease: 'power3.inOut',
        overwrite: 'auto',
      },
    })
    .fromTo(
      panels,
      {
        opacity: 1,
        scaleY: 1,
        scaleX: 1.5,
        transformOrigin: 'center top',
      },
      {
        opacity: 0,
        scaleY: 0,
        scaleX: 0,
        duration: REVEAL_DURATION,
        stagger: {
          each: REVEAL_DURATION / panels.length,
          from: 'center',
        },
      },
    )
    .set(curtain, { autoAlpha: 0 });
};

initCourtainAnimation();
