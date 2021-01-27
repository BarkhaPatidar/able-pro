window.navbar = function() {
    var navbarMenu = {};

    async function createMenuTemplate() {
        var template, data;
        await localforage.getItem("aboutData").then(function (loginResult) {
            data = {
                loginResult:loginResult
            };
        });
        
        $.get("assets/mustache/menu-bar.mustache", function( ajaxData, status ) {
            template = ajaxData;
            if ( data ) processTemplate(template, data);
        }); 
    }

    function processTemplate(template, data) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#burgermenu').html(rendered);
    }

    navbarMenu.initialize = async function() {
        await createMenuTemplate();
    }

    return navbarMenu;
}    