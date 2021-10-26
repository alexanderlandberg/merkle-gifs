"use strict";
window.addEventListener("DOMContentLoaded", init);

// Global variables
const gifData = gifDataArr;

const labelLists = ["categories", "people", "tags"];
let gTagAmount = {};
let gTagList = {};
let gActiveLabels = [];

let gFavoritedGifs = [];
let gFavoritedToggle = "off";

const gifContainer = document.querySelector("#gif-container");
const favoriteToggle = document.querySelector("#favorite-toggle");

// Init
function init() {
    getLocalStorage();
    favoriteToggle.addEventListener("click", toggleFavorites)
    sortGifs();
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

    // new action list
    let actionList = document.createElement("div");
    actionList.classList.add("action-list");

    // new favorite action
    let actionFavorite = document.createElement("div");
    actionFavorite.classList.add("action-favorite");
    actionFavorite.addEventListener("click", addFavorite);
    if (gFavoritedGifs.includes(parm.file)) {
        actionFavorite.classList.add("favorited");
    }

    // new share action
    let actionShare = document.createElement("div");
    actionShare.classList.add("action-share");
    actionShare.addEventListener("click", copyToClipboard);

    // append
    actionList.append(actionShare);
    actionList.append(actionFavorite);

    newDiv.append(actionList);
    newDiv.append(newImg);
    newDiv.append(newInput);

    gifContainer.append(newDiv);
}

// Sort gifs
function sortGifs() {
    // empty gifList
    gifContainer.innerHTML = "";

    // if no labels are active, then add all
    if (gActiveLabels.length === 0 && gFavoritedToggle === "off") {
        addAllGifs()
        return;
    }

    // sort from labels
    for (let i = 0; i < gifData.length; i++) {

        // set gifIsOn to true if label is on
        let gifIsOn = false;
        for (let j = 0; j < labelLists.length; j++) {
            const labelName = labelLists[j];
            if (typeof gifData[i][labelName] !== "undefined" && gActiveLabels.some(e => gifData[i][labelName].includes(e))) {
                gifIsOn = true;
            }
        }

        // favorites enabled
        if (gFavoritedToggle === "on") {
            if (!gFavoritedGifs.includes(gifData[i].file)) {
                gifIsOn = false;
            } else {
                gifIsOn = true;
            }
        }

        // add gifs
        if (gifIsOn) {
            addSingleGif(gifData[i]);
        }
    }
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

    // sort labelArr alphabetically
    labelArr.sort((a, b) => a.localeCompare(b));

    // sort labelArr from amount
    labelArr.sort(function (a, b) {
        return labelObj[b] - labelObj[a];
    });

    // add to DOM
    let newLabelCategory = document.createElement("div");
    newLabelCategory.setAttribute("id", labelName);
    newLabelCategory.classList.add("label-category");

    for (let i = 0; i < labelArr.length; i++) {

        // new div
        let newDiv = document.createElement("div");
        newDiv.classList.add("label");
        newDiv.setAttribute("data-tag", labelArr[i]);
        newDiv.innerHTML = `${labelArr[i]} <span>${labelObj[labelArr[i]]}</span>`;
        newDiv.addEventListener("click", toggleLabel);

        // append
        newLabelCategory.append(newDiv);
    }
    if (labelArr.length > 0) {
        document.querySelector(`#labels`).append(newLabelCategory);
    }

    // update global variables
    gTagAmount[labelName] = labelObj;
    gTagList[labelName] = labelArr;
}

// Toggle label
function toggleLabel() {

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

// Toggle favorites
function toggleFavorites() {

    if (!favoriteToggle.classList.contains("active")) {
        favoriteToggle.classList.add("active");
        gFavoritedToggle = "on";
    } else {
        favoriteToggle.classList.remove("active");
        gFavoritedToggle = "off";
    }

    // Sort gifs
    sortGifs();

    // add favorites list to localstorage
    setLocalStorage();
}

// Add favorite
function addFavorite() {

    let gifName = this.parentNode.parentNode.querySelector("img").getAttribute("src").replace('gifs/', '')

    if (!this.classList.contains("favorited")) {
        if (!gFavoritedGifs.includes(gifName)) {
            gFavoritedGifs.push(gifName);
        }
        this.classList.add("favorited");
    } else {
        gFavoritedGifs.splice(gFavoritedGifs.indexOf(gifName), 1);
        this.classList.remove("favorited");
    }

    // if favorites is showing, then sort
    if (gFavoritedToggle === "on") {
        sortGifs();
    }

    // add favorites list to localstorage
    setLocalStorage();
}

// Copy link to clipboard
function copyToClipboard() {
    // copy to clipboard
    const copyText = this.parentNode.parentNode.querySelector("input");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);

    // style click effect
    this.classList.add("click-animate");
    setTimeout(() => {
        this.classList.remove("click-animate");
    }, 600);
}

// Add data to local storage
function setLocalStorage() {
    let merkleGifsData = {};

    merkleGifsData.favorited = gFavoritedGifs;
    merkleGifsData.favoritedToggle = gFavoritedToggle;

    localStorage.setItem("merkleGifsData", JSON.stringify(merkleGifsData));
}

// Get data from local storage
function getLocalStorage() {

    // get local storage
    if (localStorage.getItem("merkleGifsData") === null) {
        return;
    } else {
        let localData = JSON.parse(localStorage.getItem("merkleGifsData"));
        gFavoritedGifs = localData.favorited;
        gFavoritedToggle = localData.favoritedToggle;
    }

    // update
    if (gFavoritedToggle === "on") {
        favoriteToggle.classList.add("active");
    }

}