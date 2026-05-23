/**
 * Django REST Framework API Service
 * Base configuration and HTTP client for music app
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/v1';

class MusicAPIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = null;
  }

  /**
   * Set authentication token for protected endpoints
   */
  setAuthToken(token) {
    this.token = token;
  }

  /**
   * Generic HTTP request handler
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ API Request Failed [${endpoint}]:`, error);
      throw error;
    }
  }

  // ============ TRACKS ENDPOINTS ============

  /**
   * Fetch all available tracks
   */
  async getTracks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/songs/${queryString ? '?' + queryString : ''}`);
  }

  /**
   * Fetch single track by ID
   */
  async getTrack(trackId) {
    return this.request(`/songs/${trackId}/`);
  }

  /**
   * Search tracks by query
   */
  async searchTracks(query) {
    return this.request(`/songs/?search=${encodeURIComponent(query)}`);
  }

  /**
   * Increment play count
   */
  async incrementPlayCount(trackId) {
    return this.request(`/songs/${trackId}/increment_plays/`, {
      method: 'POST',
    });
  }

  // ============ PLAYLISTS ENDPOINTS ============

  /**
   * Fetch all user playlists
   */
  async getPlaylists() {
    return this.request('/playlists/');
  }

  /**
   * Fetch single playlist with tracks
   */
  async getPlaylist(playlistId) {
    return this.request(`/playlists/${playlistId}/`);
  }

  /**
   * Create new playlist
   */
  async createPlaylist(data) {
    return this.request('/playlists/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update playlist
   */
  async updatePlaylist(playlistId, data) {
    return this.request(`/playlists/${playlistId}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete playlist
   */
  async deletePlaylist(playlistId) {
    return this.request(`/playlists/${playlistId}/`, {
      method: 'DELETE',
    });
  }

  // ============ ARTISTS ENDPOINTS ============

  /**
   * Fetch all artists
   */
  async getArtists(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/artists/${queryString ? '?' + queryString : ''}`);
  }

  /**
   * Fetch artist by slug
   */
  async getArtist(artistSlug) {
    return this.request(`/artists/${artistSlug}/`);
  }

  // ============ ALBUMS ENDPOINTS ============

  /**
   * Fetch all albums
   */
  async getAlbums(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/albums/${queryString ? '?' + queryString : ''}`);
  }

  /**
   * Fetch album by slug
   */
  async getAlbum(albumSlug) {
    return this.request(`/albums/${albumSlug}/`);
  }

  // ============ GENRES ENDPOINTS ============

  /**
   * Fetch all genres
   */
  async getGenres() {
    return this.request('/genres/');
  }

  // ============ FAVORITES/LIKES ENDPOINTS ============

  /**
   * Get user's liked tracks
   */
  async getLikedTracks() {
    return this.request('/favorites/');
  }

  /**
   * Like a track
   */
  async likeTrack(trackId) {
    return this.request('/favorites/', {
      method: 'POST',
      body: JSON.stringify({ song: trackId }),
    });
  }

  /**
   * Unlike a track
   */
  async unlikeTrack(favoriteId) {
    return this.request(`/favorites/${favoriteId}/`, {
      method: 'DELETE',
    });
  }

  // ============ AUTH ENDPOINTS ============

  /**
   * Get auth token (login)
   */
  async login(username, password) {
    const response = await fetch(`${this.baseURL}/auth-token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    this.setAuthToken(data.token);
    return data;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    return this.request('/auth/user/');
  }
}

export const apiClient = new MusicAPIClient();
