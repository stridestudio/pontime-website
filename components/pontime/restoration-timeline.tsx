"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  Search, 
  Cog, 
  Sparkles, 
  Droplets, 
  Settings, 
  CheckCircle2, 
  Camera 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
  {
    id: 1,
    title: 'Intake',
    description: 'Uw horloge wordt geregistreerd en gefotografeerd. We documenteren de huidige staat en eventuele specifieke wensen.',
    icon: Package,
    duration: 'Dag 1',
    image: '/atelier/cartier-handen.jpg',
  },
  {
    id: 2,
    title: 'Diagnose',
    description: 'Onze horlogemaker onderzoekt het uurwerk grondig. We identificeren alle problemen en stellen een reparatieplan op.',
    icon: Search,
    duration: 'Dag 1-2',
    image: '/atelier/horlogemaker-loep.jpg',
  },
  {
    id: 3,
    title: 'Demontage',
    description: 'Het horloge wordt volledig gedemonteerd. Elk onderdeel wordt apart gelegd en gecontroleerd.',
    icon: Cog,
    duration: 'Dag 2-3',
    image: '/atelier/demonteren-bw.jpg',
  },
  {
    id: 4,
    title: 'Reiniging',
    description: 'Alle onderdelen gaan door ons ultrasone reinigingsbad. Vuil, oud vet en oxidatie worden verwijderd.',
    icon: Sparkles,
    duration: 'Dag 3-4',
    image: '/atelier/onderdelen-tray.jpg',
  },
  {
    id: 5,
    title: 'Smering',
    description: 'Precisie-smering met speciale horlogeolie op alle bewegende delen. Elk punt wordt exact gedoseerd.',
    icon: Droplets,
    duration: 'Dag 4-5',
    image: '/atelier/reviseren-blauw.jpg',
  },
  {
    id: 6,
    title: 'Assemblage',
    description: 'Het uurwerk wordt weer zorgvuldig in elkaar gezet. Nieuwe onderdelen worden indien nodig geplaatst.',
    icon: Settings,
    duration: 'Dag 5-7',
    image: '/atelier/monteren-bw.jpg',
  },
  {
    id: 7,
    title: 'Afstelling',
    description: 'Fijnafstelling van de balans en nauwkeurigheid. Het horloge wordt in meerdere posities getest.',
    icon: CheckCircle2,
    duration: 'Dag 7-10',
    image: '/atelier/timing-machine.jpg',
  },
  {
    id: 8,
    title: 'Kwaliteitscontrole',
    description: 'Eindcontrole, waterdichtheidstest en finale foto. Uw horloge is klaar voor ophalen.',
    icon: Camera,
    duration: 'Dag 10-14',
    image: '/atelier/rolex-daydate.jpg',
  },
]

export function RestorationTimeline({ className }: { className?: string }) {
  const [activeStep, setActiveStep] = useState<number>(1)

  return (
    <div className={cn('', className)}>
      {/* Timeline navigation */}
      <div className="relative mb-8">
        {/* Progress line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-border hidden md:block" />
        <motion.div 
          className="absolute top-6 left-0 h-0.5 bg-accent hidden md:block"
          initial={{ width: 0 }}
          animate={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Step indicators */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = step.id === activeStep
            const isPast = step.id < activeStep
            
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className="flex flex-col items-center group"
              >
                <div
                  className={cn(
                    'relative z-10 h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300',
                    isActive
                      ? 'bg-accent scale-110'
                      : isPast
                        ? 'bg-primary'
                        : 'bg-muted group-hover:bg-muted/80'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-colors',
                      isActive || isPast
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium text-center transition-colors',
                    isActive
                      ? 'text-accent'
                      : isPast
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                  )}
                >
                  {step.id}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-card rounded-2xl border border-border overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 relative aspect-[4/3] md:aspect-auto md:min-h-[280px] overflow-hidden bg-muted">
              <img
                src={steps[activeStep - 1].image}
                alt={steps[activeStep - 1].title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  {(() => {
                    const StepIcon = steps[activeStep - 1].icon
                    return <StepIcon className="h-6 w-6 text-accent" />
                  })()}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-medium text-accent">{steps[activeStep - 1].duration}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">Stap {activeStep} van {steps.length}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">
                    {steps[activeStep - 1].title}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {steps[activeStep - 1].description}
              </p>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between p-6 md:px-8 border-t border-border">
            <button
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              disabled={activeStep === 1}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                activeStep === 1
                  ? 'text-muted-foreground cursor-not-allowed'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              ← Vorige stap
            </button>
            <button
              onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
              disabled={activeStep === steps.length}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                activeStep === steps.length
                  ? 'text-muted-foreground cursor-not-allowed'
                  : 'text-accent hover:bg-accent/10'
              )}
            >
              Volgende stap →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
