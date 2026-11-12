/* =====================================================
   A LITTLE UNIVERSE FOR MONI
   app.js
===================================================== */

"use strict";

const CONFIG = {
    lockCodes: ["monu", "moni"],
    friendshipStart: new Date("2025-10-22T17:41:00"),
    backgroundVolume: 0.32
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* =====================================================
   PHOTO ERROR
===================================================== */

function showPhotoError(image) {

    image.style.display = "none";

    const error = image.parentElement.querySelector(".photo-error");

    if (error) {
        error.style.display = "grid";
    }
}


/* =====================================================
   BACKGROUND MUSIC
===================================================== */

const bgMusic = document.getElementById("backgroundMusic");
const bgButton = document.getElementById("musicButton");

bgMusic.volume = CONFIG.backgroundVolume;

function updateBgButton() {

    const playing = !bgMusic.paused && !bgMusic.ended;

    bgButton.classList.toggle("is-muted", !playing);
    bgButton.setAttribute("aria-pressed", String(playing));
    bgButton.setAttribute("aria-label", playing ? "ব্যাকগ্রাউন্ড গান থামাও" : "ব্যাকগ্রাউন্ড গান চালাও");
    bgButton.title = playing ? "ব্যাকগ্রাউন্ড গান থামাও" : "ব্যাকগ্রাউন্ড গান চালাও";
}

function startBgMusic() {

    const attempt = bgMusic.play();

    if (attempt && typeof attempt.then === "function") {
        attempt.then(updateBgButton).catch(updateBgButton);
    } else {
        updateBgButton();
    }
}

function toggleBgMusic() {

    if (bgMusic.paused) {

        if (!player.paused) {
            player.pause();
            updatePlayerUI();
        }

        startBgMusic();

    } else {

        bgMusic.pause();
        updateBgButton();

    }
}

function pauseBgForPlayer() {

    if (!bgMusic.paused) {
        bgMusic.pause();
        updateBgButton();
    }
}


/* =====================================================
   LOCK SCREEN
===================================================== */

const codeInput = document.getElementById("code");

function unlock() {

    const lockScreen = document.getElementById("lockScreen");
    const error = document.getElementById("error");
    const lockCard = document.querySelector(".lock-card");
    const value = codeInput.value.trim().toLowerCase();

    if (CONFIG.lockCodes.includes(value)) {

        error.textContent = "";
        lockScreen.classList.add("unlocked");
        document.body.classList.remove("locked");

        startBgMusic();

        setTimeout(() => sparkBurst(28), 300);

        return;
    }

    error.textContent = value
        ? " মিললো না — যে নামে আমাকে ডাকো, সেটাই ভাবো ✦"
        : "আগে কোডটা লেখো, moni ✦";

    lockCard.classList.remove("shake");

    void lockCard.offsetWidth;

    lockCard.classList.add("shake");

    codeInput.value = "";
    codeInput.focus();
}

codeInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        event.preventDefault();
        unlock();
    }
});

codeInput.addEventListener("input", () => {

    if (CONFIG.lockCodes.includes(codeInput.value.trim().toLowerCase())) {
        unlock();
    }
});


/* =====================================================
   PHOTO SLIDER
===================================================== */

let currentSlide = 0;

const sliderEl = document.getElementById("slider");
const slidesEl = document.getElementById("slides");
const slideEls = document.querySelectorAll(".slide");
const dotsEl = document.getElementById("dots");
const totalSlides = slideEls.length;

for (let index = 0; index < totalSlides; index++) {

    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", "ছবি " + (index + 1) + "-এ যাও");

    dot.addEventListener("click", () => {
        currentSlide = index;
        updateSlider();
    });

    dotsEl.appendChild(dot);
}

function updateSlider() {

    slidesEl.style.transform = "translateX(-" + (currentSlide * 100) + "%)";

    dotsEl.querySelectorAll(".dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentSlide);
    });
}

