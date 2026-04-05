"use client"

import { useRef, useEffect, useState, useCallback } from 'react'

function getSeasonalColors() {
  const month = new Date().getMonth()
  // Winter: Dec, Jan, Feb
  if (month === 11 || month === 0 || month === 1) {
    return { 
      face: '#e8f4fc', 
      accent: '#7cb3d6', 
      hands: '#1a3a2e',
      text: '#1a3a2e'
    }
  }
  // Spring: Mar, Apr, May
  if (month >= 2 && month <= 4) {
    return { 
      face: '#f5f9e8', 
      accent: '#8fbc8f', 
      hands: '#1a3a2e',
      text: '#1a3a2e'
    }
  }
  // Summer: Jun, Jul, Aug
  if (month >= 5 && month <= 7) {
    return { 
      face: '#fffef0', 
      accent: '#d4a574', 
      hands: '#1a3a2e',
      text: '#1a3a2e'
    }
  }
  // Autumn: Sep, Oct, Nov
  return { 
    face: '#faf4e8', 
    accent: '#c17f59', 
    hands: '#1a3a2e',
    text: '#1a3a2e'
  }
}

export function LiveClock({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [colors] = useState(getSeasonalColors)
  const animationFrameRef = useRef<number>()

  const drawClock = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()
    const milliseconds = now.getMilliseconds()

    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 10

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw outer ring (bezel)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#d4a574')
    gradient.addColorStop(0.5, '#c9a066')
    gradient.addColorStop(1, '#b8935a')
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw inner bezel ring
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius - 8, 0, Math.PI * 2)
    ctx.fillStyle = '#1a3a2e'
    ctx.fill()

    // Draw watch face
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius - 16, 0, Math.PI * 2)
    ctx.fillStyle = colors.face
    ctx.fill()

    // Draw subtle texture
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius - 16, 0, Math.PI * 2)
    const textureGradient = ctx.createRadialGradient(centerX - 30, centerY - 30, 0, centerX, centerY, radius)
    textureGradient.addColorStop(0, 'rgba(255,255,255,0.3)')
    textureGradient.addColorStop(1, 'rgba(0,0,0,0.05)')
    ctx.fillStyle = textureGradient
    ctx.fill()

    // Draw PONTIME text
    ctx.font = `bold ${radius * 0.12}px "Playfair Display", serif`
    ctx.fillStyle = colors.text
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('PONTIME', centerX, centerY - radius * 0.35)

    // Draw "BUSSUM" subtitle
    ctx.font = `${radius * 0.06}px "Inter", sans-serif`
    ctx.fillStyle = colors.accent
    ctx.fillText('BUSSUM', centerX, centerY - radius * 0.22)

    // Draw hour markers
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180)
      const innerRadius = i % 3 === 0 ? radius - 40 : radius - 35
      const outerRadius = radius - 25

      ctx.beginPath()
      ctx.moveTo(
        centerX + Math.cos(angle) * innerRadius,
        centerY + Math.sin(angle) * innerRadius
      )
      ctx.lineTo(
        centerX + Math.cos(angle) * outerRadius,
        centerY + Math.sin(angle) * outerRadius
      )
      ctx.strokeStyle = i % 3 === 0 ? colors.hands : colors.accent
      ctx.lineWidth = i % 3 === 0 ? 3 : 1.5
      ctx.lineCap = 'round'
      ctx.stroke()
    }

    // Draw minute markers
    for (let i = 0; i < 60; i++) {
      if (i % 5 !== 0) {
        const angle = (i * 6 - 90) * (Math.PI / 180)
        ctx.beginPath()
        ctx.arc(
          centerX + Math.cos(angle) * (radius - 22),
          centerY + Math.sin(angle) * (radius - 22),
          1,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = colors.accent
        ctx.fill()
      }
    }

    // Calculate hand angles (smooth movement)
    const smoothSeconds = seconds + milliseconds / 1000
    const smoothMinutes = minutes + smoothSeconds / 60
    const smoothHours = (hours % 12) + smoothMinutes / 60

    const secondAngle = (smoothSeconds * 6 - 90) * (Math.PI / 180)
    const minuteAngle = (smoothMinutes * 6 - 90) * (Math.PI / 180)
    const hourAngle = (smoothHours * 30 - 90) * (Math.PI / 180)

    // Draw hour hand
    ctx.beginPath()
    ctx.moveTo(
      centerX - Math.cos(hourAngle) * 15,
      centerY - Math.sin(hourAngle) * 15
    )
    ctx.lineTo(
      centerX + Math.cos(hourAngle) * (radius * 0.45),
      centerY + Math.sin(hourAngle) * (radius * 0.45)
    )
    ctx.strokeStyle = colors.hands
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.stroke()

    // Draw minute hand
    ctx.beginPath()
    ctx.moveTo(
      centerX - Math.cos(minuteAngle) * 15,
      centerY - Math.sin(minuteAngle) * 15
    )
    ctx.lineTo(
      centerX + Math.cos(minuteAngle) * (radius * 0.65),
      centerY + Math.sin(minuteAngle) * (radius * 0.65)
    )
    ctx.strokeStyle = colors.hands
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.stroke()

    // Draw second hand
    ctx.beginPath()
    ctx.moveTo(
      centerX - Math.cos(secondAngle) * 25,
      centerY - Math.sin(secondAngle) * 25
    )
    ctx.lineTo(
      centerX + Math.cos(secondAngle) * (radius * 0.75),
      centerY + Math.sin(secondAngle) * (radius * 0.75)
    )
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.stroke()

    // Draw center cap
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
    ctx.fillStyle = colors.hands
    ctx.fill()

    ctx.beginPath()
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2)
    ctx.fillStyle = colors.accent
    ctx.fill()
  }, [colors])

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

    const animate = () => {
      drawClock(ctx, rect.width, rect.height)
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [drawClock])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
