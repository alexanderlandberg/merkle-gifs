"use strict";
window.addEventListener("DOMContentLoaded", init);

// Global variables
const gifData = gifDataArr;

let gTagAmount;
let gTagList;
let gActiveTags = [];

const gifContainer = document.querySelector("#gif-container");
const tags = document.querySelector("#tags");

// Init
function init() {
    addAllGifs();
    addTags();
}

// Add all gifs
function addAllGifs() {
    for (let i = 0; i < gifData.length; i++) {
        addSingleGif(gifData[i]);
    }
}

// Add gif
function addSingleGif(parm) {
    // new div
    let newDiv = document.createElement("div");
    newDiv.classList.add("gif-wrapper");

    // new img
    let newImg = document.createElement("img");
    newImg.src = "gifs/" + parm.file;

    // new input
    let newInput = document.createElement("input");
    let urlStripped = window.location.toString().replace("/index.html", "");
    newInput.value = urlStripped + "/gifs/" + parm.file;

    // new link icon
    let newLinkIcon = document.createElement("div");
    newLinkIcon.classList.add("link-icon");
    newLinkIcon.setAttribute("onclick", "copyToClipboard(this)");

    // append
    newDiv.append(newImg);
    newDiv.append(newInput);
    newDiv.append(newLinkIcon);
    gifContainer.append(newDiv);
}

// Add tags
function addTags() {

    // get tag list and amounts
    let tagObj = {}
    let tagArr = [];

    for (let i = 0; i < gifData.length; i++) {
        for (let j = 0; j < gifData[i].tags.length; j++) {
            if (tagObj[gifData[i].tags[j]] === undefined) {
                tagObj[gifData[i].tags[j]] = 1;
                tagArr.push(gifData[i].tags[j])
            } else {
                tagObj[gifData[i].tags[j]]++;
            }
        }
    }

    // sort tagArr
    tagArr.sort(function (a, b) {
        return tagObj[b] - tagObj[a];
    });

    // add to DOM
    for (let i = 0; i < tagArr.length; i++) {

        // new div
        let newDiv = document.createElement("div");
        newDiv.classList.add("tag");
        newDiv.setAttribute("data-tag", tagArr[i]);
        newDiv.innerHTML = `${tagArr[i]} <span>${tagObj[tagArr[i]]}</span>`;
        newDiv.addEventListener("click", toggleTag);

        // append
        tags.append(newDiv);
    }

    // update global variables
    gTagAmount = tagObj;
    gTagList = tagArr;
}

// Toggle tag
function toggleTag() {

    if (!this.classList.contains("active")) {
        this.classList.add("active");
        console.log(this.getAttribute("data-tag"))
        gActiveTags.push(this.getAttribute("data-tag"))
    } else {
        this.classList.remove("active");
        gActiveTags = gActiveTags.filter(e => e !== this.getAttribute("data-tag"));
    }

    // Sort gifs
    sortGifs();
}

// Sort gifs
function sortGifs() {

    // empty gifList
    gifContainer.innerHTML = "";

    // if no tags is active, then add all
    if (gActiveTags.length === 0) {
        addAllGifs()
        return;
    }

    // sort from tags
    for (let i = 0; i < gifData.length; i++) {

        // if any of the tags in the data matches with active tags
        console.log(gActiveTags.some(j => gifData[i].tags.includes(j)))

        if (gActiveTags.some(j => gifData[i].tags.includes(j))) {
            addSingleGif(gifData[i]);
        }
    }


}

// Copy link to clipboard
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