function nextSlide() {

    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function previousSlide() {

    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

updateSlider();

let sliderPaused = false;
let sliderResumeTimer;

setInterval(() => {

    if (!sliderPaused && !document.hidden) {
        nextSlide();
    }

}, 6000);

sliderEl.addEventListener("mouseenter", () => { sliderPaused = true; });
sliderEl.addEventListener("mouseleave", () => { sliderPaused = false; });
sliderEl.addEventListener("focusin", () => { sliderPaused = true; });
sliderEl.addEventListener("focusout", () => { sliderPaused = false; });

sliderEl.addEventListener("touchstart", () => { sliderPaused = true; }, { passive: true });

sliderEl.addEventListener("touchend", () => {

    clearTimeout(sliderResumeTimer);

    sliderResumeTimer = setTimeout(() => {
        sliderPaused = false;
    }, 6000);

}, { passive: true });

sliderEl.addEventListener("keydown", (event) => {

    if (event.key === "ArrowRight") {
        event.preventDefault();
        nextSlide();
    }

    if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousSlide();
    }
});

let touchStartX = 0;

slidesEl.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
}, { passive: true });

slidesEl.addEventListener("touchend", (event) => {

    const distance = touchStartX - event.changedTouches[0].clientX;

    if (Math.abs(distance) > 50) {
        distance > 0 ? nextSlide() : previousSlide();
    }

}, { passive: true });


/* =====================================================
   FRIENDSHIP COUNTER
===================================================== */

const counterSince = document.getElementById("counterSince");

