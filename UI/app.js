Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "/",
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Some Message",
        autoProcessQueue: false
    });
    
    dz.on("addedfile", function() {
        if (dz.files[1] != null) {
            dz.removeFile(dz.files[0]);        
        }
    });

    dz.on("complete", function (file) {
        let imageData = file.dataURL;
        
        var url = "http://127.0.0.1:5000/classify_image";

        $.post(url, {
            image_data: file.dataURL
        }, function(data, status) {
            console.log(data);

            if (!data || data.length === 0) {
                $("#resultHolder").hide();
                $("#divClassTable").hide();                
                $("#error").show();
                return;
            }
            
            let players = ["lionel_messi", "maria_sharapova", "roger_federer", "serena_williams", "virat_kohli"];

            $("#error").hide();
            $("#resultHolder").show();
            $("#divClassTable").show();
            $("#resultHolder").empty(); // Clear previous results

            data.forEach(function(match, index) {
                let resultHTML = $(`[data-player="${match.class}"]`).html();
                $("#resultHolder").append(`<div><h3>Result ${index + 1}</h3>${resultHTML}</div>`);

                let classDictionary = match.class_dictionary;
                for (let personName in classDictionary) {
                    let index = classDictionary[personName];
                    let probabilityScore = match.class_probability[index];
                    let elementName = `#score_${personName}`;

                    if ($(elementName).length) {
                        $(elementName).html(probabilityScore.toFixed(2) + "%");
                    } else {
                        $("#resultHolder").append(`<p>${personName}: ${probabilityScore.toFixed(2)}%</p>`);
                    }
                }
                $("#resultHolder").append(`<hr>`);
            });
        });
    });

    $("#submitBtn").on('click', function () {
        dz.processQueue();      
    });
}

$(document).ready(function() {
    console.log("ready!");
    $("#error").hide();
    $("#resultHolder").hide();
    $("#divClassTable").hide();

    init();
});
