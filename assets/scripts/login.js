window.login = function() {
    var loginPage = {};

    function createTemplate() {
        var template;
        var data = "";
        $.get("assets/mustache/login.mustache", function( ajaxData, status ) {
            template = ajaxData;
            processTemplate(template, data);
        }); 
    }

    function processTemplate(template, data) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#main-container').html(rendered);
    }

    loginPage.checkLogin = async function() {
        var email = $('#email').val();
        var password = $('#password').val();
        var result = false;
        await localforage.getItem("aboutData").then(async function (result) {
            if(result.email == email) {
                if(result.password == password) {
                    var loginUserData = true;
                    await localforage.setItem("isLogin", loginUserData).then(function (loginResult) {
                        result = loginResult;
                    });
                }
            }
        });
        return result;

    }

    loginPage.initialize = function() {
        createTemplate();
        $('#burgermenu').html("");
    }

    return loginPage;
}