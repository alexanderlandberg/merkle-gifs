"use strict";
window.addEventListener("DOMContentLoaded", init);


function init() {
    addGifs();
}

function addGifs() {
    // get data
    const gifData = gifDataArr;

    for (let i = 0; i < gifData.length; i++) {
        // new div
        let newDiv = document.createElement("div");
        newDiv.classList.add("gif-wrapper");

        // new img
        let newImg = document.createElement("img");
        newImg.src = "gifs/" + gifData[i].file;

        // new input
        let newInput = document.createElement("input");
        let urlStripped = window.location.toString().replace("/index.html", "");
        newInput.value = urlStripped + "/gifs/" + gifData[i].file;

        // new link icon
        let newLinkIcon = document.createElement("div");
        newLinkIcon.classList.add("link-icon");
        newLinkIcon.setAttribute("onclick", "copyToClipboard(this)");

        // append
        newDiv.append(newImg)
        newDiv.append(newInput)
        newDiv.append(newLinkIcon)
        document.querySelector("#gif-container").append(newDiv)
    }
}

function copyToClipboard(parm) {
    // copy to clipboard
    const copyText = parm.parentNode.querySelector("input");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);

    // style click effect
    parm.classList.add("clicked");
    setTimeout(() => {
        parm.classList.remove("clicked");
    }, 300);
}