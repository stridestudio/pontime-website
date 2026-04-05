"use client"

import { motion } from 'framer-motion'
import { Award, Clock, Star, Shield, Wrench, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

const badges = [
  { id: 1, name: 'Eerste Service', icon: Wrench, earned: true, description: 'Eerste horloge ingeleverd' },
  { id: 2, name: 'Rolex Eigenaar', icon: Crown, earned: true, description: 'Rolex service afgerond' },
  { id: 3, name: 'Trouwe Klant', icon: Star, earned: true, description: '3+ services voltooid' },
  { id: 4, name: 'Vintage Liefhebber', icon: Clock, earned: false, description: 'Vintage horloge gerestaureerd' },
  { id: 5, name: 'Collector Elite', icon: Award, earned: false, description: '10+ services voltooid' },
  { id: 6, name: 'VIP Status', icon: Shield, earned: false, description: 'Speciale status bereikt' },
]

const serviceHistory = [
  { date: '15 mrt 2024', service: 'Full Service', watch: 'Rolex Submariner', status: 'Voltooid' },
  { date: '22 nov 2023', service: 'Polijsten', watch: 'Omega Speedmaster', status: 'Voltooid' },
  { date: '08 jun 2023', service: 'Batterij', watch: 'TAG Heuer Monaco', status: 'Voltooid' },
]

export function CollectorsPassport({ className }: { className?: string }) {
  const earnedBadges = badges.filter(b => b.earned).length
  const totalBadges = badges.length
  const progress = (earnedBadges / totalBadges) * 100

  return (
    <div className={cn('bg-card rounded-2xl border border-border overflow-hidden', className)}>
      {/* Header */}
      <div className="bg-primary p-6 text-primary-foreground">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-80 mb-1">Collectors Passport</p>
            <h3 className="text-2xl font-serif">J. de Vries</h3>
          </div>
          <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">JV</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Voortgang</span>
            <span>{earnedBadges} van {totalBadges} badges</span>
          </div>
          <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
        </div>
      </div>

      {/* Badges section */}
      <div className="p-6 border-b border-border">
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
          Badges
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative group"
              >
                <div
                  className={cn(
                    'aspect-square rounded-xl flex flex-col items-center justify-center p-3 transition-all',
                    badge.earned
                      ? 'bg-accent/20 border-2 border-accent'
                      : 'bg-muted border-2 border-transparent opacity-40'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-6 w-6 mb-1',
                      badge.earned ? 'text-accent' : 'text-muted-foreground'
                    )}
                  />
                  <span
                    className={cn(
                      'text-xs font-medium text-center leading-tight',
                      badge.earned ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {badge.name}
                  </span>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {badge.description}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Service history */}
      <div className="p-6">
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
          Service Geschiedenis
        </h4>
        <div className="space-y-3">
          {serviceHistory.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className="flex items-center justify-between p-3 bg-muted rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{service.service}</p>
                  <p className="text-xs text-muted-foreground">{service.watch}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{service.date}</p>
                <span className="inline-block px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full">
                  {service.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <p className="text-xs text-center text-muted-foreground">
          Lid sinds januari 2023 • Klant #2847
        </p>
      </div>
    </div>
  )
}
