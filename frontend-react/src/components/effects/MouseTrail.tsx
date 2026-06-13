import { useEffect, useRef } from 'react'

export default function MouseTrail() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const trailPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 8}px, ${e.clientY - 8}px)`
      }
    }

    const animate = () => {
      trailPos.current.x += (pos.current.x - trailPos.current.x) * 0.12
      trailPos.current.y += (pos.current.y - trailPos.current.y) * 0.12
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailPos.current.x - 16}px, ${trailPos.current.y - 16}px)`
      }
      requestAnimationFrame(animate)
    }

    const onDown = () => {
      cursorRef.current?.style.setProperty('transform', `translate(${pos.current.x - 6}px, ${pos.current.y - 6}px) scale(1.5)`)
    }
    const onUp = () => {}

    const onEnterLink = () => {
      cursorRef.current?.style.setProperty('width', '24px')
      cursorRef.current?.style.setProperty('height', '24px')
      trailRef.current?.style.setProperty('width', '50px')
      trailRef.current?.style.setProperty('height', '50px')
    }
    const onLeaveLink = () => {
      cursorRef.current?.style.setProperty('width', '16px')
      cursorRef.current?.style.setProperty('height', '16px')
      trailRef.current?.style.setProperty('width', '32px')
      trailRef.current?.style.setProperty('height', '32px')
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.querySelectorAll('a,button,[role=button]').forEach(el => {
      el.addEventListener('mouseenter', onEnterLink)
      el.addEventListener('mouseleave', onLeaveLink)
    })

    const raf = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference rounded-full bg-white"
        style={{ width: 16, height: 16, transition: 'width 0.2s, height 0.2s' }}
      />
      <div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{
          width: 32, height: 32,
          background: 'rgba(59,130,246,0.15)',
          border: '1px solid rgba(59,130,246,0.4)',
          transition: 'width 0.3s, height 0.3s',
        }}
      />
    </>
  )
}
