window.profile = function() {
    var profilePage = {};
    var see5MoreCount = 0;
    var see10MoreCount = 0;

    async function createProfileTemplate() {
        var template;
        var data = "";
        
        $.get("assets/mustache/profile.mustache", function( ajaxData, status ) {
            template = ajaxData;
            processProfileTemplate(template, data);
        }); 
    }

    function processProfileTemplate(template, data) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#main-container').html(rendered);
        userProfileTab();
        userProfileFriendsTabs();
    }

    async function userProfileTab() {
        var template;
        var data;
        var friends = [];
        await localforage.getItem("aboutData").then(async function (profile) {
            await localforage.getItem("panelData").then(async function (panel) {
                await localforage.getItem("timelineData").then(function (posts) {
                    for(var i = 0; i < panel.friends.length; i++) {
                        if(panel.friends[i].friendStatus == "Following") {
                            friends.push(panel.friends[i]);
                        }
                    }
                    data = {
                        myProfile : profile,
                        following : friends.length,
                        activities : posts.length,
                        "convertNum": function () {
                            return function (text, render) {
                                var num = render(text);
                                if(Math.abs(num) > 999999) {
                                    var number = Math.sign(num)*((Math.abs(num)/1000000).toFixed(1)) + 'M'
                                    return number;
                                } else if(Math.abs(num) > 999) {
                                    var number = Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'K'
                                    return  number;
                                } else {
                                    var number = Math.sign(num)*Math.abs(num)
                                    return  number;
                                }
                            }
                        }
                    };
                });
            });
        });    
        $.get("assets/mustache/user-profile.mustache", function( ajaxData, status ) {
            template = ajaxData;
            if ( data ) processTabTemplate(template, data);
        }); 
    }

    function processTabTemplate(template, data) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#user-profile-tab').html(rendered);
    }

    async function userProfileFriendsTabs() {
        var template;
        var data;
        var whoToFollow = [], friends = [];
        var unfollowing = "Unfollowing";
        var following = "Following";
        await localforage.getItem("panelData").then(function (result) {
            for(var i = 0; whoToFollow.length <= 3; i++) {
                if(result.friends[i].friendStatus == unfollowing) {
                    whoToFollow.push(result.friends[i]);
                }
            }
            for(var j = 0; friends.length < 9; j++) {
                if(result.friends[j].friendStatus == following) {
                    friends.push(result.friends[j]);
                }
            }
            data = {
                whoToFollow : whoToFollow,
                friends : friends,
                "convertNum": function () {
                    return function (text, render) {
                        var num = render(text);
                        if(Math.abs(num) > 999999) {
                            var number = Math.sign(num)*((Math.abs(num)/1000000).toFixed(1)) + 'M'
                            return number;
                        } else if(Math.abs(num) > 999) {
                            var number = Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'K'
                            return  number;
                        } else {
                            var number = Math.sign(num)*Math.abs(num)
                            return  number;
                        }
                    }
                }
            };
        }); 
        $.get("assets/mustache/profile-friends.mustache", function( ajaxData, status ) {
            template = ajaxData;
            if ( data ) processFriendsTemplate(template, data);
        }); 
    }

    function processFriendsTemplate(template, data) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#user-profile-friends').html(rendered);
        $('[data-toggle="tooltip"]').tooltip();
    }

    function see5More() {
        $(document).on('click', '#see-5-more', async function() {
            var seeMoreBtn = this;
            var moreText = "See 5 more";
            var lessText = "Show less";
            var unfollowing = "Unfollowing";
            var scrollClass = 'add-scroll';
            var element = '#follow-suggestions';
            await localforage.getItem("panelData").then(function (result) {
                if($(seeMoreBtn).text() == moreText) {
                    $(element).addClass(scrollClass);
                    var whoToFollow = [];
                    see5MoreCount++;
                    var friendsData = 0;
                    var limit = 4 + (parseInt(see5MoreCount) * 5);
                    $(element).html("");
                    for(var j = 0 ; j < result.friends.length; j++) {
                        if(result.friends[j].friendStatus == unfollowing) { 
                            friendsData++;
                        }
                    }
                    if(limit > friendsData) {
                        limit = friendsData;
                        $(seeMoreBtn).text(lessText);
                        see5MoreCount = 0;
                    }
                    for(i = 0 ; whoToFollow.length < limit; i++) {
                        if(result.friends[i].friendStatus == unfollowing) {
                            whoToFollow.push(result.friends[i]);
                        } 
                    }
                    createSee5MoreTemplate(whoToFollow);
                } else {
                    var whoToFollow = [];
                    $(element).html("");
                    $(element).removeClass(scrollClass);
                    for(var i = 0; whoToFollow.length < 4; i++) {
                        if(result.friends[i].friendStatus == unfollowing) {
                            whoToFollow.push(result.friends[i]);
                        }    
                    }
                    createSee5MoreTemplate(whoToFollow);
                    $(seeMoreBtn).text(moreText);
                }
            });
        })
    }

    function createSee5MoreTemplate(whoToFollow) {
        var data = {
            whoToFollow : whoToFollow
        };
        var template;
        $.get("assets/mustache/who-to-follow.mustache", function( ajaxData, status ) {
            template = ajaxData;
            if ( data ) processSee5MoreTemplate(template, data);
        });
    }

    function processSee5MoreTemplate(template, data) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#follow-suggestions').html(rendered);
    }

    function see10More() {
        $(document).on('click', '#see-10-more', async function() {
            var seeMoreBtn = this;
            var moreText = "See 10 more";
            var lessText = "Show less";
            var following = "Following";
            var scrollClass = 'add-scroll';
            var element = '#only-frnds-wrap';
            await localforage.getItem("panelData").then(function (result) {
                if($(seeMoreBtn).text() == moreText) {
                    $(element).addClass(scrollClass);
                    $(element).html("");
                    var freiends = [];
                    see10MoreCount++;
                    var friendsData = 0;
                    var limit = 9 + (parseInt(see10MoreCount) * 10);
                    for(var j = 0 ; j < result.friends.length; j++) {
                        if(result.friends[j].friendStatus == following) { 
                            friendsData++;
                        }
                    }
                    if(limit > friendsData) {
                        limit = friendsData;
                        $(seeMoreBtn).text(lessText);
                        see10MoreCount = 0;
                    }
                    for(i = 0 ; freiends.length < limit; i++) {
                        if(result.friends[i].friendStatus == following) {
                            freiends.push(result.friends[i]);
                        }
                    }
                    createSee10MoreTemplate(freiends);
                } else {
                    var freiends = [];
                    $(element).html("");
                    $(element).removeClass(scrollClass);
                    for(var i = 0; freiends.length < 9; i++) {
                        if(result.friends[i].friendStatus == following) {
                            freiends.push(result.friends[i]);
                        }    
                    }
                    createSee10MoreTemplate(freiends)
                    $(seeMoreBtn).text(moreText);
                }
            })
        });
    }

    function createSee10MoreTemplate(freiends) {
        var data = {
            freiends : freiends
        };
        var template;
        $.get("assets/mustache/friends-icons.mustache", function( ajaxData, status ) {
            template = ajaxData;
            if ( data ) processSee10MoreTemplate(template, data);
        });
    }

    function processSee10MoreTemplate(template, data) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#only-frnds-wrap').html(rendered);
        $('[data-toggle="tooltip"]').tooltip();
    }

    profilePage.userProfileTab = async function() {
        await userProfileTab();
        await userProfileFriendsTabs();
    }

    profilePage.createMenuTemplate = function() {
        createMenuTemplate();
    }

    profilePage.initialize = async function() {
        await  window.navbar().initialize();
        await createProfileTemplate();
        await see5More();
        await see10More();
        await window.timeline().initialize();
    }

    return profilePage;
}    