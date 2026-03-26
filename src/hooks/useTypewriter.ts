import { useState, useEffect, useRef } from 'react'

export function useTypewriter(
  strings: string[],
  typingSpeed = 80,
  pauseDuration = 1500,
  deletingSpeed = 40
): string {
  const [displayed, setDisplayed] = useState('')
  const [stringIndex, setStringIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const current = strings[stringIndex]

    if (!isDeleting && charIndex < current.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1))
        setCharIndex(c => c + 1)
      }, typingSpeed)
    } else if (!isDeleting && charIndex === current.length) {
      timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseDuration)
    } else if (isDeleting && charIndex > 0) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1))
        setCharIndex(c => c - 1)
      }, deletingSpeed)
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false)
      setStringIndex(i => (i + 1) % strings.length)
    }

    return () => clearTimeout(timeoutRef.current)
  }, [charIndex, isDeleting, stringIndex, strings, typingSpeed, pauseDuration, deletingSpeed])

  return displayed
}
