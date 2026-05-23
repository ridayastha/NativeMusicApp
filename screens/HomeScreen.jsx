import React, { useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  Dimensions, 
  Platform, 
  StatusBar 
} from 'react-native';
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

  const isPodcastMode = activeCategory === "Podcasts";

  // 1. Filter Grid Items safely checking for荒 fields
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

  const handleTrackSelection = (track) => {
    if (!track || !track.url) {
      console.warn("⚠️ Aborted action: Audio resource target url string missing.", track);
      return;
    }
    playTrack(track);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0C" />
      
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
            <Ionicons name="radio-outline" size={54} color="#3a3a3c" />
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

            {/* --- Dynamic Carousels List --- */}
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
  container: { 
    flex: 1, 
    backgroundColor: '#0B0B0C' // Deep rich iOS dark mode base
  },
  topUtilityBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 12, 
    paddingBottom: 10 
  },
  leftProfileBlock: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { 
    width: 34, 
    height: 34, 
    borderRadius: 17, 
    backgroundColor: '#1DB954', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12,
    // Subtle physical lift
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },
  avatarLetter: { color: '#000', fontSize: 15, fontWeight: 'bold' },
  greetingText: { color: '#fff', fontSize: 24, fontWeight: 'bold', letterSpacing: -0.5 },
  rightActionBlock: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { 
    padding: 8, 
    marginLeft: 8, 
    backgroundColor: 'rgba(255,255,255,0.06)', 
    borderRadius: 20 
  },
  scrollPadding: { paddingTop: 12, paddingBottom: 140 },
  categoryRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 22 },
  chip: { 
    backgroundColor: 'rgba(255,255,255,0.08)', 
    paddingVertical: 8, 
    paddingHorizontal: 18, 
    borderRadius: 20, 
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)'
  },
  activeChip: { 
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  chipText: { color: '#eee', fontSize: 13, fontWeight: '600' },
  activeChipText: { color: '#000', fontWeight: '700' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 26 },
  gridCard: { 
    width: '49%', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 8, 
    marginBottom: 10, 
    overflow: 'hidden', 
    height: 58,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)'
  },
  activeCardHighlight: { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.1)' },
  gridImage: { width: 58, height: 58 },
  gridContentBlock: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1, paddingHorizontal: 10 },
  gridTitle: { color: '#fff', fontSize: 12, fontWeight: '600', flex: 1, lineHeight: 16 },
  activeGreenText: { color: '#1DB954', fontWeight: '700' },
  playingIndicator: { marginLeft: 4 },
  sectionContainer: { marginBottom: 32 },
  sectionHeading: { color: '#fff', fontSize: 21, fontWeight: 'bold', paddingHorizontal: 16, marginBottom: 14, letterSpacing: -0.4 },
  carouselScroll: { paddingLeft: 16 },
  showcaseCard: { width: 144, marginRight: 16 },
  widerTrendingCard: { width: 210 },
  showcaseImage: { width: 144, height: 144, borderRadius: 10, marginBottom: 10 },
  widerTrendingImage: { width: 210, height: 130, borderRadius: 10 },
  showcaseTitle: { color: '#fff', fontSize: 13, fontWeight: '600', marginBottom: 2, letterSpacing: -0.1 },
  showcaseArtist: { color: '#929296', fontSize: 12, fontWeight: '500', marginBottom: 3 },
  showcaseDesc: { color: '#636366', fontSize: 11, lineHeight: 15 }
});