// 1. Get all necessary elements from the HTML
const video = document.getElementById('pixelVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const muteUnmuteBtn = document.getElementById('muteUnmuteBtn');
const volumeBar = document.getElementById('volumeBar');

// --- Utility Functions ---

// Formats seconds into M:SS (e.g., 3:05)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// --- Event Listeners and Logic ---

// 2. Play/Pause Logic
playPauseBtn.addEventListener('click', () => {
    if (video.paused || video.ended) {
        video.play();
        playPauseBtn.textContent = '⏸'; // Change button to Pause
    } else {
        video.pause();
        playPauseBtn.textContent = '▶'; // Change button to Play
    }
});

// 3. Update Progress Bar and Time Display
video.addEventListener('loadedmetadata', () => {
    // Set the max value of the progress bar to the total video duration
    progressBar.max = video.duration;
    // Display the total duration
    durationDisplay.textContent = formatTime(video.duration);
});

video.addEventListener('timeupdate', () => {
    // Update the progress bar value
    progressBar.value = video.currentTime;
    // Update the current time display
    currentTimeDisplay.textContent = formatTime(video.currentTime);
});

// 4. Seeking/Scrubbing Logic (User drags the progress bar)
progressBar.addEventListener('input', () => {
    // Jump the video to the new time set by the user
    video.currentTime = progressBar.value;
});

// 5. Volume and Mute Logic
muteUnmuteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    // Synchronize the mute button icon and the volume bar position
    if (video.muted) {
        muteUnmuteBtn.textContent = '🔇';
        volumeBar.value = 0;
    } else {
        muteUnmuteBtn.textContent = '🔊';
        // If unmuted, restore the volume bar to the video's current volume (or a default if it was 0)
        volumeBar.value = video.volume;
    }
});

volumeBar.addEventListener('input', () => {
    // Set video volume based on the volume bar position
    video.volume = volumeBar.value;

    // Update the mute button icon based on the new volume
    if (video.volume == 0) {
        muteUnmuteBtn.textContent = '🔇';
        video.muted = true;
    } else {
        muteUnmuteBtn.textContent = '🔊';
        video.muted = false;
    }
});

// 6. Handle Video End
video.addEventListener('ended', () => {
    // Reset the play button icon when the video finishes
    playPauseBtn.textContent = '▶';
    // Optionally jump back to the start
    video.currentTime = 0;
});