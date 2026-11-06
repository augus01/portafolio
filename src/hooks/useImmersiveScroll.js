import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { createGovernor, getPerfTier, raisePerfTier } from '../lib/perfTier';

gsap.registerPlugin(ScrollTrigger);

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Paso guiado hero → página dentro de `rootRef`: Lenis + ScrollTrigger con todo ligado al scroll (scrub).
 * Publica el timeline en `motionRef.current.tl` para que el fondo WebGL siga las mismas fases,
 * y avisa con `onNavTone('dark' | 'light')` cuando la nav debe cambiar de estilo.
 * La nav no se ve sobre el hero: aparece arriba recién al llegar a la página (con y sin animación).
 * Con `prefers-reduced-motion: reduce` no hay pin, paso guiado ni Lenis: la nav solo se muestra u oculta.
 * Teclado: nada sale del árbol de accesibilidad ni del orden de Tab. Todo se anima solo con opacity y transform
 * (nunca visibility): la nav oculta se revela al recibir foco (clase `is-focus` en .ap-navwrap) y cada `.ap-reveal`
 * se completa al instante si recibe foco antes de que se haga scroll hasta él.
 * Bajo 600px se usa la barra móvil (.ap-mnav) en vez de la NavBar de píldoras.
 * Expone Lenis en `motionRef.current.lenis`; con `motionRef.current.jump` activo el paso guiado no interviene.
 */
