"use strict";
window.addEventListener("DOMContentLoaded", init);

// Global variables
const gifData = gifDataArr;

const labelLists = ["categories", "people", "tags"];
let gTagAmount = {};
let gTagList = {};
let gActiveLabels = [];

const gifContainer = document.querySelector("#gif-container");

// Init
function init() {
    addAllGifs();
    for (let i = 0; i < labelLists.length; i++) {
        addLabels(labelLists[i]);
    }
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
    // newDiv.append(newInput);
    newDiv.append(newLinkIcon);
    gifContainer.append(newDiv);
}

// Add labels
function addLabels(labelName) {
    // get tag list and amounts
    let labelObj = {}
    let labelArr = [];

    for (let i = 0; i < gifData.length; i++) {
        if (typeof gifData[i][labelName] !== "undefined") {
            for (let j = 0; j < gifData[i][labelName].length; j++) {
                if (labelObj[gifData[i][labelName][j]] === undefined) {
                    labelObj[gifData[i][labelName][j]] = 1;
                    labelArr.push(gifData[i][labelName][j])
                } else {
                    labelObj[gifData[i][labelName][j]]++;
                }
            }
        }
    }

    // sort labelArr
    labelArr.sort(function (a, b) {
        return labelObj[b] - labelObj[a];
    });

    // add to DOM
    for (let i = 0; i < labelArr.length; i++) {

        // new div
        let newDiv = document.createElement("div");
        newDiv.classList.add("label");
        newDiv.setAttribute("data-tag", labelArr[i]);
        newDiv.innerHTML = `${labelArr[i]} <span>${labelObj[labelArr[i]]}</span>`;
        newDiv.addEventListener("click", toggleLabel);

        // append
        document.querySelector(`#${labelName}`).append(newDiv);
    }

    // update global variables
    gTagAmount[labelName] = labelObj;
    gTagList[labelName] = labelArr;
}

// Toggle label
function toggleLabel() {

    const labelName = this.parentNode.getAttribute("id");

    if (!this.classList.contains("active")) {
        this.classList.add("active");
        gActiveLabels.push(this.getAttribute("data-tag"))
    } else {
        this.classList.remove("active");
        gActiveLabels = gActiveLabels.filter(e => e !== this.getAttribute("data-tag"));
    }

    // Sort gifs
    sortGifs();
}

// Sort gifs
function sortGifs() {
    // empty gifList
    gifContainer.innerHTML = "";

    // if no labels are active, then add all
    if (gActiveLabels.length === 0) {
        addAllGifs()
        return;
    }

    // sort from labels
    for (let i = 0; i < gifData.length; i++) {

        // set gifIsOn to true if any label is on
        let gifIsOn = false;
        for (let j = 0; j < labelLists.length; j++) {
            const labelName = labelLists[j];
            if (typeof gifData[i][labelName] !== "undefined" && gActiveLabels.some(e => gifData[i][labelName].includes(e))) {
                gifIsOn = true;
            }
        }

        // add gifs
        if (gifIsOn) {
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