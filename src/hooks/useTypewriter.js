import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Typewriter hook with multiple phrases cycling:
 * type → hold → erase → type next → hold → erase → loop
 *
 * @param {string[]} phrases - Array of phrases to cycle through
 * @param {object} opts
 * @param {number} opts.typeSpeed   - ms per character typing (default 40)
 * @param {number} opts.eraseSpeed  - ms per character erasing (default 30)
 * @param {number} opts.holdDelay   - ms to hold after typing completes (default 2000)
 * @param {number} opts.startDelay  - ms before first phrase starts (default 300)
 * @param {boolean} opts.enabled
 */
export default function useTypewriter(
  phrases,
  { typeSpeed = 40, eraseSpeed = 30, holdDelay = 2000, startDelay = 300, enabled = true } = {}
) {
  const [displayed, setDisplayed] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [phase, setPhase] = useState('idle') // idle | typing | holding | erasing
  const timerRef = useRef(null)
  const indexRef = useRef(0)

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!enabled || !phrases.length) return
    clear()

    const text = phrases[phraseIndex]

    if (phase === 'idle') {
      // Wait startDelay then begin typing
      timerRef.current = setTimeout(() => {
        indexRef.current = 0
        setPhase('typing')
      }, startDelay)
    }

    if (phase === 'typing') {
      indexRef.current = 0
      timerRef.current = setInterval(() => {
        indexRef.current += 1
        if (indexRef.current >= text.length) {
          setDisplayed(text)
          clear()
          setPhase('holding')
        } else {
          setDisplayed(text.slice(0, indexRef.current))
        }
      }, typeSpeed)
    }

    if (phase === 'holding') {
      timerRef.current = setTimeout(() => {
        indexRef.current = text.length
        setPhase('erasing')
      }, holdDelay)
    }

    if (phase === 'erasing') {
      indexRef.current = text.length
      timerRef.current = setInterval(() => {
        indexRef.current -= 1
        if (indexRef.current <= 0) {
          setDisplayed('')
          clear()
          // Move to next phrase
          setPhraseIndex((prev) => (prev + 1) % phrases.length)
          setPhase('typing')
        } else {
          setDisplayed(text.slice(0, indexRef.current))
        }
      }, eraseSpeed)
    }

    return clear
  }, [phrases, phraseIndex, phase, typeSpeed, eraseSpeed, holdDelay, startDelay, enabled, clear])

  const isTyping = phase === 'typing' || phase === 'erasing'

  return { displayed, phraseIndex, phase, cursor: isTyping || phase === 'holding' }
}
