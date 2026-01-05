import { data } from "./firebase/firestore.js";

let id = 0;
let name;
// if it's not working, it might be because you need to change the rules at https://console.firebase.google.com/project/back-attack-poc/firestore/databases/-default-/security/rules
data.onMessagesUpdate((messages) => {
    document.querySelector("#group-chat").innerHTML = "";
    messages = messages.sort((a, b) => a.id - b.id);
    messages.forEach((message) => {
        if (message.id > id) id = message.id;
        if (message.message.trim() !== "")
            document.querySelector("#group-chat").innerHTML += "<p>" + message.message + "<p>";
    });
});

document.querySelector("#send-button").addEventListener("click", () => {
    if (document.querySelector("#send-textarea").value.trim() !== "") {
        data.setMessage({ id: ++id, message: `${name}: ` + document.querySelector("#send-textarea").value.trim() });
        document.querySelector("#send-textarea").value = "";
    }
});

document.querySelector("#popup > div > button").addEventListener("click", () => {
    name = document.querySelector("#popup > div > textarea").value.trim() || "Anonymous";
    document.querySelector("#popup").style.display = "none";
});
