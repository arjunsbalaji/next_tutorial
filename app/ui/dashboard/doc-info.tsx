'use client'

import React from 'react'
import { lusitana } from '../fonts'

export default function DocInfo() {

  const value = "10"
    
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
    <div className="flex p-4" />
    <p
      className={`${lusitana.className}
        truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
    >
      {value}
    </p>
  </div>
  )
}
