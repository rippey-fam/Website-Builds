import { data } from "./firebase/firestore.js";

document.querySelector("#m-button").addEventListener("click", () => {
    document.querySelector("#group-chat").innerHTML += "<p>M: " + document.querySelector("#m-textarea").value + "<p>";
    data.setMessage({ name: "Matthew", message: "M: " + document.querySelector("#m-textarea").value });
    document.querySelector("#m-textarea").value = "";
});

document.querySelector("#s-button").addEventListener("click", () => {
    document.querySelector("#group-chat").innerHTML += "<p>S: " + document.querySelector("#m-textarea").value + "<p>";
    data.setMessage({ name: "Scott", message: "S: " + document.querySelector("#m-textarea").value });
    document.querySelector("#m-textarea").value = "";
});

data.onMessagesUpdate((messages) => {
    console.log("Messages: ", messages);
});
