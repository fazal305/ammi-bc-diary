function secureRandom() {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] / 2 ** 32
}

export function pickRandom(items, random = secureRandom) {
  if (items.length === 0) return null
  return items[Math.floor(random() * items.length)]
}