if (counterSince) {
    counterSince.textContent = new Intl.DateTimeFormat("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(CONFIG.friendshipStart);
}

const counterDigits = new Intl.NumberFormat("bn-BD", {
    minimumIntegerDigits: 2,
    useGrouping: false
});

function updateCounter() {

    let diff = Date.now() - CONFIG.friendshipStart.getTime();

    if (diff < 0) {
        diff = 0;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff / 3600000) % 24);
    const minutes = Math.floor((diff / 60000) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const values = {
        counterDays: days,
        counterHours: hours,
        counterMinutes: minutes,
        counterSeconds: seconds
    };

    Object.keys(values).forEach((id) => {

        const el = document.getElementById(id);

        if (el) {
            el.textContent = counterDigits.format(values[id]);
        }
    });
}

setInterval(updateCounter, 1000);
updateCounter();


/* =====================================================
   NOTES JAR
===================================================== */

const loveNotes = [
   "তুমি যেখানে থাকো, সেখানেই একটু আলো থাকে।",
"আজ যদি ক্লান্ত লাগে, একটু থামো। থেমে যাওয়া আর হেরে যাওয়া এক কথা নয়।",
"তুমি যতটা ভাবো, তার চেয়ে অনেক বেশি শক্ত। মনে রেখো।",
"তোমার হাসিটা অনেকের খারাপ দিনকে ভালো করে দেয়।",
"সব কিছু ঠিক হতে সময় লাগে। তুমি শুধু চলতে থাকো।",
"তুমি আছো বলেই পৃথিবীটা একটু বেশি সুন্দর।",
"যে কষ্টটা আজ বড় মনে হচ্ছে, একদিন সেটাই তোমার সাহসের গল্প হবে।",
"তুমি পারবে। আমি এটা জানি, কারণ আমি তোমাকে চিনি।",
"তোমার মনটা খুব সুন্দর। কখনো নিজেকে ছোট ভেবো না।",
"ভোরের আগের অন্ধকারটাই সবচেয়ে গাঢ়। সকাল খুব কাছেই।",
"আজ একটা ছোট পদক্ষেপই যথেষ্ট। বড় পথ এভাবেই শেষ হয়। তাই না moni",
"তুমি একা নও। আমি আছি তোমার পাশে।",
"তোমার কথা শুনলে মনটা শান্ত হয়ে যায়।",
"নিজের প্রতি একটু দয়ালু হও। তুমি যথেষ্ট ভালো আছো।",
"ভুল করা মানে ব্যর্থ হওয়া নয়। এর মানে তুমি চেষ্টা করছো।",
"তুমি আমার জীবনের সেই মানুষ, যার কথা ভাবলেই মুখে হাসি আসে।",
"যা হারিয়ে গেছে তা নিয়ে কেঁদো, কিন্তু যা আছে তাকে আঁকড়ে ধরো।",
"তোমার স্বপ্নগুলো ছোট নয়। শুধু একটু ধৈর্য ধরো।",
"কান্না দুর্বলতা নয়। এটা মনের ভার হালকা করার উপায়।",
"তুমি এমন একজন, যাকে ভুলে যাওয়া অসম্ভব।",
"আজকের দিনটা কঠিন হলেও তুমি এখানে পৌঁছেছো। এটাই বড় জয়।",
"তোমার ভেতরে এমন শক্তি আছে, যা তুমি নিজেও এখনো পুরোটা জানো না।",
"যারা তোমাকে ভালোবাসে, তারা তোমার পূর্ণতা চায় না। তারা তোমাকে তোমার মতোই চায়।",
"প্রতিটা সূর্যাস্ত বলে, 'কাল আবার নতুন শুরু।'",
"তুমি যে এত কিছু সামলে চলছো, তার জন্য আমি তোমাকে নিয়ে গর্বিত।",
"মন খারাপ হলে এই চিঠিটা খুলো। মনে রেখো, কেউ একজন তোমাকে প্রতিবেশীর মতো ভালোবাসে।",
"তোমার ছোট ছোট চেষ্টাগুলোও আমার চোখে বড় কিছু।",
"জীবন সবসময় সহজ হয় না, কিন্তু তুমি সবসময় যথেষ্ট সাহসী।",
"যেদিন সব কিছু এলোমেলো লাগবে, সেদিনও তুমি আমার কাছে অমূল্য।",
"তুমি যেভাবে অন্যকে বোঝো, সেটা এক বিরল গুণ।",
"হাল ছেড়ো না। তোমার সময় আসছে, ঠিক সময়েই আসছে।",
"তোমার চোখের জল একদিন মুক্তো হবে, শুধু বিশ্বাস রাখো।",
"তুমি কারও জন্য দোয়া, কারও জন্য আশা, কারও জন্য পুরো পৃথিবী।",
"নিজেকে কারও সাথে তুলনা কোরো না। তোমার গল্প তোমারই,",
"আজ তুমি যতটুকু করেছো, সেটাই যথেষ্ট। বাকিটা কাল হবে।",
"তোমার নীরবতাও অনেক কিছু বলে। আমি সেটা শুনতে পাই।",
"যেখানেই যাও, আমার শুভকামনা তোমার সাথে থাকবে।",
"তুমি আমার কাছে একটা সুন্দর অভ্যাসের মতো। যেটা না থাকলে ফাঁকা লাগে।",
"কঠিন সময় চিরদিন থাকে না, কিন্তু শক্ত মানুষ থেকে যায়। তুমি সেই মানুষ।",
"Moni, সবশেষে একটা কথা: তুমি ভালোবাসার যোগ্য, আজ, কাল, আর সবসময়।"
];

let remainingNotes = loveNotes.slice();
let openedNotesCount = 0;

const noteModal = document.getElementById("noteModal");
const noteContent = document.getElementById("noteContent");
const noteNumber = document.getElementById("noteNumber");
const jarBadge = document.getElementById("jarCounterBadge");
const jarContainer = document.querySelector(".jar-container");

function openLoveNote(event) {

    if (event && event.stopPropagation) {
        event.stopPropagation();
    }

    if (jarContainer) {
        jarContainer.classList.add("jar-shaking");
        setTimeout(() => jarContainer.classList.remove("jar-shaking"), 650);
    }

    createJarBurst();

    if (remainingNotes.length === 0) {
        remainingNotes = loveNotes.slice();
    }

    const randomIndex = Math.floor(Math.random() * remainingNotes.length);
    const chosenNote = remainingNotes.splice(randomIndex, 1)[0];

    openedNotesCount++;

    if (noteModal && noteContent && noteNumber) {

        const noteIndex = loveNotes.indexOf(chosenNote) + 1;

        noteNumber.textContent = "নোট নম্বর " + counterDigits.format(noteIndex);
        noteContent.textContent = "\u201C" + chosenNote + "\u201D";

        noteModal.classList.add("active");
        document.body.classList.add("modal-open");
    }

    if (jarBadge) {
        jarBadge.textContent = "এখন পর্যন্ত " + openedNotesCount.toLocaleString("bn-BD") +
            "টা নোট টেনেছ ✦";
    }
}

function closeNoteModal(event) {

    if (event && event.stopPropagation) {
        event.stopPropagation();
    }

    if (noteModal) {
        noteModal.classList.remove("active");
    }

    document.body.classList.remove("modal-open");
}

function closeNoteModalOutside(event) {

    if (event.target && event.target.id === "noteModal") {
        closeNoteModal();
    }
}

if (jarContainer) {

    jarContainer.addEventListener("keydown", (event) => {

        if (event.target !== jarContainer) {
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openLoveNote(event);
        }
    });
}

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && noteModal && noteModal.classList.contains("active")) {
        closeNoteModal();
    }
});

