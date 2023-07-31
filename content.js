// we talk about all the changes that we're making on the website(plus button on website)

let problemListKey = 'algozenith_problems';
newBookmark = window.location.href;
//all this happens when the url is matched 

//whenever the page loads add the bookmark button
window.addEventListener("load", () => {
	addBookmarkButton();
});

function addBookmarkButton() {
	//styling and specifications of the bookmark button
	const bookmarkBtn = document.createElement("img");
	bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
	bookmarkBtn.className = "btn_ref";
	bookmarkBtn.title = "Click to bookmark current timestamp";
	bookmarkBtn.style.height = "30px";
	bookmarkBtn.style.width = "30px";
	//here we are simply adding a bookmark button just below the ask doubt tab
	azAskDoubt = document.getElementsByClassName(
		"btn btn_ref text_white ml-1"
	)[0].parentElement.parentElement;
	azAskDoubt.appendChild(bookmarkBtn);//there was already class of ask doubt in the website we just added the bookmark button at the end of it

//whenever bookmark button is clicked "addNewBookmarkEventHandler" this function is called
	bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
}

const addNewBookmarkEventHandler = async () => {
	//the first step in this function is to call "fetchbookmark"->which will load all the pre-stored question 
	currentProblemBookmarks = await fetchBookmarks();
	// problemName-> this is storing current problem by accessing its div class
	problemName =
		document.getElementsByClassName("col-8 my-auto")[0].lastChild
			.textContent;
	//this is storing url of the question and its name
	const newBookmarkObj = {
		url: newBookmark,
		desc: problemName,
	};
	let addNewToBookmark = true;

	//you traverse in the already existing set of problems in todo app and no new problem is added if its already present
	for (let i = 0; i < currentProblemBookmarks.length; i++) {
		if (currentProblemBookmarks[i].url == newBookmark) {
			addNewToBookmark = false;
		}
	}
	//but if it does not match with any pre-existing set of problems or there is no pre-existing problem in todo extension-> we'll add a new problem
	if (addNewToBookmark) {
		chrome.storage.sync.set({
			[problemListKey]: JSON.stringify([
				...currentProblemBookmarks,
				newBookmarkObj,
			]),
		});
	}
};


//this function is simply fecthing the already stored problems in the todo list and displaying in the popup using resolve
const fetchBookmarks = () => {
	return new Promise((resolve) => {
		// in this line it is syncing with the storage of website and displaying using resolve
		chrome.storage.sync.get([problemListKey], (obj) => {
			resolve(obj[problemListKey] ? JSON.parse(obj[problemListKey]) : []);
		});
	});
};
