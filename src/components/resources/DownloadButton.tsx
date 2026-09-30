'use client'

import React, { useState } from 'react'

export default function DownloadButton({
  title,
  label,
}: {
  title: string
  label: string
}) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      alert(`Downloaded document: "${title}" (Official Angolela Tera Archive)`)
    }, 600)
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={downloading}
      className="w-full inline-flex items-center justify-center gap-2 bg-gray-50 hover:bg-[#1a4f8b] text-[#1a4f8b] hover:text-white border border-gray-200 hover:border-[#1a4f8b] text-xs font-bold py-2.5 px-4 rounded-lg transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
    >
      <span>{downloading ? '⏳' : '📥'}</span>
      <span>{downloading ? 'Preparing...' : label}</span>
    </button>
  )
}
