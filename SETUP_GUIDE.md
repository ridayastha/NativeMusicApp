# Setup Guide for React Native Music App + Django Backend

## Backend Setup (Django REST Framework)

### 1. Clone Backend Repository
```bash
git clone https://github.com/ridayastha/MusicPlayer.git
cd MusicPlayer
```

### 2. Create Virtual Environment
```bash
python -m venv venv

# Activate virtual environment
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Database Setup
```bash
python manage.py migrate
python manage.py createsuperuser
```

### 5. Create Media Directory
```bash
mkdir media
mkdir media/music
mkdir media/covers
mkdir media/artists
```

### 6. Collect Static Files
```bash
python manage.py collectstatic --noinput
```

### 7. Run Development Server
```bash
python manage.py runserver
```

Backend will be available at: `http://127.0.0.1:8000`

---

## Frontend Setup (React Native)

### 1. Clone Frontend Repository
```bash
git clone https://github.com/ridayastha/NativeMusicApp.git
cd NativeMusicApp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create `.env` file in root directory:
```
REACT_APP_API_URL=http://127.0.0.1:8000/api/v1
```

### 4. Start Expo Development Server
```bash
npm start
```

### 5. Run on Device/Emulator

**For iOS:**
```bash
npm run ios
# or press 'i' in the Expo CLI
```

**For Android:**
```bash
npm run android
# or press 'a' in the Expo CLI
```

**On Physical Device:**
- Download "Expo Go" app
- Scan QR code from terminal

---

## API Endpoints Reference

### Tracks
```
GET    /api/v1/songs/               # List all songs
GET    /api/v1/songs/{id}/          # Get song details
GET    /api/v1/songs/?search=query  # Search songs
POST   /api/v1/songs/{id}/increment_plays/  # Update play count
```

### Artists
```
GET    /api/v1/artists/             # List all artists
GET    /api/v1/artists/{slug}/      # Get artist details
GET    /api/v1/artists/?search=name # Search artists
```

### Albums
```
GET    /api/v1/albums/              # List all albums
GET    /api/v1/albums/{slug}/       # Get album with tracks
GET    /api/v1/albums/?search=title # Search albums
```

### Playlists (Authenticated)
```
GET    /api/v1/playlists/           # User's playlists
POST   /api/v1/playlists/           # Create playlist
GET    /api/v1/playlists/{id}/      # Get playlist details
PATCH  /api/v1/playlists/{id}/      # Update playlist
DELETE /api/v1/playlists/{id}/      # Delete playlist
```

### Favorites (Authenticated)
```
GET    /api/v1/favorites/           # User's liked songs
POST   /api/v1/favorites/           # Like a song
DELETE /api/v1/favorites/{id}/      # Unlike a song
```

### Authentication
```
POST   /api/v1/auth-token/          # Get auth token (login)
```

---

## CORS Configuration (Important!)

Ensure Django `CORS_ALLOWED_ORIGINS` includes your development environment:

In `musicplayer/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8081",  # Expo
    "http://127.0.0.1:8081",
    "http://192.168.x.x:8081",  # Replace with your local IP
]
```

---

## Troubleshooting

### "Cannot connect to API"
1. Check if Django backend is running: `http://127.0.0.1:8000/admin`
2. Verify `REACT_APP_API_URL` in `.env`
3. Check CORS settings in Django

### "Audio file not found"
1. Ensure media files are in `/media/music/`
2. Check file permissions
3. Verify audio URL in API response

### "Token authentication failed"
1. Obtain token: `curl -X POST http://127.0.0.1:8000/api/v1/auth-token/ -d "username=user&password=pass"`
2. Set token in app after login
3. Check if user is authenticated in admin panel

### Expo won't connect
1. Check network connectivity
2. Run: `expo start -c` (clear cache)
3. Use LAN connection if WiFi fails

---

## Development Workflow

1. **Make backend changes** → Test with Django admin/API
2. **Update API client** (`services/api.js`) if endpoints change
3. **Update components** to use new data
4. **Test on both** iOS and Android
5. **Commit changes** with clear messages

---

## Production Deployment

### Backend (Django)
```bash
# Update settings.py
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']

# Use production database (PostgreSQL recommended)
# Configure static/media file serving
# Use gunicorn/uwsgi
```

### Frontend (React Native)
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit
```

---

## Performance Tips

1. **Backend**: Enable query optimization with `select_related()` and `prefetch_related()`
2. **Frontend**: Use `FlatList` instead of `ScrollView` for large lists
3. **API**: Implement pagination for large datasets
4. **Audio**: Pre-buffer next track during playback
5. **Caching**: Implement local caching for frequently accessed data

---

## Additional Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Django REST Framework](https://www.django-rest-framework.org)
- [React Navigation](https://reactnavigation.org)

---

**Happy coding! 🎵**
