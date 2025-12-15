// 媒体数据（包含音频和视频）
const mediaList = [
    {
        title: "歌曲1",
        artist: "艺术家1",
        src: "mp3/music0.mp3",
        cover: "img/record0.jpg",
        type: "audio"
    },
    {
        title: "歌曲2",
        artist: "艺术家2",
        src: "mp3/music1.mp3",
        cover: "img/record1.jpg",
        type: "audio"
    },
    {
        title: "歌曲3",
        artist: "艺术家3",
        src: "mp3/music2.mp3",
        cover: "img/record2.jpg",
        type: "audio"
    },
    {
        title: "歌曲4",
        artist: "艺术家4",
        src: "mp3/music3.mp3",
        cover: "img/record3.jpg",
        type: "audio"
    },
    {
        title: "视频1",
        artist: "创作者1",
        src: "mp4/video0.mp4",
        cover: "img/MV.png",
        type: "video"
    },
    {
        title: "视频2",
        artist: "创作者2",
        src: "mp4/video1.mp4",
        cover: "img/MV.png",
        type: "video"
    },
    {
        title: "视频3",
        artist: "创作者3",
        src: "mp4/video2.mp4",
        cover: "img/MV.png",
        type: "video"
    },
    {
        title: "视频4",
        artist: "创作者4",
        src: "mp4/video3.mp4",
        cover: "img/MV.png",
        type: "video"
    }
];

// DOM元素
const audio = document.getElementById('audio');
const video = document.getElementById('video');
const albumImg = document.getElementById('albumImg');
const audioCover = document.getElementById('audioCover');
const mediaTitle = document.getElementById('mediaTitle');
const artistName = document.getElementById('artistName');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const progress = document.getElementById('progress');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeBtn = document.getElementById('volumeBtn');
const volumeIcon = document.getElementById('volumeIcon');
const volumeSlider = document.getElementById('volumeSlider');
const modeBtn = document.getElementById('modeBtn');
const songCount = document.getElementById('songCount');
const nowPlayingCover = document.getElementById('nowPlayingCover');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingArtist = document.getElementById('nowPlayingArtist');
const playlistItems = document.getElementById('playlistItems');

// 当前媒体元素引用
let currentMediaElement = audio;

// 播放器状态
let currentSongIndex = 0;
let isPlaying = false;
let isMuted = false;
let playMode = 1; // 1: 循环播放, 2: 单曲循环, 3: 随机播放
let previousVolume = 0.7;

// 初始化播放器
function initPlayer() {
    loadMedia(currentSongIndex);
    createPlaylist();
    updatePlaylistActiveItem();
    songCount.textContent = mediaList.length;
}

// 加载媒体（音频或视频）
function loadMedia(index) {
    const media = mediaList[index];
    
    // 停止当前播放的媒体
    if (isPlaying) {
        pauseMedia();
    }
    
    // 更新媒体信息
    mediaTitle.textContent = media.title;
    artistName.textContent = media.artist;
    nowPlayingTitle.textContent = media.title;
    nowPlayingArtist.textContent = media.artist;
    nowPlayingCover.src = media.cover;
    albumImg.src = media.cover;
    
    // 根据媒体类型切换播放器
    if (media.type === 'audio') {
        // 显示音频封面，隐藏视频
        audioCover.style.display = 'block';
        video.style.display = 'none';
        
        // 加载音频
        audio.src = media.src;
        currentMediaElement = audio;
    } else {
        // 显示视频，隐藏音频封面
        audioCover.style.display = 'none';
        video.style.display = 'block';
        
        // 加载视频
        video.src = media.src;
        currentMediaElement = video;
    }
    
    // 更新音量
    currentMediaElement.volume = isMuted ? 0 : volumeSlider.value;
}

// 创建播放列表
function createPlaylist() {
    playlistItems.innerHTML = '';
    mediaList.forEach((media, index) => {
        const tr = document.createElement('tr');
        // 根据媒体类型添加不同的标识
        const mediaTypeIcon = `<span class="media-type ${media.type}"></span>`;
        tr.innerHTML = `
            <td class="col-index">${index + 1}</td>
            <td class="col-title">${mediaTypeIcon}${media.title}</td>
            <td class="col-artist">${media.artist}</td>
            <td class="col-time">-</td>
        `;
        tr.addEventListener('click', () => {
            currentSongIndex = index;
            loadMedia(currentSongIndex);
            playMedia();
            updatePlaylistActiveItem();
        });
        playlistItems.appendChild(tr);
    });
}

// 更新播放列表激活项
function updatePlaylistActiveItem() {
    const items = playlistItems.querySelectorAll('tr');
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentSongIndex);
    });
}

// 播放媒体
function playMedia() {
    isPlaying = true;
    playIcon.src = 'img/暂停.png';
    playBtn.title = '暂停';
    currentMediaElement.play();
}

