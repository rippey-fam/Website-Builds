let puzzles = [
  "tO bE Or nOt tO bE",
  "mAy thE fOrCe bE With yOu",
  "i hAvE a dReAm",
  "thErE iS nO pLaCe liKe hOmE",
  "tO iNfiniTy aNd bEyOnD",
  "juSt kEEp sWiMMinG",
  "hOuStOn wE hAvE a prObLeM",
  "i aM yOur fAthEr",
  "fOur scOrE aNd sEvEn yEaRs aGo",
  "lOvE yOur nEiGhbOr aS yOurSeLf",
  "dO uNtO oThErS aS yOu wOuLd hAvE tHeM dO uNtO yOu",
  "thE lOrD iS mY shEphErD",
  "fEaR nOt fOr i aM With yOu",
  "oNe sMaLl sTeP fOr mAn",
  "bEtTeR lAtE thAn nEvEr",
  "pRaCtiCe mAkEs pErFeCt",
  "lOoK bEfOrE yOu lEaP"
].sort((a, b) => Math.random() - 0.5)
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let randomAlphabet;
const alphabetMapping = new Array(alphabet.length)
let currentPuzzle;
let deletedPuzzles = [];

function findAlphabetNum(letter) {
    for (let j = 0; j < alphabet.length; j++) {
        if (letter.toUpperCase() === alphabet[j]) {
            return j
        }
    }
    return null
}

function generateCryptogram(code) {
    let main = document.createElement("main")
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
                alphabetMapping[alphabetPos] = letterToUse
            } else {
                letterToUse = alphabetMapping[alphabetPos]
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
    document.body.insertBefore(main, document.getElementsByClassName("buttonHolder")[0]);
}
function addListeners() {
    document.addEventListener('keypress', function (e) {
        const input = document.querySelector('div.box:focus p');
        const selectedP = document.querySelector("div.box:focus");
        const otherP = document.querySelectorAll("div.box");
        const main = document.getElementsByTagName("main")[0]
        let keyToUse = e.key.toUpperCase()
        if (findAlphabetNum(keyToUse) === null) {
            keyToUse = "-"
        }
        console.log(keyToUse)
        input.innerHTML = keyToUse
        for (let i = 0; i < otherP.length; i++) {
            if (otherP[i] === selectedP) {
                if (i != (otherP.length - 1)) {
                    if (otherP[i + 1].hasAttribute("tabindex")) {
                        otherP[i + 1].focus()
                        break
                    } else {
                        for (let j = i; j < otherP.length; j++) {
                            if (otherP[j + 1].hasAttribute("tabindex")) {
                                otherP[j + 1].focus()
                                break
                            }
                        }
                    }
                }
            }
        }
        let codes = document.querySelectorAll('div.box p:last-child');
        for (let i = 0; i < codes.length; i++) {
            if (selectedP.lastElementChild.innerText === codes[i].innerText) {
                codes[i].previousElementSibling.innerHTML = keyToUse;
            }
        }
        let currentlySolvedCode = []
        for(let sentence of main.childNodes){
            let word = []
            for(let letterDiv of sentence.childNodes){
                word.push(letterDiv.firstChild.innerHTML)
            }
            currentlySolvedCode.push(word.join(""))
        }
        currentlySolvedCode = currentlySolvedCode.join(" ")
        if(currentlySolvedCode === currentPuzzle.toUpperCase()){
            setTimeout(()=>{winGame()}, 10)
        }
    });
    document.addEventListener("keydown", function (e) {
        const selectedP = document.querySelector("div.box:focus");
        const otherP = document.querySelectorAll("div.box");
        if (e.key === "ArrowRight") {
            for (let i = 0; i < otherP.length; i++) {
                if (otherP[i] === selectedP) {
                    if (i != (otherP.length - 1)) {
                        if (otherP[i + 1].hasAttribute("tabindex")) {
                            otherP[i + 1].focus()
                            break
                        } else {
                            for (let j = i; j < otherP.length; j++) {
                                if (otherP[j + 1].hasAttribute("tabindex")) {
                                    otherP[j + 1].focus()
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }
        if (e.key === "ArrowLeft") {
            for (let i = 0; i < otherP.length; i++) {
                if (otherP[i] === selectedP) {
                    if (i != 0) {
                        if (otherP[i - 1].hasAttribute("tabindex")) {
                            otherP[i - 1].focus()
                            break
                        } else {
                            for (let j = i; j > 1; j--) {
                                if (otherP[j - 1].hasAttribute("tabindex")) {
                                    otherP[j - 1].focus()
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }
        if (e.key === "Backspace") {
            selectedP.firstElementChild.innerHTML = "-"
            for (let i = 0; i < otherP.length; i++) {
                if (otherP[i] === selectedP) {
                    if (i != 0) {
                        if (otherP[i - 1].hasAttribute("tabindex")) {
                            otherP[i - 1].focus()
                            break
                        } else {
                            for (let j = i; j > 1; j--) {
                                if (otherP[j - 1].hasAttribute("tabindex")) {
                                    otherP[j - 1].focus()
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}

function newPuzzle(confirmStart) {
    if (confirmStart && !confirm("Do you really want to start a new puzzle?")) {
        return
    }
    document.getElementsByTagName("main")[0].remove()
    if (puzzles.length === 0) {
        puzzles = [...deletedPuzzles]
        deletedPuzzles = []
    }
    currentPuzzle = puzzles.pop()
    console.log(currentPuzzle)
    deletedPuzzles.unshift(currentPuzzle)
    randomAlphabet = [...alphabet].sort((a, b) => Math.random() - 0.5)
    console.log("random alphabet: " + randomAlphabet)
    alphabetMapping.fill("-")
    generateCryptogram(currentPuzzle)
}

function restartPuzzle() {
    if (!confirm("Do you really want to reset?")) {
        return
    }
    document.getElementsByTagName("main")[0].remove()
    console.log(currentPuzzle)
    console.log("random alphabet: " + randomAlphabet)
    generateCryptogram(currentPuzzle)
}

function winGame(){
    const main = document.getElementsByTagName("main")[0]
    main.setAttribute("class", "winScreen");
    main.innerHTML += '<div class = "winTextVisible">You WON!</div>'
    for(let sentence of main.childNodes){
            for(let letterDiv of sentence.childNodes){
                letterDiv.removeAttribute("tabindex")
            }
        }
}

document.addEventListener("DOMContentLoaded", e => {
    addListeners(false)
    newPuzzle()
})