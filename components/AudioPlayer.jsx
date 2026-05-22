import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AudioContext } from '../context/AudioContext';
import FullPlayerModal from './FullPlayerModal';

export default function AudioPlayer() {
  const { currentTrack, isPlaying, togglePlayPause } = useContext(AudioContext);
  const [modalVisible, setModalVisible] = useState(false);

  if (!currentTrack) return null;

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={styles.dock}>
          <Image source={{ uri: currentTrack.cover }} style={styles.dockCover} />
          <View style={styles.dockText}>
            <Text style={styles.dockTitle} numberOfLines={1}>{currentTrack.title}</Text>
            <Text style={styles.dockArtist}>{currentTrack.artist || "Unknown Artist"}</Text>
          </View>
          <TouchableOpacity onPress={togglePlayPause} style={styles.playBtn}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>

      <FullPlayerModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  dock: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1c',
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#282828',
    position: 'absolute',
    bottom: 55, 
    left: 8,
    right: 8,
    borderRadius: 8,
    zIndex: 999
  },
  dockCover: { width: 40, height: 40, borderRadius: 4 },
  dockText: { flex: 1, marginLeft: 12 },
  dockTitle: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  dockArtist: { color: '#b3b3b3', fontSize: 11, marginTop: 1 },
  playBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
});