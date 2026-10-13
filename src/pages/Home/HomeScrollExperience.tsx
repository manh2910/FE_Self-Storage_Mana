import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, ScrollTrigger, useGSAP } from './useHomeMotion'
import './HomeMotion.css'

const steps = [
  { title: 'Find your space.', body: 'Explore storage by location and size. Choose a space for your boxes, furniture or business inventory.', detail: '01 / EXPLORE', image: '/images/storage-hero.webp' },
  { title: 'Make it yours.', body: 'Choose your rental period, review the agreement and complete the demo booking. Real bookings require the backend connection.', detail: '02 / BOOK', image: '/images/storage-small.webp' },
  { title: 'Move in. Breathe out.', body: 'Follow your facility’s handover instructions and settle your belongings into their own space.', detail: '03 / MOVE IN', image: '/images/storage-medium.webp' },
]
const FRAME_COUNT = 48
const framePath = (index: number) => `/images/storage-sequence/frame-${String(index).padStart(3, '0')}.svg`

/** CSS sticky keeps the visual beside three fully readable story panels. */
function StorageStory() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const section = root.current!
      const panels = Array.from(section.querySelectorAll<HTMLElement>('.storage-story-step'))
      const pictures = Array.from(section.querySelectorAll<HTMLElement>('.storage-story-picture'))
      gsap.set(pictures.slice(1), { opacity: 0 })
      panels.forEach((panel, index) => {
        // The fade reverses on upward scrolling and does not remove text from the DOM.
        if (index) gsap.to(pictures[index], { opacity: 1, ease: 'none', scrollTrigger: { trigger: panel, start: 'top 75%', end: 'top 45%', scrub: .4 } })
        gsap.fromTo(panel, { opacity: .7 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: panel, start: 'top 88%', end: 'top 52%', scrub: .4 } })
      })
      gsap.timeline({ scrollTrigger: { trigger: section.querySelector('.storage-story-layout'), start: 'top 20%', end: 'bottom 85%', scrub: .7 } })
        .fromTo(pictures, { scale: 1, rotationY: -4, xPercent: -2 }, { scale: 1.12, rotationY: 4, xPercent: 2, ease: 'none' })
        .to(pictures, { scale: 1.03, rotationY: 0, xPercent: 0, ease: 'none' })
    })
    return () => media.revert()
  }, { scope: root })
  return <section ref={root} className="storage-story" id="how-it-works"><div className="home-container"><div className="section-heading centered"><span className="eyebrow">FROM SEARCH TO SETTLED</span><h2 data-cinematic-heading><span className="motion-line">A little more space.</span><span className="motion-line">Three simple steps.</span></h2><p>Scroll through your storage journey.</p></div><div className="storage-story-layout"><div className="storage-story-visual"><div className="storage-story-picture-stack">{steps.map((step, index) => <img key={step.title} className="storage-story-picture" src={step.image} alt={index === 0 ? 'Blue storage doors in a bright corridor' : index === 1 ? 'A compact storage space for personal belongings' : 'Furniture and boxes settled into a storage unit'} loading="lazy" />)}</div><div className="storage-story-caption"><span>YOUR NEXT CHAPTER</span><strong>Room for what matters.</strong></div><span className="storage-story-scroll" aria-hidden="true">SCROLL TO EXPLORE ↓</span></div><div className="storage-story-copy">{steps.map((step, index) => <article className="storage-story-step" key={step.title} id={`storage-step-${index + 1}`}><span className="eyebrow">{step.detail}</span><h3>{step.title}</h3><p>{step.body}</p>{index === 0 ? <a className="text-link" href="#units">Explore sizes <span aria-hidden="true">→</span></a> : index === 1 ? <Link className="text-link" to="/storage">Start your demo booking <span aria-hidden="true">→</span></Link> : <a className="text-link" href="#contact">Talk to our team <span aria-hidden="true">→</span></a>}</article>)}</div></div></div></section>
}

