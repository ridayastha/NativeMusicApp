import React, { useContext } from 'react';
import { StyleSheet, Text, View, Modal, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AudioContext } from '../context/AudioContext';

export default function FullPlayerModal({ visible, onClose }) {
  const { 
    currentTrack, isPlaying, playbackStatus, isShuffleOn, repeatMode,
    togglePlayPause, seekToPosition, handleNext, handlePrevious, toggleShuffle, toggleRepeatMode 
  } = useContext(AudioContext);

  if (!currentTrack) return null;

  function formatTime(millis) {
    if (!millis) return "0:00";
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  const position = playbackStatus?.positionMillis || 0;
  const duration = playbackStatus?.durationMillis || 1;

  // Resolve dynamic active display properties for repeat layout layers
  const getRepeatIconColor = () => repeatMode > 0 ? "#1DB954" : "#b3b3b3";
  const getRepeatIconName = () => repeatMode === 2 ? "repeat-once" : "repeat";

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        
        {/* Top Header Controls Block */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="chevron-down" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{currentTrack.album || "Now Playing"}</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="dots-horizontal" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Big Cover Artwork Aspect Frame */}
        <View style={styles.coverWrapper}>
          <Image source={{ uri: currentTrack.cover }} style={styles.hugeCover} />
        </View>

        {/* Track Title Metadata Row */}
        <View style={styles.metaRow}>
          <View style={styles.trackDetails}>
            <Text style={styles.trackTitle} numberOfLines={1}>{currentTrack.title}</Text>
            <Text style={styles.trackArtist}>{currentTrack.artist || "Unknown Artist"}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.6}>
            <Ionicons name="heart-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Dynamic Position Progress Track Line */}
        <View style={styles.sliderWrapper}>
          <Slider
            style={styles.progressBar}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#535353"
            thumbTintColor="#fff"
            onSlidingComplete={seekToPosition}
          />
          <View style={styles.timeLabelRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Media Engine Remote Button Control Deck */}
        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={toggleShuffle} activeOpacity={0.7}>
            <MaterialCommunityIcons 
              name="shuffle" 
              size={24} 
              color={isShuffleOn ? "#1DB954" : "#b3b3b3"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handlePrevious} activeOpacity={0.7}>
            <Ionicons name="play-skip-back" size={36} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={togglePlayPause} style={styles.hugePlayBtn} activeOpacity={0.9}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="#000" style={!isPlaying && { marginLeft: 4 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext} activeOpacity={0.7}>
            <Ionicons name="play-skip-forward" size={36} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={toggleRepeatMode} activeOpacity={0.7}>
            <MaterialCommunityIcons 
              name={getRepeatIconName()} 
              size={24} 
              color={getRepeatIconColor()} 
            />
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'space-between', paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  closeBtn: { padding: 4 },
  headerTitle: { color: '#fff', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, maxWidth: '60%' },
  coverWrapper: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: 20 },
  hugeCover: { width: 310, height: 310, borderRadius: 8 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 28, marginBottom: 10 },
  trackDetails: { flex: 1, paddingRight: 10 },
  trackTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  trackArtist: { color: '#b3b3b3', fontSize: 16, marginTop: 4 },
  sliderWrapper: { paddingHorizontal: 16, marginBottom: 20 },
  progressBar: { width: '100%', height: 40 },
  timeLabelRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 },
  timeText: { color: '#b3b3b3', fontSize: 12 },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 32 },
  hugePlayBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
});