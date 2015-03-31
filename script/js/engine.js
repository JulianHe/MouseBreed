var loadedBreed= JSON.parse(localStorage.getItem("loadedBreed"));

var engine = {

    /*
     * genotyp mix with length of 2(ex: Ab,AA,...)
     * @param geno1 string with 2 Chars
     * @param geno2 string with 2 Chars
     * @return one possible Genotypes, each one has 25%
     */
    mixGenotyp: function (mouseOne, mouseTwo) {

        var x = mouseOne.genotyp;
        var y = mouseTwo.genotyp;

        var x1 = x.charAt(0);
        var x2 = x.charAt(1);
        var y1 = y.charAt(0);
        var y2 = y.charAt(1);

        var res1 = x1 + y1;
        var res2 = x1 + y2;
        var res3 = x2 + y1;
        var res4 = x2 + y2;

        var genoarray = [res1, res2, res3, res4];
        var randNum = Math.floor((Math.random() * 4) + 1);

        return genoarray[randNum]
    },

    changeCage: function(mouse_ID,old_cage_ID,new_cage_ID){
        var choosenMouse = loadedBreed.cages[old_cage_ID].mice[mouse_ID];   /*gewünschte Maus heraussuchen*/
        choosenMouse["cage_id"] = new_cage_ID;                              /*die neue cage_ID wird gesetzt*/
        loadedBreed["cages"][new_cage_ID]["mice"][mouse_ID] = choosenMouse; /*choosenMouse wird in den neuen Käfig angefügt*/
        delete loadedBreed["cages"][old_cage_ID]["mice"][mouse_ID];         /*choosenMouse aus dem Alten Käfig-Objekt löschen*/
    },

    newCage: function(maxNumberMice){

        var response = $.ajax({
            type: "POST",
            url: "/script/php/ajax/newCage.php",
            data: { max_number_of_mice: maxNumberMice },
            async: false
        }).responseText;
        response = JSON.parse(response);

        if(response.success == true) {
            loadedBreed["cages"][response.id] = {breed_id: loadedBreed.id, id: response.id, max_number_of_mice: maxNumberMice, mice: {}};

            // erfolgreich erstellt

            // Rückgabe?
        } else {

            // nicht erstellt
            addBen("Käfig nicht erstellt","Der Käfig wurde nicht erstellt, Fehler beim Datenbankzugriff","Warn");
            // Rückgabe?
        }

    },

    newMouse: function(cage_id, gender, name, genotyp, weight, mother_id, father_id, age, img_name){

        var response = $.ajax({
            type: "POST",
            url: "/script/php/ajax/newMouse.php",
            data: { cage_id: cage_id, gender: gender, name: name, genotyp: genotyp, weight: weight, mother_id: mother_id,
                    father_id: father_id, age: age, img_name: img_name },
            async: false
        }).responseText;
        response = JSON.parse(response);

        if(response.success == true) {
            loadedBreed['cages'][cage_id]['mice'][response.id] = { cage_id: cage_id, gender: gender, name: name,
                genotyp: genotyp, weight: weight, mother_id: mother_id, father_id: father_id, age: age,
                img_name: img_name };

            // erfolgreich erstellt

            // Rückgabe?
        } else {

            // nicht erstellt
            addBen("Käfig nicht erstellt","Die Maus wurde nicht erstellt, Fehler beim Datenbankzugriff","Warn");
            // Rückgabe?
        }

    },

    setOwnGender : function(mouse_ID,userGender){
        loadedBreed["currentCage"]["mice"][mouse_ID]["userGender"] = userGender;
    }
}

var clock = {

    nextDay: function (breed) {
        breed[timeUnit] = breed[timeUnit]+1;
        gainWeight(breed[mice]);
        checkHomelessMouse(breed);
    },

    gainWeight: function (mouseArray) {
        /*addWeight- Arrays zählen für die jeweiligen Mäuse ab 20 age*/
        var addWeightMale = [0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.84, 0.53, 0.53, 0.53, 0.53,
            0.53, 0.53, 0.52, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.24, 0.16,
            0.16, 0.16, 0.16, 0.16, 0.16, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.16, 0.09, 0.09, 0.09, 0.09, 0.09,
            0.09, 0.06, 0.16, 0.16,0.16, 0.16,0.16, 0.16,0.14, 0.14,0.14, 0.14,0.14, 0.14,0.14, 0.16, 0.10, 0.10, 0.10,
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
        for (var i = 0,l = mouseArray.length ; i < l; i++) {
            if(mouseArray[i].gender=0) {
                mouseArray[i].weight += addWeightMale[$_SESSION['loadedBreed'][timeUnit]];
            }else{
                mouseArray[i].weight += addWeightFemale[$_SESSION['loadedBreed'][timeUnit]];
            }
        }
    },

    checkHomelessMouse: function(breed){
        var level = breed[target];
        var mouseArray = breed[mice];
        var l = mouseArray.length;
        for(var i= 0;i<l;i++){
            if(i[cage_id]==-1){
                if(level==1){
                    addBen("Nicht zugeordnete Mäuse","Es gibt Mäuse die noch keinem Käfig zugeordnet sind !!!","warn")
                }else{
                    addBen("†","Die freilauende Maus wurde von der Katze gefressen","error")
                }
            }

        }

    },

    checkPubescent: function (mouseArray) {
        for (var i = 0, l = mouseArray.length; i < l; i++) {
            if (mouseArray[i].age > 69) {
                mouseArray[i].pubescent = true;
            } else {
                mouseArray[i].pubescent = false;
            }
        }
    }
};

