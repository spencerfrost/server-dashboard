import { LucideIcon } from 'lucide-react'

export interface MenuItem {
  id: string
  label: string
  icon: LucideIcon
  path: string
}

export interface BreadcrumbItem {
  label: string
  path: string
}
