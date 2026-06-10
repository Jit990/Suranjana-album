import React, { useEffect } from 'react'
import { DownloadIcon, HeartIcon, ShareIcon, XIcon } from '../ui/icons'
import type { Photo } from '../state/store'

type Props = {
  photo: Photo
  onClose: () => void
  isFavorite: boolean
  onToggleFavorite: () => void
}

export default function Lightbox({ photo, onClose, isFavorite, onToggleFavorite }: Props) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const onDownload = () => {
    const a = document.createElement('a')
    a.href = photo.src
    a.download = photo.alt || 'photo'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const onShare = async () => {
    const text = photo.alt || 'Shared photo'
    // Make URL absolute for share target apps
    const url = `${window.location.origin}${photo.src}`
    // Best-effort share. If unavailable, fall back to copying link.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav: any = navigator
    if (nav?.share) {
      try {
        await nav.share({ title: text, text, url })
        return
      } catch {
        // ignore
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      alert('Link copied!')
    } catch {
      // ignore
      window.prompt('Copy this link:', url)
    }
  }

  return (
    <div
      className="lbOverlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="lb fade-in">
        <div className="lbTop">
          <div className="lbTitle">{photo.alt}</div>
          <div className="lbClose" role="button" tabIndex={0} onClick={onClose} aria-label="Close">
            <XIcon />
          </div>
        </div>

        <div className="lbBody">
          <div className="lbImgWrap">
            <img className="lbImg" src={photo.src} alt={photo.alt} />
          </div>

          <div className="lbSide">
            <div className="lbActions">
              <div
                className="actionBtn"
                role="button"
                tabIndex={0}
                onClick={onToggleFavorite}
                aria-label={isFavorite ? 'Unfavorite' : 'Favorite'}
              >
                <span className="actionIcon">
                  <HeartIcon filled={isFavorite} />
                </span>
                <span>{isFavorite ? 'Unfavorite' : 'Favorite'}</span>
              </div>

              <div className="actionBtn" role="button" tabIndex={0} onClick={onDownload} aria-label="Download">
                <span className="actionIcon">
                  <DownloadIcon />
                </span>
                <span>Download</span>
              </div>

              <div className="actionBtn" role="button" tabIndex={0} onClick={onShare} aria-label="Share">
                <span className="actionIcon">
                  <ShareIcon />
                </span>
                <span>Share</span>
              </div>

              <div className="footerNote">
                Tip: Press <b>Esc</b> to close.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
