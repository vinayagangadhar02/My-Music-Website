console.log("Lets write JS");
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "0:00"; // Handling invalid or negative inputs
  }

  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);

  // Ensure seconds are always two digits (e.g., 05 instead of 5)
  remainingSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return minutes + ":" + remainingSeconds;
}

let currentSong = new Audio();

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");

  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const ele = as[i];
    if (ele.href.endsWith(".mp3")) {
      songs.push(decodeURIComponent(ele.href.split("/songs/")[1]));
    }
  }
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong
      .play()
      .then(() => {
        console.log(`Playing: ${track}`);
      })
      .catch((error) => {
        console.error(`Error playing track: ${track}`, error);
      });
  }

  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function main() {
  let songs = await getSongs();
  console.log(songs);

  playMusic(songs[0], true);
  let songUL = document.querySelector(".songList ul");
  for (const song of songs) {
    songUL.innerHTML += `<li> 
                                <img class="invert" src="./SVG/music.svg">
                                <div class="info">
                                    <div>${song}</div>
                                    <div>Song Artist</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                <img  src="/SVG/playbutton.svg" alt="" >
                            </div>
                         </li>`;
  }

  let listItems = document.querySelectorAll(".songList li");
  listItems.forEach((item) => {
    item.addEventListener("click", () => {
      let songName = item.querySelector(".info div").innerText.trim();
      playMusic(songName);
    });
  });

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "./SVG/pause.svg";
    } else {
      currentSong.pause();
      play.src = "./SVG/playbutton.svg";
    }
  });
  currentSong.addEventListener("timeupdate", () => {
    let currentTime = Math.floor(currentSong.currentTime);
    let duration = Math.floor(currentSong.duration);

    document.querySelector(".songtime").innerHTML = `
        ${formatTime(currentTime)} / ${formatTime(duration)}`;
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";
  });
}

main();
