module.exports = {
  default: {
    resources: [
      {
        type: "static",
        name: "index.html",
        contents:
          '<!doctype html><title>Gallery Slideshow</title><meta name=viewport content="width=device-width,initial-scale=1" charset=utf-8><link rel=stylesheet href=index.css><script src=files.js charset=utf-8></script><div id=container class=slideshow-container><a class=prev onclick=plusSlides(-1)>&#10094;</a> <a class=next onclick=plusSlides(1)>&#10095;</a></div><script src=index.js charset=utf-8></script>'
      },
      {
        type: "static",
        name: "index.css",
        contents:
          "body,html{width:100%;height:100%;display:flex;background-color:#001}*{margin:0;padding:0}.slideshow-container{margin:auto;background-color:#000;display:flex;height:80%;width:80%;justify-content:space-between;align-items:center;border-radius:3px 3px 3px 3px}.mySlides{order:1;margin:auto;max-width:100%;max-height:100%}.next,.prev{order:0;cursor:pointer;width:auto;padding:16px;color:#fff;font-weight:700;font-size:18px;transition:.6s ease;border-radius:0 3px 3px 0;user-select:none}.next{order:2;border-radius:3px 0 0 3px}.next:hover,.prev:hover{background-color:#eee;color:#000}.fade{-webkit-animation-name:fade;-webkit-animation-duration:1s;animation-name:fade;animation-duration:1s}@-webkit-keyframes fade{from{opacity:.4}to{opacity:1}}@keyframes fade{from{opacity:.4}to{opacity:1}}@media only screen and (max-width:300px){.next,.prev,.text{font-size:11px}}"
      },
      {
        type: "static",
        name: "index.js",
        contents:
          'const container=document.getElementById("container");for(let e=0;e<images.length;e++){const n=document.createElement("img");n.className="mySlides fade",n.src=images[e],container.appendChild(n)}let slideIndex=1;function plusSlides(e){showSlides(slideIndex+=e)}function showSlides(e){const n=document.getElementsByClassName("mySlides");e>n.length&&(slideIndex=1),e<1&&(slideIndex=n.length);for(let e=0;e<n.length;e++)n[e].style.display="none";n[slideIndex-1].style.display="block"}showSlides(slideIndex);'
      }
    ],
    title: "Gallery Slideshow"
  }
};
