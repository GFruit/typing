/*
let link = document.querySelector("link[rel~='icon']")
let faviconUrl = "https://gfruit.github.io/typing/keyboard.ico" //link.href;
let img = document.createElement("img");
img.addEventListener("load", onImageLoaded);
img.crossOrigin = "anonymous";
img.src = faviconUrl;

console.log(img.src)

function onImageLoaded() {
    subColor = getComputedStyle(document.querySelector(':root')).getPropertyValue("--sub-color");
    var canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    var context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);
    context.globalCompositeOperation = "source-in";
    context.fillStyle = subColor;
    context.fillRect(0, 0, 16, 16);
    context.fill();
    link.type = "image/x-icon";
    link.href = canvas.toDataURL();
  };
  */
