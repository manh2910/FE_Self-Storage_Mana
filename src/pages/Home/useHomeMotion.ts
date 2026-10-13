import type { RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)
export { gsap, ScrollTrigger, useGSAP }

/** Page-scoped animations are reverted on unmount (including React StrictMode). */
export function useHomeMotion(root: RefObject<HTMLDivElement>) {
  useGSAP(() => {
    const pageRoot = root.current
    const header = document.querySelector<HTMLElement>('.shared-header')
    const updateHeader = () => pageRoot?.style.setProperty('--motion-header-height', `${header?.offsetHeight || 80}px`)
    updateHeader()
    const headerObserver = new ResizeObserver(updateHeader)
    if (header) headerObserver.observe(header)
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const page = root.current
      if (!page) return
      const select = gsap.utils.selector(page)
      // 1. Scroll position, rather than a timer, drives the hero photograph.
      gsap.fromTo(select('.hero-image'), { scale: 1.04, rotation: -1.5 }, {
        scale: 1.2, yPercent: 8, rotation: 1.5, ease: 'none',
        scrollTrigger: { trigger: select('.hero')[0], start: 'top top', end: 'bottom top', scrub: .6 },
      })
      // 4. Each explicit line retains its semantic heading; no character splitting.
      gsap.from(select('.hero .motion-line'), { opacity: .15, yPercent: 25, scale: .96, stagger: .12, duration: .7, ease: 'power2.out' })
      select('[data-cinematic-heading]').forEach((heading: HTMLElement) => {
        const lines = heading.querySelectorAll('.motion-line')
        gsap.fromTo(lines.length ? lines : heading, { opacity: .2, y: 28, scale: .97 }, {
          opacity: 1, y: 0, scale: 1, stagger: .12, ease: 'none',
          scrollTrigger: { trigger: heading, start: 'top 90%', end: 'top 58%', scrub: .5 },
        })
      })
      const refresh = () => ScrollTrigger.refresh()
      page.querySelectorAll('img').forEach(image => { if (!image.complete) { image.addEventListener('load', refresh); image.addEventListener('error', refresh) } })
      let disposed = false
      document.fonts.ready.then(() => { if (!disposed) refresh() })
      return () => { disposed = true; page.querySelectorAll('img').forEach(image => { image.removeEventListener('load', refresh); image.removeEventListener('error', refresh) }) }
    })
    return () => { media.revert(); headerObserver.disconnect(); pageRoot?.style.removeProperty('--motion-header-height') }
  }, { scope: root })
}
