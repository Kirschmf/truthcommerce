import { useCallback, useEffect, useRef, useState } from 'react'

export interface TypewriterOptions {
  typeSpeed?: number
  eraseSpeed?: number
  holdDelay?: number
  startDelay?: number
  enabled?: boolean
}

export default function useTypewriter(
  phrases: string[],
  {
    typeSpeed = 40,
    eraseSpeed = 30,
    holdDelay = 2000,
    startDelay = 300,
    enabled = true,
  }: TypewriterOptions = {},
) {
  const [displayed, setDisplayed] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'typing' | 'holding' | 'erasing'>('idle')
  const timerRef = useRef<number | null>(null)
  const indexRef = useRef(0)

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!enabled || phrases.length === 0) return
    clear()

    const text = phrases[phraseIndex] ?? ''

    if (phase === 'idle') {
      timerRef.current = window.setTimeout(() => {
        indexRef.current = 0
        setPhase('typing')
      }, startDelay)
    }

    if (phase === 'typing') {
      indexRef.current = 0
      timerRef.current = window.setInterval(() => {
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
      timerRef.current = window.setTimeout(() => {
        indexRef.current = text.length
        setPhase('erasing')
      }, holdDelay)
    }

    if (phase === 'erasing') {
      indexRef.current = text.length
      timerRef.current = window.setInterval(() => {
        indexRef.current -= 1
        if (indexRef.current <= 0) {
          setDisplayed('')
          clear()
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
