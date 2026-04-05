"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Clock, Wrench, Zap, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const brands = [
  { id: 'rolex', name: 'Rolex', premium: true },
  { id: 'omega', name: 'Omega', premium: false },
  { id: 'tag-heuer', name: 'TAG Heuer', premium: false },
  { id: 'breitling', name: 'Breitling', premium: false },
  { id: 'cartier', name: 'Cartier', premium: true },
  { id: 'patek', name: 'Patek Philippe', premium: true },
  { id: 'iwc', name: 'IWC', premium: false },
  { id: 'andere', name: 'Ander merk', premium: false },
]

const problems = [
  { id: 'full-service', name: 'Full Service', description: 'Complete revisie van het uurwerk', icon: Wrench },
  { id: 'batterij', name: 'Batterij vervangen', description: 'Snelle batterijwissel', icon: Zap },
  { id: 'polijsten', name: 'Polijsten & Lapideren', description: 'Kast en band opnieuw afwerken', icon: Clock },
  { id: 'reparatie', name: 'Specifieke reparatie', description: 'Onderdeel vervangen of herstellen', icon: Wrench },
  { id: 'waterdicht', name: 'Waterdichtheid', description: 'Pakking vervangen en testen', icon: Clock },
  { id: 'bezel', name: 'Bezel cutten', description: 'Bezel restauratie service', icon: Zap },
]

const urgencies = [
  { id: 'normaal', name: 'Normaal', days: '3-4 weken', multiplier: 1 },
  { id: 'snel', name: 'Snel', days: '1-2 weken', multiplier: 1.5 },
  { id: 'spoed', name: 'Spoed', days: '3-5 dagen', multiplier: 2 },
]

const basePrices: Record<string, number> = {
  'full-service': 350,
  'batterij': 35,
  'polijsten': 150,
  'reparatie': 200,
  'waterdicht': 75,
  'bezel': 250,
}

export function ServiceConfigurator({ className }: { className?: string }) {
  const [step, setStep] = useState(1)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null)
  const [selectedUrgency, setSelectedUrgency] = useState<string | null>(null)

  const calculatePrice = () => {
    if (!selectedProblem || !selectedUrgency) return 0
    const basePrice = basePrices[selectedProblem] || 200
    const urgency = urgencies.find(u => u.id === selectedUrgency)
    const brand = brands.find(b => b.id === selectedBrand)
    const premiumMultiplier = brand?.premium ? 1.3 : 1
    const urgencyMultiplier = urgency?.multiplier || 1
    return Math.round(basePrice * premiumMultiplier * urgencyMultiplier)
  }

  const getDeliveryTime = () => {
    const urgency = urgencies.find(u => u.id === selectedUrgency)
    return urgency?.days || '3-4 weken'
  }

  const resetConfigurator = () => {
    setStep(1)
    setSelectedBrand(null)
    setSelectedProblem(null)
    setSelectedUrgency(null)
  }

  return (
    <div className={cn('bg-card rounded-2xl border border-border overflow-hidden', className)}>
      {/* Progress bar */}
      <div className="bg-muted p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Service Configurator</span>
          <span className="text-sm text-muted-foreground">Stap {step} van 4</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Brand Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-foreground mb-2">Kies uw merk</h3>
              <p className="text-muted-foreground text-sm mb-6">Selecteer het merk van uw horloge</p>
              <div className="grid grid-cols-2 gap-3">
                {brands.map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand.id)}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      selectedBrand === brand.id
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                    )}
                  >
                    <span className="font-medium text-foreground">{brand.name}</span>
                    {brand.premium && (
                      <span className="ml-2 text-xs text-accent">Premium</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedBrand}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Volgende
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Problem Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-foreground mb-2">Wat is het probleem?</h3>
              <p className="text-muted-foreground text-sm mb-6">Selecteer de gewenste service</p>
              <div className="space-y-3">
                {problems.map(problem => {
                  const Icon = problem.icon
                  return (
                    <button
                      key={problem.id}
                      onClick={() => setSelectedProblem(problem.id)}
                      className={cn(
                        'w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4',
                        selectedProblem === problem.id
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                      )}
                    >
                      <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground block">{problem.name}</span>
                        <span className="text-sm text-muted-foreground">{problem.description}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Terug
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedProblem}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Volgende
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Urgency Selection */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-foreground mb-2">Hoe snel heeft u het nodig?</h3>
              <p className="text-muted-foreground text-sm mb-6">Kies uw gewenste doorlooptijd</p>
              <div className="space-y-3">
                {urgencies.map(urgency => (
                  <button
                    key={urgency.id}
                    onClick={() => setSelectedUrgency(urgency.id)}
                    className={cn(
                      'w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between',
                      selectedUrgency === urgency.id
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                    )}
                  >
                    <div>
                      <span className="font-medium text-foreground block">{urgency.name}</span>
                      <span className="text-sm text-muted-foreground">{urgency.days}</span>
                    </div>
                    {urgency.multiplier > 1 && (
                      <span className="text-sm text-accent font-medium">
                        +{Math.round((urgency.multiplier - 1) * 100)}%
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Terug
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  disabled={!selectedUrgency}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Bekijk advies
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Results */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 mb-4">
                  <Check className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Uw service advies</h3>
              </div>

              <div className="bg-muted rounded-xl p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Geschatte prijs</p>
                    <p className="text-3xl font-bold text-foreground">€{calculatePrice()}</p>
                    <p className="text-xs text-muted-foreground">vanaf</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Doorlooptijd</p>
                    <p className="text-3xl font-bold text-accent">{getDeliveryTime()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Merk:</span>
                  <span className="font-medium text-foreground">
                    {brands.find(b => b.id === selectedBrand)?.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium text-foreground">
                    {problems.find(p => p.id === selectedProblem)?.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Urgentie:</span>
                  <span className="font-medium text-foreground">
                    {urgencies.find(u => u.id === selectedUrgency)?.name}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center mb-6">
                * Dit is een indicatie. De definitieve prijs wordt bepaald na inspectie van uw horloge.
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  asChild
                >
                  <a href="#contact">Vraag offerte aan</a>
                </Button>
                <Button
                  variant="outline"
                  onClick={resetConfigurator}
                  className="w-full"
                >
                  Opnieuw configureren
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
