class Player {
    constructor(name, game){
        this.name = name;
        this.game = game;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    getGame() {
        return this.game;
    }

    summary() {
        let summary = "";
        summary += "(name " + this.getName() + ")";
        return summary;
    }
}

class TalesFromTheLoopPlayer extends Player {
    constructor(name, game, age, type, ILP, luckPoints, drive, anchor, problem, pride, description, favoriteSong, relationshipDict, items, notes, attributes, conditions, skills, experience) {
        super(name, game);
        this.age = age;
        this.type = type;
        this.initalLuckPoints = ILP;
        this.luck = luckPoints;
        this.drive = drive;
        this.anchor = anchor;
        this.problem = problem;
        this.pride = pride;
        this.description = description;
        this.favSong = favoriteSong;
        this.relationshipDict = relationshipDict;
        this.items = items;
        this.notes = notes;
        this.attributes = attributes;
        this.conditions = conditions;
        this.skills = skills;
        this.experience = experience;
    }

    get(val) {
        let res = this[val];
        if (val.includes("item")) {
            res = this.getItem(val);
        } else if (val.includes("kid") || val.includes("npc")) {
            res = this.getRelationship(val);
        } else if (val in this.getAttributes()) {
            res = parseInt(this.getAttribute(val), 10);
        } else if (val in this.getSkills()) {
            res = parseInt(this.getSkill(val), 10);
        } else if (val in this.getConditions()) {
            res = this.getCondition(val);
        }
        if (res == undefined) {
            res = "";
        } else if (this[val] == parseInt(this[val], 10)) {
            return parseInt(this[val], 10);
        }
        return res;
    }

    setAge(age) {
        this.age  = age;
    }

    getAge() {
        return this.age;
    }

    getType() {
        return this.type;
    }

    getInitialLuckPoints() {
        return this.initalLuckPoints;
    }

    setLuckPoints(luckPoints) {
        this.luck = luckPoints;
    }

    getLuckPoints() {
        return this.luck;
    }

    getDrive() {
        return this.drive;
    }

    getAnchor() {
        return this.anchor;
    }

    getProblem() {
        return this.problem;
    }

    setPride(pride) {
        this.pride = pride;
    }

    getPride() {
        return this.pride;
    }

    getDescription() {
        return this.description;
    }

    getFavoriteSong() {
        return this.favSong;
    }

    setRelationship(name, relationship) {
        this.relationshipDict[name] = relationship;
    }

    getRelationships() {
        return this.relationshipDict;
    }

    getRelationship(name) {
        return this.relationshipDict[name];
    }

    addItem(item, modifier) {
        this.items[item] = modifier;
    }

    getItem(item) {
        return this.items[item];
    }

    getItems() {
        return this.items;
    }

    removeItemByIndex(index) {
        if (index > 0) {
            this.items.splice(index, 1);
        }
    }

    removeItemByValue(value) {
        this.removeItemByIndex(this.items.indexOf(value));
    }

    setNotes(notes) {
        this.notes = notes;
    }

    getNotes() {
        return this.notes;
    }

    appendNotes(note) {
        this.notes += "\n" + note;
    }

    setAttribute(attribute, value) {
        this.attributes[attribute] = value;
    }

    getAttribute(attribute) {
        return this.attributes[attribute];
    }

    getAttributes() {
        return this.attributes;
    }

    setCondition(condition, value) {
        this.conditions[condition] = value;
    }

    getCondition(condition) {
        return this.conditions[condition];
    }

    getConditions() {
        return this.conditions;
    }

    setSkill(skill, value) {
        this.skills[skill] = value;
    }

    getSkill(skill) {
        return this.skills[skill];
    }

    getSkills() {
        return this.skills
    }

    incrementExperience() {
        this.experience += 1;
    }

    getExperience() {
        return this.experience;
    }

    rest() {
        setLuckPoints(this.initalLuckPoints);
        setPride(true);
        for (let c in this.getConditions()) {
            this.setCondition(c, false);
        }
    }