export function useImmersiveScroll(rootRef, motionRef, onNavTone) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const q = (s) => root.querySelector(s);

    const mm = gsap.matchMedia();
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 599px)' }, (ctx) => {
      const { mobile } = ctx.conditions;
      // Se mide la barra real (.ap-nav): el envoltorio del componente no tiene alto propio.
      const navEl = q(mobile ? '.ap-navwrap .ap-mnav' : '.ap-navwrap .ap-nav');
      const navWrap = q('.ap-navwrap');
      // Cada limpieza que no es de GSAP (oyentes, clases) se registra aquí y corre al revertir.
      const cleanups = [];
      // Sobre el hero la nav es transparente pero sigue en el orden de Tab: al recibir foco se muestra (CSS: .is-focus).
      // Solo con foco de teclado: un clic (p. ej. en el interruptor de idioma) deja el foco en la nav y no debe mostrarla.
      const onFocusIn = (e) => {
        let keyboard = true;
        try { keyboard = e.target.matches(':focus-visible'); } catch (err) { /* navegador sin :focus-visible */ }
        if (keyboard) navWrap.classList.add('is-focus');
      };
      const onFocusOut = (e) => { if (!navWrap.contains(e.relatedTarget)) navWrap.classList.remove('is-focus'); };
      navWrap.addEventListener('focusin', onFocusIn);
      navWrap.addEventListener('focusout', onFocusOut);
      cleanups.push(() => {
        navWrap.removeEventListener('focusin', onFocusIn);
        navWrap.removeEventListener('focusout', onFocusOut);
        navWrap.classList.remove('is-focus', 'is-on-page');
      });

      // Sin animación: la nav se oculta mientras el hero está en pantalla y aparece de golpe al salir de él.
      if (!ctx.conditions.motion) {
        const toggle = (onHero) => {
          gsap.set(navEl, { opacity: onHero ? 0 : 1 });
          navWrap.classList.toggle('is-on-page', !onHero);
          onNavTone(onHero ? 'dark' : 'light');
        };
        const st = ScrollTrigger.create({ trigger: q('.ap-track'), start: 'top top', end: 'bottom top', onToggle: (self) => toggle(self.isActive) });
        toggle(st.isActive || window.scrollY < 1);
        return () => { st.kill(); cleanups.forEach((fn) => fn()); };
      }

      const lenis = new Lenis({ lerp: 0.16, smoothWheel: true, syncTouch: true });
      lenis.on('scroll', ScrollTrigger.update);
      // El mismo ticker mide la fluidez: si la página no llega a ~42 fps, sube un nivel de rendimiento.
      const gov = createGovernor();
      const tick = (t, dt) => {
        lenis.raf(t * 1000);
        if (gov.sample(dt)) raisePerfTier(getPerfTier() + 1);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      motionRef.current.lenis = lenis;

      const track = q('.ap-track');
      const name = q('.ap-hero__name');
      const overlay = q('.ap-overlay');
      const overInner = q('.ap-overlay__inner');
      const topKids = root.querySelectorAll('.ap-hero__top > *');
      const exitEl = q('.ap-exit');
      const after = q('.ap-after');
      // Si el titular está vacío, el velo de abajo no se muestra.
      if (overInner && !overInner.textContent.trim()) gsap.set(overlay, { display: 'none' });

      // Nav: oculta sobre el hero; aparece arriba (top 24px) al llegar a la página.
      let tone = 'dark';
      // Con opacity 0 los elementos siguen recibiendo clics: mientras no se ven, la página y la nav no capturan el puntero.
      const applyLayers = (p) => {
        after.style.pointerEvents = p < 0.72 ? 'none' : '';
        navWrap.classList.toggle('is-on-page', p > 0.88);
      };
      applyLayers(0);
      cleanups.push(() => { after.style.removeProperty('pointer-events'); navWrap.classList.remove('is-on-page'); });
      gsap.set([name, overInner], { willChange: 'transform' });
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: track, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true,
          onUpdate: (self) => {
            motionRef.current.progress = self.progress;
            applyLayers(self.progress);
            // La nav cambia a su estilo claro justo antes de reaparecer sobre la página, y vuelve al oscuro al regresar.
            const want = self.progress > 0.85 ? 'light' : 'dark';
            if (want !== tone) { tone = want; onNavTone(want); }
          },
          onLeave: () => { motionRef.current.progress = 1; gsap.set([name, overInner], { willChange: 'auto' }); },
          onEnterBack: () => { gsap.set([name, overInner], { willChange: 'transform' }); },
        },
      });
      motionRef.current.tl = tl;

      // La página que sigue se monta justo bajo el final del pin (un viewport hacia arriba) y aparece cubriendo el hero.
      after.style.setProperty('margin-top', '-100svh');
      // El nombre no sube: viene hacia ti (crece) y se desvanece, como si lo dejaras atrás al avanzar por la luz.
      tl.fromTo(name, { scale: 1, transformOrigin: '50% 50%' }, { scale: 3.4, duration: 0.24, ease: 'power2.in' }, 0)
        .to(name, { opacity: 0, duration: 0.14, ease: 'power1.in' }, 0.1)
        .to(topKids, { opacity: 0, duration: 0.1 }, 0)
        .fromTo(navEl, { opacity: 0 }, { opacity: 0, duration: 0.01 }, 0)
        .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.05)
        .fromTo(overInner, { y: 120 }, { y: 0, duration: 0.08, ease: 'power2.out' }, 0.05)
        .to(overInner, { opacity: 0, y: -60, duration: 0.05, ease: 'power1.in' }, 0.2)
        .to(overlay, { opacity: 0, duration: 0.05 }, 0.2)
        .fromTo(exitEl, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22 }, 0.72)
        .fromTo(after, { opacity: 0 }, { opacity: 1, duration: 0.22 }, 0.72)
        .to(navEl, { opacity: 1, duration: 0.1 }, 0.88);

      // Paso guiado: un gesto dentro del pin lo completa solo, a ritmo fijo (1,6 s), hacia la sección o de vuelta al hero.
      let auto = false, safety = 0;
      const pinStart = () => track.offsetTop;
      const pinEnd = () => track.offsetTop + track.offsetHeight - window.innerHeight;
      lenis.on('scroll', (l) => {
        if (auto || motionRef.current.jump) return;
        const y = l.scroll, a = pinStart(), b = pinEnd();
        if (b - a < 4 || y <= a + 2 || y >= b - 2) return;
        auto = true;
        const done = () => { auto = false; clearTimeout(safety); };
        safety = setTimeout(done, 2400);
        l.scrollTo(l.direction < 0 ? a : b, { duration: 1.6, easing: ease, lock: true, force: true, onComplete: done });
      });

      // Reveals de las secciones siguientes, una sola vez. Solo opacity y transform: el contenido siempre está en el
      // árbol de accesibilidad y en el orden de Tab; si recibe foco antes de revelarse, se completa al instante.
      root.querySelectorAll('.ap-reveal').forEach((el) => {
        const tw = gsap.fromTo(el, { opacity: 0, y: 60 }, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        });
        const onFocus = () => { tw.scrollTrigger?.kill(); tw.progress(1); };
        el.addEventListener('focusin', onFocus, { once: true });
        cleanups.push(() => el.removeEventListener('focusin', onFocus));
      });

      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

      return () => {
        cleanups.forEach((fn) => fn());
        gsap.ticker.remove(tick);
        clearTimeout(safety);
        lenis.destroy();
        after.style.removeProperty('margin-top');
        motionRef.current.tl = null;
        motionRef.current.lenis = null;
        motionRef.current.progress = 0;
      };
    });

    return () => mm.revert();
  }, [rootRef, motionRef, onNavTone]);
}
