console.log("Lets write Js");

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  
  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");
  
  let songs=[]
  for(let i=0;i<as.length;i++){
    const ele=as[i];
    if(ele.href.endsWith(".mp3")){
        songs.push(ele.href)
    }
  }
  return songs
}

async function main(){
let songs=await getSongs();
console.log(songs)

let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
for (const song of songs) {
  songUL.innerHTML=songUL.innerHTML+`<li> ${song} </li>`;
}

let audio=new Audio(songs[0])
audio.play();

audio.addEventListener("loadeddata",()=>{
  let duration=audio.duration;
  console.log(duration)

})
}
main()
