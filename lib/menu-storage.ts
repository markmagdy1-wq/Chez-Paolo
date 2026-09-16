export type CustomMenuItem = {
  id: string
  name: string
  description: string
  price: number
  section: 'Breakfast' | 'Main' | 'Beverage'
  category: string
  image: string
}

export const CUSTOM_MENU_KEY = 'chez-paolo-custom-menu'

export function readCustomMenu(): CustomMenuItem[] {
  if (typeof window === 'undefined') return []
  try {
    const value = window.localStorage.getItem(CUSTOM_MENU_KEY)
    return value ? JSON.parse(value) : []
  } catch {
    return []
  }
}

export function writeCustomMenu(items: CustomMenuItem[]) {
  window.localStorage.setItem(CUSTOM_MENU_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('chez-paolo-menu-updated'))
}
