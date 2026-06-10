import { useEffect, useMemo, useState } from 'react'

export type Photo = {
  id: string
  src: string
  alt: string
  kind?: 'starter' | 'upload'
}

export const ABOUT_KEY = 'aboutText'
const FAVORITES_KEY = 'favoritesV1'

// Configuration keys
const INSTAGRAM_KEY = 'instagramUrl'
const FACEBOOK_KEY = 'facebookUrl'
const NAME_KEY = 'displayName'

// Uploaded photo persistence
const UPLOAD_DB_NAME = 'albumUploadsDB'
const UPLOAD_DB_VERSION = 1
const UPLOAD_STORE_NAME = 'photos'

const UPLOADED_IDS_KEY = 'uploadedPhotoIdsV1'
const PROFILE_PHOTO_ID_KEY = 'profilePhotoIdV1'

type UploadedPhotoRecord = {
  id: string
  src: string // objectURL-ish; we will persist via base64 so it survives reload
  alt: string
}

function safeParseJSON<T>(value: string | null, fallback: T): T {
  try {
    if (!value) return fallback
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function formatPhotoName(fileName: string) {
  // Example: "WhatsApp Image 2026-06-08 at 12.29.30 (1).jpeg" -> "WhatsApp Image 2026-06-08 at 12:29:30 (1)"
  const noExt = fileName.replace(/\.[^.]+$/, '')
  return noExt
}

/**
 * Vite/React apps running in the browser can’t “persist” object URLs across refresh.
 * We store uploaded images as base64 (data URL) inside IndexedDB so they rehydrate after reload.
 */
async function fileToDataURL(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.onload = () => resolve(String(reader.result))
    reader.readAsDataURL(file)
  })
}

function openUploadDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(UPLOAD_DB_NAME, UPLOAD_DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(UPLOAD_STORE_NAME)) {
        db.createObjectStore(UPLOAD_STORE_NAME, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function idbPutPhoto(record: UploadedPhotoRecord) {
  const db = await openUploadDB()
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(UPLOAD_STORE_NAME, 'readwrite')
    tx.objectStore(UPLOAD_STORE_NAME).put(record)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function idbGetPhotoById(id: string): Promise<UploadedPhotoRecord | null> {
  const db = await openUploadDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(UPLOAD_STORE_NAME, 'readonly')
    const req = tx.objectStore(UPLOAD_STORE_NAME).get(id)
    req.onsuccess = () => resolve((req.result as UploadedPhotoRecord) ?? null)
    req.onerror = () => reject(req.error)
  })
}

async function idbGetPhotosByIds(ids: string[]): Promise<UploadedPhotoRecord[]> {
  const db = await openUploadDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(UPLOAD_STORE_NAME, 'readonly')
    const store = tx.objectStore(UPLOAD_STORE_NAME)

    const results: UploadedPhotoRecord[] = []
    let pending = ids.length

    if (pending === 0) resolve([])

    ids.forEach((id) => {
      const req = store.get(id)
      req.onsuccess = () => {
        if (req.result) results.push(req.result as UploadedPhotoRecord)
        pending -= 1
        if (pending === 0) resolve(results)
      }
      req.onerror = () => reject(req.error)
    })
  })
}