function createJarBurst() {

    const jar = document.querySelector(".jar-glass");

    if (!jar || reduceMotion) {
        return;
    }

    const rect = jar.getBoundingClientRect();
    const icons = ["✦", "💫", "📝", "🌙", "✨", "🍀"];
    const colors = ["#ffd79a", "#ffb27a", "#b7a4ff", "#ff8d9e", "#8fe3c6"];

    for (let index = 0; index < 9; index++) {

        const spark = document.createElement("span");

        spark.textContent = icons[Math.floor(Math.random() * icons.length)];
        spark.style.position = "fixed";
        spark.style.left = (rect.left + rect.width / 2) + "px";
        spark.style.top = (rect.top + rect.height / 3) + "px";
        spark.style.fontSize = (15 + Math.random() * 16) + "px";
        spark.style.color = colors[Math.floor(Math.random() * colors.length)];
        spark.style.pointerEvents = "none";
        spark.style.zIndex = "9600";
        spark.style.transition = "all 0.9s cubic-bezier(0.25, 1, 0.5, 1)";

        document.body.appendChild(spark);

        const angle = (Math.PI * 2 * index) / 9 + (Math.random() * 0.4 - 0.2);
        const distance = 60 + Math.random() * 80;

        requestAnimationFrame(() => {
            spark.style.transform = "translate(" +
                (Math.cos(angle) * distance) + "px, " +
                (Math.sin(angle) * distance - 30) + "px) scale(1.25)";
            spark.style.opacity = "0";
        });

        setTimeout(() => spark.remove(), 1000);
    }
}


/* =====================================================
   MUSIC PLAYER
===================================================== */

const tracks = [
    {
        src: "songs/song1.mp3",
        title: "31 December 2025",
        artist: "monu",
        length: "3:45"
    },
    {
        src: "songs/song2.mp3",
        title: "তুমি নেই, তবু তোমারই পাশে",
        artist: "monu",
        length: "3:38"
    },
    {
        src: "songs/song3.mp3",
        title: "বন্ধু, চল—গাই একসাথে",
        artist: "monu",
        length: "2:15"
    },
    {
        src: "songs/song4.mp3",
        title: "রোদ্দুর নামে ধীরে",
        artist: "monu",
        length: "2:32"
    }
];

const player = document.getElementById("songPlayer");
const playerCard = document.getElementById("playerCard");
const trackTitleEl = document.getElementById("trackTitle");
const trackArtistEl = document.getElementById("trackArtist");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const seekBar = document.getElementById("seekBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeBar = document.getElementById("volumeBar");
const tracklistEl = document.getElementById("tracklist");

let trackIndex = 0;
let isSeeking = false;

tracks.forEach((track, index) => {

    const item = document.createElement("li");
    const button = document.createElement("button");

    button.type = "button";
    button.className = "track";
    button.dataset.index = String(index);

    button.innerHTML =
        '<span class="track-num">' + String(index + 1).padStart(2, "0") + '</span>' +
        '<span class="track-meta">' +
            '<span class="track-name">' + track.title + '</span>' +
            '<span class="track-sub">' + track.artist + '</span>' +
        '</span>' +
        '<span class="mini-eq" aria-hidden="true"><i></i><i></i><i></i></span>' +
        '<span class="track-dur">' + track.length + '</span>';

    button.addEventListener("click", () => {

        if (index === trackIndex && !player.paused) {
            player.pause();
            updatePlayerUI();
        } else {
            loadTrack(index, true);
        }
    });

    item.appendChild(button);
    tracklistEl.appendChild(item);
});

function formatTime(value) {

    if (!isFinite(value) || value < 0) {
        return "0:00";
    }

    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);

    return minutes + ":" + String(seconds).padStart(2, "0");
}

