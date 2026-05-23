import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TouchableWithoutFeedback, Platform } from 'react-native';
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
          {/* Track Cover Artwork */}
          <Image 
            source={{ uri: currentTrack.cover || currentTrack.cover_image }} 
            style={styles.dockCover} 
          />
          
          {/* Meta Information Metadata Stack */}
          <View style={styles.dockText}>
            <Text style={styles.dockTitle} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.dockArtist} numberOfLines={1}>
              {currentTrack.artist || "Unknown Artist"}
            </Text>
          </View>
          
          {/* Playback Trigger Control */}
          <TouchableOpacity 
            onPress={togglePlayPause} 
            style={styles.playBtn}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={22} 
              color={isPlaying ? "#1DB954" : "#FFFFFF"} // Turns green when active for telemetry feel
            />
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>

      {/* Full Screen Interactive Sheet Controller */}
      <FullPlayerModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  dock: {
    flexDirection: 'row',
    backgroundColor: 'rgba(22, 22, 26, 0.92)', // Translucent glassmorphism base
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 96 : 72, // Suspended floating placement relative to App.js tabbar height
    left: 12,
    right: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)', // High contrast ultra-thin perimeter ring
    zIndex: 999,
    
    // Smooth telemetry shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
  dockCover: { 
    width: 44, 
    height: 44, 
    borderRadius: 8,
    backgroundColor: '#1C1C1E'
  },
  dockText: { 
    flex: 1, 
    marginLeft: 14,
    marginRight: 8
  },
  dockTitle: { 
    color: '#FFFFFF', 
    fontWeight: '700', 
    fontSize: 14,
    letterSpacing: -0.2
  },
  dockArtist: { 
    color: '#8E8E93', // iOS style muted gray
    fontSize: 12, 
    marginTop: 2,
    fontWeight: '500'
  },
  playBtn: { 
    width: 42, 
    height: 42, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)', // Interactive pad surface
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
});