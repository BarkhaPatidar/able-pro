window.friends = function() {
    var friendsPage = {};

    async function createFriendsTemplate() {
        var template;
        var data = "";
        await localforage.getItem("panelData").then(function (result) {
            data = {
                friends : result.friends,
                "checkStatus": function () {
                    return function (text, render) {
                        var status = render(text);
                        if(status == "Following") {
                            return "Unfollow";
                        } else {
                            return "Follow";
                        }
                    }
                }
            };
        });
        $.get("assets/mustache/friends.mustache", async function( ajaxData, status ) {
            template = ajaxData;
            if ( data ) await processTemplate(template, data);
        }); 
    }

    function processTemplate(template, data) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#timeline-wrap').html(rendered);
    }

    function unfollow() {
        $(document).on('click', '.unfollow-frnd', async function() {
            var statusValue = $(this).val();
            var userId = $(this).next().text();
            var panelData = [];
            await localforage.getItem("panelData").then(async function (result) {
                panelData = result;
                for(var i = 0; i < panelData.friends.length; i++) {
                    if(panelData.friends[i].userId == userId) {
                        
                        if(statusValue == "Follow") {
                            var status = "Following";
                        } else {
                            var status = "Unfollowing";
                        }
                        panelData.friends[i].friendStatus = status;
                    }
                }
                await localforage.setItem("panelData", panelData).then(async function (data) {
                    await createFriendsTemplate();
                    await window.profile().userProfileTab();
                    await unfollow();
                });
            });
        })
    }

    friendsPage.initialize = function() {
        createFriendsTemplate();
        unfollow();
    }

    return friendsPage;
}    