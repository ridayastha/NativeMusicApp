import React, { createContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { RECENT_GRID } from '../constants/mockTracks'; // Fallback playlist source bank

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [playbackInstance, setPlaybackInstance] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState(RECENT_GRID); // Active track sequence block
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  // Synchronize playback instance removal
  useEffect(() => {
    return () => {
      if (playbackInstance) {
        playbackInstance.unloadAsync();
      }
    };
  }, [playbackInstance]);

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        if (isRepeat) {
          // Restart identical link resource tracking parameters
          handleReplayCurrent();
        } else {
          // Autoplay next index link chain item
          handleNextTrack();
        }
      }
    }
  };

  const playTrack = async (track) => {
    try {
      if (playbackInstance !== null) {
        await playbackInstance.unloadAsync();
        setPlaybackInstance(null);
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      setPlaybackInstance(sound);
      setCurrentTrack(track);
      setIsPlaying(true);
    } catch (error) {
      console.warn("❌ Sound loading sequence runtime fault target:", error);
    }
  };

  const togglePlayPause = async () => {
    if (!playbackInstance) return;
    if (isPlaying) {
      await playbackInstance.pauseAsync();
    } else {
      await playbackInstance.playAsync();
    }
  };

  const handleReplayCurrent = async () => {
    if (playbackInstance) {
      await playbackInstance.setPositionAsync(0);
      await playbackInstance.playAsync();
    }
  };

  const handleNextTrack = () => {
    if (queue.length === 0) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      playTrack(queue[randomIndex]);
      return;
    }

    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    const nextIndex = currentIndex + 1;

    if (nextIndex < queue.length) {
      playTrack(queue[nextIndex]);
    } else {
      // Loop back to index zero start point configuration position
      playTrack(queue[0]);
    }
  };

  const handlePrevTrack = async () => {
    if (queue.length === 0) return;

    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      playTrack(queue[prevIndex]);
    } else {
      // Go back to the final element in the playlist sequence stack
      playTrack(queue[queue.length - 1]);
    }
  };

  return (
    <AudioContext.Provider value={{
      currentTrack,
      isPlaying,
      isShuffle,
      isRepeat,
      setQueue,
      setIsShuffle: () => setIsShuffle(!isShuffle),
      setIsRepeat: () => setIsRepeat(!isRepeat),
      playTrack,
      togglePlayPause,
      handleNextTrack,
      handlePrevTrack
    }}>
      {children}
    </AudioContext.Provider>
  );
};