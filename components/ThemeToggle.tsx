'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon, Sparkles } from 'lucide-react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsAnimating(true)
    
    setTimeout(() => {
      if (isDark) {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
        setIsDark(false)
      } else {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
        setIsDark(true)
      }
      setIsAnimating(false)
    }, 150)
  }

  return (
    <button
      onClick={toggleTheme}
      disabled={isAnimating}
      className="relative p-3 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-700/50 hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-800/40 dark:hover:to-orange-800/40 transition-all duration-300 ease-out hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group"
      aria-label="Toggle theme"
    >
      {/* Animated background glow */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/20 to-orange-400/20 dark:from-amber-500/20 dark:to-orange-500/20 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`} />
      
      {/* Icon container */}
      <div className={`relative z-10 transition-all duration-300 ${
        isAnimating ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
      }`}>
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-200" />
        ) : (
          <Moon className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-200" />
        )}
      </div>
      
      {/* Sparkle effect */}
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-ping" />
        </div>
      )}
    </button>
  )
}