function safeUUID() {
  // simple unique id for uploads
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export function getPhotoList(): Photo[] {
  // Starter photos (existing /photo folder)
  const candidates = [
    'WhatsApp Image 2026-06-08 at 12.29.28 PM.jpeg',
    'WhatsApp Image 2026-06-08 at 12.29.29 PM (1).jpeg',
    'WhatsApp Image 2026-06-08 at 12.29.29 PM (2).jpeg',
    'WhatsApp Image 2026-06-08 at 12.29.29 PM.jpeg',
    'WhatsApp Image 2026-06-08 at 12.29.30 PM (1).jpeg',
    'WhatsApp Image 2026-06-08 at 12.29.30 PM (2).jpeg',
    'WhatsApp Image 2026-06-08 at 12.29.30 PM.jpeg',
    'WhatsApp Image 2026-06-08 at 12.29.31 PM (1).jpeg',
    'WhatsApp Image 2026-06-08 at 12.29.31 PM (2).jpeg',
    'WhatsApp Image 2026-06-08 at 12.29.31 PM.jpeg',
    'WhatsApp Image 2026-06-08 at 12.29.32 PM.jpeg'
  ]

  return candidates.map((fileName) => {
    const id = `starter:${fileName}`
    return {
      id,
      kind: 'starter',
      src: `/photo/${encodeURIComponent(fileName).replace(/%2F/g, '/')}`,
      alt: formatPhotoName(fileName)
    }
  })
}

async function getUploadedPhotos(): Promise<Photo[]> {
  const ids = safeParseJSON<string[]>(localStorage.getItem(UPLOADED_IDS_KEY), [])
  const records = await idbGetPhotosByIds(ids)
  return records.map((r) => ({
    id: `upload:${r.id}`,
    kind: 'upload',
    src: r.src,
    alt: r.alt
  }))
}

function getProfilePhotoFromStorage(): string | null {
  const profileId = localStorage.getItem(PROFILE_PHOTO_ID_KEY)
  if (!profileId) return null
  // If it's a data URL (uploaded), use it directly, otherwise it's a file path
  if (profileId.startsWith('data:')) return profileId
  return `/photo/${encodeURIComponent(profileId).replace(/%2F/g, '/')}`
}

export function getProfilePhoto(): string {
  return getProfilePhotoFromStorage() || '/photo/WhatsApp Image 2026-06-08 at 12.29.30 PM.jpeg'
}

export async function setProfilePhoto(file: File): Promise<string> {
  const dataUrl = await fileToDataURL(file)
  localStorage.setItem(PROFILE_PHOTO_ID_KEY, dataUrl)
  return dataUrl
}

export function getDisplayName(): string {
  return localStorage.getItem(NAME_KEY) || 'Suranjana'
}

export function setDisplayName(name: string): void {
  localStorage.setItem(NAME_KEY, name)
}

export function getInstagramUrl(): string {
  return localStorage.getItem(INSTAGRAM_KEY) || 'https://www.instagram.com/suranjana_783'
}

export function setInstagramUrl(url: string): void {
  localStorage.setItem(INSTAGRAM_KEY, url)
}

export function getFacebookUrl(): string {
  return localStorage.getItem(FACEBOOK_KEY) || 'https://www.facebook.com/suranjana.maity.592783'
}

export function setFacebookUrl(url: string): void {
  localStorage.setItem(FACEBOOK_KEY, url)
}

export function toggleFavorite(id: string) {
  const raw = localStorage.getItem(FAVORITES_KEY)
  const ids: string[] = safeParseJSON<string[]>(raw, [])
  const set = new Set(ids)
  if (set.has(id)) {
    set.delete(id)
  } else {
    set.add(id)
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...set]))
}

function getFavoriteIds(): Set<string> {
  const raw = localStorage.getItem(FAVORITES_KEY)
  const ids: string[] = safeParseJSON<string[]>(raw, [])
  return new Set(ids.filter(Boolean))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => getFavoriteIds())

  const refresh = () => {
    setFavorites(getFavoriteIds())
  }

  useEffect(() => {
    window.addEventListener('storage', refresh)
    return () => window.removeEventListener('storage', refresh)
  }, [])

  return {
    has: (id: string) => favorites.has(id),
    size: favorites.size,
    refresh
  }
}

export async function addUploadedPhoto(file: File): Promise<Photo> {
  const id = safeUUID()
  const dataUrl = await fileToDataURL(file)
  const alt = formatPhotoName(file.name)

  await idbPutPhoto({ id, src: dataUrl, alt })

  const existingIds = safeParseJSON<string[]>(localStorage.getItem(UPLOADED_IDS_KEY), [])
  localStorage.setItem(UPLOADED_IDS_KEY, JSON.stringify([...existingIds, id]))

  return {
    id: `upload:${id}`,
    kind: 'upload',
    src: dataUrl,
    alt
  }
}

export function getAllPhotos(): Photo[] {
  return getPhotoList()
}

// Admin password protection
const ADMIN_PASS_KEY = 'adminPassword'

export function setAdminPassword(password: string): void {
  localStorage.setItem(ADMIN_PASS_KEY, btoa(password))
}

export function verifyAdminPassword(password: string): boolean {
  const stored = localStorage.getItem(ADMIN_PASS_KEY)
  if (!stored) return password === 'admin123' // default password
  return stored === btoa(password)
}

export function hasAdminPassword(): boolean {
  return !!localStorage.getItem(ADMIN_PASS_KEY)
}
