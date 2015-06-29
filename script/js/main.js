var URL_ROOT = "http://local.mousebreed/";

var Logout = {

    onReady: function () {
        $("#logout").click(Logout.run);
    },

    run: function () {
        $.ajax({
            url: "/script/php/ajax/logout.php"
        }).done(function () {
            localStorage.removeItem('loadedBreed');
            location.replace(URL_ROOT);
        });
    }
};

// Datenstruktur zum speichern der Elemente aus mouse.js



function addBen(titel, nachricht, art) {
    // TODO: Die Nachricht muss unterhalb der Oberen leiste angezeigt werden
    switch (art) {
        case "success":
            $.notify(titel, "success");
            break;
        case "warn":
            $.notify(titel, "warn");
            break;
        case "info":
            $.notify(titel, "info");
            break;
        case "error":
            $.notify(titel, "error");
            break;
        default:
            $.notify(titel, "info");
            break;
    }

    // Anbgeben der Zeit für die Benachrichtigung
    var date = new Date();
    var dateHours = date.getHours();
    var dateMinutes = date.getMinutes();
    var dateSeconds = date.getSeconds();
    if(dateHours < 10){dateHours = '0'+dateHours;}
    if(dateMinutes < 10){dateMinutes = '0'+dateMinutes;}
    if(dateSeconds < 10){dateSeconds = '0'+dateSeconds;}
    var dateOutput = dateHours+":"+dateMinutes+":"+dateSeconds;

    // Anfügen der neuen Benachrichtigung
    $("#benliste_top").prepend('<li class="divider"></li>');
    $("#benliste_top").prepend('<li class="benMessagetoDelete"><a href="#"><div class="benTitle"><strong>' + titel + '</strong></div><div class="bentimestamp"><span class="label label-info">' + dateOutput + '</span></div><div class="benMessage">' + nachricht + '</div></a></li>');

    // Setzten des Zählers
    $("#NumBen").html($("#benliste_top > li.benMessagetoDelete").length);
}

// Checken ob der Browser LocalStorage unterstützt
function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

var NextDay = {
    // Bitte in play.js verlegen wo es hingehört

    onReady: function () {
       // $("#sidebarNextDay").click(NextDay.run);
    },

    run: function () {
        clock.nextDay();

    }
};


$(document).ready(function () {
    Logout.onReady();
    NextDay.onReady();

    $("#targetInfo").popover({
        html : true,
        content: function() {
          return $('#targetContent').html();
        },
        placement: "bottom"
    });

    $("#mybutton").click(
        function () {
            addBen($("#title").val(), $("#name").val(), document.querySelector('input[name="inlineRadioOptionen"]:checked').value);
        });
    $('#deleteall').click(
        function () {
            $("#benliste_top").empty();
            // $("#benliste_top").prepend('<li class="divider"></li>');
            $("#benliste_top").prepend('<li id="benLast"><button id="deleteall" class="btn btn-danger center-block">Alles Löschen</button></li>');
            $("#NumBen").html(0);
        }
    );
    $('#benachrichtigung').click(
        function () {
            $('#deleteall').click(
                function () {
                    // TODO Sehr unsabuer :)

                    $("#benliste_top").empty();
                    // $("#benliste_top").prepend('<li class="divider"></li>');
                    $("#benliste_top").prepend('<li id="benLast"><button id="deleteall" class="btn btn-danger center-block">Alles Löschen</button></li>');
                    $("#NumBen").html(0);
                }
            );
        }
    );

    $("#navSidebarZuchten a").on("click", function(){
        $(".nav").find(".active").removeClass("active");
        $(this).parent().addClass("active");
    });

    $('#noticeid').on('click', function (event) {
        $(this).parent().toggleClass('open');
    });

    $('body').on('click', function (e) {
        if (!$('#noticeid').is(e.target)
            && $('#noticeid').has(e.target).length === 0
            && $('.open').has(e.target).length === 0
        ) {
            $('#noticeid').removeClass('open');
        }
    });


    $('#addbtn').click(
        function() {
            var inText = $('#noticetext').val();
            $('#notizenT').prepend('<li class="notMessage list-group-item"><div class="row"><div class="col-md-10">' + inText + '</div><div class="col-md-2"><button onClick="$(this).parent().parent().parent().remove()" type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button></div> </div></li>');
           //$('#notizenT').prepend('<li class="notMessage list-group-item"> ' + inText + '<button onClick="$(this).parent().remove()" type="button" class="close pull-right" aria-label="Close"><span aria-hidden="true">&times;</span></button> </li>');
            $('#noticetext').val("");
        });

    $('#chooseGenderMale').click(
        function(){
            $("#ListMouse").find(".active").gender = 0;
        });

    $('#chooseGenderFemale').click(
        function(){
            $("#ListMouse").find(".active").gender = 1;
        });

    $('#myModal').on('show', function () {
        $('.modal-body',this).css({width:'auto',height:'auto', 'max-height':'100%'});
    });

    });

/*$('#noticetext').value= "";*/