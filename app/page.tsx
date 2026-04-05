"use client"

import React, { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Menu, X, ChevronRight, Clock, Award, Shield, Wrench, Star, Phone, Mail, MapPin } from 'lucide-react'
import { useScroll, motion, useMotionValue, animate } from 'framer-motion'
import useMeasure from 'react-use-measure'
import { LiveClock } from '@/components/pontime/live-clock'
import { BeforeAfterSlider } from '@/components/pontime/before-after-slider'
import { ServiceConfigurator } from '@/components/pontime/service-configurator'
import { RestorationTimeline } from '@/components/pontime/restoration-timeline'
import { CollectorsPassport } from '@/components/pontime/collectors-passport'

type InfiniteSliderProps = {
  children: React.ReactNode
  gap?: number
  duration?: number
  durationOnHover?: number
  direction?: 'horizontal' | 'vertical'
  reverse?: boolean
  className?: string
  speed?: number
  speedOnHover?: number
}

function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
  speed,
  speedOnHover,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(speed || duration)
  const [ref, { width, height }] = useMeasure()
  const translation = useMotionValue(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [key, setKey] = useState(0)

  useEffect(() => {
    let controls
    const size = direction === 'horizontal' ? width : height
    const contentSize = size + gap
    const from = reverse ? -contentSize / 2 : 0
    const to = reverse ? 0 : -contentSize / 2

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: 'linear',
        duration: currentDuration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => {
          setIsTransitioning(false)
          setKey((prevKey) => prevKey + 1)
        },
      })
    } else {
      controls = animate(translation, [from, to], {
        ease: 'linear',
        duration: currentDuration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from)
        },
      })
    }

    return controls?.stop
  }, [key, translation, currentDuration, width, height, gap, isTransitioning, direction, reverse])

  const hoverProps =
    durationOnHover || speedOnHover
      ? {
          onHoverStart: () => {
            setIsTransitioning(true)
            setCurrentDuration(speedOnHover || durationOnHover || duration)
          },
          onHoverEnd: () => {
            setIsTransitioning(true)
            setCurrentDuration(speed || duration)
          },
        }
      : {}

  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        className="flex w-max"
        style={{
          ...(direction === 'horizontal' ? { x: translation } : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
        }}
        ref={ref}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}

const GRADIENT_ANGLES = { top: 0, right: 90, bottom: 180, left: 270 }

function ProgressiveBlur({
  direction = 'bottom',
  className,
}: {
  direction?: keyof typeof GRADIENT_ANGLES
  blurLayers?: number
  className?: string
  blurIntensity?: number
}) {
  const angle = GRADIENT_ANGLES[direction]
  const gradient = `linear-gradient(${angle}deg, #1a3a2e 0%, rgba(26,58,46,0) 100%)`
  return (
    <div
      className={cn('pointer-events-none', className)}
      style={{ background: gradient }}
    />
  )
}

const Logo = ({ className, variant = 'dark' }: { className?: string; variant?: 'dark' | 'light' }) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-2xl font-serif tracking-tight">
        <span className={variant === 'dark' ? 'text-primary-foreground' : 'text-foreground'}>PON</span>
        <span className="text-accent">TIME</span>
      </span>
    </div>
  )
}

const menuItems = [
  { name: 'Diensten', href: '#diensten' },
  { name: 'Werkwijze', href: '#werkwijze' },
  { name: 'Configurator', href: '#configurator' },
  { name: 'Over ons', href: '#over-ons' },
  { name: 'Contact', href: '#contact' },
]

const HeroHeader = () => {
  const [menuState, setMenuState] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrolled(latest > 0.05)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <header>
      <nav data-state={menuState && 'active'} className="group fixed z-20 w-full pt-2">
        <div
          className={cn(
            'mx-auto max-w-7xl rounded-3xl px-6 transition-all duration-300 lg:px-12',
            scrolled && 'bg-[#1a3a2e] border border-accent/20'
          )}
        >
          <motion.div
            className={cn(
              'relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0 lg:py-6',
              scrolled && 'lg:py-4'
            )}
          >
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <a href="/" aria-label="home" className="flex items-center space-x-2">
                <Logo />
              </a>
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200 text-primary-foreground" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 text-primary-foreground" />
              </button>
              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="text-primary-foreground hover:text-accent block duration-150 font-medium"
                      >
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-[#1a3a2e] group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-accent/20 p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="text-primary-foreground hover:text-accent block duration-150 font-medium"
                      >
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-primary-foreground/50 bg-transparent text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground hover:border-primary-foreground/70 font-medium"
                >
                  <a href="#configurator">
                    <span>Offerte Aanvragen</span>
                  </a>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-accent hover:bg-accent/85 text-accent-foreground shadow-lg font-medium"
                >
                  <a href="#contact">
                    <span>Neem Contact Op</span>
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </nav>
    </header>
  )
}