    useLuck() {
        if (this.luck == 0) {
            return "No luck left";
        } else {
            this.luck -= 1;
        }
    }

    getNumberOfConditions() {
        let conditions = 0;
        for (let c in this.getConditions()) {
            if (this.getCondition(c)) {
                conditions += 1;
            }
        }
        return conditions;
    }

    roll(value, modifer) {
        value = value.trim();
        if (this.getCondition("broken")) {
            return 0;
        }
        let successes = parseInt(modifer, 10);
        if (value in this.getAttributes()) {
            successes += this.getAttribute(value);
        } else {
            successes += this.getSkill(value);
            if (["sneak", "force", "move"].includes(value)) {
                successes += this.getAttribute("body");
            } else if (["tinker", "program", "calculate"].includes(value)) {
                successes += this.getAttribute("tech");
            } else if (["contact", "charm", "lead"].includes(value)) {
                successes += this.getAttribute("heart");
            } else if (["investigate", "comprehend", "empathize"].includes(value)) {
                successes += this.getAttribute("mind");
            }
        }
        console.log(successes);
        let s = rollDice(successes, 6);
        successes = s.split("6").length - 1;
        return successes - this.getNumberOfConditions();
    }

    summarizeDict(dict) {
        let summary = "";
        for (let key in dict) {
            summary += "(" + key + " " + dict[key] + ") ";
        }
        return summary.trim();
    }

    summary() {
        let summary = "";
        summary += super.summary() + " ";
        summary += "(age " + this.getAge() + ") ";
        summary += "(type " + this.getType() + ") ";
        summary += "(ILP " + this.getInitialLuckPoints() + ") ";
        summary += "(luck " + this.getLuckPoints() + ") ";
        summary += "(anchor " + this.getAnchor() + ") ";
        summary += "(drive " + this.getDrive() + ") ";
        summary += "(problem " + this.getProblem() + ") ";
        summary += "(pride " + this.getPride() + ") ";
        summary += "(description " + this.getDescription() + ") ";
        summary += "(favSong " + this.getFavoriteSong() + ") ";
        summary += this.summarizeDict(this.getRelationships()) + " ";
        summary += this.summarizeDict(this.getItems()) + " ";
        summary += "(notes " + this.getNotes() + ") ";
        summary += this.summarizeDict(this.getAttributes()) +  " ";
        summary += this.summarizeDict(this.getConditions()) + " ";
        summary += this.summarizeDict(this.getSkills()) + " ";
        summary += "(experience " + this.getExperience() + ")";
        return summary;
    }

    static appendDict(dict, value, token, isNumber) {
        if (value == "" || value == null || value == undefined) {
            return dict;
        }
        let vList = value.split(token);
        if (isNumber) {
            dict[vList[0].trim()] = parseInt(vList[1].trim(), 10);
        } else {
            dict[vList[0].trim()] = vList[1].trim();
        }
        return dict;
    }

    static getInt(str) {
        return parseInt(str, 10);
    }

    static getInitCommands() {
        return {name: "", age: 0, type: "", drive: "", ILP: 0, luck: 0, anchor: "", problem: "", pride: false, description: "", favSong: "", kid_1: "", kid_2: "", kid_3: "", kid_4: "", npc_1: "", npc_2: "",  iconic_item: "",  item_2: "",  item_3: "",  item_4: "", item_5: "", item_6: "",  notes: "", body: 0, tech: 0, heart: 0, mind: 0, upset: false, scared: false, exhausted: false, injured: false, broken: false, sneak: 0, force: 0, move: 0, tinker: 0, program: 0, calculate: 0, contact: 0, charm: 0, lead: 0, investigate: 0, comprehend: 0, empathize: 0, experience: 0, hideout: ""};
    }