/** Real frame-by-frame image sequence. Scroll changes an index, not React state. */
function StorageTour() {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 900px)' }, context => {
      if (!context.conditions?.motion) return
      const desktop = context.conditions.desktop
      const section = root.current!
      const viewport = section.querySelector<HTMLElement>('.storage-tour-viewport')!
      const surface = canvas.current!
      const drawing = surface.getContext('2d')
      if (!drawing) return
      const images: HTMLImageElement[] = []
      const sequence = { frame: 0 }
      let disposed = false
      let loading = false
      let ready = false
      let refreshFrame = 0
      // Each source frame is only 720×450. The drawing surface caps pixel density.
      function render() {
        const index = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(sequence.frame)))
        const img = images[index]
        if (!img?.complete || !img.naturalWidth) return
        const width = surface.clientWidth
        const height = surface.clientHeight
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
        const nextWidth = Math.round(width * ratio)
        const nextHeight = Math.round(height * ratio)
        if (!nextWidth || !nextHeight) return
        if (surface.width !== nextWidth || surface.height !== nextHeight) { surface.width = nextWidth; surface.height = nextHeight }
        const scale = Math.min(surface.width / img.naturalWidth, surface.height / img.naturalHeight)
        const w = img.naturalWidth * scale
        const h = img.naturalHeight * scale
        drawing!.clearRect(0, 0, surface.width, surface.height)
        drawing!.drawImage(img, (surface.width - w) / 2, (surface.height - h) / 2, w, h)
        surface.dataset.frame = String(index)
      }
      async function preload() {
        if (loading || disposed) return
        loading = true
        // Four concurrent requests, started only when the section is nearby.
        let next = 0
        try {
          await Promise.all(Array.from({ length: 4 }, async () => {
            while (next < FRAME_COUNT && !disposed) {
              const index = next++
              const img = new Image()
              img.decoding = 'async'
              images[index] = img
              await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = () => reject(new Error('Frame unavailable')); img.src = framePath(index) })
            }
          }))
          if (!disposed) { ready = true; render(); section.classList.add('sequence-ready') }
        } catch { /* Keep the static poster if a frame fails to load. */ }
      }
      const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { void preload(); observer.disconnect() } }, { rootMargin: '600px' })
      observer.observe(section)
      const headerHeight = () => document.querySelector<HTMLElement>('.shared-header')?.offsetHeight || 80
      const timeline = gsap.timeline({ scrollTrigger: {
        trigger: viewport,
        start: desktop ? () => `top ${headerHeight()}` : 'top 85%',
        end: desktop ? () => `+=${window.innerHeight * 2.2}` : 'bottom 15%',
        pin: desktop ? viewport : false,
        scrub: desktop ? .5 : .25,
        anticipatePin: desktop ? 1 : 0,
        invalidateOnRefresh: true,
      } })
      // 3. Camera approaches, shutter rises, then interior lights turn on.
      timeline.to(sequence, { frame: FRAME_COUNT - 1, duration: 2.4, ease: 'none', onUpdate: render }, 0)
      // 5. A small photo expands to the entire visible viewport at the end.
      timeline.fromTo(section.querySelector('.storage-tour-zoom'), { opacity: 0, clipPath: 'inset(24% 20% round 24px)' }, { opacity: 1, duration: .25, ease: 'none' }, 2.35)
        .to(section.querySelector('.storage-tour-zoom'), { clipPath: 'inset(0% 0% round 0px)', duration: 1, ease: 'none' }, 2.6)
        .fromTo(section.querySelector('.storage-tour-finale'), { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: .5, ease: 'none' }, 3.1)
        .to(section.querySelector('.storage-tour-intro'), { opacity: 0, duration: .3, ease: 'none' }, 2.35)
        .to({}, { duration: .35 }, 3.6) // Brief full-frame hold before native scroll continues.
        .fromTo(section.querySelector('.storage-tour-progress-fill'), { scaleX: 0 }, { scaleX: 1, duration: 3.95, ease: 'none' }, 0)
      const resize = new ResizeObserver(() => { if (ready) render() })
      resize.observe(surface)
      // Other lazy-loaded images and fonts are refreshed by useHomeMotion.
      refreshFrame = requestAnimationFrame(() => { if (!disposed) ScrollTrigger.refresh() })
      return () => {
        disposed = true; observer.disconnect(); resize.disconnect(); cancelAnimationFrame(refreshFrame)
        section.classList.remove('sequence-ready')
        images.forEach(img => { img.onload = null; img.onerror = null; img.removeAttribute('src') })
        images.length = 0
      }
    })
    return () => media.revert()
  }, { scope: root })
  return <section ref={root} className="storage-tour" aria-labelledby="storage-tour-title"><div className="storage-tour-viewport"><div className="storage-tour-intro"><span className="eyebrow">STEP INSIDE YOUR NEXT CHAPTER</span><h2 id="storage-tour-title" data-cinematic-heading><span className="motion-line">Open the door.</span><span className="motion-line">Make room for more.</span></h2><p>An illustrated look inside your storage space.</p></div><div className="storage-tour-scene"><img className="storage-tour-poster" src={framePath(FRAME_COUNT - 1)} alt="Illustrated open storage unit with the lights on and boxes arranged inside" loading="lazy" /><canvas ref={canvas} className="storage-tour-canvas" aria-hidden="true" /></div><div className="storage-tour-zoom" aria-hidden="true"><img src="/images/storage-medium.webp" alt="" loading="lazy" /><div className="storage-tour-photo-shade" /></div><div className="storage-tour-finale"><span>LESS CLUTTER. MORE POSSIBILITY.</span><p>A space for what comes next.</p></div><div className="storage-tour-progress" aria-hidden="true"><span className="storage-tour-progress-fill" /></div></div></section>
}
export default function HomeScrollExperience() { return <><StorageStory /><StorageTour /></> }