// 暂停媒体
function pauseMedia() {
    isPlaying = false;
    playIcon.src = 'img/继续播放.png';
    playBtn.title = '播放';
    currentMediaElement.pause();
}

// 上一曲
function prevSong() {
    if (playMode === 3) {
        // 随机播放
        currentSongIndex = Math.floor(Math.random() * mediaList.length);
    } else {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = mediaList.length - 1;
        }
    }
    loadMedia(currentSongIndex);
    playMedia();
    updatePlaylistActiveItem();
}

// 下一曲
function nextSong() {
    if (playMode === 3) {
        // 随机播放
        currentSongIndex = Math.floor(Math.random() * mediaList.length);
    } else {
        currentSongIndex++;
        if (currentSongIndex > mediaList.length - 1) {
            currentSongIndex = 0;
        }
    }
    loadMedia(currentSongIndex);
    playMedia();
    updatePlaylistActiveItem();
}

// 更新进度条
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (duration && !isNaN(duration)) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        
        // 更新时间显示
        currentTimeEl.textContent = transTime(currentTime);
        durationEl.textContent = transTime(duration);
        
        // 更新播放列表中的时长
        updatePlaylistItemTime(currentSongIndex, duration);
    }
}

// 更新播放列表中的时长
function updatePlaylistItemTime(index, duration) {
    const items = playlistItems.querySelectorAll('tr');
    if (items[index]) {
        const timeTd = items[index].querySelector('.col-time');
        if (timeTd && timeTd.textContent === '-') {
            timeTd.textContent = transTime(duration);
        }
    }
}

// 设置进度条
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = currentMediaElement.duration;
    if (duration && !isNaN(duration)) {
        currentMediaElement.currentTime = (clickX / width) * duration;
    }
}

// 切换播放/暂停
playBtn.addEventListener('click', () => {
    isPlaying ? pauseMedia() : playMedia();
});

// 上一曲按钮
prevBtn.addEventListener('click', prevSong);

// 下一曲按钮
nextBtn.addEventListener('click', nextSong);

// 进度条点击
progressBar.addEventListener('click', setProgress);

// 监听播放进度
audio.addEventListener('timeupdate', updateProgress);
video.addEventListener('timeupdate', updateProgress);

// 监听媒体加载完成事件
audio.addEventListener('loadedmetadata', (e) => updateProgress(e));
video.addEventListener('loadedmetadata', (e) => updateProgress(e));

// 媒体播放结束
audio.addEventListener('ended', handleMediaEnded);
video.addEventListener('ended', handleMediaEnded);

// 处理媒体播放结束
function handleMediaEnded() {
    if (playMode === 2) {
        // 单曲循环
        currentMediaElement.currentTime = 0;
        playMedia();
    } else {
        nextSong();
    }
}

// 音量控制
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value;
    audio.volume = volume;
    video.volume = volume;
    if (volume === 0) {
        isMuted = true;
        volumeIcon.src = 'img/静音.png';
    } else {
        isMuted = false;
        volumeIcon.src = 'img/音量.png';
    }
});

// 静音切换
volumeBtn.addEventListener('click', () => {
    if (isMuted) {
        // 取消静音
        audio.volume = previousVolume;
        video.volume = previousVolume;
        volumeSlider.value = previousVolume;
        isMuted = false;
        volumeIcon.src = 'img/音量.png';
    } else {
        // 静音
        previousVolume = audio.volume;
        audio.volume = 0;
        video.volume = 0;
        volumeSlider.value = 0;
        isMuted = true;
        volumeIcon.src = 'img/静音.png';
    }
});

// 播放模式切换
modeBtn.addEventListener('click', () => {
    playMode++;
    if (playMode > 3) {
        playMode = 1;
    }
    
    // 更新播放模式图标
    const modeImg = modeBtn.querySelector('img');
    switch(playMode) {
        case 1:
            modeImg.src = 'img/mode1.png';
            modeBtn.title = '循环播放';
            break;
        case 2:
            modeImg.src = 'img/mode2.png';
            modeBtn.title = '单曲循环';
            break;
        case 3:
            modeImg.src = 'img/mode3.png';
            modeBtn.title = '随机播放';
            break;
    }
});

// 音频播放时间换算
function transTime(value) {
    var time = '';
    var h = parseInt(value / 3600);
    value %= 3600;
    var m = parseInt(value / 60);
    var s = parseInt(value % 60);
    if (h > 0) {
        time = formatTime(h + ':' + m + ':' + s);
    } else {
        time = formatTime(m + ':' + s);
    }
    return time;
}

// 格式化时间显示，补零对齐
function formatTime(value) {
    var time = '';
    var s = value.split(':');
    var i = 0;
    for (; i < s.length - 1; i++) {
        time += s[i].length == 1 ? '0' + s[i] : s[i];
        time += ':';
    }
    time += s[i].length == 1 ? '0' + s[i] : s[i];
    return time;
}

// 初始化播放器
document.addEventListener('DOMContentLoaded', initPlayer);