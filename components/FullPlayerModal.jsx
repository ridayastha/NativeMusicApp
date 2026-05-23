import React, { useContext } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Image, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AudioContext } from '../context/AudioContext';

export default function FullPlayerModal({ visible, onClose }) {
  const { 
    currentTrack, 
    isPlaying, 
    isShuffle, 
    isRepeat, 
    togglePlayPause, 
    handleNextTrack, 
    handlePrevTrack,
    setIsShuffle,
    setIsRepeat 
  } = useContext(AudioContext);

  if (!currentTrack) return null;

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onClose} style={styles.headerActionCircle}>
            <Ionicons name="chevron-down-sharp" size={26} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerLabel}>Now Playing</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.artFrameDeck}>
          <Image 
            source={{ uri: currentTrack.cover || currentTrack.cover_image }} 
            style={styles.heroArtworkImage} 
          />
        </View>

        <View style={styles.trackDetailsMetaBlock}>
          <View style={styles.titleTextWrapper}>
            <Text style={styles.trackMainTitle} numberOfLines={1}>{currentTrack.title}</Text>
            <Text style={styles.artistSubLabel} numberOfLines={1}>{currentTrack.artist || "Unknown Creator"}</Text>
          </View>
          <TouchableOpacity style={styles.bookmarkActionIcon}>
            <Ionicons name="heart-outline" size={24} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <View style={styles.progressTimelineContainer}>
          <View style={styles.baseTimelineBar}>
            <View style={[styles.activeProgressFill, { width: '35%' }]} />
          </View>
          <View style={styles.timeValueTimestampRow}>
            <Text style={styles.timeLabel}>1:14</Text>
            <Text style={styles.timeLabel}>3:30</Text>
          </View>
        </View>

        <View style={styles.controlCommandConsolePad}>
          <TouchableOpacity onPress={setIsShuffle} style={styles.utilityActionBtn}>
            <Ionicons 
              name="shuffle-sharp" 
              size={22} 
              color={isShuffle ? "#1DB954" : "#8E8E93"} 
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePrevTrack} style={styles.skipActionBtn}>
            <Ionicons name="play-back-sharp" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={togglePlayPause} 
            style={styles.masterPlaybackCoreHubBtn}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isPlaying ? "pause-sharp" : "play-sharp"} 
              size={30} 
              color="#000" 
              style={{ marginLeft: isPlaying ? 0 : 4 }} 
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNextTrack} style={styles.skipActionBtn}>
            <Ionicons name="play-forward-sharp" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={setIsRepeat} style={styles.utilityActionBtn}>
            <Ionicons 
              name="repeat-sharp" 
              size={22} 
              color={isRepeat ? "#1DB954" : "#8E8E93"} 
            />
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { 
    flex: 1, 
    backgroundColor: '#0B0B0C', 
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 20 : 40
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'android' ? 20 : 10 
  },
  headerActionCircle: { padding: 4 },
  headerLabel: { color: '#E5E5EA', fontSize: 14, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  artFrameDeck: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 32,
    marginVertical: 20
  },
  heroArtworkImage: { 
    width: '100%', 
    aspectRatio: 1, 
    borderRadius: 16, 
    backgroundColor: '#1C1C1E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  trackDetailsMetaBlock: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 32, 
    marginBottom: 20 
  },
  titleTextWrapper: { flex: 1 },
  trackMainTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  artistSubLabel: { color: '#8E8E93', fontSize: 16, marginTop: 4, fontWeight: '500' },
  bookmarkActionIcon: { paddingLeft: 10 },
  progressTimelineContainer: { paddingHorizontal: 32, marginBottom: 30 },
  baseTimelineBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
  activeProgressFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 2 },
  timeValueTimestampRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  timeLabel: { color: '#636366', fontSize: 12, fontWeight: '500' },
  controlCommandConsolePad: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 32,
    marginBottom: 20
  },
  utilityActionBtn: { padding: 10 },
  skipActionBtn: { padding: 10 },
  masterPlaybackCoreHubBtn: { 
    width: 68, 
    height: 68, 
    borderRadius: 34, 
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  }
});