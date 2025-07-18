const puzzles = ["Foo Bar Baz Testing Testing One Two Three Hello World", "HeLLO its a LemOncHeLLO"].sort((a, b) => Math.random() - 0.5)
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const randomAlphabet = [...alphabet].sort((a, b) => Math.random() - 0.5)
const alphabetMapping = new Array(alphabet.length)
alphabetMapping.fill("-")
console.log(alphabet)
let currentPuzzle = puzzles.pop()

function findAlphabetNum(letter) {
    for (let j = 0; j < alphabet.length; j++) {
        if (letter.toUpperCase() === alphabet[j]) {
            console.log("found letter " + alphabet[j] + " at position " + j)
            return j
        }
    }
    console.log("couldn\'t find letter " + letter)
    return "XYZ"
}


function generateCryptogram(code) {
    const main = document.getElementsByTagName("main")[0]
    let sentence = document.createElement("div");
    sentence.setAttribute("class", "sentence");
    for (let i = 0; i < code.length; i++) {
        if (code[i] === " ") {
            main.append(sentence)
            sentence = document.createElement("div")
            sentence.setAttribute("class", "sentence")
        } else {
            let div = document.createElement("div");
            let letter = document.createElement("p");
            let codeLetter = document.createElement("p");
            div.append(letter);
            div.append(codeLetter);
            letter.innerHTML = code[i];
            letter.addEventListener("mouseenter", (e) => {
                let codes = document.querySelectorAll('div.box p:last-child');
                for (let i = 0; i < codes.length; i++) {
                    if (e.target.nextElementSibling.innerText === codes[i].innerText) {
                        codes[i].previousElementSibling.classList.add("sameCode")
                    }
                }
            })
            letter.addEventListener("focus", (e) => {
                let codes = document.querySelectorAll('div.box p:last-child');
                for (let i = 0; i < codes.length; i++) {
                    if (e.target.nextElementSibling.innerText === codes[i].innerText) {
                        codes[i].previousElementSibling.classList.add("sameLetter")
                    }
                }
            })
            letter.addEventListener("mouseleave", (e) => {
                let codes = document.querySelectorAll('div.box p:first-child');
                for (let i = 0; i < codes.length; i++) {
                    codes[i].classList.remove("sameCode")
                }
            })
            let alphabetPos = findAlphabetNum(code[i])
            let letterToUse;
            if (alphabetMapping[alphabetPos] === "-") {
                letterToUse = randomAlphabet.pop()
                console.log("using new letter. chose " + letterToUse)
                alphabetMapping[alphabetPos] = letterToUse
            } else {
                letterToUse = alphabetMapping[alphabetPos]
                console.log("using another " + letterToUse)
            }
            codeLetter.innerHTML = letterToUse
            if (code[i] === code[i].toUpperCase()) {
                letter.innerHTML = code[i]
                div.removeAttribute("tabindex")
            } else {
                letter.innerHTML = "-"
                div.setAttribute("tabindex", "0");
            }
            letter.setAttribute("class", "letter");
            div.setAttribute("class", "box");
            sentence.append(div)
        }
        main.append(sentence)
    }
}
function addListeners() {
    document.addEventListener('keypress', function (e) {
        const input = document.querySelector('div.box:focus p');
        const selectedP = document.querySelector("div.box:focus");
        const otherP = document.querySelectorAll("div.box");
        input.innerHTML = e.key.toUpperCase();
        if (input.innerHTML === " ") {
            input.innerHTML = "-"
        }
        for (let i = 0; i < otherP.length; i++) {
            if (otherP[i] === selectedP) {
                if (i != (otherP.length - 1))
                    if (otherP[i].hasAttribute("tabindex")) {
                        otherP[i + 1].focus();
                    } else {
                        for (let j = i; j < otherP.length; j++) {
                            if (otherP[i].hasAttribute("tabindex")) {
                                otherP[i + 1].focus();
                                break;
                            }
                        }
                    }
            }
        }
        let codes = document.querySelectorAll('div.box p:last-child');
        for (let i = 0; i < codes.length; i++) {
            if (selectedP.lastElementChild.innerText === codes[i].innerText) {
                codes[i].previousElementSibling.innerHTML = e.key.toUpperCase();
            }
        }

    });
}


document.addEventListener("DOMContentLoaded", e => {
    generateCryptogram(currentPuzzle)
    addListeners()
})