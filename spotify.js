let current_song = new Audio();
let songs;
function secondsToTime(durationInSeconds) {
    // Ensure input is a non-negative number
    if (typeof durationInSeconds !== "number" || durationInSeconds < 0) {
        throw new Error("Input must be a non-negative number");
    }

    // Calculate minutes and seconds
    const minutes = Math.floor(durationInSeconds / 60);
    const remainingSeconds = Math.floor(durationInSeconds % 60);

    // Format minutes and seconds with leading zeros
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    // Combine and return the formatted time
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".unknown")) {
            songs.push(element.href.split("/songs/")[1]);
        }
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}
const playmusic = (track, pause = false) => {
    current_song.src = "/songs/" + track;
    if (!pause) {
        current_song.play();
        play.src = "pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};
async function main() {
    songs = await getsongs();
    playmusic(songs[0], true);
    let songUL = document
        .querySelector(".songlist")
        .getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML =
            songUL.innerHTML +
            `<li>
           
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Song Artist</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="play.svg" alt="">
            </div>
        </li>`;
    }
    Array.from(
        document.querySelector(".songlist").getElementsByTagName("li")
    ).forEach((e) => {
        e.addEventListener("click", (element) => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(
                e.querySelector(".info").firstElementChild.innerHTML.trim()
            );
        });
    });
    //to play , next, prev
    play.addEventListener("click", () => {
        if (current_song.paused) {
            current_song.play();
            play.src = "pause.svg";
        } else {
            current_song.pause();
            play.src = "play.svg";
        }
    });
    //listen for time update event
    current_song.addEventListener("timeupdate", () => {
        console.log(current_song.currentTime, current_song.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToTime(
            current_song.currentTime
        )}/${secondsToTime(current_song.duration)}`;
        document.querySelector(".circle").style.left =
            (current_song.currentTime / current_song.duration) * 100 + "%";
    });
    //add event listener to seek
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent =
            (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        current_song.currentTime = current_song.duration * (percent / 100);
    });
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });
    previous.addEventListener("click", () => {
        let index = songs.indexOf(current_song.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playmusic(songs[index - 1]);
        }
    });
    next.addEventListener("click", () => {
        let index = songs.indexOf(current_song.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length) {
            playmusic(songs[index + 1]);
        }
    });
    //add event to volume
    document
        .querySelector(".range")
        .getElementsByTagName("input")[0]
        .addEventListener("change", (e) => {
            current_song.volume = parseInt(e.target.value) / 100;
        });
}
main();
