window.photos = function() {
    var photosPage = {};

    async function createPhotosTemplate() {
        var template;
        var data = "";
        await localforage.getItem("timelineData").then(function (result) {
            data = {
                allPhotos : result
            }
        });
        $.get("assets/mustache/photos.mustache", function( ajaxData, status ) {
            template = ajaxData;
            if ( data ) processTemplate(template, data);
        }); 
    }

    function processTemplate(template, data) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#timeline-wrap').html(rendered);
    }

    photosPage.initialize = function() {
        createPhotosTemplate();
    }

    return photosPage;
}    