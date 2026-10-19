'use client'

import React, { useState, useEffect } from 'react'

export default function AdminSettingsPage() {
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
      setMsg({ type: 'error', text: 'Failed to load system settings.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
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
        setMsg({ type: 'success', text: 'Official government site settings updated successfully.' })
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to update settings.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network communication error.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              System Administration
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#0d2340]">
            Official Government Site Settings
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure institutional naming, official phone numbers, emergency hotlines, working hours, and physical addresses.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs self-start sm:self-auto disabled:opacity-50"
        >
          {saving ? 'Saving Changes...' : '💾 Save All Settings'}
        </button>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} className="text-sm font-bold opacity-70 hover:opacity-100">
            ×
          </button>
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-xs text-gray-500">
          Loading system settings...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Institutional Naming */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#0d2340] border-b border-gray-100 pb-2">
              1. Institutional Identity & Government Naming
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Official Entity Name (English)
                </label>
                <input
                  type="text"
                  value={settings.government_name_en || ''}
                  onChange={(e) => handleChange('government_name_en', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ይፋዊ የስም መጠሪያ (አማርኛ)
                </label>
                <input
                  type="text"
                  value={settings.government_name_am || ''}
                  onChange={(e) => handleChange('government_name_am', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Maqaa Seeraa (Afaan Oromo)
                </label>
                <input
                  type="text"
                  value={settings.government_name_om || ''}
                  onChange={(e) => handleChange('government_name_om', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Administrative Center / Capital Town
                </label>
                <input
                  type="text"
                  value={settings.capital_city_en || 'Chacha'}
                  onChange={(e) => handleChange('capital_city_en', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Zone & Regional Jurisdiction
                </label>
                <input
                  type="text"
                  value={settings.zone_name_en || 'North Shewa Zone, Amhara Region'}
                  onChange={(e) => handleChange('zone_name_en', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
            </div>
          </div>

          {/* Official Contacts & Emergency Hotlines */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#0d2340] border-b border-gray-100 pb-2">
              2. Official Contacts & Public Safety Emergency Hotlines
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Main Switchboard Phone
                </label>
                <input
                  type="text"
                  value={settings.contact_phone || ''}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Primary Government Inquiries Email
                </label>
                <input
                  type="email"
                  value={settings.contact_email || ''}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Woreda Police Emergency Dispatch
                </label>
                <input
                  type="text"
                  value={settings.emergency_police || '991 / +251 58 661 0110'}
                  onChange={(e) => handleChange('emergency_police', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Emergency Medical & Ambulance Hotlines
                </label>
                <input
                  type="text"
                  value={settings.emergency_health || '907 / +251 58 661 0112'}
                  onChange={(e) => handleChange('emergency_health', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
            </div>
          </div>

          {/* Official Working Hours */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#0d2340] border-b border-gray-100 pb-2">
              3. Civil Service Working Hours
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Service Hours Schedule (English)
                </label>
                <input
                  type="text"
                  value={settings.working_hours_en || ''}
                  onChange={(e) => handleChange('working_hours_en', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  የሥራ ሰዓት መርሃ-ግብር (አማርኛ)
                </label>
                <input
                  type="text"
                  value={settings.working_hours_am || ''}
                  onChange={(e) => handleChange('working_hours_am', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving Updates...' : '💾 Save All Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
