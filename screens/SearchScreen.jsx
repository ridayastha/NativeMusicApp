import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { SEARCH_CATEGORIES } from '../constants/searchCategories';
import { RECENT_GRID, CAROUSEL_SECTIONS } from '../constants/mockTracks';
import { AudioContext } from '../context/AudioContext';

export default function SearchScreen() {
  const { playTrack } = useContext(AudioContext);
  const [searchQuery, setSearchQuery] = useState('');

  // Combine our dummy datasets into a single searchable array pool
  const allTracks = [
    ...RECENT_GRID,
    ...CAROUSEL_SECTIONS[0].data,
    ...CAROUSEL_SECTIONS[1].data,
  ];

  // Filter track items against current search string text
  const filteredTracks = allTracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Search</Text>

      {/* --- Search Input Box Field --- */}
      <View style={styles.searchBoxWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.inputField}
          placeholder="What do you want to listen to?"
          placeholderTextColor="#777"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {searchQuery.trim().length === 0 ? (
        /* --- Default Browse Category Cards --- */
        <ScrollView contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Browse all</Text>
          <View style={styles.gridContainer}>
            {SEARCH_CATEGORIES.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={[styles.categoryCard, { backgroundColor: category.color }]}
              >
                <Text style={styles.cardText}>{category.title}</Text>
                <Image source={{ uri: category.image }} style={styles.cardImage} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        /* --- Live Search Result Rows --- */
        <FlatList
          data={filteredTracks}
          keyExtractor={(item, index) => item.id.toString() + index}
          contentContainerStyle={styles.resultListPadding}
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Text style={styles.emptyText}>No results found for "{searchQuery}"</Text>
              <Text style={styles.emptySubtext}>Check spelling or try a different term.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.trackRow} onPress={() => playTrack(item)}>
              <Image source={{ uri: item.cover }} style={styles.thumbnail} />
              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.trackArtist}>{item.artist}</Text>
              </View>
              <Text style={styles.moreIcon}>•••</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 60 },
  pageTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', paddingHorizontal: 16, marginBottom: 16 },
  
  searchBoxWrapper: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    marginHorizontal: 16, 
    borderRadius: 6, 
    alignItems: 'center', 
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 20
  },
  searchIcon: { fontSize: 16, marginRight: 8, color: '#000' },
  inputField: { flex: 1, color: '#000', fontSize: 14, fontWeight: '600' },
  
  scrollPadding: { paddingHorizontal: 16, paddingBottom: 120 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard: { 
    width: '48%', 
    height: 100, 
    borderRadius: 4, 
    padding: 12, 
    marginBottom: 16, 
    position: 'relative', 
    overflow: 'hidden' 
  },
  cardText: { color: '#fff', fontSize: 15, fontWeight: 'bold', width: '70%' },
  cardImage: { 
    width: 60, 
    height: 60, 
    position: 'absolute', 
    bottom: -10, 
    right: -10, 
    borderRadius: 4,
    transform: [{ rotate: '25deg' }] 
  },

  // Search Results layout styles
  resultListPadding: { paddingHorizontal: 16, paddingBottom: 120 },
  trackRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  thumbnail: { width: 48, height: 48, borderRadius: 4 },
  trackInfo: { flex: 1, marginLeft: 12 },
  trackTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  trackArtist: { color: '#b3b3b3', fontSize: 13, marginTop: 2 },
  moreIcon: { color: '#b3b3b3', fontSize: 14, paddingHorizontal: 8 },

  emptyWrapper: { alignItems: 'center', marginTop: 40, paddingHorizontal: 24 },
  emptyText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  emptySubtext: { color: '#b3b3b3', fontSize: 13, marginTop: 6, textAlign: 'center' }
});