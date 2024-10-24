export interface DocSection {
  id: string
  title: string
  content: string
  lastUpdated: Date
  version: string
  category: 'system' | 'services' | 'network' | 'security' | 'configuration'
}

export interface DocChange {
  id: string
  sectionId: string
  timestamp: Date
  author: string
  changes: string
  version: string
}
