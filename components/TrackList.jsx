import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { MOCK_TRACKS } from '../constants/mockTracks';

export default function TrackList({ onSelectTrack, currentTrack }) {
  return (
    <FlatList
      data={MOCK_TRACKS}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listPadding}
      renderItem={({ item }) => {
        const isCurrent = currentTrack && currentTrack.id === item.id;
        return (
          <TouchableOpacity 
            style={[styles.trackRow, isCurrent && styles.activeRow]} 
            onPress={() => onSelectTrack(item)}
          >
            <Image source={{ uri: item.cover_image }} style={styles.thumbnail} />
            <View style={styles.info}>
              <Text style={[styles.title, isCurrent && styles.activeText]}>{item.title}</Text>
              <Text style={styles.artist}>{item.artist}</Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  listPadding: { paddingHorizontal: 16, paddingTop: 12 },
  trackRow: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    alignItems: 'center'
  },
  activeRow: { backgroundColor: '#2e2e2e', borderWidth: 1, borderColor: '#1DB954' },
  thumbnail: { width: 50, height: 50, borderRadius: 6 },
  info: { marginLeft: 12, flex: 1 },
  title: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  activeText: { color: '#1DB954' },
  artist: { color: '#b3b3b3', fontSize: 14, marginTop: 2 }
});