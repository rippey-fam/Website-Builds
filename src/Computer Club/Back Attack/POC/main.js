import "./firebase/firestore.js";

document.querySelector("#m-button").addEventListener("click", () => {
    document.querySelector("#group-chat").innerHTML += "<p>M: " + document.querySelector("#m-textarea").value + "<p>";
    document.querySelector("#m-textarea").value = "";
});
