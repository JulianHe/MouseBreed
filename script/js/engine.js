var loadedBreed = JSON.parse(localStorage.getItem("loadedBreed"));
var target;

var engine = {
    /*Target is an object that represents the properties of one target for one scenario
     * @param strictTime integer; If 0 there is no restriction, else x is the number of days
     * @param numberOfMice integer; the total number of mice needed
     * @param gender integer; 0 = male,1=female
     * @param genotyp string; 2 characters
     * @param age integer; the minimal age
     * */
    Target: function (strictTime, numberOfMice, gender, genotyp, age) {
        _strictTime = strictTime;
        _numberOfMice = numberOfMice;
        _gender = gender;
        _genpotyp = genotyp;
        _age = age;
    },

    /*Creating an Array which contains every possible scenario
     * target = [Target,Target,...]*/
    setTarget: function () {
        target = [{strictTime: 0, numberOfMice: 20, gender: 1, genotyp: "--", age: 42}, {
            strictTime: 0,
            numberOfMice: 0,
            gender: 0,
            genotype: "",
            age: 0
        }];
    },

    convertScenario2Index: function (s) {      // get the Index for the Target-Arrayout of the scenarioname
        switch (s) {
            case "easy_1" :
                return 0
                break;
            case "easy_2" :
                return 1
                break;
            default :
                return -1
        }

    },

    updateLoadedBreed: function () {
        var data = localStorage.getItem("loadedBreed");
        loadedBreed = JSON.parse(data);
    },
    /*
     * genotyp mix with length of 2(ex: Ab,AA,...)
     * @param geno1 string with 2 Chars
     * @param geno2 string with 2 Chars
     * @return Array of Genotypes
     */
    mixGenotyp: function (mouseOne, mouseTwo) {
        var x = mouseOne["genotyp"];
        var y = mouseTwo["genotyp"];

        var x1 = x.charAt(0);
        var x2 = x.charAt(1);
        var y1 = y.charAt(0);
        var y2 = y.charAt(1);

        var res1 = x1 + y1;
        var res2 = x1 + y2;
        var res3 = x2 + y1;
        var res4 = x2 + y2;

        var genoarray = [res1, res2, res3, res4];
        /*var randNum = Math.floor((Math.random() * 4) + 1)-1;  */

        return genoarray
    },

    changeCage: function (mouse_ID, old_cage_ID, new_cage_ID) {
        var choosenMouse = loadedBreed.cages[old_cage_ID].mice[mouse_ID];
        /*gewünschte Maus heraussuchen*/
        choosenMouse["cage_id"] = new_cage_ID;
        /*die neue cage_ID wird gesetzt*/
        loadedBreed["cages"][new_cage_ID]["mice"][mouse_ID] = choosenMouse;
        /*choosenMouse wird in den neuen Käfig angefügt*/
        delete loadedBreed["cages"][old_cage_ID]["mice"][mouse_ID];
        /*choosenMouse aus dem Alten Käfig-Objekt löschen*/
    },

    newCage: function (maxNumberMice) {
        var response = $.ajax({
            type: "POST",
            url: "/script/php/ajax/newCage.php",
            data: {max_number_of_mice: maxNumberMice},
            async: false
        }).responseText;
        response = JSON.parse(response);

        if (response.success == true) {
            loadedBreed["cages"][response.id] = {
                id: response.id,
                breed_id: loadedBreed.id,
                id: response.id,
                max_number_of_mice: maxNumberMice,
                mice: {}
            };

            // erfolgreich erstellt

            // Rückgabe?
        } else {

            // nicht erstellt
            addBen("Käfig nicht erstellt", "Der Käfig wurde nicht erstellt, Fehler beim Datenbankzugriff", "Warn");
            // Rückgabe?
        }

    },

    // Legt eine neue Verpaarung an und gibt die ID zurück
    newMating: function (mother_id, father_id) {
        var response = $.ajax({
            type: "POST",
            url: "/script/php/ajax/newMating.php",
            data: {mother_id: mother_id, father_id: father_id},
            async: false
        }).responseText;
        response = JSON.parse(response);

        if (response.success == true) {

            // erfolgreich erstellt

            return response.id;
        } else {

            // nicht erstellt
            // Rückgabe?
        }

    },

    // Erhöt das Alter der Zucht sowie aller Würfe/Verpaarungen mit einem Alter < 22 um 1, Berechnung im php-Skript
    incrementAge: function () {
        var response = $.ajax({
            type: "POST",
            url: "/script/php/ajax/nextDay.php",
            async: false
        }).responseText;
        response = JSON.parse(response);

        if (response.success == true) {

            // erfolgreich

        } else {

            // nicht erfolgreich
        }

    },

    // Gibt die Würfe/Verpaarungen mit dem Alter von 21 Tagen zurück, Berechnung im php-Skript
    getBroods: function () {
        var response = $.ajax({
            type: "POST",
            url: "/script/php/ajax/getBroods.php",
            async: false
        }).responseText;
        response = JSON.parse(response);

        if (response.success == true) {

            // erfolgreich erstellt

            return response.broods;
        } else {

            // nicht erstellt
            // Rückgabe?
        }

    },

    newMouse: function (cage_id, gender, genotyp, weight, mating_id, mother_id, father_id, age, img_name) {

        var response = $.ajax({
            type: "POST",
            url: "/script/php/ajax/newMouse.php",
            data: {
                cage_id: cage_id, gender: gender, genotyp: genotyp, weight: weight, mating_id: mating_id,
                mother_id: mother_id, father_id: father_id, age: age, img_name: img_name
            },
            async: false
        }).responseText;
        response = JSON.parse(response);

        if (response.success == true) {
            loadedBreed['cages'][cage_id]['mice'][response.id] = {
                id: response.id, cage_id: cage_id, gender: gender, name: response.name,
                genotyp: genotyp, weight: weight, mother_id: mother_id, father_id: father_id, age: age,
                img_name: img_name
            };

            // erfolgreich erstellt

            // Rückgabe?
        } else {

            // nicht erstellt
            addBen("Käfig nicht erstellt", "Die Maus wurde nicht erstellt, Fehler beim Datenbankzugriff", "Warn");
            // Rückgabe?
        }

    },

    birth: function () {
        var response = $.ajax({
            type: "POST",
            url: "/script/php/ajax/birth.php",
            async: false
        }).responseText;
        response = JSON.parse(response);
        if (response.success == true) {
            var initial_img_name = "data\img\defaultMausChB.png";
            for (i in response["ready_matings"]) {
                var tmpMaxNumberOFMice = 6;                         //create new cage for mother and her newborn
                engine.newCage(tmpMaxNumberOFMice);
                var curr_mating = i;
                var father_id = response["ready_matings"][i]["father_id"]
                var mother_id = response["ready_matings"][i]["mother_id"]
                var tmp_cage_id = engine.find_newest_cage();
                var genotypArray = engine.mixGenotyp(engine.find_mouse(mother_id), engine.find_mouse(father_id))
                for (k = 0; k <= 5; k++) {
                    var tmp_gender = (Math.random() < 0.5) ? 0 : 1;                           //each new Mouse gets its (random) Gender
                    var initial_weight = 1 + Math.round(Math.random() * 7.5 * 100) / 100;     //each new Mouse gets its (random) Weight
                    engine.newMouse(tmp_cage_id, tmp_gender, genotypArray[k % 4], initial_weight, response["ready_matings"][curr_mating]["id"], mother_id, father_id, 0, initial_img_name)
                }
                engine.changeCage(mother_id, engine.find_cage(mother_id), engine.find_newest_cage()); // move the mother into the new cage
                addBen("Der Wurf ist da", "Der Wurf von der Mutter " + mother_id + " ist nun auf der Welt und in Käfig " + tmp_cage_id + " machen die Kleinen ihre ersten Schritte", "info");
            }
            // erfolgreich erstellt
            return response;

        } else {

            // nicht erstellt
            // Rückgabe?
        }

    },

    find_newest_cage: function () {
        var maxNum = 0;
        for (i in loadedBreed["cages"]) {
            if (parseInt(loadedBreed["cages"][i]["id"]) > maxNum) {
                maxNum = loadedBreed["cages"][i]["id"]
            }
        }
        return maxNum;
    },

    find_cage: function (mouseId) {
        var erg;
        for (i in loadedBreed["cages"]) {
            for (j in loadedBreed["cages"][i]["mice"]) {
                if (loadedBreed["cages"][i]["mice"][j]["id"] == mouseId) {
                    erg = i
                }
            }
        }
        return erg;
    },

    find_mouse: function (mouseId) {
        var erg;
        for (i in loadedBreed["cages"]) {
            for (j in loadedBreed["cages"][i]["mice"]) {
                if (loadedBreed["cages"][i]["mice"][j]["id"] == mouseId) {
                    erg = loadedBreed["cages"][i]["mice"][j]
                }
            }
        }
        return erg;

    },

    save: function () {
        var response = $.ajax({
            type: "POST",
            url: "/script/php/ajax/saveBreed.php",
            data: {breed: JSON.stringify(loadedBreed)},
            dataType: "json",
            async: false
        }).responseText;
        response = JSON.parse(response);
        if (response.success == true) {
            // Erfolgreich gespeichert
        } else {
            // Fehler beim Speichern
        }
    },

    ready2GoOn: function () {
        for (i in loadedBreed["cages"]) {
            var menProblem = false;
            for (j in loadedBreed["cages"][i]["mice"]) {
                if (loadedBreed["cages"][i]["mice"][j]["gender"] == 0) {
                    if (loadedBreed["cages"][i]["mice"][j]["age"] > 69) {
                        if (menProblem) {                                                           //Männer-Konflikt Abfragen
                            addBen("Männchen Konflikt", "Es gibt zum Zeitpunkt der Paarung " +
                                "mehrer Geschlechtsreife Männchen im Käfig " + i + " !!!", "warn");
                            return false
                        } else {
                            menProblem = true
                        }
                    }
                }

            }
        }
        return true
    },

    getGenderOfReadyMice: function () {
        var flag = true;
        var selectedGender = loadedBreed["finished_cage"]["mice"][0]["gender"];
        for (i in loadedBreed["finished_cage"]["mice"]) {
            flag = loadedBreed["finished_cage"]["mice"][i]["gender"] == selectedGender;
        }
        if (flag) {
            return parseInt(selectedGender);
        } else {
            addBen("Verschiedene Geschlechter im Zielkäfig", "Es befinden sich Mäuse mit unterschiedlichen Geschlechtern im Zielkäfig", "warn");
        }
    },

    getGenotypeOfReadyMice: function () {
        var flag = true;
        var selectedGenotype = loadedBreed["finished_cage"]["mice"][0]["genotype"];
        for (i in loadedBreed["finished_cage"]["mice"]) {
            flag = loadedBreed["finished_cage"]["mice"][i]["genotyp"] == selectedGenotype;
        }
        if (flag) {
            return selectedGenotype;
        } else {
            addBen("Verschiedene Genotypen im Zielkäfig", "Es befinden sich Mäuse mit unterschiedlichen Genotypen im Zielkäfig", "warn");
        }
    },

    checkMinimalAge: function (minAge) {
        for (i in loadedBreed["finished_cage"]["mice"]) {
            if (loadedBreed["finished_cage"]["mice"][i]["age"] < minAge) {
                return false
            }
        }

    },

    find_Male: function (index) {
        for (m in loadedBreed["cages"][index]["mice"]) {
            if (parseInt(loadedBreed["cages"][index]["mice"][m]["gender"]) == 0 && parseInt(loadedBreed["cages"][index]["mice"][m]["age"]) > 69) {
                return loadedBreed["cages"][index]["mice"][m]["id"];
            }
        }
        return -1;
    },

    move2Trash: function (mouseId,cageId) {
        engine.changeCage(mouseId,cageId,loadedBreed["trash_cage"])
    }

};

