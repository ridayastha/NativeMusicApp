export const CATEGORIES = ["Music", "Podcasts"];

export const RECENT_GRID = [
  {
    id: 'rg1',
    title: 'Chill Lofi Beats',
    category: 'Music', // Added tag
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    album: 'Lofi Study Sessions'
  },
  {
    id: 'rg2',
    title: 'Synthwave Sunset',
    category: 'Music', // Added tag
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    album: 'Neon Horizons'
  }
];

export const CAROUSEL_SECTIONS = [
  {
    title: 'Trending Right Now',
    data: [
      {
        id: 'trend1',
        title: 'Neon Overdrive',
        artist: 'Hyperion',
        category: 'Music',
        cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        desc: '#1 globally this week • High-energy synth racing rhythms.',
        album: 'Velocity'
      },
      {
        id: 'trend2',
        title: 'The Tech Tech Show',
        artist: 'Code Cast',
        category: 'Podcasts', // Tagged as Podcast
        cover: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        desc: 'Episode 42: The Future of Python and AI Architectures.',
        album: 'Tech Tech Show'
      },
      {
        id: 'trend3',
        title: 'Aftershock',
        artist: 'Glitch Matrix',
        category: 'Music',
        cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        desc: 'Viral hit • Cyber-industrial electronic soundscapes.',
        album: 'Simulation Collapse'
      }
    ]
  },
  {
    title: 'Recommended For You',
    data: [
      {
        id: 'mfy1',
        title: 'Cyberpunk Drive',
        artist: 'Retrowave Engine',
        category: 'Music',
        cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        desc: 'Futuristic highway driving tracks for focus.',
        album: 'Grid Runner'
      },
      {
        id: 'mfy2',
        title: 'Developer Mindset',
        artist: 'Growth Lab',
        category: 'Podcasts', // Tagged as Podcast
        cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        desc: 'Dealing with imposter syndrome and burnout in software engineering.',
        album: 'Growth Lab Daily'
      }
    ]
  }
];

// Append this to the bottom of constants/mockTracks.js
export const LIBRARY_ITEMS = [
  {
    id: 'lib1',
    title: 'Your Liked Songs',
    subtitle: 'Playlist • 142 songs',
    category: 'Music',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    isPinned: true
  },
  {
    id: 'lib2',
    title: 'Deep House Flow',
    subtitle: 'Playlist • By Hridaya',
    category: 'Music',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
    isPinned: false
  },
  {
    id: 'lib3',
    title: 'The Tech Tech Show',
    subtitle: 'Podcast • 8 downloaded episodes',
    category: 'Podcasts',
    cover: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400',
    isPinned: true
  },
  {
    id: 'lib4',
    title: 'Developer Mindset',
    subtitle: 'Podcast • Updated yesterday',
    category: 'Podcasts',
    cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
    isPinned: false
  },
  {
    id: 'lib5',
    title: 'Chill Lofi Workout',
    subtitle: 'Playlist • 45 songs',
    category: 'Music',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
    isPinned: false
  }
];