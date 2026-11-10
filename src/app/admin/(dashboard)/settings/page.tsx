'use client'

import React, { useState, useEffect } from 'react'

type SettingsTab =
  | 'general'
  | 'branding'
  | 'broadcast'
  | 'social'
  | 'seo'
  | 'security'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/settings')
      const data = await res.json()
      if (data.success && data.data) {
        setSettings(data.data)
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to retrieve system settings from server.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    try {
      setSaving(true)
      setMsg(null)
      const res = await fetch('/api/v1/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: 'success', text: 'Official government site settings updated and committed to audit trail.' })
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to update settings.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network communication failure.' })
    } finally {
      setSaving(false)
    }
  }

  const TABS: { id: SettingsTab; label: string; icon: string; desc: string }[] = [
    { id: 'general', label: 'General & Contact', icon: '🏛️', desc: 'Institutional names, phones, hotlines' },
    { id: 'branding', label: 'Branding & Identity', icon: '🎨', desc: 'Coat of arms, logos, theme colors' },
    { id: 'broadcast', label: 'Emergency Broadcasts', icon: '🚨', desc: 'Urgent citizen alerts & banners' },
    { id: 'social', label: 'Social & Regional Portals', icon: '🌐', desc: 'Telegram, Facebook, YouTube links' },
    { id: 'seo', label: 'Localization & SEO', icon: '🔍', desc: 'Meta tags, default locale, search engine snippets' },
    { id: 'security', label: 'Security & Session Policy', icon: '🛡️', desc: 'Session timeout, maintenance mode' },
  ]

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              System Administration
            </span>
            <span className="text-xs font-semibold text-gray-500">
              Government Platform Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d2340] tracking-tight">
            Institutional System Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
            Configure institutional contacts, emergency broadcast banners, official social channels, and public accessibility policies without modifying source code.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 self-start md:self-auto"
        >
          <span>{saving ? '⏳' : '💾'}</span>
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {/* Status Alert */}
      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{msg.text}</span>
          <button type="button" onClick={() => setMsg(null)} className="opacity-70 hover:opacity-100 text-sm">
            ×
          </button>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#1a4f8b] text-white shadow-xs'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Settings Form Container */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center text-xs text-gray-500">
          Loading system configuration parameters...
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* TAB 1: GENERAL & CONTACT */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0d2340]">Official Government Naming & Jurisdiction</h3>
                <p className="text-xs text-gray-500">Multilingual designations used across all public footers and gazette headers.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Institution Name (English)</label>
                  <input
                    type="text"
                    value={settings.government_name_en || ''}
                    onChange={(e) => handleChange('government_name_en', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Institution Name (Amharic / አማርኛ)</label>
                  <input
                    type="text"
                    value={settings.government_name_am || ''}
                    onChange={(e) => handleChange('government_name_am', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Municipal Capital / Seat</label>
                  <input
                    type="text"
                    value={settings.capital_city_en || 'Chacha'}
                    onChange={(e) => handleChange('capital_city_en', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Administrative Zone</label>
                  <input
                    type="text"
                    value={settings.zone_name_en || 'North Shewa Zone, Amhara Region'}
                    onChange={(e) => handleChange('zone_name_en', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                  Official Communication Channels & Hotlines
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Primary Woreda Switchboard</label>
                    <input
                      type="text"
                      value={settings.contact_phone || ''}
                      onChange={(e) => handleChange('contact_phone', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Public Inquiries Email</label>
                    <input
                      type="email"
                      value={settings.contact_email || ''}
                      onChange={(e) => handleChange('contact_email', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Emergency Police Line</label>
                    <input
                      type="text"
                      value={settings.emergency_police || ''}
                      onChange={(e) => handleChange('emergency_police', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Ambulance & Emergency Medical Hotline</label>
                    <input
                      type="text"
                      value={settings.emergency_health || ''}
                      onChange={(e) => handleChange('emergency_health', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                  Service Hall Working Hours & Physical Address
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Official Working Hours (English)</label>
                    <input
                      type="text"
                      value={settings.working_hours_en || ''}
                      onChange={(e) => handleChange('working_hours_en', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Official Working Hours (Amharic)</label>
                    <input
                      type="text"
                      value={settings.working_hours_am || ''}
                      onChange={(e) => handleChange('working_hours_am', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BRANDING & IDENTITY */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0d2340]">Institutional Branding & Visual Identity</h3>
                <p className="text-xs text-gray-500">Government seals, crests, and color accents adhering to Ethiopian public standards.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Official Crest / Logo URL</label>
                  <input
                    type="text"
                    value={settings.portal_logo_url || '/logo.png'}
                    onChange={(e) => handleChange('portal_logo_url', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                  <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <img
                      src={settings.portal_logo_url || '/logo.png'}
                      alt="Logo preview"
                      className="w-12 h-12 object-contain"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none' }}
                    />
                    <span className="text-xs text-gray-500">Preview: Live Emblem</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Favicon Asset URL</label>
                  <input
                    type="text"
                    value={settings.favicon_url || '/icon.png'}
                    onChange={(e) => handleChange('favicon_url', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                  <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <img
                      src={settings.favicon_url || '/icon.png'}
                      alt="Favicon preview"
                      className="w-8 h-8 object-contain"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none' }}
                    />
                    <span className="text-xs text-gray-500">Preview: Browser Tab Icon</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Primary Institutional Navy</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.primary_brand_color || '#1a4f8b'}
                      onChange={(e) => handleChange('primary_brand_color', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={settings.primary_brand_color || '#1a4f8b'}
                      onChange={(e) => handleChange('primary_brand_color', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Restrained Gold Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.gold_accent_color || '#FED100'}
                      onChange={(e) => handleChange('gold_accent_color', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={settings.gold_accent_color || '#FED100'}
                      onChange={(e) => handleChange('gold_accent_color', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EMERGENCY BROADCASTS */}
          {activeTab === 'broadcast' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#0d2340]">Urgent Civil Emergency Broadcast Banner</h3>
                  <p className="text-xs text-gray-500">
                    Display an urgent notification across the top of all public pages (e.g. agricultural disease alerts, weather advisories).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-700">Broadcast Live:</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleChange(
                        'broadcast_active',
                        settings.broadcast_active === 'true' ? 'false' : 'true'
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      settings.broadcast_active === 'true' ? 'bg-rose-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.broadcast_active === 'true' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Alert Severity Level</label>
                  <select
                    value={settings.broadcast_urgency || 'WARNING'}
                    onChange={(e) => handleChange('broadcast_urgency', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  >
                    <option value="URGENT">🔴 Critical / Urgent (High Priority)</option>
                    <option value="WARNING">🟠 Warning / Public Advisory</option>
                    <option value="INFO">🔵 Informational Announcement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Action Link (Optional)</label>
                  <input
                    type="text"
                    value={settings.broadcast_link_url || ''}
                    onChange={(e) => handleChange('broadcast_link_url', e.target.value)}
                    placeholder="e.g., /news/urgent-flood-advisory"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Alert Headline (English)</label>
                <input
                  type="text"
                  value={settings.broadcast_message_en || ''}
                  onChange={(e) => handleChange('broadcast_message_en', e.target.value)}
                  placeholder="e.g., Seasonal Rainfall Advisory: Farmers along Beressa Basin urged to safeguard harvest..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Alert Headline (Amharic / አማርኛ)</label>
                <input
                  type="text"
                  value={settings.broadcast_message_am || ''}
                  onChange={(e) => handleChange('broadcast_message_am', e.target.value)}
                  placeholder="የአስቸኳይ ጊዜ መረጃ ማስታወቂያ..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              {/* Live Preview of Banner */}
              {settings.broadcast_active === 'true' && (
                <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-rose-900">
                      Live Broadcast Preview
                    </span>
                  </div>
                  <p className="text-xs font-bold text-rose-900">
                    {settings.broadcast_message_en || 'Alert headline in English'}
                  </p>
                  <p className="text-xs text-rose-800">
                    {settings.broadcast_message_am || 'የማስታወቂያ ጽሑፍ በአማርኛ'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SOCIAL & REGIONAL LINKS */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0d2340]">Official Social Channels & External Links</h3>
                <p className="text-xs text-gray-500">Verified links displayed on the citizen portal header and footer.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Official Facebook Page</label>
                  <input
                    type="url"
                    value={settings.social_facebook || 'https://www.facebook.com/share/1F8hTSPLaN/'}
                    onChange={(e) => handleChange('social_facebook', e.target.value)}
                    placeholder="https://www.facebook.com/share/..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Official YouTube Channel</label>
                  <input
                    type="url"
                    value={settings.social_youtube || 'https://youtube.com/@angolelateraworedaprosperitypa?si=MgfK74L7pLCiwKLw'}
                    onChange={(e) => handleChange('social_youtube', e.target.value)}
                    placeholder="https://youtube.com/@channel"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Official X (Twitter) Account</label>
                  <input
                    type="url"
                    value={settings.social_x || 'https://x.com/angolela79256'}
                    onChange={(e) => handleChange('social_x', e.target.value)}
                    placeholder="https://x.com/angolela79256"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Regional Government Portal Link</label>
                  <input
                    type="url"
                    value={settings.regional_portal_url || 'https://amhara.gov.et'}
                    onChange={(e) => handleChange('regional_portal_url', e.target.value)}
                    placeholder="https://amhara.gov.et"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LOCALIZATION & SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0d2340]">Localization & Search Engine Optimization (SEO)</h3>
                <p className="text-xs text-gray-500">Manage default language priorities and OpenGraph social snippet cards.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Default Portal Language</label>
                  <select
                    value={settings.default_locale || 'en'}
                    onChange={(e) => handleChange('default_locale', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  >
                    <option value="en">English (Default)</option>
                    <option value="am">አማርኛ (Amharic)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Default OpenGraph Share Image URL</label>
                  <input
                    type="text"
                    value={settings.seo_og_image_url || '/logo.png'}
                    onChange={(e) => handleChange('seo_og_image_url', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Global Meta Title (English)</label>
                <input
                  type="text"
                  value={settings.seo_meta_title_en || 'Angolela Tera Woreda Administration • Official Government Portal'}
                  onChange={(e) => handleChange('seo_meta_title_en', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Global Meta Description (English)</label>
                <textarea
                  rows={2}
                  value={settings.seo_meta_description_en || 'Official public gateway for Angolela Tera Woreda Administration in North Shewa Zone. Access public services, development tenders, kebele directories, and investment incentives.'}
                  onChange={(e) => handleChange('seo_meta_description_en', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY & SESSION POLICY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0d2340]">Security Governance & System Status</h3>
                <p className="text-xs text-gray-500">Session policies and operational maintenance controls.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Administrative Session Timeout (Minutes)</label>
                  <input
                    type="number"
                    min="15"
                    max="1440"
                    value={settings.session_timeout_minutes || '120'}
                    onChange={(e) => handleChange('session_timeout_minutes', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Inactivity duration before requiring re-authentication.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Max Failed Login Attempts</label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={settings.max_login_attempts || '5'}
                    onChange={(e) => handleChange('max_login_attempts', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Temporary lock-out threshold to mitigate brute-force attacks.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-gray-800">Public Maintenance Mode</p>
                  <p className="text-[11px] text-gray-500">Displays a temporary maintenance banner to public visitors while allowing administrators to work.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleChange(
                      'maintenance_mode',
                      settings.maintenance_mode === 'true' ? 'false' : 'true'
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    settings.maintenance_mode === 'true' ? 'bg-amber-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.maintenance_mode === 'true' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={fetchSettings}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Reset to Saved
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#1a4f8b] text-white hover:bg-[#133a6b] transition-colors disabled:opacity-50 shadow-sm"
            >
              {saving ? 'Committing Changes...' : 'Save Settings Tab'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
