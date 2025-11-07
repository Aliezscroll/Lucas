// 播放器状态
let isPlaying = false;
let currentSong = null;
let currentTime = 0;
let totalTime = 225; // 3:45 in seconds

// DOM 元素
const playPauseBtn = document.querySelector('.play-pause-btn');
const progressFill = document.querySelector('.progress-fill');
const progressTrack = document.querySelector('.progress-track');
const timeCurrent = document.querySelector('.time-current');
const timeTotal = document.querySelector('.time-total');
const musicCards = document.querySelectorAll('.music-card');
const playButtons = document.querySelectorAll('.play-btn');
const volumeSlider = document.querySelector('.volume-slider');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    updateTimeDisplay();
    setupEventListeners();
});

// 设置事件监听器
function setupEventListeners() {
    // 播放/暂停按钮
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // 音乐卡片点击
    musicCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.play-btn')) {
                const songId = card.dataset.song;
                playSong(songId, card);
            }
        });
    });
    
    // 播放按钮
    playButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.music-card');
            const songId = card.dataset.song;
            playSong(songId, card);
        });
    });
    
    // 进度条
    progressTrack.addEventListener('click', (e) => {
        const rect = progressTrack.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        seekTo(percent);
    });
    
    // 音量控制
    volumeSlider.addEventListener('input', (e) => {
        updateVolume(e.target.value);
    });
    
    // 上一首/下一首
    document.querySelectorAll('.player-controls .prev-btn, .player-controls .next-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('prev-btn')) {
                playPrevious();
            } else {
                playNext();
            }
        });
    });
    
    // 随机播放/重复
    document.querySelectorAll('.shuffle-btn, .repeat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            if (btn.classList.contains('active')) {
                btn.style.color = 'var(--green)';
            } else {
                btn.style.color = '';
            }
        });
    });
    
    // 喜欢按钮
    document.querySelector('.like-btn').addEventListener('click', (e) => {
        const icon = e.target.closest('.like-btn').querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = 'var(--green)';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '';
        }
    });
}

// 播放/暂停切换
function togglePlayPause() {
    isPlaying = !isPlaying;
    const icon = playPauseBtn.querySelector('i');
    
    if (isPlaying) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        startProgress();
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        stopProgress();
    }
}

// 播放歌曲
function playSong(songId, card) {
    currentSong = songId;
    isPlaying = true;
    
    // 更新播放按钮
    const icon = playPauseBtn.querySelector('i');
    icon.classList.remove('fa-play');
    icon.classList.add('fa-pause');
    
    // 更新当前播放信息
    const title = card.querySelector('.card-title').textContent;
    const artist = card.querySelector('.card-artist').textContent;
    const img = card.querySelector('.card-image img').src;
    
    updateNowPlaying(title, artist, img);
    
    // 重置进度
    currentTime = 0;
    updateProgress();
    startProgress();
    
    // 显示通知
    showNotification(`正在播放: ${title}`);
}

// 更新当前播放信息
function updateNowPlaying(title, artist, img) {
    document.querySelector('.track-name').textContent = title;
    document.querySelector('.track-artist').textContent = artist;
    document.querySelector('.now-playing-img').src = img;
}

// 更新进度
function updateProgress() {
    const percent = (currentTime / totalTime) * 100;
    progressFill.style.width = percent + '%';
    const handle = document.querySelector('.progress-handle');
    if (handle) {
        handle.style.left = percent + '%';
    }
    updateTimeDisplay();
}

// 更新时间显示
function updateTimeDisplay() {
    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    const totalMinutes = Math.floor(totalTime / 60);
    const totalSeconds = Math.floor(totalTime % 60);
    
    timeCurrent.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
    timeTotal.textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
}

// 开始进度
function startProgress() {
    if (window.progressInterval) {
        clearInterval(window.progressInterval);
    }
    
    window.progressInterval = setInterval(() => {
        if (isPlaying) {
            currentTime += 1;
            if (currentTime >= totalTime) {
                currentTime = totalTime;
                isPlaying = false;
                const icon = playPauseBtn.querySelector('i');
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                clearInterval(window.progressInterval);
            }
            updateProgress();
        }
    }, 1000);
}

// 停止进度
function stopProgress() {
    if (window.progressInterval) {
        clearInterval(window.progressInterval);
    }
}

// 跳转到指定位置
function seekTo(percent) {
    currentTime = percent * totalTime;
    updateProgress();
}

// 更新音量
function updateVolume(value) {
    // 这里可以添加实际的音量控制逻辑
    console.log('Volume:', value);
}

// 上一首
function playPrevious() {
    if (!currentSong) return;
    
    const currentIndex = Array.from(musicCards).findIndex(card => card.dataset.song === currentSong);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : musicCards.length - 1;
    const prevCard = musicCards[prevIndex];
    
    playSong(prevCard.dataset.song, prevCard);
}

// 下一首
function playNext() {
    if (!currentSong) return;
    
    const currentIndex = Array.from(musicCards).findIndex(card => card.dataset.song === currentSong);
    const nextIndex = (currentIndex + 1) % musicCards.length;
    const nextCard = musicCards[nextIndex];
    
    playSong(nextCard.dataset.song, nextCard);
}

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 120px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-secondary);
        color: var(--text-primary);
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        z-index: 10000;
        animation: slideUp 0.3s ease-out;
        font-size: 14px;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// 添加 CSS 动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 导航按钮功能
document.querySelectorAll('.top-bar .nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        showNotification('导航功能');
    });
});

// 搜索功能
document.querySelector('.sidebar-nav .nav-item:nth-child(2)').addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('搜索功能开发中...');
});

// 音乐库功能
document.querySelector('.sidebar-nav .nav-item:nth-child(3)').addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('音乐库功能开发中...');
});

