$(function() {
    window.localData().initialize();
    createNavbarTemplate();
    createPostModalTemplate();
    checkSession();
    logEvents();
    timelineMenu();

    async function checkSession() {
        await localforage.getItem("isLogin").then(function (result) {
            if(result) {
                window.profile().initialize();
            } else {
                browserPage = '/Login';
                var stateObject = {
                    page : "Login"
                }
                window.history.pushState(stateObject, null, browserPage);
                window.login().initialize();
                logEvents();
                loginFormValidation();
            }
        })
    }

    function logEvents() {
        $('#login-error').html("");
        logout();
    }

    function login() {
        var result = window.login().checkLogin();
        if(result == false) {
            $('#login-error').css('display','block');
            $('#login-error').text('Your email or password is incorrect.');
            fadeErrorBox();
        } else {
            $('#main-container').html("");
            browserPage = '/Timeline';
            var stateObject = {
                page : "Timeline"
            }
            window.history.pushState(stateObject, null, browserPage);
            window.profile().initialize();
        }
       
    }

    function logout() {
        $(document).on('click', 'a[id^="logout-btn"]', async function() {
            await localforage.removeItem('isLogin').then(function() {
                checkSession();
            })
        })
    }

    function loginFormValidation() {
        $(document).on('click', 'button[id^="login-btn"]',function() {
            $("#login-form").validate({
                errorElement: "span",
                rules : {
                    email : {
                        required : true,
                        email : true
                    },
                    password : {
                        required : true
                    }
                },
                messages : {
                    email : {
                        required : "Please enter your email.",
                        email : "Please enter valid email."
                    },
                    password : {
                        required : "Please enter your password."
                    },
                },
                submitHandler:function(form)
                {
                    login();
                }
            })
        });
    }

    function fadeErrorBox() {
        $(".error-msg").fadeOut(5000);
    }

    function createNavbarTemplate() {
        var template;
        var data = "";
        $.get("assets/mustache/navbar-menu.mustache", function( ajaxData, status ) {
            template = ajaxData;
            processTemplate(template, data);
        }); 
    }

    function processTemplate(template, data) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#navbar-menu').html(rendered);
    }

    function createPostModalTemplate() {
        var template;
        var data = "";
        $.get("assets/mustache/add-post.mustache", function( ajaxData, status ) {
            template = ajaxData;
            processModalTemplate(template, data);
        }); 
    }

    function processModalTemplate(template, data) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#new-post-modal').html(rendered);
    }

    function timelineMenu() {
        $(document).on('click', '.timeline-bar li', function() {
            var activeElement = '.timeline-bar li.active';
            var active = 'active'
            $(activeElement).removeClass(active); 
            $(this).addClass(active);
            var activeValue = $(activeElement+' a').text();
            browserPage = '/'+activeValue;
            var stateObject = {
                page : activeValue
            }
            window.history.pushState(stateObject, null, browserPage);
            switchActiveMenu(activeValue);
        });
    }

    function switchActiveMenu(activeValue) {
        switch(activeValue) {
            case "Timeline" :
                window.timeline().initialize();
              break;
            case "About" :
                window.about().initialize();
              break;
            case "Photos" :
                window.photos().initialize();
              break;  
            case "Friends" :
                window.friends().initialize();
              break;  
        }
    }

    window.addEventListener('popstate', function(event) {
        var state = event.state;
        if(state) { 
            var page = state.page;
            if(page == "Login") {
                browserPage = '/Timeline';
                var stateObject = {
                    page : "Timeline"
                }
                window.history.pushState(stateObject, null, browserPage);
                window.timeline().initialize();
            } else {
                switchActiveMenu(page);
            }
            $('.timeline-bar li').each(function(index) {
                var activeElement = '.timeline-bar li.active';
                var active = 'active'
                var activeValue = $(this).find('a').text();
                if(activeValue == page) {
                    $(activeElement).removeClass(active);
                    $(this).addClass(active);
                }
            });
        }
    });
});
