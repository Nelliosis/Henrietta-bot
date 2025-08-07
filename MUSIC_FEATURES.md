# Henrietta Bot - Music Features

## Overview

Henrietta Bot has been refactored to use `youtube-dl-exec` for robust music playback functionality. This provides better audio quality and more reliable YouTube music streaming.

## Features

### 🎵 Music Commands (Slash Commands)

- `/play song <query>` - Play a song or add it to the queue
- `/play skip` - Skip the current song
- `/play stop` - Stop playing and leave voice channel
- `/play pause` - Pause the current song
- `/play resume` - Resume the paused song
- `/play queue` - Show the current queue
- `/play clear` - Clear the entire queue

### 🎶 Music Features

- **High-quality audio** using youtube-dl-exec
- **Queue system** for multiple songs
- **YouTube support** for URLs and search queries
- **Automatic cleanup** of temporary audio files
- **Error handling** with fallback to next song
- **Voice channel management** with proper permissions

### 🛠️ Technical Implementation

- Uses `youtube-dl-exec` for downloading audio
- Creates temporary files in system temp directory
- Implements proper audio resource management
- Handles Discord voice connections and audio players
- Supports both MP3 audio format for optimal quality

## Usage Examples

### Playing Music

```
/play song Never Gonna Give You Up
/play song https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### Managing Playback

```
/play pause
/play resume
/play skip
/play stop
```

### Queue Management

```
/play queue
/play clear
```

## Installation Requirements

```bash
npm install youtube-dl-exec @discordjs/voice discord.js
```

## Backwards Compatibility

The bot still supports prefix commands (`!!play`, `!!skip`, etc.) but they redirect users to use the new slash commands for better functionality.

## Error Handling

- Automatic retry on song failure
- Cleanup of temporary files
- Graceful handling of voice channel disconnections
- User-friendly error messages

## Performance

- Efficient memory usage with temporary file cleanup
- Optimized audio streaming
- Minimal latency for music playback
- Proper resource management

---

*Refactored based on ThomasAK/DiscordMusicBot reference implementation*
