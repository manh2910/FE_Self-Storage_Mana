// Generate a deterministic, lightweight illustration sequence. Replace these SVGs
// with exported 3D-render frames later without changing the scroll renderer.
const fs = require('node:fs')
const path = require('node:path')
const directory = path.resolve(__dirname, '../public/images/storage-sequence')
fs.mkdirSync(directory, { recursive: true })
const count = 48
const clamp = value => Math.max(0, Math.min(1, value))
const ease = value => value * value * (3 - 2 * value)
for (let index = 0; index < count; index++) {
  const t = index / (count - 1)
  const opening = ease(clamp((t - .25) / .5))
  const light = ease(clamp((t - .62) / .3))
  const scale = .82 + ease(clamp(t / .35)) * .18 + ease(clamp((t - .75) / .25)) * .2
  const height = 318 * (1 - opening)
  const slats = Array.from({ length: 25 }, (_, n) => `<path d="M182 ${78+n*13}h356" stroke="#103d79" stroke-width="2"/><path d="M184 ${80+n*13}h352" stroke="#75a8df" stroke-opacity=".4"/>`).join('')
  const boxes = [[264,262,66,57],[341,252,70,67],[293,210,57,48],[373,207,43,42]].map(([x,y,w,h])=>`<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#b78652" stroke="#866039" stroke-width="2"/><path d="M${x+w/2} ${y}v${h}" stroke="#ddba84" stroke-width="8"/><path d="M${x+12} ${y+15}h18" stroke="#795b39" stroke-width="2"/></g>`).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="450" viewBox="0 0 720 450"><title>Illustrated storage unit: door opening and lights turning on</title><defs><linearGradient id="wall" x2="0" y2="1"><stop stop-color="#e6edf4"/><stop offset="1" stop-color="#9aaec2"/></linearGradient><linearGradient id="floor" x2="0" y2="1"><stop stop-color="#71879e"/><stop offset="1" stop-color="#e3edf5"/></linearGradient><linearGradient id="door" x2="1" y2="0"><stop stop-color="#174b91"/><stop offset=".5" stop-color="#3678be"/><stop offset="1" stop-color="#1e579c"/></linearGradient><radialGradient id="glow"><stop stop-color="#fff5cf" stop-opacity=".7"/><stop offset="1" stop-color="#fff5cf" stop-opacity="0"/></radialGradient><clipPath id="shutter"><rect x="182" y="78" width="356" height="${height.toFixed(2)}"/></clipPath></defs><rect width="720" height="450" fill="#d9e4ee"/><g transform="translate(360 225) scale(${scale.toFixed(4)}) translate(-360 -225)"><path d="M0 0h720v450H0Z" fill="url(#wall)"/><path d="m0 450 180-64h360l180 64" fill="#acbdcd"/><rect x="168" y="60" width="384" height="344" rx="5" fill="#31465b"/><path d="M182 78h356v318H182Z" fill="#e4e8e7"/><path d="m182 78 111 71v152l-111 95" fill="#aebbc6"/><path d="m538 78-111 71v152l111 95" fill="#becbd4"/><path d="m182 78 111 71h134l111-71" fill="#d8e2e8"/><path d="m182 396 111-95h134l111 95" fill="url(#floor)"/><rect x="293" y="149" width="134" height="152" fill="#d4dce1"/><path d="M306 301 251 396M341 301l-13 95M380 301l15 95M416 301l66 95M267 324h186M233 355h257" stroke="#8ca0b3" stroke-width="1"/>${boxes}<rect x="448" y="238" width="55" height="94" rx="3" fill="#8da3b8"/><path d="M448 268h55M448 300h55" stroke="#607990" stroke-width="4"/><rect x="330" y="121" width="60" height="8" rx="4" fill="${light>.2?'#fff6d2':'#94a3b8'}"/><ellipse cx="360" cy="225" rx="178" ry="170" fill="url(#glow)" opacity="${light.toFixed(3)}"/><rect x="182" y="78" width="356" height="318" fill="#091425" opacity="${(.7*(1-light)).toFixed(3)}"/><g clip-path="url(#shutter)"><rect x="182" y="78" width="356" height="318" fill="url(#door)"/>${slats}</g><path d="M182 ${(78+height).toFixed(2)}h356" stroke="#102f53" stroke-width="6"/><path d="M175 77v319M545 77v319" stroke="#60768c" stroke-width="6"/><rect x="572" y="96" width="65" height="38" rx="5" fill="#fff"/><text x="604" y="121" text-anchor="middle" fill="#16345b" font-family="Arial,sans-serif" font-size="16" font-weight="700">A012</text><path d="M64 68v321M99 68v321M654 68v321" stroke="#a3b6c9" stroke-width="2"/></g></svg>`
  fs.writeFileSync(path.join(directory, `frame-${String(index).padStart(3, '0')}.svg`), svg)
}
console.log(`Generated ${count} storage sequence frames.`)