function setRangeFill(element, percent) {

    element.style.setProperty("--value", Math.max(0, Math.min(100, percent)) + "%");
}

function markActiveTrack() {

    tracklistEl.querySelectorAll(".track").forEach((button, index) => {
        button.classList.toggle("active", index === trackIndex);
    });
}

function updateMediaSession() {

    if (!("mediaSession" in navigator)) {
        return;
    }

    try {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: tracks[trackIndex].title,
            artist: tracks[trackIndex].artist,
            album: "the moni & monu tapes"
        });
    } catch (error) {
        /* Media Session is a nice-to-have. */
    }
}

function loadTrack(index, autoplay) {

    trackIndex = index;

    const track = tracks[index];

    trackTitleEl.textContent = track.title;
    trackArtistEl.textContent = track.artist;
    durationEl.textContent = track.length;
    currentTimeEl.textContent = "0:00";

    seekBar.value = 0;
    setRangeFill(seekBar, 0);

    player.src = track.src;
    player.load();

    markActiveTrack();
    updateMediaSession();

    if (autoplay) {
        playCurrent();
    }
}

function playCurrent() {

    pauseBgForPlayer();

    const attempt = player.play();

    if (attempt && typeof attempt.then === "function") {
        attempt.then(updatePlayerUI).catch(updatePlayerUI);
    } else {
        updatePlayerUI();
    }
}

function updatePlayerUI() {

    const playing = !player.paused;

    playerCard.classList.toggle("is-playing", playing);
    playBtn.setAttribute("aria-label", playing ? "গান থামাও" : "গান চালাও");
}

playBtn.addEventListener("click", () => {

    if (player.paused) {
        playCurrent();
    } else {
        player.pause();
        updatePlayerUI();
    }
});

prevBtn.addEventListener("click", () => {

    const wasPlaying = !player.paused;

    loadTrack((trackIndex - 1 + tracks.length) % tracks.length, wasPlaying);
});

nextBtn.addEventListener("click", () => {

    const wasPlaying = !player.paused;

    loadTrack((trackIndex + 1) % tracks.length, wasPlaying);
});

seekBar.addEventListener("input", () => {

    isSeeking = true;

    const percent = Number(seekBar.value) / 10;

    setRangeFill(seekBar, percent);

    if (isFinite(player.duration) && player.duration > 0) {
        player.currentTime = (percent / 100) * player.duration;
        currentTimeEl.textContent = formatTime(player.currentTime);
    }
});

seekBar.addEventListener("change", () => {
    isSeeking = false;
});

volumeBar.addEventListener("input", () => {

    player.volume = Number(volumeBar.value) / 100;
    setRangeFill(volumeBar, Number(volumeBar.value));
});

player.addEventListener("play", updatePlayerUI);
player.addEventListener("pause", updatePlayerUI);

player.addEventListener("loadedmetadata", () => {

    if (isFinite(player.duration)) {
        durationEl.textContent = formatTime(player.duration);
    }
});

player.addEventListener("timeupdate", () => {

    if (isSeeking || !isFinite(player.duration) || player.duration <= 0) {
        return;
    }

    const percent = (player.currentTime / player.duration) * 100;

    seekBar.value = Math.round(percent * 10);
    setRangeFill(seekBar, percent);
    currentTimeEl.textContent = formatTime(player.currentTime);
});

player.addEventListener("ended", () => {

    loadTrack((trackIndex + 1) % tracks.length, true);
});

player.addEventListener("error", () => {

    if (player.error) {
        trackArtistEl.textContent = "গানটা লোড হলো না — songs ফোল্ডারটা দেখো";
    }
});