export default function PontimeHomepage() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden bg-primary">
        {/* Hero Section */}
        <section className="relative min-h-screen">
          <div className="py-24 md:pb-32 lg:pb-24 lg:pt-40">
            <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
              <div className="mx-auto max-w-3xl text-center lg:ml-0 lg:max-w-2xl lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block mb-4 px-4 py-2 rounded-full bg-accent/20 border border-accent/40"
                >
                  <span className="text-accent text-sm font-medium tracking-wide uppercase">
                    Horloge Service Atelier
                  </span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mt-6 max-w-4xl text-balance text-5xl md:text-6xl lg:mt-8 xl:text-7xl font-serif text-primary-foreground"
                >
                  Uw horloge in <span className="italic text-accent">goede</span> handen
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-6 max-w-2xl text-balance text-lg text-primary-foreground/80"
                >
                  Pontime is een horloge service atelier in Bussum (&apos;t Gooi - Gooise Meren). Met drie zeer
                  ervaren horlogemakers kunnen we jouw horloge repareren, onderhouden, polijsten en lapideren
                  of zelfs laserwelden. We zijn gespecialiseerd in Rolex.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
                >
                  <Button
                    asChild
                    size="lg"
                    className="h-14 rounded-full pl-6 pr-4 text-base bg-accent hover:bg-accent/85 text-accent-foreground shadow-lg font-semibold"
                  >
                    <a href="#contact">
                      <span className="text-nowrap">Neem Contact Op</span>
                      <ChevronRight className="ml-1" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-14 rounded-full px-6 text-base border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/15 hover:border-primary-foreground/60 font-medium"
                  >
                    <a href="#diensten">
                      <span className="text-nowrap">Onze Diensten</span>
                    </a>
                  </Button>
                </motion.div>
              </div>

            </div>

            {/* Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src="/hero-bg.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0f2419]/85 via-[#1a3a2e]/75 to-[#0a1812]/90" />
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="bg-primary pb-2 border-t border-accent/20">
          <div className="group relative m-auto max-w-7xl px-6">
            <div className="flex flex-col items-center md:flex-row py-8">
              <div className="md:max-w-44 md:border-r md:border-accent/20 md:pr-6">
                <p className="text-end text-sm text-primary-foreground/70">Vertrouwd door collectors</p>
              </div>
              <div
                className="relative py-6 md:w-[calc(100%-11rem)]"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0, #000 10%, #000 90%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to right, transparent 0, #000 10%, #000 90%, transparent 100%)",
                }}
              >
                <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                  <div className="flex items-center gap-2 text-primary-foreground/60">
                    <Award className="h-5 w-5" />
                    <span className="text-sm font-medium">Rolex Specialist</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-foreground/60">
                    <Shield className="h-5 w-5" />
                    <span className="text-sm font-medium">Ervaren Horlogemakers</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-foreground/60">
                    <Star className="h-5 w-5" />
                    <span className="text-sm font-medium">Snelle Service</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-foreground/60">
                    <Wrench className="h-5 w-5" />
                    <span className="text-sm font-medium">Bezel Cutter</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-foreground/60">
                    <Clock className="h-5 w-5" />
                    <span className="text-sm font-medium">Laserwelding</span>
                  </div>
                </InfiniteSlider>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="diensten" className="bg-background py-24 md:py-32 border-t border-accent/20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Onze Diensten</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Deskundige verzorging voor uw kostbare uurwerken
              </p>
            </motion.div>
            <div className="mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="group overflow-hidden shadow-xl bg-card border-border hover:border-accent/50 transition-all h-full p-0 gap-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src="/atelier/diensten-full-service.jpg"
                      alt="Full service en reparaties"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#8fbc8f]/25 pointer-events-none" />
                  </div>
                  <CardHeader>
                    <div className="md:p-4">
                      <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center mb-4">
                        <Wrench className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <p className="font-semibold text-xl text-foreground mb-2">Full Service & Reparaties</p>
                      <p className="text-muted-foreground text-sm">
                        Volledige revisie van het uurwerk, reiniging en nauwkeurige afstelling
                      </p>
                      <div className="mt-4 inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/40">
                        <span className="text-accent text-xs font-medium">3-4 weken doorlooptijd</span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="group overflow-hidden shadow-xl bg-card border-border hover:border-accent/50 transition-all h-full p-0 gap-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src="/atelier/diensten-polijsten.jpg"
                      alt="Polijsten en lapideren"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#8fbc8f]/25 pointer-events-none" />
                  </div>
                  <CardHeader>
                    <div className="md:p-4">
                      <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center mb-4">
                        <Star className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <p className="font-semibold text-xl text-foreground mb-2">Polijsten & Lapideren</p>
                      <p className="text-muted-foreground text-sm">
                        Professionele kast- en bandafwerking om de originele glans te herstellen
                      </p>
                      <div className="mt-4 inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/40">
                        <span className="text-accent text-xs font-medium">1-2 weken doorlooptijd</span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="group overflow-hidden shadow-xl bg-card border-border hover:border-accent/50 transition-all h-full p-0 gap-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src="/atelier/diensten-restauratie.jpg"
                      alt="Restauratie van vintage uurwerken"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#8fbc8f]/25 pointer-events-none" />
                  </div>
                  <CardHeader>
                    <div className="md:p-4">
                      <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center mb-4">
                        <Clock className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <p className="font-semibold text-xl text-foreground mb-2">Restauratie</p>
                      <p className="text-muted-foreground text-sm">
                        Vintage uurwerken terugbrengen naar hun oude glorie
                      </p>
                      <div className="mt-4 inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/40">
                        <span className="text-accent text-xs font-medium">Op maat gemaakt</span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="sm:col-span-2 lg:col-span-3"
              >
                <Card className="group overflow-hidden shadow-xl bg-card border-border hover:border-accent/50 transition-all p-0 gap-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-2/5 aspect-[4/3] md:aspect-auto md:min-h-[240px] overflow-hidden bg-muted">
                      <img
                        src="/atelier/diensten-bezel.jpg"
                        alt="Bezel cutten en gespecialiseerde diensten"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#8fbc8f]/25 pointer-events-none" />
                    </div>
                    <CardHeader className="flex-1">
                      <div className="md:p-4 flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                          <Shield className="h-8 w-8 text-accent-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-2xl text-foreground mb-2">
                            Bezel Cutten & Gespecialiseerde Diensten
                          </p>
                          <p className="text-muted-foreground">
                            Expert bezel restauratie en snijdiensten voor Rolex en andere luxe merken. We kunnen nu
                            ook gouden Rolex bezels &quot;cutten&quot;.
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Before/After Section */}
        <section className="bg-primary py-24 md:py-32 border-t border-accent/20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif text-primary-foreground mb-4">
                Onze Resultaten
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Bekijk het verschil voor en na onze restauratie
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-accent/20">
                <BeforeAfterSlider className="w-full h-full" />
              </div>
              <p className="text-center text-primary-foreground/60 text-sm mt-4">
                Sleep de divider om het verschil te zien
              </p>
            </motion.div>
          </div>
        </section>

        {/* Werkwijze Section */}
        <section id="werkwijze" className="bg-background py-24 md:py-32 border-t border-accent/20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Full Service Proces</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Ontdek stap voor stap hoe wij uw horloge behandelen
              </p>
            </motion.div>
            <RestorationTimeline />
          </div>
        </section>

        {/* Atelier Showcase Section */}
        <section className="bg-primary py-24 md:py-32 border-t border-accent/20 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-accent/20 border border-accent/40">
                <span className="text-accent text-sm font-medium tracking-wide uppercase">
                  Ons atelier
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-primary-foreground mb-4">
                Waar vakmanschap samenkomt
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Een blik in ons atelier in Bussum, waar elk horloge de aandacht krijgt die het verdient
              </p>
            </motion.div>
            <div className="grid gap-4 md:grid-cols-6 md:grid-rows-2 md:h-[520px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="md:col-span-4 md:row-span-2 relative aspect-[4/3] md:aspect-auto rounded-2xl overflow-hidden border border-accent/20"
              >
                <img
                  src="/atelier/atelier-overzicht.jpg"
                  alt="Het Pontime atelier in Bussum"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#8fbc8f]/25 pointer-events-none" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="md:col-span-2 relative aspect-[4/3] md:aspect-auto rounded-2xl overflow-hidden border border-accent/20"
              >
                <img
                  src="/atelier/onderdelen-box.jpg"
                  alt="Horlogemaker onderdelen"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#8fbc8f]/25 pointer-events-none" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:col-span-2 relative aspect-[4/3] md:aspect-auto rounded-2xl overflow-hidden border border-accent/20"
              >
                <img
                  src="/atelier/tools-kast.jpg"
                  alt="Het atelier van binnen"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#8fbc8f]/25 pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Service Configurator Section */}
        <section id="configurator" className="bg-primary py-24 md:py-32 border-t border-accent/20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl md:text-5xl font-serif text-primary-foreground mb-4">
                  Configureer uw service
                </h2>
                <p className="text-lg text-primary-foreground/80 mb-8">
                  Ontvang direct een indicatie van de kosten en doorlooptijd voor uw horloge service.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-primary-foreground font-semibold mb-1">Kies uw merk</h3>
                      <p className="text-primary-foreground/70 text-sm">
                        Selecteer het merk van uw horloge voor een nauwkeurige inschatting.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-primary-foreground font-semibold mb-1">Beschrijf het probleem</h3>
                      <p className="text-primary-foreground/70 text-sm">
                        Welke service heeft uw horloge nodig?
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-primary-foreground font-semibold mb-1">Ontvang uw advies</h3>
                      <p className="text-primary-foreground/70 text-sm">
                        Direct een prijsindicatie en doorlooptijd op maat.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ServiceConfigurator />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-primary pb-24 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl px-6 text-center"
          >
            <div className="flex justify-center mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 text-accent fill-accent" />
              ))}
            </div>
            <p className="text-3xl md:text-4xl font-serif italic text-primary-foreground mb-8">
              &quot;Mijn Rolex Submariner zag eruit alsof hij net uit de vitrine kwam. Ongelooflijk vakmanschap
              en snelle service.&quot;
            </p>
            <div>
              <p className="text-lg font-semibold text-primary-foreground uppercase tracking-wide">
                Tevreden Klant
              </p>
              <p className="text-primary-foreground/70">Particulier - Bussum</p>
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="over-ons" className="bg-background py-24 md:py-32 border-t border-accent/20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-accent/20 border border-accent/40">
                <span className="text-accent text-sm font-medium tracking-wide uppercase">
                  Over ons
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
                De mannen achter Pontime
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Pontime is opgericht vanuit een gedeelde passie voor horlogemakerij. Drie ervaren
                horlogemakers, verenigd door één drijfveer: ieder horloge de zorg geven die het
                verdient. Wij geloven dat een horloge meer is dan een tijdmeter — het is een erfstuk,
                een verhaal, een stukje vakmanschap dat wij met trots onderhouden.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {[
                {
                  name: 'Naam 1',
                  role: 'Horlogemaker & Oprichter',
                  bio: 'Specialist in Rolex service en vintage restauratie. Ruim 20 jaar ervaring.',
                  image: '/atelier/rolex-jas.jpg',
                },
                {
                  name: 'Naam 2',
                  role: 'Horlogemaker',
                  bio: 'Expert in complicaties en laserwelding. Trained bij toonaangevende ateliers.',
                  image: '/atelier/rolex-jas.jpg',
                },
                {
                  name: 'Naam 3',
                  role: 'Horlogemaker',
                  bio: 'Gespecialiseerd in polijsten, lapideren en bezel-restauratie.',
                  image: '/atelier/rolex-jas.jpg',
                },
              ].map((person, index) => (
                <motion.div
                  key={person.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative aspect-[3/4] rounded-2xl bg-muted border border-border mb-5 overflow-hidden">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#8fbc8f]/25 pointer-events-none" />
                  </div>
                  <h3 className="text-xl font-serif text-foreground mb-1">{person.name}</h3>
                  <p className="text-accent text-sm font-medium mb-3 tracking-wide uppercase">
                    {person.role}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{person.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-background py-24 md:py-32 border-t border-accent/20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
                Klaar om uw horloge te laten verzorgen?
              </h2>
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                Neem vandaag nog contact op voor een vrijblijvende offerte. Zowel horloge professionals als
                particulieren zijn welkom.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="h-14 rounded-full px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg font-semibold"
                  asChild
                >
                  <a href="mailto:info@pontime.nl">
                    <Mail className="mr-2 h-5 w-5" />
                    <span>E-mail Ons</span>
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 rounded-full px-8 text-base font-medium"
                  asChild
                >
                  <a href="tel:+31616551611">
                    <Phone className="mr-2 h-5 w-5" />
                    <span>Bel Ons</span>
                  </a>
                </Button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center p-8 bg-card rounded-2xl border border-border"
              >
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">3-4 weken</div>
                <div className="text-muted-foreground">Full Service</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center p-8 bg-card rounded-2xl border border-border"
              >
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">1-2 weken</div>
                <div className="text-muted-foreground">Polijsten</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center p-8 bg-card rounded-2xl border border-border"
              >
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">Bussum</div>
                <div className="text-muted-foreground">&apos;t Gooi</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-primary border-t border-accent/20 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <Logo variant="dark" />
              <div className="text-primary-foreground/70 text-sm text-center md:text-right">
                <p>© 2025 Pontime Horloge Service. Alle rechten voorbehouden.</p>
                <p className="mt-2 flex flex-wrap justify-center md:justify-end gap-4">
                  <a href="mailto:info@pontime.nl" className="hover:text-accent transition-colors">
                    info@pontime.nl
                  </a>
                  <span>•</span>
                  <a href="tel:+31616551611" className="hover:text-accent transition-colors">
                    +31 6 1655 1611
                  </a>
                  <span>•</span>
                  <span>Bussum, NL</span>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
