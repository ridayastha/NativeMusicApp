import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { AudioContext } from '../context/AudioContext';
import TrackList from '../components/TrackList';
import AudioPlayer from '../components/AudioPlayer';
import { MOCK_TRACKS } from '../constants/mockTracks';

export default function HomeScreen() {
  const { currentTrack, playTrack, setTracksList } = useContext(AudioContext);

  // Load your tracks into the playback engine's queue on boot
  useEffect(() => {
    if (setTracksList) {
      setTracksList(MOCK_TRACKS);
    }
  }, []);

  const handleSelectTrack = (track) => {
    // Normalize properties inline so .cover works everywhere!
    const normalizedTrack = {
      ...track,
      cover: track.cover_image, // Maps cover_image over to cover safely
    };
    playTrack(normalizedTrack);
  };

  return (
    <View style={styles.container}>
      {/* Scrollable List of Songs */}
      <TrackList 
        onSelectTrack={handleSelectTrack} 
        currentTrack={currentTrack} 
      />

      {/* Floating Global Audio Bar */}
      <AudioPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Matches your dark theme
  },
});