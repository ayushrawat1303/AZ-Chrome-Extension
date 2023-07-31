//we talk about all the changes that we will make on the popup (here we're displaying those bookmarked problems)
let problemListKey = 'algozenith_problems';

document.addEventListener("DOMContentLoaded", async () => {
    //fetching the already bookmarked questions 
    chrome.storage.sync.get([problemListKey], (data) => {
        //displaying bookmarked problems in the popup by calling the viewbookmarks function
        const currentBookmarks = data[problemListKey] ? JSON.parse(data[problemListKey]) : [];
        viewBookmarks(currentBookmarks);
    });
});
//this function adds the bookmark to the popup if there are bookmarks in the storage and if there is no mark then popup will display NO bookmarks to show
const viewBookmarks = (currentBookmarks = []) => {
    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "";
    //if fetched data is not empty
    if (currentBookmarks.length > 0) {
        for (let i = 0; i < currentBookmarks.length; i++) {
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarksElement, bookmark);
        }
    } else {//if not empty
        bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
    }
    return;
};


const addNewBookmark = (bookmarks, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const controlsElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");

    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";
    controlsElement.className = "bookmark-controls";

    setBookmarkAttributes("play", onPlay, controlsElement);
    setBookmarkAttributes("delete", onDelete, controlsElement);

    newBookmarkElement.id = "bookmark-" + bookmark.url.toString().split("-").at(-1);
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("url", bookmark.url);

    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(controlsElement);

    bookmarks.appendChild(newBookmarkElement);
};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement("img");
    controlElement.src = "assets/" + src + ".png";
    controlElement.title = src;
    controlElement.addEventListener("click", eventListener);
    controlParentElement.appendChild(controlElement);
};
//when we press the play button we try to open that question
const onPlay = async e => {
    const bookmarUrl = e.target.parentNode.parentNode.getAttribute("url");
    window.open(bookmarUrl, "_blank");
};
//when we press delete button we want to delete it from current list and memory as well
const onDelete = async e => {
    const bookmarkUrl = e.target.parentNode.parentNode.getAttribute("url");
    console.log(bookmarkUrl);
    const bookmarkElementToDelete = document.getElementById(
        "bookmark-" + bookmarkUrl.toString().split("-").at(-1)
    );
    console.log(bookmarkElementToDelete);
    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);
    await removeFromMemory(bookmarkUrl);
};

async function removeFromMemory(urlToDelete) {
    let bookmarkData = []
    chrome.storage.sync.get([problemListKey], (data) => {
        bookmarkData = data[problemListKey] ? JSON.parse(data[problemListKey]) : [];

        let foundIndex = -1;
        for (let index = 0; index < bookmarkData.length; index++) {
            if (bookmarkData[index].url == urlToDelete) {
                foundIndex = index; break;
            }
        }

        if (foundIndex > -1) {
            bookmarkData.splice(foundIndex, 1);
            chrome.storage.sync.set({
                [problemListKey]: JSON.stringify(bookmarkData)
            });
        }
    });
}







