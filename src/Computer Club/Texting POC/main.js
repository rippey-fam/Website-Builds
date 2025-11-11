import { data } from "./firebase/firestore.js";

let id = 0;

data.onMessagesUpdate((messages) => {
    document.querySelector("#group-chat").innerHTML = "";
    messages = messages.sort((a, b) => a.id - b.id);
    messages.forEach((message) => {
        if (message.id > id) id = message.id;
        document.querySelector("#group-chat").innerHTML += "<p>" + message.message + "<p>";
    });
});

document.querySelector("#m-button").addEventListener("click", () => {
    data.setMessage({ id: ++id, message: "M: " + document.querySelector("#m-textarea").value });
    document.querySelector("#m-textarea").value = "";
});

document.querySelector("#s-button").addEventListener("click", () => {
    data.setMessage({ id: ++id, message: "S: " + document.querySelector("#m-textarea").value });
    document.querySelector("#m-textarea").value = "";
});
