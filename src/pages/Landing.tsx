import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HeartIcon, InstagramIcon, FacebookIcon, EyeIcon } from '../ui/icons'
import { getAllPhotos, getProfilePhoto, toggleFavorite, useFavorites, getDisplayName, getInstagramUrl, getFacebookUrl } from '../state/store'
import Lightbox from '../components/Lightbox'

const ABOUT_KEY = 'aboutText'

export default function Landing() {
  const photos = useMemo(() => getAllPhotos(), [])
  const profile = useMemo(() => getProfilePhoto(), [])

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)
  const [globalMouse, setGlobalMouse] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
    setGlobalMouse({ x: e.clientX, y: e.clientY })
  }

  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent) => {
      setGlobalMouse({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleGlobalMove)
    return () => window.removeEventListener('mousemove', handleGlobalMove)
  }, [])

  const [about, setAbout] = useState<string>('')
  const [displayName, setDisplayName] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem(ABOUT_KEY)
    setAbout(
      stored ||
        'Some people arrive like a season change—quietly, beautifully, and forever. Suranjana, with her warm smile and graceful soul, turns ordinary moments into something you want to keep in your heart.'
    )
    setDisplayName(getDisplayName())
    setInstagramUrl(getInstagramUrl())
    setFacebookUrl(getFacebookUrl())
  }, [])

  const favorites = useFavorites()
  const [activeId, setActiveId] = useState<string | null>(null)

  const activePhoto = useMemo(() => {
    if (!activeId) return null
    return photos.find((p) => p.id === activeId) ?? null
  }, [activeId, photos])

  const onToggleFavorite = (id: string) => {
    toggleFavorite(id)
    // same-tab updates don't trigger the browser 'storage' event, so refresh manually
    favorites.refresh()
  }

  useEffect(() => {
    // no-op; favorites are refreshed on demand
  }, [])

  return (
    <div
      className="container"
      style={{
        '--mouse-x': `${globalMouse.x}px`,
        '--mouse-y': `${globalMouse.y}px`
      } as React.CSSProperties}
    >
      <header className="hero fade-in">
        <div className="profileWrap">
          <div
            className={`profileGlowWrap ${isHovering ? 'active' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={isHovering ? {
              '--glow-x': `${mousePos.x}%`,
              '--glow-y': `${mousePos.y}%`
            } as React.CSSProperties : undefined}
          >
            <img className="avatar" src={profile} alt="Suranjana profile" />
          </div>
        </div>

        <div>
          <h1 className="name">{displayName || 'Suranjana'}</h1>
          <p className="subline">A soft heart, a sparkling smile, and stories worth remembering.</p>
          <p className="aboutText">{about}</p>

          <div className="socialRow">
            <a
              className="iconBtn"
              href={instagramUrl || 'https://www.instagram.com/suranjana_783'}
              target="_blank" rel="noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              className="iconBtn"
              href={facebookUrl || 'https://www.facebook.com/suranjana.maity.592783'}
              target="_blank" rel="noreferrer"
              aria-label="Facebook"
              title="Facebook"
            >
              <FacebookIcon />
            </a>
            <Link to="/admin" className="iconBtn" aria-label="Admin" title="Admin">
              <EyeIcon />
            </Link>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="sectionHead">
          <div>
            <h2 className="h2">Album</h2>
            <p className="hint">View, download, share — and mark your favorites.</p>
          </div>
          <p className="hint">Favorites: {favorites.size}</p>
        </div>

        <div className="albumGrid">
          {photos.map((p) => {
            const isFav = favorites.has(p.id)
            return (
              <div key={p.id} className="photo" role="button" tabIndex={0} onClick={() => setActiveId(p.id)}>
                <img className="photoImg" src={p.src} alt={p.alt} loading="lazy" />

                <div className="favBadge" aria-hidden="true">
                  <div
                    className="favChip"
                    title={isFav ? 'Unfavorite' : 'Favorite'}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(p.id)
                      setActiveId(null)
                    }}
                    role="button"
                    tabIndex={-1}
                  >
                    <HeartIcon filled={isFav} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {activePhoto && (
        <Lightbox
          photo={activePhoto}
          onClose={() => setActiveId(null)}
          isFavorite={favorites.has(activePhoto.id)}
          onToggleFavorite={() => toggleFavorite(activePhoto.id)}
        />
      )}
    </div>
  )
}
