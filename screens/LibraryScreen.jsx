import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Fetching the exact same data source file as the HomeScreen
import { RECENT_GRID, CAROUSEL_SECTIONS } from '../constants/mockTracks';

export default function LibraryScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const filters = ['All', 'Playlists', 'Artists', 'Podcasts'];

  // --- Dynamic Data Aggregation ---
  // Compile all data nodes into a singular track pool
  const allTracksPool = [
    ...(RECENT_GRID || []),
    ...(CAROUSEL_SECTIONS?.[0]?.data || []),
    ...(CAROUSEL_SECTIONS?.[1]?.data || []),
    ...(CAROUSEL_SECTIONS?.[2]?.data || []),
  ];

  // Helper arrays to handle dynamic extraction
  const playlistsMap = {};
  const artistsMap = {};
  const podcastsList = [];

  allTracksPool.forEach((track) => {
    const isPodcast = track.category === 'Podcasts' || 
                      (track.desc || '').toLowerCase().includes('podcast') || 
                      track.title.toLowerCase().includes('show');

    if (isPodcast) {
      // 1. Process as a Podcast Show Item
      podcastsList.push({
        id: track.id,
        title: track.title,
        cover: track.cover,
        type: 'Podcast',
        count: track.artist || 'Podcast Show',
        pinned: false,
      });
    } else {
      // 2. Process & group into Playlists via the Album property
      const playlistName = track.album || 'Specials Collection';
      if (!playlistsMap[playlistName]) {
        playlistsMap[playlistName] = {
          id: `playlist-${track.id}`,
          title: playlistName,
          cover: track.cover,
          type: 'Playlist',
          songsCount: 0,
          pinned: false,
        };
      }
      playlistsMap[playlistName].songsCount += 1;

      // 3. Process & isolate unique Artists
      const artistName = track.artist || 'Various Artists';
      if (!artistsMap[artistName]) {
        artistsMap[artistName] = {
          id: `artist-${track.id}`,
          title: artistName,
          cover: track.cover, // Uses track artwork as fallback
          type: 'Artist',
          count: 'Artist',
          pinned: false,
        };
      }
    }
  });

  // Convert map objects back to arrays and add calculated text metadata labels
  const generatedPlaylists = Object.values(playlistsMap).map((p, idx) => ({
    ...p,
    count: `${p.songsCount} ${p.songsCount === 1 ? 'song' : 'songs'}`,
    pinned: idx === 0, // Pin the first playlist item for layout aesthetics
  }));

  const generatedArtists = Object.values(artistsMap);

  // Set the first podcast item as pinned if items are present
  if (podcastsList.length > 0) {
    podcastsList[0].pinned = true;
  }

  // --- Compile Structured Data Array ---
  let combinedLibraryItems = [];
  if (selectedFilter === 'All') {
    combinedLibraryItems = [...generatedPlaylists, ...generatedArtists, ...podcastsList];
  } else if (selectedFilter === 'Playlists') {
    combinedLibraryItems = generatedPlaylists;
  } else if (selectedFilter === 'Artists') {
    combinedLibraryItems = generatedArtists;
  } else if (selectedFilter === 'Podcasts') {
    combinedLibraryItems = podcastsList;
  }

  // Sort pinned items to the very top dynamically across the rendering collections
  const finalRenderData = combinedLibraryItems.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarReplacer}>
            <Text style={styles.avatarText}>H</Text>
          </View>
          <Text style={styles.pageTitle}>Your Library</Text>
        </View>
        <View style={styles.actionIcons}>
          <TouchableOpacity style={styles.headerIcon}><Ionicons name="search" size={22} color="#fff" /></TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}><Ionicons name="add" size={26} color="#fff" /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {filters.map((filter) => (
            <TouchableOpacity 
              key={filter} 
              style={[styles.pill, selectedFilter === filter && styles.activePill]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[styles.pillText, selectedFilter === filter && styles.activePillText]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={finalRenderData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        ListHeaderComponent={
          selectedFilter === 'All' || selectedFilter === 'Playlists' ? (
            <TouchableOpacity style={styles.createPlaylistRow}>
              <View style={styles.plusBox}>
                <Ionicons name="add" size={32} color="#b3b3b3" />
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.createTitle}>Create new playlist</Text>
              </View>
            </TouchableOpacity>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemRow} activeOpacity={0.7}>
            <Image 
              source={{ uri: item.cover }} 
              style={[styles.coverArtwork, item.type === 'Artist' && styles.circularArtistImage]} 
            />
            <View style={styles.infoBlock}>
              <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
              <View style={styles.metadataSubrow}>
                {item.pinned && <Ionicons name="pin" size={12} color="#1DB954" style={{ marginRight: 4 }} />}
                <Text style={styles.subtextMeta}>{item.type} • {item.count}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 60 },
  profileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 20 },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatarReplacer: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1DB954', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  pageTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  actionIcons: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { marginLeft: 20, padding: 2 },
  filterWrapper: { marginBottom: 16 },
  filterScroll: { paddingLeft: 16 },
  pill: { backgroundColor: '#2a2a2a', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 8 },
  activePill: { backgroundColor: '#1DB954' },
  pillText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  activePillText: { color: '#000' },
  listPadding: { paddingHorizontal: 16, paddingBottom: 120 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  coverArtwork: { width: 64, height: 64, borderRadius: 4 },
  circularArtistImage: { borderRadius: 32 },
  infoBlock: { flex: 1, marginLeft: 16 },
  itemTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  metadataSubrow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  subtextMeta: { color: '#b3b3b3', fontSize: 13 },
  createPlaylistRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  plusBox: { width: 64, height: 64, backgroundColor: '#282828', borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  createTitle: { color: '#fff', fontSize: 16, fontWeight: '600' }
});