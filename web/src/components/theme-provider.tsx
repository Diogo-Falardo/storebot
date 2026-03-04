import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
}: ThemeProviderProps) {
  // Start with defaultTheme (safe for SSR)
  const [theme, setThemeState] = useState<Theme>(defaultTheme)

  // On mount, sync with localStorage and system preference
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Try to get from localStorage
    const stored = localStorage.getItem(storageKey) as Theme | null
    if (stored) {
      setThemeState(stored)
    } else if (defaultTheme === 'system') {
      // If system, detect system theme
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      setThemeState(systemTheme)
    }
  }, [defaultTheme, storageKey])

  // Update DOM and localStorage when theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    let appliedTheme = theme
    if (theme === 'system') {
      appliedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    root.classList.add(appliedTheme)
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  // Expose a setter that updates state
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeProviderContext)
