import { media } from "./media.json";

const title = document.getElementById("title");
const artist = document.getElementById("artist");
const videoPlayer = document.getElementById("video");
const audioPlayer = document.getElementById("audio");
videoPlayer.style.display = "none";
audioPlayer.style.display = "none";

const init = function () {
  const currentSearch = window.location.search.replace(/\?/g, "");
  const currentMedia = media.find((e) => {
    return e.slug === currentSearch;
  });
  if (currentMedia) {
    title.innerText = currentMedia.title;
    artist.innerText = `by ${currentMedia.artist}`;
    if (currentMedia.type === "audio/mp3") {
      document.title = `${currentMedia.artist} | ${currentMedia.title}`;
      addSource(audioPlayer, currentMedia.src, currentMedia.type);
      audioPlayer.load();
      audioPlayer.style.display = "block";
    } else if (currentMedia.type === "video/mp4") {
      document.title = `${currentMedia.artist} | ${currentMedia.title}`;
      addSource(videoPlayer, currentMedia.src, currentMedia.type);
      videoPlayer.load();
      videoPlayer.style.display = "block";
    } else {
      title.innerText = `This media type is not supported: ${currentMedia.type}`;
      console.error(`This media type is not supported: ${currentMedia.type}`);
    }
  } else {
    title.innerHTML = `This media does not exist. <br><a href="index.html">< Go back</a>`;
  }
};

const addSource = function (element, src, type) {
  var source = document.createElement("source");

  source.src = src;
  source.type = type;

  element.appendChild(source);
};

init();