var clock = {

    nextDay: function () {

        if (engine.ready2GoOn()) {
            clock.increaseAge();
            clock.gainWeight();
            clock.pairing();
            engine.birth();
            loadedBreed.age = parseInt(loadedBreed.age) + 1;
            refereshNumberOfDays();
            if (selectedMouse) {                                // refresh the information of the choosen mouse
                clickedMouse(selectedMouse.id);
            }
            if (clock.checkTarget()) {
                alert("Ende")
            }
            ;
        }
        else {
            addBen("Tag wurde NICHT gewechselt", "warn")
        }
    },

    increaseAge: function () {
        for (i in loadedBreed["cages"]) {
            for (j in loadedBreed["cages"][i]["mice"]) {
                loadedBreed["cages"][i]["mice"][j]["age"] = parseInt(loadedBreed["cages"][i]["mice"][j]["age"]) + 1;
            }
        }
        engine.incrementAge(); // increment the age of the unborn mice (via php)

    },

    gainWeight: function () {
        /*addWeight- Arrays zählen für die jeweiligen Mäuse ab 20 age*/
        var addWeightMale = [0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.84, 0.53, 0.53, 0.53, 0.53,
            0.53, 0.53, 0.52, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.24, 0.16,
            0.16, 0.16, 0.16, 0.16, 0.16, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.16, 0.09, 0.09, 0.09, 0.09, 0.09,
            0.09, 0.06, 0.16, 0.16, 0.16, 0.16, 0.16, 0.16, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.16, 0.10, 0.10, 0.10,
            0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.06,
            0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.04, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.06, 0.06, 0.06, 0.06, 0.06,
            0.06, 0.06, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.049];
        var addWeightFemale = [0.69, 0.69, 0.69, 0.69, 0.69, 0.69, 0.69, 0.66, 0.40, 0.40, 0.40, 0.40, 0.40, 0.40,
            0.40, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.06, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.07, 0.07, 0.07,
            0.07, 0.07, 0.07, 0.08, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.06, 0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.08,
            0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.04, 0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.08, 0.14, 0.14, 0.14, 0.14,
            0.14, 0.14, 0.16, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.06, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.06, 0.04,
            0.04, 0.04, 0.04, 0.04, 0.04, 0.06, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.06, 0.06, 0.06, 0.06, 0.06,
            0.06, 0.04, 0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.08, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.04];
        for (i in loadedBreed["cages"]) {
            for (j in loadedBreed["cages"][i]["mice"]) {
                if (loadedBreed["cages"][i]["mice"][j]["age"] > 20) {
                    if (loadedBreed["cages"][i]["mice"][j]["gender"] == 0) {
                        loadedBreed["cages"][i]["mice"][j]["weight"] = parseInt(loadedBreed["cages"][i]["mice"][j]["weight"]) + addWeightFemale[loadedBreed["cages"][i]["mice"][j]["age"] - 20];
                    } else {
                        loadedBreed["cages"][i]["mice"][j]["weight"] = parseInt(loadedBreed["cages"][i]["mice"][j]["weight"]) + addWeightMale[loadedBreed["cages"][i]["mice"][j]["age"] - 20];
                    }
                }
            }
        }
    },



    pairing: function () {
        for (i in loadedBreed["cages"]) {
            theManId = engine.find_Male(i);
            if (theManId > 0) {
                for (m in loadedBreed["cages"][i]["mice"]) {
                    if (parseInt(loadedBreed["cages"][i]["mice"][m]["age"]) > 69) {
                        if (parseInt(loadedBreed["cages"][i]["mice"][m]["gender"]) == 1) {
                            if (parseInt(loadedBreed["cages"][i]["mice"][m]["pregnant"]) == 0) {
                                loadedBreed["cages"][i]["mice"][m]["pregnant"] = 1;
                                engine.newMating(loadedBreed["cages"][i]["mice"][m]["id"], theManId);
                                addBen("Neue Schwangerschaft", "Die Maus mit der ID " + loadedBreed["cages"][i]["mice"][m]["id"] + " ist jetzt Schwanger", "info");
                            }
                        }
                    }
                }
            }
        }
    },

    checkTarget: function () {
        engine.setTarget();                                          // Create the Target-Array, wich contains the information about the endconditions
        var rtn = true;
        var tmp = target[engine.convertScenario2Index(loadedBreed["scenario"])];
        rtn = rtn && (tmp.strictTime >= loadedBreed["age"]); // check strictTime
        rtn = rtn && (tmp["numberOfMice"] <= loadedBreed["finished_cage"]["mice"].length); // check Number of Mice
        rtn = rtn && (parseInt(tmp["gender"]) == engine.getGenderOfReadyMice);
        rtn = rtn && (parseInt(tmp["genotype"]) == engine.getGenotypeOfReadyMice());
        rtn = rtn && engine.checkMinimalAge();
        return rtn;
    }
};

