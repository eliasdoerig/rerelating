import { media } from "./media.json";

// Grab elements, create settings, etc.
const video = document.getElementById("video");
const title = document.getElementById("title");
const searching = document.getElementById("searching");
const mediaLink = document.getElementById("mediaLink");
let isLinkVisible = false;
let currentMedia = "";

function init() {
  // Create a webcam capture
  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: "environment",
      },
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
      video.onloadedmetadata = function (e) {
        video.play();
      };
    })
    .then(() => {
      ml5
        .imageClassifier("test-image-model/model.json", video)
        .then((classifier) => loop(classifier));
    })
    .catch(function (error) {
      console.error("Oops. Something is broken.", error);
    });
  // Initialize the Image Classifier method with MobileNet passing the video as the
  // second argument and the getClassification function as the third
}

const loop = (classifier) => {
  classifier.classify().then((results) => {
    const conf = results[0].confidence.toFixed(4);
    //probability.innerText = `${conf * 100}%`;
    if (conf > 0.95) {
      if (!isLinkVisible) {
        currentMedia = media.find((e) => {
          return e.slug === results[0].label;
        });
        title.innerHTML = `${currentMedia.slug}<br>${currentMedia.title}`;
        searching.style.display = "none";
        mediaLink.style.opacity = 1;
        isLinkVisible = true;
      }
    } else if (conf < 0.6 && isLinkVisible) {
      if (isLinkVisible) {
        currentMedia = "";
        title.innerText = "";
        searching.style.display = "block";
        mediaLink.style.opacity = 0;
        isLinkVisible = false;
      }
    }
    loop(classifier); // Call again to create a loop
  });
};

window.addEventListener("load", init, false);

mediaLink.addEventListener("click", (e) => {
  e.preventDefault();
  if (isLinkVisible && currentMedia !== "") {
    window.location.href = `media.html?${currentMedia.slug}`;
  }
});
