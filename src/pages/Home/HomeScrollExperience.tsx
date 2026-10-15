import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, ScrollTrigger, useGSAP } from './useHomeMotion'

// Shared Tailwind utilities stay beside the components that use them.
const styles = {
  eyebrow: [
    "text-[length:10px] font-bold tracking-[1.8px] text-[color:var(--blue)] inline-flex items-center gap-[9px]",
    "[.hero_&]:bg-none [.hero_&]:bg-[color:#eff6ff] [.hero_&]:bg-clip-border [.hero_&]:text-[length:10px]",
    "[.hero_&]:tracking-[1.1px] [.hero_&]:px-3 [.hero_&]:py-[7px] [.hero_&]:rounded-[30px]",
    "[.final-cta_&]:text-[color:#dbeafe] [.final-cta_&]:text-[length:9px] max-[720px]:[.final-cta_&]:text-[length:8px]",
    "max-[720px]:[.final-cta_&]:tracking-[1px] [.storage-home_.hero_&]:bg-none [.storage-home_.hero_&]:bg-[color:#eff6ff]",
    "[.storage-home_.hero_&]:bg-clip-border [.storage-home_.hero_&]:text-[color:#1e40af]",
    "[.storage-home_.hero_&]:[box-shadow:0_3px_14px_#2563eb08] [.storage-home_.hero_&]:border",
    "[.storage-home_.hero_&]:border-solid [.storage-home_.hero_&]:border-[color:#bfdbfe]",
    "[.storage-home_.storage-story_.section-heading_&]:text-[color:#6ee7b7]",
    "[.storage-home_.storage-story-step_&]:text-[color:#93c5fd] [.storage-home_.storage-story-step_&]:relative",
    "[.storage-home_.storage-story-step_&]:pl-7 [.storage-home_.storage-story-step_&:before]:content-['']",
    "[.storage-home_.storage-story-step_&:before]:absolute [.storage-home_.storage-story-step_&:before]:left-0",
    "[.storage-home_.storage-story-step_&:before]:top-[50%] [.storage-home_.storage-story-step_&:before]:w-[17px]",
    "[.storage-home_.storage-story-step_&:before]:h-0.5 [.storage-home_.storage-story-step_&:before]:bg-none",
    "[.storage-home_.storage-story-step_&:before]:bg-[color:#6ee7b7]",
    "[.storage-home_.storage-story-step_&:before]:bg-clip-border",
    "[.storage-home_.storage-tour-intro_&]:text-[color:#1e40af] [.storage-home_.storage-tour-intro_&]:bg-none",
    "[.storage-home_.storage-tour-intro_&]:bg-[color:#dbeafe] [.storage-home_.storage-tour-intro_&]:bg-clip-border",
    "[.storage-home_.storage-tour-intro_&]:tracking-[1.2px] [.storage-home_.storage-tour-intro_&]:px-3",
    "[.storage-home_.storage-tour-intro_&]:py-1.5 [.storage-home_.storage-tour-intro_&]:rounded-[20px]",
    "[.storage-home_.storage-tour-intro_&]:border [.storage-home_.storage-tour-intro_&]:border-solid",
    "[.storage-home_.storage-tour-intro_&]:border-[color:#bfdbfe]",
  ].join(' '),
  motionLine: [
    "[.storage-home_&]:block [.storage-home_&]:[transform-origin:left_center]",
    "[.storage-home_.hero_h1>&:last-child]:text-[color:transparent]",
    "[.storage-home_.hero_h1>&:last-child]:bg-[image:linear-gradient(105deg,#1e40af,#2563eb_60%,#3b82f6)]",
    "[.storage-home_.hero_h1>&:last-child]:bg-[color:transparent] [.storage-home_.hero_h1>&:last-child]:bg-clip-text",
    "[.storage-home_.hero_h1>&:last-child]:[-webkit-background-clip:text]",
    "[.storage-home_.hero_h1>&:first-child]:text-[color:var(--navy)]",
    "[.storage-home_.storage-story_.section-heading_h2_&:last-child]:text-[color:#93c5fd]",
    "[.storage-home_.storage-tour-intro_h2_&:last-child]:text-[color:#1e40af]",
    "[@media(forced-colors:active)]:[.storage-home_.hero_h1>&:last-child]:bg-none",
    "[@media(forced-colors:active)]:[.storage-home_.hero_h1>&:last-child]:bg-[color:none]",
    "[@media(forced-colors:active)]:[.storage-home_.hero_h1>&:last-child]:bg-clip-border",
    "[@media(forced-colors:active)]:[.storage-home_.hero_h1>&:last-child]:text-[color:CanvasText]",
    "[@media(forced-colors:active)]:[.storage-home_.hero_h1>&:last-child]:[-webkit-text-fill-color:CanvasText]",
  ].join(' '),
  textLink: [
    "inline-flex items-center !text-[color:var(--blue)] text-[length:12px] font-semibold bg-none bg-[color:transparent]",
    "bg-clip-border p-0 gap-3 border-[length:0px] border-none border-[color:currentColor] [&:hover]:underline",
    "[.size-content_&]:mt-[18px] [.split_&]:mb-[7px] [.trust-strip_&]:ml-auto [.trust-strip_&]:whitespace-nowrap",
    "[.faq-section_&]:mt-6 [.faq-section_&]:text-[length:11px] max-[1020px]:[.trust-strip_&]:ml-0",
    "[.storage-story-step_&]:mt-[25px] max-[899px]:[.storage-story-step_&]:mt-3.5",
    "[.storage-home_.storage-story_&]:text-[color:#93c5fd] [.storage-home_.storage-story_&:hover]:text-[color:#bfdbfe]",
  ].join(' '),
} as const


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
  return <section ref={root} className="storage-story bg-none bg-[color:#f5f8fc] bg-clip-border px-0 py-20 max-[899px]:px-0 max-[899px]:py-[55px] [.storage-home_&]:bg-[image:radial-gradient(ellipse_at_8%_20%,#1e3a5f80,transparent_55%)] [.storage-home_&]:bg-[color:var(--accent-night)] [.storage-home_&]:bg-clip-border [.storage-home_&]:text-[color:#f8fafc] [.storage-home_&]:[border-top-width:1px] [.storage-home_&]:[border-top-style:solid] [.storage-home_&]:[border-top-color:#203957] [.storage-home_&]:[border-bottom-width:1px] [.storage-home_&]:[border-bottom-style:solid] [.storage-home_&]:[border-bottom-color:#203957]" id="how-it-works"><div className="home-container w-[calc(100%_-_96px)] max-w-[1240px] m-auto max-[1250px]:w-[calc(100%_-_64px)] max-[720px]:w-[calc(100%_-_40px)]"><div className="section-heading centered mb-[35px] [&.centered]:text-center [.storage-home_&_p]:text-[color:var(--muted)] [.storage-home_&_p]:mt-3 [.storage-home_&_p]:text-[length:13px] [.storage-home_&_p]:leading-[1.8] max-[720px]:mb-[26px] max-[720px]:[.storage-home_&_p]:text-[length:12px] [.storage-home_.storage-story_&_h2]:text-[color:#fff] [.storage-home_.storage-story_&_p]:text-[color:#cbd5e1]"><span className={`eyebrow ${styles.eyebrow}`}>FROM SEARCH TO SETTLED</span><h2 data-cinematic-heading><span className={`motion-line ${styles.motionLine}`}>A little more space.</span><span className={`motion-line ${styles.motionLine}`}>Three simple steps.</span></h2><p>Scroll through your storage journey.</p></div><div className="storage-story-layout grid grid-cols-[1.15fr_1fr] [align-items:start] mt-[50px] gap-[85px] max-[899px]:grid-cols-[1fr] max-[899px]:mt-[30px] max-[899px]:gap-5 motion-reduce:!items-center"><div className="storage-story-visual sticky top-[calc(var(--motion-header-height,80px)_+_35px)] h-[calc(75svh_-_var(--motion-header-height,80px))] max-h-[590px] min-h-[340px] overflow-hidden bg-none bg-[color:#e5edf5] bg-clip-border [perspective:1000px] rounded-[20px] [&:after]:content-[''] [&:after]:absolute [&:after]:top-0 [&:after]:right-0 [&:after]:bottom-0 [&:after]:left-0 [&:after]:bg-[image:linear-gradient(transparent_45%,#0f1e33b0)] [&:after]:bg-[color:transparent] [&:after]:bg-clip-border [&:after]:pointer-events-none max-[899px]:relative max-[899px]:top-auto max-[899px]:h-[360px] max-[899px]:min-h-0 motion-reduce:!relative motion-reduce:!top-auto motion-reduce:!h-[400px] [.storage-home_&]:[box-shadow:0_20px_60px_#02061730] [.storage-home_&]:border [.storage-home_&]:border-solid [.storage-home_&]:border-[color:#ffffff26]"><div className="storage-story-picture-stack absolute top-0 right-0 bottom-0 left-0">{steps.map((step, index) => <img key={step.title} className="storage-story-picture absolute top-0 right-0 bottom-0 left-0 [will-change:transform,opacity] [&:not(:first-child)]:[opacity:0] motion-reduce:![will-change:auto]" src={step.image} alt={index === 0 ? 'Blue storage doors in a bright corridor' : index === 1 ? 'A compact storage space for personal belongings' : 'Furniture and boxes settled into a storage unit'} loading="lazy" />)}</div><div className="storage-story-caption absolute bottom-[45px] left-[30px] right-[30px] text-[color:white] z-[1] [&_span]:text-[length:9px] [&_span]:tracking-[2px] [&_span]:text-[color:#dbeafe] [&_strong]:block [&_strong]:text-[length:29px] [&_strong]:leading-[1.2] [&_strong]:tracking-[-1px] [&_strong]:font-semibold [&_strong]:mt-2.5 max-[899px]:[&_strong]:text-[length:25px] [.storage-home_&_span]:text-[color:#a7f3d0]"><span>YOUR NEXT CHAPTER</span><strong>Room for what matters.</strong></div><span className="storage-story-scroll absolute left-[30px] top-[25px] bg-none bg-[color:#ffffffeb] bg-clip-border text-[color:#14263d] text-[length:8px] tracking-[1px] z-[1] px-3 py-[7px] rounded-[20px] [.storage-home_&]:bg-none [.storage-home_&]:bg-[color:#d1fae5] [.storage-home_&]:bg-clip-border [.storage-home_&]:text-[color:#065f46]" aria-hidden="true">SCROLL TO EXPLORE ↓</span></div><div className="storage-story-copy">{steps.map((step, index) => <article className="storage-story-step min-h-[62svh] pt-[70px] pb-[90px] flex flex-col [align-items:start] justify-center px-0 [.storage-home_&_h3]:text-[length:42px] [.storage-home_&_h3]:leading-[1.15] [.storage-home_&_h3]:tracking-[-1.7px] [.storage-home_&_h3]:font-[650] [.storage-home_&_h3]:max-w-[350px] [.storage-home_&_h3]:text-[color:#f8fafc] [.storage-home_&_h3]:mx-0 [.storage-home_&_h3]:my-5 [&_p]:text-[length:15px] [&_p]:text-[color:#52647a] [&_p]:leading-[1.9] [&_p]:max-w-[360px] max-[899px]:min-h-0 max-[899px]:[border-bottom-width:1px] max-[899px]:[border-bottom-style:solid] max-[899px]:[border-bottom-color:#dce4ee] max-[899px]:px-0 max-[899px]:py-7 max-[899px]:[.storage-home_&_h3]:text-[length:31px] max-[899px]:[.storage-home_&_h3]:mx-0 max-[899px]:[.storage-home_&_h3]:my-3 max-[899px]:[&_p]:max-w-none max-[899px]:[&_p]:text-[length:14px] motion-reduce:!min-h-0 motion-reduce:!px-0 motion-reduce:!py-[35px] [.storage-home_&_p]:text-[color:#cbd5e1] max-[899px]:[.storage-home_&]:[border-bottom-color:#ffffff24]" key={step.title} id={`storage-step-${index + 1}`}><span className={`eyebrow ${styles.eyebrow}`}>{step.detail}</span><h3>{step.title}</h3><p>{step.body}</p>{index === 0 ? <a className={`text-link ${styles.textLink}`} href="#units">Explore sizes <span aria-hidden="true">→</span></a> : index === 1 ? <Link className={`text-link ${styles.textLink}`} to="/storage">Start your demo booking <span aria-hidden="true">→</span></Link> : <a className={`text-link ${styles.textLink}`} href="#contact">Talk to our team <span aria-hidden="true">→</span></a>}</article>)}</div></div></div></section>
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
  return <section ref={root} className="storage-tour relative bg-none bg-[color:#e8eff6] bg-clip-border mb-0 [.storage-home_&]:bg-none [.storage-home_&]:bg-[color:#eaf2fc] [.storage-home_&]:bg-clip-border" aria-labelledby="storage-tour-title"><div className="storage-tour-viewport relative h-[calc(100svh_-_var(--motion-header-height,80px))] min-h-[580px] overflow-hidden isolate max-[899px]:h-[720px] max-[899px]:min-h-0 motion-reduce:!h-[650px] motion-reduce:!min-h-0"><div className="storage-tour-intro absolute top-[5%] left-[7%] z-[3] max-w-[490px] [.storage-home_&_h2]:text-[length:clamp(32px,3.8vw,56px)] [.storage-home_&_h2]:tracking-[-1.8px] [.storage-home_&_h2]:font-[650] [.storage-home_&_h2]:leading-[1.1] [.storage-home_&_h2]:mx-0 [.storage-home_&_h2]:my-[13px] [&_p]:text-[length:12px] [&_p]:text-[color:#52647a] max-[899px]:top-[30px] max-[899px]:left-5 max-[899px]:right-5 max-[899px]:[.storage-home_&_h2]:text-[length:38px]"><span className={`eyebrow ${styles.eyebrow}`}>STEP INSIDE YOUR NEXT CHAPTER</span><h2 id="storage-tour-title" data-cinematic-heading><span className={`motion-line ${styles.motionLine}`}>Open the door.</span><span className={`motion-line ${styles.motionLine}`}>Make room for more.</span></h2><p>An illustrated look inside your storage space.</p></div><div className="storage-tour-scene absolute top-[34%] right-[12%] bottom-[4%] left-[12%] overflow-hidden bg-none bg-[color:#d9e4ee] bg-clip-border rounded-[18px] max-[899px]:top-[32%] max-[899px]:right-[5%] max-[899px]:bottom-[6%] max-[899px]:left-[5%]"><img className="storage-tour-poster absolute top-0 right-0 bottom-0 left-0 w-full h-full object-cover [.sequence-ready_&]:[opacity:0]" src={framePath(FRAME_COUNT - 1)} alt="Illustrated open storage unit with the lights on and boxes arranged inside" loading="lazy" /><canvas ref={canvas} className="storage-tour-canvas absolute top-0 right-0 bottom-0 left-0 w-full h-full object-cover [opacity:0] bg-none bg-[color:#d9e4ee] bg-clip-border [.sequence-ready_&]:[opacity:1] motion-reduce:!hidden" aria-hidden="true" /></div><div className="storage-tour-zoom absolute top-0 right-0 bottom-0 left-0 [opacity:0] z-[4] pointer-events-none motion-reduce:!hidden" aria-hidden="true"><img src="/images/storage-medium.webp" alt="" loading="lazy" /><div className="storage-tour-photo-shade absolute top-0 right-0 bottom-0 left-0 bg-[image:linear-gradient(transparent_25%,#0f1e3390)] bg-[color:transparent] bg-clip-border" /></div><div className="storage-tour-finale absolute left-[7%] bottom-[14%] right-[7%] z-[5] [opacity:0] text-[color:white] pointer-events-none [&_span]:text-[length:10px] [&_span]:tracking-[2px] [.storage-home_&_p]:text-[length:clamp(30px,4.2vw,64px)] [.storage-home_&_p]:leading-[1.13] [.storage-home_&_p]:tracking-[-1.7px] [.storage-home_&_p]:font-[650] [.storage-home_&_p]:max-w-[750px] [.storage-home_&_p]:mt-[15px] max-[899px]:left-[25px] max-[899px]:right-[25px] max-[899px]:bottom-[15%] motion-reduce:!hidden"><span>LESS CLUTTER. MORE POSSIBILITY.</span><p>A space for what comes next.</p></div><div className="storage-tour-progress absolute left-[7%] right-[7%] bottom-[4%] h-0.5 bg-none bg-[color:#64748b40] bg-clip-border z-[6] pointer-events-none motion-reduce:!hidden" aria-hidden="true"><span className="storage-tour-progress-fill block w-full h-full bg-none bg-[color:#2563eb] bg-clip-border [transform:scaleX(0)] [transform-origin:left_center] [.storage-home_&]:bg-none [.storage-home_&]:bg-[color:#047857] [.storage-home_&]:bg-clip-border" /></div></div></section>
}
export default function HomeScrollExperience() { return <><StorageStory /><StorageTour /></> }
