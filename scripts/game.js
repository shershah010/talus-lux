class Game {
    constructor(name) {
        this.name = name;
        this.gameType = "none";
        this.playerDict = {};
        this.images = [];
    }

    getPlayers() {
        return this.playerDict;
    }

    getPlayer(playerName) {
        return this.playerDict[playerName];
    }

    addPlayer(player) {
        this.playerDict[player.getName()] = player;
    }

    removePlayer(playerName) {
        delete this.playerDict[playerName];
    }

    addImage(path) {
        this.images.add(path);
    }

    removeImageByIndex(index) {
        this.images.splice(index, 1);
    }

    removeImageByValue(path) {
        this.removeImageByIndex(this.images.indexOf(path));
    }

    getName() {
        return this.name;
    }

    getType() {
        return this.gameType;
    }

    getImages() {
        return this.images;
    }

    getImage(index) {
        return this.images[index];
    }

    summary() {
        let summary = "";
        summary += this.getName() + "\n";
        summary += this.getType() + "\n";
        for (let player in this.getPlayers()) {
            summary += this.getPlayer(player).summary() + "\n";
        }
        for (let path in this.getImages()) {
            summary += path + "\n";
        }
        summary = summary.trim();
        return summary;
    }
}

class TalesFromTheLoopGame extends Game {
    constructor(name) {
        super(name);
        this.gameType = "tftl";
        this.hideout = "";
    }

    setHideout(hideout) {
        this.hideout = hideout;
    }

    getHideout() {
        return this.hideout;
    }

    getFullGameType() {
        return "Tales from the Loop";
    }

    summary() {
        let summary = super.summary() + "\n";
        summary += "(hideout " + this.getHideout() + ")";
        return summary;
    }

    readFile(data) {
        for (let i = 2; i < data.length - 1; i += 1) {
            this.addPlayer(TalesFromTheLoopPlayer.fromFile(data[i], this));
        }
        let hide = data[data.length - 1].trim();
        this.setHideout(hide.substring(9, hide.length - 1));
        console.log(this.getPlayers());
    }
}

class DungeonsAndDragonsGame extends Game {
    constructor(name) {
        super(name);
        this.gameType = "dnd";
    }

    getFullGameType() {
        return "Dungeons and Dragons";
    }

    readFile(data) {
        for (let line in data) {
            console.log(data[line]);
        }
    }
}
