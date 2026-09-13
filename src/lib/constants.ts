import { MusicTrack, StickerPack } from "./types";

export const APP_NAME = "VibeChat";
export const APP_TAGLINE = "Feel the Connection. Real-Time Chat, Stories & Social Commerce.";

export const ROYALTY_FREE_TRACKS: MusicTrack[] = [
  {
    id: "track-1",
    title: "Midnight Tokyo Lo-Fi",
    artist: "Aura Beats",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
    duration: 30,
    genre: "Chillhop / Lo-Fi"
  },
  {
    id: "track-2",
    title: "Cyber Sunset Synth",
    artist: "Neon Dreamer",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=electronic-future-beats-117997.mp3",
    duration: 32,
    genre: "Synthwave"
  },
  {
    id: "track-3",
    title: "Coffee & Raindrops",
    artist: "Komorebi",
    coverUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3",
    duration: 28,
    genre: "Ambient Acoustic"
  },
  {
    id: "track-4",
    title: "Summer Groove Vibe",
    artist: "Solaris",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630d7a3f.mp3?filename=groove-ambient-11005.mp3",
    duration: 35,
    genre: "Deep House"
  }
];

export const DEMO_STICKER_PACKS: StickerPack[] = [
  {
    id: "pack-vibe-emojis",
    name: "Vibe Reactions",
    category: "Vibes",
    thumbnail: "🔥",
    stickers: [
      { id: "st-1", name: "Fire", imageUrl: "🔥", emojiShortcut: ":fire:" },
      { id: "st-2", name: "Rocket", imageUrl: "🚀", emojiShortcut: ":rocket:" },
      { id: "st-3", name: "Heart Eyes", imageUrl: "😍", emojiShortcut: ":hearteyes:" },
      { id: "st-4", name: "Party Popper", imageUrl: "🎉", emojiShortcut: ":party:" },
      { id: "st-5", name: "Cool Sunglasses", imageUrl: "😎", emojiShortcut: ":cool:" },
      { id: "st-6", name: "Mind Blown", imageUrl: "🤯", emojiShortcut: ":shock:" },
      { id: "st-7", name: "Money Face", imageUrl: "🤑", emojiShortcut: ":rich:" },
      { id: "st-8", name: "Crown", imageUrl: "👑", emojiShortcut: ":crown:" },
      { id: "st-9", name: "Diamond", imageUrl: "💎", emojiShortcut: ":gem:" },
      { id: "st-10", name: "100", imageUrl: "💯", emojiShortcut: ":100:" },
      { id: "st-11", name: "Sparkles", imageUrl: "✨", emojiShortcut: ":sparkles:" },
      { id: "st-12", name: "High Five", imageUrl: "🙌", emojiShortcut: ":highfive:" },
    ]
  },
  {
    id: "pack-dev-moods",
    name: "Dev & Startup Vibes",
    category: "Tech",
    thumbnail: "⚡",
    stickers: [
      { id: "dev-1", name: "Shipped It", imageUrl: "🚢", emojiShortcut: ":ship:" },
      { id: "dev-2", name: "Bug Squashed", imageUrl: "🐛", emojiShortcut: ":bug:" },
      { id: "dev-3", name: "Coffee Fueled", imageUrl: "☕", emojiShortcut: ":coffee:" },
      { id: "dev-4", name: "Lighting Fast", imageUrl: "⚡", emojiShortcut: ":fast:" },
      { id: "dev-5", name: "Brainstorming", imageUrl: "💡", emojiShortcut: ":idea:" },
      { id: "dev-6", name: "Target Hit", imageUrl: "🎯", emojiShortcut: ":bullseye:" },
    ]
  }
];

export const STATUS_GRADIENTS = [
  "from-indigo-600 via-purple-600 to-pink-600",
  "from-cyan-500 via-blue-600 to-indigo-700",
  "from-emerald-500 via-teal-600 to-cyan-700",
  "from-amber-500 via-orange-600 to-rose-600",
  "from-fuchsia-600 via-rose-600 to-amber-600",
  "from-slate-900 via-purple-950 to-indigo-950",
];
