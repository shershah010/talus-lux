/* Creates new game-------------------------------------------------------------- */
function newGameInit() {
    let modal = document.querySelector(".modal");
    let add = document.querySelector(".new").addEventListener("click", function(e) {
        modal.style.display = "block";
    });

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.querySelector("input").value = "";
            modal.style.display = "none";
        }
    }

    modal.querySelector(".close").addEventListener("click", function(e) {
        modal.querySelector("input").value = "";
        modal.style.display = "none";
    });

    let form = modal.querySelector("form");
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        let gameName = form.querySelector("input[name=\"name\"]").value;
        let dropdown = form.querySelector("select[name=\"type\"]");
        let gameType = dropdown.options[dropdown.selectedIndex].value;
        if (gameName in games) {
            form.querySelector("input[name=\"name\"]").classList.add("error");
        } else {
            createNewGame(gameName, gameType);
            modal.style.display = "none";
        }
        form.querySelector("input[name=\"name\"]").value = "";
    });
}

function createNewGame(gameName, gameType) {
    let tempGameObject;
    switch (gameType) {
        case "tftl": tempGameObject = new TalesFromTheLoopGame(gameName); break;
        case "dnd": tempGameObject = new DungeonsAndDragonsGame(gameName); break;
    }
    games[gameName] = tempGameObject;
    fs.writeFileSync(gamePath + "\\" + gameName + ".txt", tempGameObject.summary(), "utf8");
    updateAside(tempGameObject);
}

function readGame(data) {
    let tempGameObject;
    if (data[1].trim() == "tftl") {
        tempGameObject = new TalesFromTheLoopGame(data[0]);
    } else if (data[1].trim() == "dnd") {
        tempGameObject = new DungeonsAndDragonsGame(data[0]);
    }
    tempGameObject.readFile(data);
    games[data[0]] = tempGameObject;
    return tempGameObject;
}
/* ------------------------------------------------------------------------------ */

/* Functions for aside ---------------------------------------------------------- */
function asideInit() {
    let files = fs.readdirSync(gamePath, "utf8");
    for (let f in files) {
        if (files[f] == ".gitignore") {
            continue;
        }
        let data = fs.readFileSync(gamePath + "\\" + files[f], "utf8");
        updateAside(readGame(data.split("\n")));
    }
}

function updateAside(game) {
    let gameList = document.querySelector(".aside .game_list");
    let gameLabel = document.createElement("li");
    gameLabel.innerHTML = game.getName();
    gameLabel.addEventListener("click", function(e) {
        showGamePage(game);
    });
    gameList.appendChild(gameLabel);
}
/* ------------------------------------------------------------------------------ */

/* Main page -------------------------------------------------------------------- */
function tabInit() {
    let input = document.querySelector(".main #tab1");
    let del = document.querySelector(".main label .delete");
    input.addEventListener("click", function(e) {
        input.checked = true;
        if (document.querySelector(".show_page") != null) {
            document.querySelector(".show_page").classList.remove("show_page");
        }
        document.querySelector("#c_tab1").classList.add("show_page");
    });
    del.addEventListener("click", function(e) {
        input.remove();
        document.querySelector(".main label[for=\"tab1\"]").remove();
        document.querySelector("#c_tab1").remove();
        for (let t in tabs) {
            tabs[t].checked = true;
            document.querySelector("#c_" + tabs[t].id).classList.add("show_page");
            break;
        }
    });
    tabs["welcome"] = input;
}

function showGamePage(game) {
    createTab(game.getName());
    createGameSection(game);
}

function createTab(tabName) {
    if (tabName in tabs) {
        tabs[tabName].checked = true;
        return;
    }
    tabLevel += 1;
    const myTab = tabLevel;
    let tabTemplate = document.querySelector("#tab_template");
    let tabClone = tab_template.content.cloneNode(true);
    tabClone.querySelector("input").id = "tab" + myTab;
    tabClone.querySelector("input").checked = true;
    tabClone.querySelector("input").addEventListener("click", function(e) {
        document.querySelector("#tab" + myTab).checked = true;
        if (document.querySelector(".show_page") != null) {
            document.querySelector(".show_page").classList.remove("show_page");
        }
        document.querySelector("#c_tab" + myTab).classList.add("show_page");
    });
    tabClone.querySelector("label").setAttribute("for", "tab" + myTab);
    tabClone.querySelector("label").innerHTML = tabName + "&emsp;<span class=\"delete\">&#x26CC;</span>";
    tabClone.querySelector(".delete").addEventListener("click", function(e) {
        delete tabs[tabName];
        selectedPlayer = null;
        document.querySelector("#tab" + myTab).remove();
        document.querySelector("label[for=\"tab" + myTab + "\"]").remove();
        document.querySelector("#c_tab" + myTab).remove();
        for (let t in tabs) {
            tabs[t].checked = true;
            document.querySelector("#c_" + tabs[t].id).classList.add("show_page");
            return;
        }
    });
    tabs[tabName] = tabClone.querySelector("input");
    document.querySelector(".tabs-here").appendChild(tabClone);
}

