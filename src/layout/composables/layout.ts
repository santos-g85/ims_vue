import { computed, reactive, type ComputedRef } from 'vue'

type MenuMode = 'static' | 'overlay'

interface LayoutConfig {
  preset: string
  primary: string
  surface: string | null
  darkTheme: boolean
  menuMode: MenuMode
}

interface LayoutState {
  staticMenuDesktopInactive: boolean
  overlayMenuActive: boolean
  profileSidebarVisible: boolean
  configSidebarVisible: boolean
  staticMenuMobileActive: boolean
  menuHoverActive: boolean
  activeMenuItem: string | null
}

interface LayoutComposable {
  layoutConfig: LayoutConfig
  layoutState: LayoutState
  toggleMenu: () => void
  isSidebarActive: ComputedRef<boolean>
  isDarkTheme: ComputedRef<boolean>
  getPrimary: ComputedRef<string>
  getSurface: ComputedRef<string | null>
  setActiveMenuItem: (item: string | { value: string }) => void
  toggleDarkMode: () => void
}

const layoutConfig = reactive<LayoutConfig>({
  preset: 'Aura',
  primary: 'emerald',
  surface: null,
  darkTheme:
    localStorage.getItem('darkTheme') !== null
      ? localStorage.getItem('darkTheme') === 'true'
      : true,
  menuMode: 'static',
})

if (layoutConfig.darkTheme) {
  document.documentElement.classList.add('app-dark')
}

const layoutState = reactive<LayoutState>({
  staticMenuDesktopInactive: false,
  overlayMenuActive: false,
  profileSidebarVisible: false,
  configSidebarVisible: false,
  staticMenuMobileActive: false,
  menuHoverActive: false,
  activeMenuItem: null,
})

export function useLayout(): LayoutComposable {
  const setActiveMenuItem = (item: string | { value: string }): void => {
    layoutState.activeMenuItem = typeof item === 'string' ? item : item.value
  }

  const toggleDarkMode = (): void => {
    if (!document.startViewTransition) {
      executeDarkModeToggle()
      return
    }

    document.startViewTransition(() => executeDarkModeToggle())
  }

  const executeDarkModeToggle = (): void => {
    layoutConfig.darkTheme = !layoutConfig.darkTheme
    localStorage.setItem('darkTheme', String(layoutConfig.darkTheme))
    document.documentElement.classList.toggle('app-dark', layoutConfig.darkTheme)
  }

  const toggleMenu = (): void => {
    if (layoutConfig.menuMode === 'overlay') {
      layoutState.overlayMenuActive = !layoutState.overlayMenuActive
    }

    if (window.innerWidth > 991) {
      layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive
    } else {
      layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive
    }
  }

  const isSidebarActive = computed<boolean>(
    () => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive,
  )

  const isDarkTheme = computed<boolean>(() => layoutConfig.darkTheme)

  const getPrimary = computed<string>(() => layoutConfig.primary)

  const getSurface = computed<string | null>(() => layoutConfig.surface)

  return {
    layoutConfig,
    layoutState,
    toggleMenu,
    isSidebarActive,
    isDarkTheme,
    getPrimary,
    getSurface,
    setActiveMenuItem,
    toggleDarkMode,
  }
}
