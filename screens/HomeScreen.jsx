import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, RECENT_GRID, CAROUSEL_SECTIONS } from '../constants/mockTracks';
import { AudioContext } from '../context/AudioContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { playTrack, currentTrack, isPlaying } = useContext(AudioContext);
  const [activeCategory, setActiveCategory] = useState("Music");
  const [greeting, setGreeting] = useState("Good morning");

  // Dynamic system clock greeting updates
  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting("Good morning");
    else if (hrs < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // --- Advanced Structural Filtering Pipeline ---
  const isPodcastMode = activeCategory === "Podcasts";

  // 1. Filter Grid Items safely checking for undefined fields
  const displayedGridItems = RECENT_GRID.filter(item => {
    if (item.category) {
      return item.category === activeCategory;
    }
    
    const titleLower = (item.title || '').toLowerCase();
    const albumLower = (item.album || '').toLowerCase();

    if (isPodcastMode) {
      return titleLower.includes('podcast') || albumLower.includes('show');
    }
    return !titleLower.includes('podcast');
  });

  // 2. Filter Section Rows dynamically & protect against undefined properties
  const displayedCarousels = CAROUSEL_SECTIONS.map(section => {
    const filteredData = section.data.filter(track => {
      if (track.category) {
        return track.category === activeCategory;
      }
      
      const descLower = (track.desc || '').toLowerCase();
      const titleLower = (track.title || '').toLowerCase();
      const artistLower = (track.artist || '').toLowerCase();
      
      if (isPodcastMode) {
        return descLower.includes('podcast') || descLower.includes('show') || titleLower.includes('talk') || titleLower.includes('cast') || artistLower.includes('cast');
      }
      return !descLower.includes('podcast') && !descLower.includes('episode');
    });

    return {
      ...section,
      data: filteredData
    };
  }).filter(section => section.data && section.data.length > 0);

  // Failsafe wrapper function to protect audio player context layers
  const handleTrackSelection = (track) => {
    if (!track || !track.url) {
      console.warn("⚠️ Aborted action: Audio resource target url string missing.", track);
      return;
    }
    playTrack(track);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Global Utility Header Top bar --- */}
      <View style={styles.topUtilityBar}>
        <View style={styles.leftProfileBlock}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>H</Text>
          </View>
          <Text style={styles.greetingText}>{greeting}</Text>
        </View>
        <View style={styles.rightActionBlock}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons name="time-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={21} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
        
        {/* --- Category Selector Dynamic Pill Rows --- */}
        <View style={styles.categoryRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.chip, activeCategory === cat && styles.activeChip]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.activeChipText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- Render Interface Conditions --- */}
        {displayedGridItems.length === 0 && displayedCarousels.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="radio-outline" size={54} color="#444" />
            <Text style={styles.emptyStateText}>No content found matching "{activeCategory}".</Text>
            <Text style={styles.emptySubText}>Try adding explicit category tags inside mock data properties.</Text>
          </View>
        ) : (
          <>
            {/* --- 2-Column Quick Grid Section --- */}
            {displayedGridItems.length > 0 && (
              <View style={styles.gridContainer}>
                {displayedGridItems.map((item) => {
                  const isCurrent = currentTrack?.id === item.id;
                  return (
                    <TouchableOpacity 
                      key={item.id} 
                      style={[styles.gridCard, isCurrent && styles.activeCardHighlight]}
                      onPress={() => handleTrackSelection(item)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: item.cover }} style={styles.gridImage} />
                      <View style={styles.gridContentBlock}>
                        <Text style={[styles.gridTitle, isCurrent && styles.activeGreenText]} numberOfLines={2}>
                          {item.title || 'Unknown Title'}
                        </Text>
                        {isCurrent && isPlaying && (
                          <Ionicons name="volume-high" size={14} color="#1DB954" style={styles.playingIndicator} />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* --- Dynamic Carousels List (Includes Trending Section on Top) --- */}
            {displayedCarousels.map((section) => (
              <View key={section.title} style={styles.sectionContainer}>
                <Text style={styles.sectionHeading}>{section.title}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carouselScroll}>
                  {section.data.map((track) => {
                    const isCurrent = currentTrack?.id === track.id;
                    const isTrendingRow = section.title && section.title.includes('Trending');
                    
                    return (
                      <TouchableOpacity 
                        key={track.id} 
                        style={[styles.showcaseCard, isTrendingRow && styles.widerTrendingCard]}
                        onPress={() => handleTrackSelection(track)}
                        activeOpacity={0.7}
                      >
                        <Image 
                          source={{ uri: track.cover }} 
                          style={[styles.showcaseImage, isTrendingRow && styles.widerTrendingImage]} 
                        />
                        <Text style={[styles.showcaseTitle, isCurrent && styles.activeGreenText]} numberOfLines={1}>
                          {track.title || 'Unknown Title'}
                        </Text>
                        <Text style={styles.showcaseArtist} numberOfLines={1}>
                          {track.artist || 'Various Creators'}
                        </Text>
                        {track.desc && (
                          <Text style={styles.showcaseDesc} numberOfLines={2}>
                            {track.desc}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            ))}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  topUtilityBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  leftProfileBlock: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1DB954', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarLetter: { color: '#000', fontSize: 14, fontWeight: 'bold' },
  greetingText: { color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: -0.4 },
  rightActionBlock: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { padding: 6, marginLeft: 12 },
  scrollPadding: { paddingTop: 12, paddingBottom: 130 },
  categoryRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 20 },
  chip: { backgroundColor: '#2a2a2a', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 8 },
  activeChip: { backgroundColor: '#1DB954' },
  chipText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  activeChipText: { color: '#000' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 24 },
  gridCard: { width: '49%', backgroundColor: '#282828', flexDirection: 'row', alignItems: 'center', borderRadius: 6, marginBottom: 8, overflow: 'hidden', height: 56 },
  activeCardHighlight: { backgroundColor: '#333' },
  gridImage: { width: 56, height: 56 },
  gridContentBlock: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1, paddingHorizontal: 8 },
  gridTitle: { color: '#fff', fontSize: 12, fontWeight: 'bold', flex: 1 },
  activeGreenText: { color: '#1DB954', fontWeight: 'bold' },
  playingIndicator: { marginLeft: 4 },
  sectionContainer: { marginBottom: 30 },
  sectionHeading: { color: '#fff', fontSize: 20, fontWeight: 'bold', paddingHorizontal: 16, marginBottom: 14, letterSpacing: -0.3 },
  carouselScroll: { paddingLeft: 16 },
  showcaseCard: { width: 144, marginRight: 16 },
  widerTrendingCard: { width: 190 },
  showcaseImage: { width: 144, height: 144, borderRadius: 6, marginBottom: 8 },
  widerTrendingImage: { width: 190, height: 120 },
  showcaseTitle: { color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  showcaseArtist: { color: '#b3b3b3', fontSize: 11, fontWeight: '500', marginBottom: 4 },
  showcaseDesc: { color: '#9f9f9f', fontSize: 11, lineHeight: 15 },
  emptyStateContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 100, paddingHorizontal: 40 },
  emptyStateText: { color: '#fff', fontSize: 15, fontWeight: '600', marginTop: 16, textAlign: 'center' },
  emptySubText: { color: '#777', fontSize: 12, marginTop: 6, textAlign: 'center', lineHeight: 18 }
});