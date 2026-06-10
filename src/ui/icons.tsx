import React from 'react'

type SvgProps = {
  filled?: boolean
  className?: string
}

function IconBase({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      className={className ? className : 'iconSvg'}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  )
}

export function HeartIcon({ filled }: SvgProps) {
  const fill = filled ? 'var(--accent)' : 'none'
  const stroke = filled ? 'var(--accent)' : 'rgba(255,255,255,0.9)'
  return (
    <IconBase className="favSvg">
      <path
        d="M12 21s-7.2-4.6-9.3-8.4C1.1 9.5 2.3 6.7 5 5.7c1.9-.7 4 .1 5.2 1.6C11.4 5.8 13.5 5 15.4 5.7c2.7 1 3.9 3.8 2.3 6.9C19.2 16.4 12 21 12 21Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </IconBase>
  )
}

export function InstagramIcon() {
  return (
    <IconBase>
      <rect x="6" y="6" width="12" height="12" rx="3" stroke="rgba(255,255,255,0.95)" strokeWidth="1.8" />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="rgba(255,255,255,0.95)" strokeWidth="1.8" />
      <path d="M16.5 7.6h.01" stroke="rgba(255,255,255,0.95)" strokeWidth="3" strokeLinecap="round" />
    </IconBase>
  )
}

export function FacebookIcon() {
  return (
    <IconBase>
      <path
        d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v3H7v3h3v6h3v-6h3l1-3h-4v-3c0-.6.4-1 1-1Z"
        fill="rgba(255,255,255,0.92)"
      />
    </IconBase>
  )
}

export function DownloadIcon() {
  return (
    <IconBase>
      <path d="M12 3v10" stroke="rgba(255,255,255,0.95)" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M8 11l4 4 4-4"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 20h14" stroke="rgba(255,255,255,0.95)" strokeWidth="1.8" strokeLinecap="round" />
    </IconBase>
  )
}

export function ShareIcon() {
  return (
    <IconBase>
      <path
        d="M16 8a3 3 0 1 0-2.8-4"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 13l12-6"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 11a3 3 0 1 0 .01 0Z"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 13l12 6"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18 19a3 3 0 1 0 .01 0Z"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </IconBase>
  )
}

export function EyeIcon() {
  return (
    <IconBase>
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.8"
      />
    </IconBase>
  )
}

export function XIcon() {
  return (
    <IconBase>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </IconBase>
  )
}

export function PlusIcon() {
  return (
    <IconBase>
      <path
        d="M12 5v14M5 12h14"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </IconBase>
  )
}

export function TrashIcon() {
  return (
    <IconBase>
      <path
        d="M6 7h12M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M10 7v10M14 7v10M9 7l1 13h4l1-13"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  )
}

export function UploadIcon() {
  return (
    <IconBase>
      <path
        d="M12 16V4M8 10l4-4 4 4"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 16v4h16v-4"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  )
}

export function UserIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,0.95)" strokeWidth="1.6" />
      <path
        d="M4 20c0-4 4-6 8-6s8 2 8 6"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </IconBase>
  )
}

export function CameraIcon() {
  return (
    <IconBase>
      <path
        d="M4 6h16l2 4H2l2-4z"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="4" stroke="rgba(255,255,255,0.95)" strokeWidth="1.6" />
      <circle cx="16" cy="7" r="1" fill="rgba(255,255,255,0.95)" />
    </IconBase>
  )
}

export function LockIcon() {
  return (
    <IconBase>
      <rect x="6" y="10" width="12" height="10" rx="2" stroke="rgba(255,255,255,0.95)" strokeWidth="1.6" />
      <path
        d="M9 10V7a3 3 0 016 0v3"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </IconBase>
  )
}

export function UnlockIcon() {
  return (
    <IconBase>
      <rect x="6" y="10" width="12" height="10" rx="2" stroke="rgba(255,255,255,0.95)" strokeWidth="1.6" />
      <path
        d="M9 10V7a3 3 0 016 0"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M3 12h1M20 12h1"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </IconBase>
  )
}

export function SettingsIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="12" r="3" stroke="rgba(255,255,255,0.95)" strokeWidth="1.6" />
      <path
        d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </IconBase>
  )
}