    static fromForm(nodes, gameObj) {
        let commands = this.getInitCommands();
        for (let node of nodes) {
            if (node.name != null && node.name != undefined) {
                commands[node.name.trim()] = node.value.trim();
                if (node.type == "checkbox") {
                    node.checked = node.value.trim();
                }
            }
        }
        return TalesFromTheLoopPlayer.readCommands(commands, gameObj);
    }

    static readCommands(commands, gameObj) {
        let relationshipDict = {}, items = {}, attributes = {}, conditions = {}, skills = {};
        for (let key in commands) {
            switch (key) {
                case "kid_1": case "kid_2": case "kid_3": case "kid_4": case "npc_1": case "npc_2":
                    relationshipDict[key] = commands[key]; break;
                case "iconic_item": case "item_2": case "item_3": case "item_4": case "item_5": case "item_6":
                    items[key] = commands[key]; break;
                case "body": case "tech": case "heart": case "mind":
                    attributes[key] = this.getInt(commands[key]); break;
                case "upset": case "scared": case "exhausted": case "injured": case "broken":
                    conditions[key] = (commands[key] === "true"); break;
                case "sneak": case "force": case "move": case "tinker": case "program": case "calculate": case "contact": case "charm": case "lead": case "investigate": case "comprehend": case "empathize":
                    skills[key] = this.getInt(commands[key]); break;
                case "hideout" : gameObj.setHideout(commands[key]); break;
            }
        }
        return new TalesFromTheLoopPlayer(commands["name"], gameObj, this.getInt(commands["age"]), commands["type"], this.getInt(commands["ILP"]), this.getInt(commands["luck"]), commands["drive"], commands["anchor"], commands["problem"], commands["pride"], commands["description"], commands["favSong"], relationshipDict, items, commands["notes"], attributes, conditions, skills, commands["experience"]);
    }

    static fromFile(line, gameObj) {
        let leftPa = 0;
        let command = "";
        let commands = this.getInitCommands();
        for (let c in line) {
            if (line[c] == ")") { leftPa--; }
            if (leftPa > 0) { command += line[c];}
            if (line[c] == "(") { leftPa++; }
            if (leftPa == 0 && command.trim() != "") {
                command = command.trim();
                let c1 = command.substring(0, command.indexOf(" "));
                let c2 =  command.substring(command.indexOf(" ") + 1, command.length);
                commands[c1.trim()] = c2.trim();
                command = "";
            }
        }
        return TalesFromTheLoopPlayer.readCommands(commands, gameObj);
    }
}

class DungeonsAndDragonsPlayer extends Player {
    constructor(name, game, lass, level, background, race, alignment, exp, attributes, perception, inspiration, proficiency, saving_throws, skills, hit_points, temp_hit_points, hit_dice, death_saves, attacks, personality, ideals, bonds, flaws, proficiencies_languages, equipment, features, apperence, backstory, treasure, allies, spellcasting, spell_save, spell_attack_bonus, spells) {
        super(name, game);
        this.class = lass;
        this.level = level;
        this.background = background;
        this.race = race;
        this.alignment = alignment;
        this.exp = exp;
        this.attributes = attributes;
        this.perception = perception;
        this.inspiration = inspiration;
        this.proficiency = proficiency;
        this.saving_throws = saving_throws;
        this.skills = skills;
        this.hit_points = hit_points;
        this.temp_hit_points = temp_hit_points;
        this.hit_dice = hit_dice;
        this.death_saves = death_saves;
        this.attacks = attacks
        this.personality = personality;
        this.ideals = ideals;
        this.bonds = bonds;
        this.flaws = flaws;
        this.proficiencies_languages = proficiencies_languages;
        this.equipment = equipment;
        this.features = features;
        this.apperence = apperence;
        this.backstory = backstory;
        this.treasure = treasure;
        this.allies = allies;
        this.spellcasting = spellcasting;
        this.spell_save = spell_save;
        this.spell_attack_bonus = spell_attack_bonus;
        this.spells = spells;
    }

    get(key) {
        return this[key];
    }

    set(key, value) {
        this[key] = value;
    }
}
