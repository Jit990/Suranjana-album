import React, { useEffect, useState } from 'react'
import { getAllPhotos, ABOUT_KEY, toggleFavorite, addUploadedPhoto, useFavorites, getProfilePhoto, setProfilePhoto, setAdminPassword, verifyAdminPassword, hasAdminPassword, getDisplayName, setDisplayName, getInstagramUrl, setInstagramUrl, getFacebookUrl, setFacebookUrl } from '../state/store'
import { DownloadIcon, EyeIcon, HeartIcon, XIcon, UploadIcon, CameraIcon, LockIcon, UnlockIcon, SettingsIcon } from '../ui/icons'

type AuthState = 'idle' | 'locked' | 'unlocked'

export default function Admin() {
  const [about, setAbout] = useState('')
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [err, setErr] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [photoCounts, setPhotoCounts] = useState(0)
  const [profilePhoto, setProfilePhotoState] = useState('')
  const [settingProfile, setSettingProfile] = useState(false)
  const [animCounts, setAnimCounts] = useState({ fav: 0, photos: 0 })
  const [authState, setAuthState] = useState<AuthState>('idle')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPasswordSetup, setShowPasswordSetup] = useState(false)
  const [displayName, setDisplayNameState] = useState('')
  const [instagramUrl, setInstagramUrlState] = useState('')
  const [facebookUrl, setFacebookUrlState] = useState('')

  const favorites = useFavorites()

  useEffect(() => {
    // Check if user is already authenticated in this session
    const sessionAuth = sessionStorage.getItem('adminAuthenticated')
    if (sessionAuth === 'true') {
      setAuthState('unlocked')
    } else {
      setAuthState('locked')
    }
  }, [])

  useEffect(() => {
    if (authState !== 'unlocked') return

    const stored = localStorage.getItem(ABOUT_KEY)
    setAbout(
      stored ||
        'Some people arrive like a season change—quietly, beautifully, and forever. Suranjana, with her warm smile and graceful soul, turns ordinary moments into something you want to keep in your heart.'
    )

    const updateCounts = () => {
      try {
        const raw = localStorage.getItem('favoritesV1')
        const ids: string[] = raw ? JSON.parse(raw) : []
        const favCount = new Set((ids || []).filter(Boolean)).size
        setFavoritesCount(favCount)
        setPhotoCounts(getAllPhotos().length)
        setAnimCounts({ fav: favCount, photos: getAllPhotos().length })
      } catch {
        setFavoritesCount(0)
        setPhotoCounts(0)
        setAnimCounts({ fav: 0, photos: 0 })
      }
    }

    updateCounts()
    setProfilePhotoState(getProfilePhoto())
    setDisplayNameState(getDisplayName())
    setInstagramUrlState(getInstagramUrl())
    setFacebookUrlState(getFacebookUrl())
    window.addEventListener('storage', updateCounts)
    return () => window.removeEventListener('storage', updateCounts)
  }, [authState])

  // Animate counting
  useEffect(() => {
    if (animCounts.fav === favoritesCount && animCounts.photos === photoCounts) return

    const timer = setInterval(() => {
      setAnimCounts(prev => ({
        fav: prev.fav < favoritesCount ? prev.fav + 1 : favoritesCount,
        photos: prev.photos < photoCounts ? prev.photos + 1 : photoCounts
      }))
    }, 30)

    setTimeout(() => clearInterval(timer), 500)
    return () => clearInterval(timer)
  }, [favoritesCount, photoCounts])

  const onUnlock = () => {
    if (verifyAdminPassword(password)) {
      setAuthState('unlocked')
      sessionStorage.setItem('adminAuthenticated', 'true')
      setErr(null)
    } else {
      setErr('Incorrect password')
    }
  }

  const onSetupPassword = () => {
    if (newPassword.length < 4) {
      setErr('Password must be at least 4 characters')
      return
    }
    setAdminPassword(newPassword)
    setNewPassword('')
    setShowPasswordSetup(false)
    setErr(null)
    alert('Password set successfully!')
  }

  const onLock = () => {
    setAuthState('locked')
    sessionStorage.removeItem('adminAuthenticated')
    setPassword('')
  }

  const onSave = () => {
    try {
      localStorage.setItem(ABOUT_KEY, about)
      setErr(null)
      alert('Saved successfully!')
    } catch (e) {
      setErr('Could not save. Try again.')
    }
  }

  const onSaveName = () => {
    try {
      setDisplayName(displayName)
      alert('Name saved!')
    } catch (e) {
      setErr('Could not save name.')
    }
  }

  const onSaveInstagram = () => {
    try {
      setInstagramUrl(instagramUrl)
      alert('Instagram URL saved!')
    } catch (e) {
      setErr('Could not save Instagram URL.')
    }
  }

  const onSaveFacebook = () => {
    try {
      setFacebookUrl(facebookUrl)
      alert('Facebook URL saved!')
    } catch (e) {
      setErr('Could not save Facebook URL.')
    }
  }

  const onToggleFavorite = (id: string) => {
    toggleFavorite(id)
    setTimeout(() => {
      const raw = localStorage.getItem('favoritesV1')
      const ids: string[] = raw ? JSON.parse(raw) : []
      setFavoritesCount(new Set((ids || []).filter(Boolean)).size)
    }, 100)
  }

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        await addUploadedPhoto(files[i])
      }
      setPhotoCounts(getAllPhotos().length)
      alert(`Uploaded ${files.length} photo(s) successfully!`)
    } catch (err) {
      setErr('Upload failed. Try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const onProfileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSettingProfile(true)
    try {
      const newPhoto = await setProfilePhoto(file)
      setProfilePhotoState(newPhoto)
      alert('Profile picture updated!')
    } catch (err) {
      setErr('Failed to update profile picture.')
    } finally {
      setSettingProfile(false)
      e.target.value = ''
    }
  }

  const previewPhotos = getAllPhotos().slice(0, 8)

  // Locked screen
  if (authState === 'locked') {
    return (
      <div className="container adminWrap fade-in">
        <div className="lockScreen">
          <div className="lockCard">
            <div className="lockIcon">
              <LockIcon />
            </div>
            <h2 className="lockTitle">Admin Panel</h2>
            <p className="lockSubtitle">Enter password to access</p>
            <input
              type="password"
              className="passwordInput"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onUnlock()}
            />
            {err && <div className="errorText">{err}</div>}
            <button className="btn ultra unlockBtn" onClick={onUnlock}>
              <UnlockIcon /> Unlock
            </button>
            <p className="hint" style={{ marginTop: 20 }}>
              Default password: <code>admin123</code>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container adminWrap fade-in">
      <div className="adminHeader">
        <div className="adminTitle">
          <h1 className="h2">Admin Panel</h1>
          <div className="adminStats">
            <span className="statBadge pulse">
              <HeartIcon filled />
              <span className="statNumber">{animCounts.fav}</span>
              <span className="statLabelText">Favorites</span>
            </span>
            <span className="statBadge pulse">
              <EyeIcon />
              <span className="statNumber">{animCounts.photos}</span>
              <span className="statLabelText">Photos</span>
            </span>
            <button className="lockBtn" onClick={onLock} title="Lock">
              <LockIcon />
            </button>
          </div>
        </div>
        <p className="hint">Manage your album, upload photos, and update content.</p>
      </div>

      <div className="adminGrid">
        <div className="adminCard">
          <div className="cardHeader">
            <h3 className="cardTitle">Profile Picture</h3>
            <span className="cardLabel">Avatar</span>
          </div>
          <div className="profileSection">
            <div className="profilePreview">
              <img src={profilePhoto} alt="Profile" className="profileImage" />
              <div className="profileOverlay">
                <CameraIcon />
              </div>
            </div>
            <label className="btn profileBtn">
              <input type="file" accept="image/*" onChange={onProfileSelect} disabled={settingProfile} hidden />
              {settingProfile ? 'Updating...' : 'Change Profile Photo'}
            </label>
            <p className="profileHint">Click to upload a new profile picture</p>
          </div>
        </div>

        <div className="adminCard">
          <div className="cardHeader">
            <h3 className="cardTitle">Display Name</h3>
            <span className="cardLabel">Landing Page</span>
          </div>
          <input
            type="text"
            className="input ultra"
            value={displayName}
            onChange={(e) => setDisplayNameState(e.target.value)}
            placeholder="Enter display name"
          />
          <button className="btn ultra" onClick={onSaveName}>
            <XIcon /> Save Name
          </button>
        </div>

        <div className="adminCard">
          <div className="cardHeader">
            <h3 className="cardTitle">Instagram URL</h3>
            <span className="cardLabel">Social Link</span>
          </div>
          <input
            type="url"
            className="input ultra"
            value={instagramUrl}
            onChange={(e) => setInstagramUrlState(e.target.value)}
            placeholder="https://instagram.com/username"
          />
          <button className="btn ultra" onClick={onSaveInstagram}>
            <XIcon /> Save URL
          </button>
        </div>

        <div className="adminCard">
          <div className="cardHeader">
            <h3 className="cardTitle">Facebook URL</h3>
            <span className="cardLabel">Social Link</span>
          </div>
          <input
            type="url"
            className="input ultra"
            value={facebookUrl}
            onChange={(e) => setFacebookUrlState(e.target.value)}
            placeholder="https://facebook.com/username"
          />
          <button className="btn ultra" onClick={onSaveFacebook}>
            <XIcon /> Save URL
          </button>
        </div>

        <div className="adminCard">
          <div className="cardHeader">
            <h3 className="cardTitle">About Text</h3>
            <span className="cardLabel">Landing Page</span>
          </div>
          <textarea
            id="about"
            className="textarea ultra"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Write something beautiful about Suranjana..."
          />
          <button className="btn ultra" onClick={onSave}>
            <XIcon /> Save Changes
          </button>
          {err && <div className="errorText">{err}</div>}
          <div className="storageNote">Stored locally (key: <code>{ABOUT_KEY}</code>)</div>
        </div>

        <div className="adminCard">
          <div className="cardHeader">
            <h3 className="cardTitle">Upload Photos</h3>
            <span className="cardLabel">Add to Album</span>
          </div>
          <label className="uploadZone">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onFileSelect}
              disabled={uploading}
            />
            <div className="uploadContent">
              {uploading ? (
                <div className="uploadSpinner" />
              ) : (
                <>
                  <UploadIcon />
                  <span className="uploadText">Drop photos here or click to browse</span>
                  <span className="uploadHint">Supports JPG, PNG, WEBP</span>
                </>
              )}
            </div>
          </label>
        </div>

        <div className="adminCard">
          <div className="cardHeader">
            <h3 className="cardTitle">Security</h3>
            <span className="cardLabel">Password</span>
          </div>
          {!showPasswordSetup ? (
            <>
              <div className="securityInfo">
                <LockIcon />
                <span>{hasAdminPassword() ? 'Custom password set' : 'Using default password'}</span>
              </div>
              <button className="btn ultra" onClick={() => setShowPasswordSetup(true)}>
                <SettingsIcon /> Change Password
              </button>
            </>
          ) : (
            <>
              <input
                type="password"
                className="passwordInput"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="btnRow">
                <button className="btn ultra" onClick={onSetupPassword}>
                  <XIcon /> Save
                </button>
                <button className="btn ultra" onClick={() => setShowPasswordSetup(false)}>
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>

        <div className="adminCard fullWidth">
          <div className="cardHeader">
            <h3 className="cardTitle">Photo Gallery</h3>
            <span className="cardLabel">Manage & Preview</span>
          </div>
          <div className="photoGrid">
            {previewPhotos.map((p) => {
              const isFav = favorites.has(p.id)
              return (
                <div key={p.id} className="photoCard">
                  <img className="photoThumb" src={p.src} alt={p.alt} />
                  <div className="photoActions">
                    <button
                      className={`actionBtnUltra ${isFav ? 'active' : ''}`}
                      onClick={() => onToggleFavorite(p.id)}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <HeartIcon filled={isFav} />
                    </button>
                    <button
                      className="actionBtnUltra"
                      onClick={() => {
                        const a = document.createElement('a')
                        a.href = p.src
                        a.download = p.alt || 'photo'
                        a.click()
                      }}
                      title="Download photo"
                    >
                      <DownloadIcon />
                    </button>
                  </div>
                  {isFav && <div className="favIndicator" />}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}