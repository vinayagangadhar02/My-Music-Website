console.log("Lets write JS");
let songs
let currFolder;
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "0:00"; 
  }

  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);

 
  remainingSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return minutes + ":" + remainingSeconds;
}

let currentSong = new Audio();



async function getSongs(folder) {
  currFolder=folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");

  songs = [];
  for (let i = 0; i < as.length; i++) {
    const ele = as[i];
    if (ele.href.endsWith(".mp3")) {
      songs.push(decodeURIComponent(ele.href.split( `/${folder}/`)[1]));
    }
  }


  let songUL = document.querySelector(".songList ul");
  songUL.innerHTML=""
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




}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
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


async function displayAlbums(){
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
console.log(div)
let anchors=div.getElementsByTagName("a")
console.log(anchors)
let folders=[]
let cardContainer=document.querySelector(".cardContainer")

let array=Array.from(anchors)



for(let i=0;i<array.length;i++){
  let e=array[i]
  if(e.href.includes("/songs/")){
    console.log(e.href)
    let folder=e.href.split("/").slice(-1)[0]
    console.log(folder)
    let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
    let response = await a.json();
    console.log(response)
    cardContainer.innerHTML+=`  <div  data-folder="${folder}" class="card">
                       <div class="border">
                        <img class="play" src="/SVG/playbutton.svg" alt="">
                      <img aria-hidden="false" draggable="false" loading="eager"
                          src="/songs/${folder}/cover.png"
                          data-testid="cover-art-image" alt=""
                          class="mMx2LUixlnN_Fu45JpFB FqmFsMhuF4D0s35Z62Js Yn2Ei5QZn19gria6LjZj">
                          </div>
                      <div role="button" aria-disabled="false"
                          aria-labelledby="card-title-spotify:playlist:37i9dQZF1EQoSpPa76iq3Q-1 card-subtitle-spotify:playlist:37i9dQZF1EQoSpPa76iq3Q-1"
                          aria-describedby="onClickHintspotify:playlist:37i9dQZF1EQoSpPa76iq3Q-1" tabindex="0"
                          class="CardButton-sc-g9vf2u-0 doNNoL"></div>
                      <h2>${response.title}</h2>
                      <p>${response.description}</p>

                  </div>`
  
  }
}

Array.from(document.getElementsByClassName("card")).forEach(e=>{
  console.log(e)
  e.addEventListener("click",async item=>{
   
    songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
  
  })
})


}



async function main() {
  await getSongs("songs/music1");
  console.log(songs);

  playMusic(songs[0], true);


displayAlbums()


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




  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });


  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0";
  })

  document.querySelector(".close").addEventListener("click",()=>{
document.querySelector(".left").style.left="-120"+"%";
  })


  document.getElementById("previous").addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").pop())); 
// console.log(index)
    if (index > 0) {
      playMusic(songs[index - 1]);
    } else {
      console.log("No previous song available.");
    }
  });



  document.getElementById("next").addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").pop())); 
    // console.log(index)
   

    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    } else {
      console.log("No next song available.");
    }
  });

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentSong.volume=parseInt(e.target.value)/100
    
      })
      document.querySelector(".volume-img").addEventListener("click", (e) => {
        let img = e.target;
    
        console.log("Clicked image:", img.src);  
        
        if (img.src.includes("volume.svg")) {
            img.src = img.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            console.log("Volume muted");
        } else if (img.src.includes("mute.svg")) {
            img.src = img.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.1;  
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
            console.log("Volume set to 0.1");
        } else {
            console.error("Unexpected image source:", img.src);
        }
    });
    
  



}

main();