/*
 --------------------------------------------------------------------------------------------------------------------
 engine|
 ------
 ,

 feed: function(){
 for(i in loadedBreed["cages"]){
 i["plate"] += 10;
 }
 },

 giveWaterToDrink: function(){
 for(i in loadedBreed["cages"]){
 i["bottle"] += 10;
 }
 },

 handInMouse: function(thisMouse){

 engine.deleteFromBreed(thisMouse);
 },

 burry: function(cageID,mouseID){


 }

 setOwnGender : function(mouse_ID,userGender){
 loadedBreed["currentCage"]["mice"][mouse_ID]["userGender"] = userGender;
 },

 ------------------------------------------------------------------------------------------------------
 clock|
 -----
 checkGenderProblem : function(){
 var problem = false;
 for(i in loadedBreed["cages"]){
 var menList = [];
 for(j in loadedBreed["cages"][i]["mice"]){
 if(loadedBreed["cages"][i]["mice"][j]["gender"]==0 && loadedBreed["cages"][i]["mice"][j]["age"]>69){
 menList.push(loadedBreed["cages"][i]["mice"][m])
 }
 }
 if(menList.length > 1){
 problem = true;
 addBen("Männchen Konflikt","Es gibt zum Zeitpunkt der Paarung mehrer Geschlechtsreife Männchen im Käfig "+i+" !!!","Error");
 };
 }
 return problem;
 }

 eat: function(){
 for(i in loadedBreed["cages"]){
 for(j in i["mice"]){
 i["plate"] -= j["age"]*0.1 //Annahme Mäuse fressen 1/10 ihres Alters in Gramm
 }
 }
 },

 drink: function(){
 for(i in loadedBreed["cages"]){
 for(j in i["mice"]){
 i["bottle"] -= j["age"]*0.1 //Annahme Mäuse trinken 1/10 ihres Alters in ml
 }
 }
 }
 */

/*checkPubescent: function () {
 for (i in loadedBreed["cages"]) {
 for(j in loadedBreed["cages"][i]["mice"]){
 if(j["age"] > 69){
 j.pubescent = true;
 }else{
 j.pubescent = false;
 }

 }


 }
 }

 checkDeadMouse: function () {
 for(i in loadedBreed["cages"]){
 for(j in loadedBreed["cages"][i]["mice"]){
 //if(!loadedBreed["cages"][i]["mice"][j]["alive"]){engine.burry(i,j)}
 }
 }
 },

 */
/*increaseNumberOfDay: function(){
 var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
 var firstDate = new Date();
 var arrayDate = loadedBreed["time_of_creation"].split("-");
 var secondDate = new Date(arrayDate[0],arrayDate[1],arrayDate[2]);
 var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
 numberOfDays = diffDays;
 },*/