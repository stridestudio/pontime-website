"use client"

import { useRef, useEffect, useState, useCallback } from 'react'

export function BeforeAfterSlider({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const drawWatch = useCallback((
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number,
    sliderPos: number
  ) => {
    const centerX = width / 2
    const centerY = height / 2
    const watchRadius = Math.min(width, height) * 0.35

    ctx.clearRect(0, 0, width, height)

    // Background
    ctx.fillStyle = '#1a3a2e'
    ctx.fillRect(0, 0, width, height)

    // Draw "BEFORE" label
    ctx.font = 'bold 14px Inter, sans-serif'
    ctx.fillStyle = '#d4a574'
    ctx.textAlign = 'left'
    ctx.fillText('VOOR', 20, 30)

    // Draw "AFTER" label
    ctx.textAlign = 'right'
    ctx.fillText('NA', width - 20, 30)

    // Calculate divider position
    const dividerX = (sliderPos / 100) * width

    // Save state and create clip for "before" side (damaged watch)
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, dividerX, height)
    ctx.clip()

    // Draw damaged watch (before)
    // Bezel
    ctx.beginPath()
    ctx.arc(centerX, centerY, watchRadius + 10, 0, Math.PI * 2)
    ctx.fillStyle = '#8b7355'
    ctx.fill()

    // Scratched effect on bezel
    for (let i = 0; i < 20; i++) {
      ctx.beginPath()
      const angle = Math.random() * Math.PI * 2
      const len = 10 + Math.random() * 15
      ctx.moveTo(
        centerX + Math.cos(angle) * (watchRadius + 5),
        centerY + Math.sin(angle) * (watchRadius + 5)
      )
      ctx.lineTo(
        centerX + Math.cos(angle + 0.1) * (watchRadius + 5 + len),
        centerY + Math.sin(angle + 0.1) * (watchRadius + 5 + len)
      )
      ctx.strokeStyle = 'rgba(60,40,20,0.5)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Watch face (damaged)
    ctx.beginPath()
    ctx.arc(centerX, centerY, watchRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#e8e0d0'
    ctx.fill()

    // Discoloration spots
    for (let i = 0; i < 5; i++) {
      ctx.beginPath()
      const spotX = centerX + (Math.random() - 0.5) * watchRadius * 1.2
      const spotY = centerY + (Math.random() - 0.5) * watchRadius * 1.2
      ctx.arc(spotX, spotY, 5 + Math.random() * 15, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(180,160,120,0.4)'
      ctx.fill()
    }

    // Deep scratches
    for (let i = 0; i < 8; i++) {
      ctx.beginPath()
      const startX = centerX + (Math.random() - 0.5) * watchRadius * 1.5
      const startY = centerY + (Math.random() - 0.5) * watchRadius * 1.5
      ctx.moveTo(startX, startY)
      ctx.lineTo(startX + (Math.random() - 0.5) * 60, startY + (Math.random() - 0.5) * 60)
      ctx.strokeStyle = 'rgba(100,80,60,0.3)'
      ctx.lineWidth = 1 + Math.random() * 2
      ctx.stroke()
    }

    // Damaged hour markers
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180)
      ctx.beginPath()
      ctx.arc(
        centerX + Math.cos(angle) * (watchRadius - 20),
        centerY + Math.sin(angle) * (watchRadius - 20),
        3,
        0,
        Math.PI * 2
      )
      ctx.fillStyle = i % 4 === 0 ? '#8b7355' : '#a09080'
      ctx.fill()
    }

    // Tarnished hands
    const hourAngle = -45 * (Math.PI / 180)
    const minuteAngle = 60 * (Math.PI / 180)

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(
      centerX + Math.cos(hourAngle) * (watchRadius * 0.4),
      centerY + Math.sin(hourAngle) * (watchRadius * 0.4)
    )
    ctx.strokeStyle = '#5a4a3a'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(
      centerX + Math.cos(minuteAngle) * (watchRadius * 0.6),
      centerY + Math.sin(minuteAngle) * (watchRadius * 0.6)
    )
    ctx.strokeStyle = '#5a4a3a'
    ctx.lineWidth = 3
    ctx.stroke()

    ctx.restore()

    // Save state and create clip for "after" side (polished watch)
    ctx.save()
    ctx.beginPath()
    ctx.rect(dividerX, 0, width - dividerX, height)
    ctx.clip()

    // Draw polished watch (after)
    // Shiny bezel
    ctx.beginPath()
    ctx.arc(centerX, centerY, watchRadius + 10, 0, Math.PI * 2)
    const bezelGradient = ctx.createLinearGradient(
      centerX - watchRadius, centerY - watchRadius,
      centerX + watchRadius, centerY + watchRadius
    )
    bezelGradient.addColorStop(0, '#d4a574')
    bezelGradient.addColorStop(0.3, '#f0d8b8')
    bezelGradient.addColorStop(0.5, '#d4a574')
    bezelGradient.addColorStop(0.7, '#f0d8b8')
    bezelGradient.addColorStop(1, '#c9956a')
    ctx.fillStyle = bezelGradient
    ctx.fill()

    // Watch face (pristine)
    ctx.beginPath()
    ctx.arc(centerX, centerY, watchRadius, 0, Math.PI * 2)
    const faceGradient = ctx.createRadialGradient(
      centerX - 20, centerY - 20, 0,
      centerX, centerY, watchRadius
    )
    faceGradient.addColorStop(0, '#ffffff')
    faceGradient.addColorStop(1, '#f5f0e8')
    ctx.fillStyle = faceGradient
    ctx.fill()

    // Crisp hour markers
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180)
      if (i % 3 === 0) {
        ctx.beginPath()
        ctx.moveTo(
          centerX + Math.cos(angle) * (watchRadius - 30),
          centerY + Math.sin(angle) * (watchRadius - 30)
        )
        ctx.lineTo(
          centerX + Math.cos(angle) * (watchRadius - 15),
          centerY + Math.sin(angle) * (watchRadius - 15)
        )
        ctx.strokeStyle = '#1a3a2e'
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.arc(
          centerX + Math.cos(angle) * (watchRadius - 20),
          centerY + Math.sin(angle) * (watchRadius - 20),
          2,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = '#1a3a2e'
        ctx.fill()
      }
    }

    // Polished hands
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(
      centerX + Math.cos(hourAngle) * (watchRadius * 0.4),
      centerY + Math.sin(hourAngle) * (watchRadius * 0.4)
    )
    ctx.strokeStyle = '#1a3a2e'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(
      centerX + Math.cos(minuteAngle) * (watchRadius * 0.6),
      centerY + Math.sin(minuteAngle) * (watchRadius * 0.6)
    )
    ctx.strokeStyle = '#1a3a2e'
    ctx.lineWidth = 3
    ctx.stroke()

    // Center cap
    ctx.beginPath()
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2)
    ctx.fillStyle = '#d4a574'
    ctx.fill()

    ctx.restore()

    // Draw divider line
    ctx.beginPath()
    ctx.moveTo(dividerX, 0)
    ctx.lineTo(dividerX, height)
    ctx.strokeStyle = '#d4a574'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw handle
    ctx.beginPath()
    ctx.arc(dividerX, centerY, 20, 0, Math.PI * 2)
    ctx.fillStyle = '#d4a574'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(dividerX, centerY, 16, 0, Math.PI * 2)
    ctx.fillStyle = '#1a3a2e'
    ctx.fill()

    // Arrows on handle
    ctx.font = 'bold 12px sans-serif'
    ctx.fillStyle = '#d4a574'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('◄►', dividerX, centerY)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    drawWatch(ctx, rect.width, rect.height, sliderPosition)
  }, [sliderPosition, drawWatch])

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative cursor-ew-resize select-none ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
