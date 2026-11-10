'use client'

import React, { useState } from 'react'

export interface DownloadButtonProps {
  title: string
  label: string
  refNumber?: string
  category?: string
  contentSnippet?: string
  filename?: string
}

export default function DownloadButton({
  title,
  label,
  refNumber = 'ATW-DOC-2026',
  category = 'Official Public Record',
  contentSnippet,
  filename,
}: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = () => {
    setDownloading(true)

    try {
      // Build official printable gazetted document text with institutional header
      const documentContent = `================================================================================
FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA
AMHARA NATIONAL REGIONAL STATE
ANGOLELA TERA WOREDA ADMINISTRATION
Chacha Town, North Shewa Zone, Ethiopia
Official Inquiries: angolelatera1@gmail.com | Helpline: +251 (0) 58 661 0100
================================================================================

DOCUMENT TITLE: ${title.toUpperCase()}
REFERENCE CODE: ${refNumber}
CLASSIFICATION: ${category}
DATE GENERATED: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
STATUS: APPROVED & GAZETTED BY WOREDA ADMINISTRATION

--------------------------------------------------------------------------------
1. INSTITUTIONAL STATEMENT & PURPOSE
--------------------------------------------------------------------------------
This official document is issued by the Angolela Tera Woreda Administration 
under regional civil service, municipal, and land administration proclamations.
All citizens, enterprises, and regional authorities may utilize this form or 
directive for official administrative processing.

--------------------------------------------------------------------------------
2. DOCUMENT DETAILS & FORM FIELDS
--------------------------------------------------------------------------------
${contentSnippet || `Form Reference: ${refNumber}
Applicant / Enterprise Legal Name: ____________________________________________
National / Kebele ID Number:       ____________________________________________
Telephone Number:                 ____________________________________________
Email Address:                    ____________________________________________
Permanent Kebele of Residence:    ____________________________________________

SECTION A: APPLICATION SPECIFICATIONS
1. Service Requested: ${title}
2. Legal Justification & Scope:
   __________________________________________________________________________
   __________________________________________________________________________

SECTION B: REQUIRED VERIFICATION DOCUMENTS
[ ] Copy of valid National Identity Card or Resident Kebele ID
[ ] Certified Taxpayer Identification Number (TIN) where applicable
[ ] Cadastral sketch / site coordinate boundary plan (for land services)
[ ] Official payment receipt from Woreda Revenue & Tax Bureau

SECTION C: OFFICIAL ATTESTATION & SIGNATURE
I hereby certify under penalty of administrative sanctions that all statements 
and attached documents submitted are true, complete, and legally authentic.

Applicant Signature: ______________________ Date: ____________________`}

--------------------------------------------------------------------------------
3. OFFICIAL PROCESSING & APPROVAL (FOR WOREDA DESK USE ONLY)
--------------------------------------------------------------------------------
Receiving Officer Name:       ______________________________________________
Designation & Office:         ______________________________________________
Verification Date:            ______________________________________________
Action Taken:                 [ ] Approved   [ ] Under Review   [ ] Rejected
Official Stamp & Seal:

================================================================================
Angolela Tera Woreda Digital Portal Archives • Verified Official Government Record
================================================================================
`

      const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safeFilename = filename || `${refNumber}_${title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`
      a.download = safeFilename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={downloading}
      className="w-full inline-flex items-center justify-center gap-2 bg-gray-50 hover:bg-[#1a4f8b] text-[#1a4f8b] hover:text-white border border-gray-200 hover:border-[#1a4f8b] text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
    >
      <span>{downloading ? '⏳' : '📥'}</span>
      <span>{downloading ? 'Downloading...' : label}</span>
    </button>
  )
}
