import { Progress } from '@/components/ui/progress'
import { useEffect, useState } from 'react'

interface LoadingSpinnerProps {
  stage?: string
}

export default function LoadingSpinner({ stage }: LoadingSpinnerProps) {
  const [progress, setProgress] = useState(0)

  // Define stages and their target progress values
  const stageProgress: { [key: string]: number } = {
    'Analyzing your mood...': 20,
    'Generating playlist tracks...': 40,
    'Fetching Spotify data...': 70,
    'Fetching YouTube data...': 90,
    'Finalizing your playlist...': 100
  }

  useEffect(() => {
    const targetProgress = stage ? stageProgress[stage] || 0 : 0
    
    // Smooth animation to target progress
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev < targetProgress) {
          return Math.min(prev + 2, targetProgress)
        } else if (prev > targetProgress) {
          return Math.max(prev - 2, targetProgress)
        }
        return prev
      })
    }, 50)

    return () => clearInterval(timer)
  }, [stage])

  return (
    <div className="w-full max-w-md mx-auto">
      <Progress 
        value={progress} 
        className="h-3 bg-theme-surface border border-theme-disabled"
      />
    </div>
  )
}