function createGameSection(game) {
    let sectionTemplate = document.querySelector("#game_content_template");
    let sectionClone = sectionTemplate.content.cloneNode(true);
    sectionClone.querySelector("section").id = "c_tab" + tabLevel;
    if (document.querySelector(".show_page") != null) {
        document.querySelector(".show_page").classList.remove("show_page");
    }
    sectionClone.querySelector("section").classList.add("show_page");
    sectionClone.querySelector("h1").innerHTML = game.getName();
    sectionClone.querySelector("h2").innerHTML = game.getFullGameType();
    for (let player in game.getPlayers()) {
        sectionClone.querySelector("section").appendChild(createPlayerSummary(game.getPlayer(player)));
    }
    sectionClone.querySelector(".new").addEventListener("click", function(e) {
        createTab("New Player - " + game.getType());
        let playerTemplate = document.querySelector("#player_content_template");
        let playerClone = playerTemplate.content.cloneNode(true);
        playerClone.querySelector("section").id = "c_tab" + tabLevel;
        playerClone.querySelector("section").appendChild(charaterSheet(game));
        document.querySelector(".main").appendChild(playerClone);
        document.querySelector("#tab" + tabLevel).checked = true;
        document.querySelector(".show_page").classList.remove("show_page");
        document.querySelector("#c_tab" + tabLevel).classList.add("show_page");
    });
    document.querySelector(".main").appendChild(sectionClone);
}

function createPlayerSummary(player) {
    let sec = document.createElement("div");
    let substrings;
    switch (player.getGame().getType().trim()) {
        case "tftl" : substrings = ["name", "body", "tech", "heart", "mind", "true"]; break;
        case "dnd" : substrings = []; break;
    }
    let summary = player.summary().split(/\x29\s*\x28/);
    let regex = new RegExp(substrings.join("|"));
    for (let s of summary) {
        let p = document.createElement("p");
        s = s.trim();
        s = s.replace("(", "");
        s = s.replace(")", "");
        if (s.includes(" ")) {
            if (regex.test(s)) {
                p.innerHTML = s;
                sec.appendChild(p);
            }
        }
    }
    sec.classList.add("player");
    sec.addEventListener("click", function(e) {
        if (selectedPlayer != null) {
            document.querySelector(".selected_player").classList.remove("selected_player");
        }
        selectedPlayer = player;
        sec.classList.add("selected_player");
    });
    sec.addEventListener("dblclick", function() {
        createTab(player.getName());
        let playerTemplate = document.querySelector("#player_content_template");
        let playerClone = playerTemplate.content.cloneNode(true);
        playerClone.querySelector("section").id = "c_tab" + tabLevel;
        playerClone.querySelector("section").appendChild(charaterSheet(player.getGame(), player));
        document.querySelector(".main").appendChild(playerClone);
        document.querySelector("#tab" + tabLevel).checked = true;
        document.querySelector(".show_page").classList.remove("show_page");
        document.querySelector("#c_tab" + tabLevel).classList.add("show_page");
    });
    return sec;
}

function charaterSheet(game, player) {
    let element = document.createElement("div");
    element.classList.add("character_sheet");
    switch (game.getType()) {
        case "tftl" :
            element.innerHTML = fs.readFileSync(typePath + "\\tftl\\index.html", "utf8"); break;
        case "dnd" :
            element.innerHTML = fs.readFileSync(typePath + "\\dnd\\index.html", "utf8"); break;
    }
    element.querySelector(".charForm").addEventListener("submit", function(e) {
        e.preventDefault();
        let children = element.querySelector("form").getElementsByTagName("*");
        let tempPlayerObj;
        switch (game.getType().trim()) {
            case "tftl" : tempPlayerObj = TalesFromTheLoopPlayer.fromForm(children, game); break;
            case "dnd" : tempPlayerObj = DungeonsAndDragonsPlayer.fromForm(children, game); break;
        }
        game.addPlayer(tempPlayerObj);
        fs.writeFileSync(gamePath + "\\" + game.getName().trim() + ".txt", game.summary());
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });
    if (player != undefined) {
        let children = element.querySelector("form").getElementsByTagName("*");
        for (let node of children) {
            if (node.name != undefined && node.value != "submit") {
                node.value = player.get(node.name.trim());
                if (node.type == "checkbox") {
                    node.checked = (player.get(node.name.trim()) === "true");
                }
            }
        }
        switch (game.getType().trim()) {
            case "tftl" :
                element.querySelector("textarea[name=\"hideout\"]").value = player.getGame().getHideout(); break;
            case "dnd" :
                break;
        }
    }
    let checkboxes = element.querySelectorAll("input[type=\"checkbox\"]");
    for (let checkbox of checkboxes) {
        checkbox.addEventListener("change", function(e) {
            if (checkbox.checked) {
                checkbox.value = true;
                checkbox.checked = true;
            } else {
                checkbox.value = false;
                checkbox.checked = false;
            }
        });
    }
    return element;
}
/* ------------------------------------------------------------------------------ */
/* Roll functions --------------------------------------------------------------- */
function rollInit() {
    document.querySelector(".roll form").addEventListener("submit", function(e) {
        e.preventDefault();
        let p = document.createElement("p");
        let command = document.querySelector(".roll form input").value.trim();
        document.querySelector(".roll form input").value = "";
        if (command.match(/[0-9]+d[0-9]+/)) {
            p.innerHTML = rollDice(command.substring(0, command.indexOf("d")),
                                   command.substring(command.indexOf("d") + 1, command.length));
        }  else if (selectedPlayer != null) {
            command = command.split(" ");
            command[1] = command[1] != undefined ? command[1] : 0;
            p.innerHTML = selectedPlayer.roll(command[0], command[1]);
        } else {
            return;
        }
        document.querySelector(".roll form p").prepend(p);
        let ps = document.querySelectorAll(".roll form p");
        for (let p = ps.length - 1; p > 5; p -= 1) {
            ps[p].remove();
        }
    });
}
/* ------------------------------------------------------------------------------ */

function start() {
    newGameInit();
    asideInit();
    tabInit();
    rollInit();
}

start();
