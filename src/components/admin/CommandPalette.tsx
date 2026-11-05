'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface CommandItem {
  id: string
  title: string
  category: 'Pages & Sectors' | 'Quick Actions' | 'Administration & Security'
  icon: string
  href: string
  keywords?: string[]
}

const COMMAND_LIST: CommandItem[] = [
  // Pages & Sectors
  { id: 'p-dashboard', title: 'Executive Dashboard', category: 'Pages & Sectors', icon: '◈', href: '/admin/dashboard', keywords: ['home', 'overview', 'stats', 'analytics'] },
  { id: 'p-news', title: 'News & Press Releases', category: 'Pages & Sectors', icon: '📰', href: '/admin/news', keywords: ['articles', 'announcements', 'communiques', 'media'] },
  { id: 'p-services', title: 'Public Citizen Services', category: 'Pages & Sectors', icon: '📋', href: '/admin/services', keywords: ['civil registration', 'licenses', 'health', 'land'] },
  { id: 'p-inquiries', title: 'Citizen Grievances & Inquiries (SLA)', category: 'Pages & Sectors', icon: '📥', href: '/admin/inquiries', keywords: ['complaints', 'petitions', 'tickets', 'feedback'] },
  { id: 'p-offices', title: 'Sector Directorates & Offices', category: 'Pages & Sectors', icon: '🏛️', href: '/admin/offices', keywords: ['departments', 'agriculture', 'health', 'education'] },
  { id: 'p-tenders', title: 'Procurement Tenders & Bids', category: 'Pages & Sectors', icon: '⚖️', href: '/admin/tenders', keywords: ['procurement', 'bidding', 'cpo', 'contracts'] },
  { id: 'p-kebeles', title: 'Kebeles & Municipal Towns', category: 'Pages & Sectors', icon: '🗺️', href: '/admin/kebeles', keywords: ['chacha', 'cheki', 'geyet', 'rural', 'urban'] },
  { id: 'p-investments', title: 'Strategic Investment Corridor', category: 'Pages & Sectors', icon: '📈', href: '/admin/investments', keywords: ['industrial park', 'land', 'incentives', 'business'] },
  { id: 'p-projects', title: 'Capital Development Projects', category: 'Pages & Sectors', icon: '🏗️', href: '/admin/projects', keywords: ['infrastructure', 'water', 'roads', 'schools'] },
  { id: 'p-tourism', title: 'Tourism & Cultural Heritage', category: 'Pages & Sectors', icon: '🏞️', href: '/admin/tourism', keywords: ['palace', 'waterfalls', 'monasteries', 'shewa'] },
  { id: 'p-companies', title: 'Private Sector Enterprises', category: 'Pages & Sectors', icon: '💼', href: '/admin/companies', keywords: ['factories', 'agro processing', 'plants', 'commerce'] },
  { id: 'p-partners', title: 'Development Cooperation Partners', category: 'Pages & Sectors', icon: '🤝', href: '/admin/partners', keywords: ['ngos', 'un agencies', 'aid', 'cooperatives'] },
  { id: 'p-documents', title: 'Document & Forms Library', category: 'Pages & Sectors', icon: '📄', href: '/admin/documents', keywords: ['pdfs', 'forms', 'applications', 'gazettes'] },
  { id: 'p-media', title: 'Media Library & Assets', category: 'Pages & Sectors', icon: '🖼️', href: '/admin/media', keywords: ['photos', 'images', 'videos', 'uploads'] },

  // Quick Actions
  { id: 'a-new-news', title: 'Publish New Announcement', category: 'Quick Actions', icon: '📢', href: '/admin/news', keywords: ['write news', 'press release', 'new communique'] },
  { id: 'a-profile', title: 'My Profile & Account Security', category: 'Quick Actions', icon: '👤', href: '/admin/profile', keywords: ['profile', 'account', 'settings', 'password'] },
  { id: 'a-change-pw', title: 'Change My Password', category: 'Quick Actions', icon: '🔐', href: '/admin/profile', keywords: ['password', 'credentials', 'security', 'reset'] },
  { id: 'a-public', title: 'Open Live Public Portal', category: 'Quick Actions', icon: '🌐', href: '/en', keywords: ['view portal', 'front site', 'citizen view'] },

  // Administration & Security
  { id: 's-users', title: 'User Accounts & RBAC Permissions', category: 'Administration & Security', icon: '🛡️', href: '/admin/users', keywords: ['super admin', 'editors', 'access control', 'roles'] },
  { id: 's-sliders', title: 'Homepage Hero Sliders', category: 'Administration & Security', icon: '🖼️', href: '/admin/sliders', keywords: ['carousel', 'banners', 'hero images'] },
  { id: 's-sections', title: 'Homepage Section Layouts', category: 'Administration & Security', icon: '⚙️', href: '/admin/sections', keywords: ['blocks', 'ordering', 'homepage toggles'] },
  { id: 's-nav', title: 'Portal Navigation Menus', category: 'Administration & Security', icon: '🧭', href: '/admin/navigation', keywords: ['menu links', 'header links', 'navigation hierarchy'] },
  { id: 's-settings', title: 'Official Site Settings', category: 'Administration & Security', icon: '🔧', href: '/admin/settings', keywords: ['contact phone', 'emails', 'social links', 'branding'] },
  { id: 's-audit', title: 'System Security Audit Trail', category: 'Administration & Security', icon: '📜', href: '/admin/audit-log', keywords: ['logs', 'history', 'activity', 'compliance'] },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Listen for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Auto focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setSelectedIndex(0)
    }
  }, [open])

  // Filter commands
  const filtered = COMMAND_LIST.filter((cmd) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      cmd.keywords?.some((k) => k.toLowerCase().includes(q))
    )
  })

  // Keyboard navigation inside palette
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[selectedIndex]) {
        executeCommand(filtered[selectedIndex])
      }
    }
  }

  const executeCommand = useCallback(
    (cmd: CommandItem) => {
      setOpen(false)
      if (cmd.href.startsWith('/en')) {
        window.open(cmd.href, '_blank')
      } else {
        router.push(cmd.href)
      }
    },
    [router]
  )

  if (!open) return null

  // Group filtered results by category
  const categories = Array.from(new Set(filtered.map((c) => c.category)))

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <span className="text-gray-400 text-lg">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a command or jump to module... (e.g. news, tenders, password)"
            className="w-full bg-transparent text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold text-gray-400 bg-gray-100 border border-gray-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Command Results */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-gray-50 scrollbar-none">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400">
              No matching modules or administrative actions found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            categories.map((cat) => {
              const items = filtered.filter((i) => i.category === cat)
              return (
                <div key={cat} className="py-2">
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {cat}
                  </p>
                  <div className="space-y-0.5">
                    {items.map((item) => {
                      const globalIdx = filtered.indexOf(item)
                      const isSelected = globalIdx === selectedIndex
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => executeCommand(item)}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                            isSelected
                              ? 'bg-[#1a4f8b] text-white shadow-xs'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-base shrink-0">{item.icon}</span>
                            <span className="truncate">{item.title}</span>
                          </div>
                          <span
                            className={`text-[10px] font-mono shrink-0 ${
                              isSelected ? 'text-blue-200' : 'text-gray-400'
                            }`}
                          >
                            Jump →
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="font-semibold text-gray-500">GovTech Quick Access</span>
        </div>
      </div>
    </div>
  )
}