if ("mediaSession" in navigator) {

    try {
        navigator.mediaSession.setActionHandler("play", playCurrent);
        navigator.mediaSession.setActionHandler("pause", () => player.pause());
        navigator.mediaSession.setActionHandler("previoustrack", () => {
            loadTrack((trackIndex - 1 + tracks.length) % tracks.length, true);
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
            loadTrack((trackIndex + 1) % tracks.length, true);
        });
    } catch (error) {
        /* Unsupported action handlers are fine. */
    }
}

player.volume = 0.85;
volumeBar.value = 85;
setRangeFill(volumeBar, 85);

loadTrack(0, false);
updateBgButton();


/* =====================================================
   AMBIENT SPARKS
===================================================== */

const sparkChars = ["✦", "✧", "⋆", "·"];
const sparkColors = ["#ffd79a", "#ffb27a", "#b7a4ff", "#ff8d9e"];

function createSpark() {

    if (reduceMotion) {
        return;
    }

    const spark = document.createElement("span");

    spark.className = "spark";
    spark.textContent = sparkChars[Math.floor(Math.random() * sparkChars.length)];
    spark.style.left = Math.random() * 100 + "vw";
    spark.style.fontSize = (7 + Math.random() * 9) + "px";
    spark.style.color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
    spark.style.animationDuration = (9 + Math.random() * 8) + "s";

    document.body.appendChild(spark);

    setTimeout(() => spark.remove(), 18000);
}

function sparkBurst(count) {

    if (reduceMotion) {
        return;
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.42;

    for (let index = 0; index < count; index++) {

        const star = document.createElement("span");

        star.className = "burst-star";
        star.textContent = sparkChars[Math.floor(Math.random() * sparkChars.length)];
        star.style.left = centerX + "px";
        star.style.top = centerY + "px";
        star.style.fontSize = (9 + Math.random() * 16) + "px";
        star.style.color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
        star.style.animationDelay = (Math.random() * 0.15) + "s";

        const angle = Math.random() * Math.PI * 2;
        const distance = 70 + Math.random() * 250;

        star.style.setProperty("--tx", Math.cos(angle) * distance + "px");
        star.style.setProperty("--ty", Math.sin(angle) * distance + "px");
        star.style.setProperty("--rot", (Math.random() * 240 - 120) + "deg");

        document.body.appendChild(star);

        setTimeout(() => star.remove(), 1500);
    }
}

if (!reduceMotion) {

    setInterval(() => {

        if (!document.hidden) {
            createSpark();
        }

    }, 2400);

    for (let index = 0; index < 6; index++) {
        setTimeout(createSpark, index * 600);
    }
}


/* =====================================================
   SCROLL PROGRESS + NAV STATE
===================================================== */

const nav = document.getElementById("siteNav");
const progressBar = document.getElementById("scrollProgress");

function onScroll() {

    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const percent = max > 0 ? doc.scrollTop / max : 0;

    progressBar.style.transform = "scaleX(" + percent + ")";
    nav.classList.toggle("scrolled", doc.scrollTop > 40);
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();


/* =====================================================
   SCROLL SPY
===================================================== */

const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const navMap = {};

navLinks.forEach((link) => {
    navMap[link.getAttribute("href").slice(1)] = link;
});

if ("IntersectionObserver" in window) {

    const spy = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) {
                return;
            }

            navLinks.forEach((link) => link.classList.remove("active"));

            const activeLink = navMap[entry.target.id];

            if (activeLink) {
                activeLink.classList.add("active");
            }
        });

    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    ["story", "memories", "jar", "music", "letter"].forEach((id) => {

        const section = document.getElementById(id);

        if (section) {
            spy.observe(section);
        }
    });
}


/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealEls = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && !reduceMotion) {

    const revealObserver = new IntersectionObserver((entries, observer) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
        });

    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach((element) => revealObserver.observe(element));

} else {

    revealEls.forEach((element) => element.classList.add("in-view"));
}


/* =====================================================
   SURPRISE BUTTON
===================================================== */

const surpriseBtn = document.getElementById("surpriseBtn");
const surpriseNote = document.getElementById("surpriseNote");

surpriseBtn.addEventListener("click", () => {

    surpriseNote.classList.add("show");
    surpriseBtn.textContent = "পেয়ে গেছ ✦";
    surpriseBtn.disabled = true;

    sparkBurst(34);
});
