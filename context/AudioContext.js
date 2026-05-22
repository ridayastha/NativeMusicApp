import React, { createContext, useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState(null);
  
  // Keep a reference to a single Sound instance across the entire application lifecycle
  const soundRef = useRef(null);

  // Clean up sound instance when the component unmounts
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Sync state update variations with live instance playback streams
  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPlaybackStatus(status);
      setIsPlaying(status.isPlaying);
      
      // If the track finishes playing, automatically reset state configurations
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    } else {
      if (status.error) {
        console.error(`Playback Error Encountered: ${status.error}`);
      }
    }
  };

  const playTrack = async (track) => {
    try {
      if (!track || !track.url) {
        console.warn("⚠️ Cannot play track: Missing audio URL asset reference.", track);
        return;
      }

      // --- CRITICAL FIX: If a sound is already loaded/playing, stop and unload it first ---
      if (soundRef.current !== null) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Update current playing target metadata state layers
      setCurrentTrack(track);
      setIsPlaying(true);

      // Create, configure, and initialize the new singular sound target
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      // Store the single instance into our reference tracker
      soundRef.current = sound;

    } catch (error) {
      console.error("Error running playTrack loop instance within AudioContext:", error);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;

    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling track execution playback hooks:", error);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playbackStatus,
        playTrack,
        togglePlayPause,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};