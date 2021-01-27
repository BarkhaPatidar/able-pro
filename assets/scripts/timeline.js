window.timeline = function() {
    var timelinePage = {};

    async function createTimelineTemplate() {
        var template;
        var data = "";
        await localforage.getItem("timelineData").then(function (result) {
            data = {
                allPosts : result,
                "convertNum" : function () {
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
                },
                "convertTime" : function () {
                    return function (text, render) {
                        var vidDate = render(text);
                        var videoDate = new Date(vidDate);
                        var today = new Date();
                        var diff = Math.floor(today.getTime() - videoDate.getTime());
                        var seconds = Math.floor((diff / 1000) % 60) ;
                        var minutes = Math.floor((diff / (1000*60)) % 60);
                        var hours   = Math.floor((diff / (1000*60*60)) % 24);
                        var weeks = Math.floor(diff / 604800000)
                        var day = 1000 * 60 * 60 * 24;
                        var days = Math.floor(diff/day);
                        var months = Math.floor(days/31);
                        var years = Math.floor(months/12);
                        if(years){
                            var message = years+" years"
                            return message;
                        }
                        if(months){
                            var message = months+" months"
                            return message;
                        }
                        if(weeks){
                            var message = weeks+" weeks"
                            return message;
                        }
                        if(days){
                            var message = days+" days"
                            return message;
                        }
                        if(hours){
                            var message = hours+" hours"
                            return message;
                        }
                        if(minutes){
                            var message = minutes+" minutes"
                            return message;
                        }
                        if(seconds){
                            var message = seconds+" seconds"
                            return message;
                        } else {
                            var message = "0 seconds"
                            return message;
                        }
                    }
                }
            };
        });
        $.get("assets/mustache/timeline.mustache", function( ajaxData, status ) {
            template = ajaxData;
            if ( data ) processTimelineTemplate(template, data);
        }); 
        jQuery.ajaxSetup({async:true}); 
    }

    function processTimelineTemplate(template, data) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#timeline-wrap').html(rendered);
    }


    function likeComShare() {
        $(document).off('click', '.like-com-sh.like');
        $(document).on('click', '.like-com-sh.like', async function() {
            var timelineData = [];
            var likeClass = 'liked';
            var postId = $(this).find('.post-id').text();
            var likeCountElement = '#likes-count-'+postId;
            var heartElement = '#heart-icon-'+postId;
            await localforage.getItem("timelineData").then(async function (result) {
                timelineData = result;
               
                for(var i = 0; i < timelineData.length; i++) {
                    if(timelineData[i].postId == postId) {
                        var likes = $(likeCountElement).text();
                        if($(heartElement).hasClass(likeClass)) {
                            $(heartElement).removeClass(likeClass);
                            var addLike =  parseInt(likes) - 1;
                            $(likeCountElement).text(addLike);
                            timelineData[i].liked = "";
                            timelineData[i].likes = addLike;
                        } else {
                            $(heartElement).addClass(likeClass);
                            var addLike =  parseInt(likes) + 1;
                            $(likeCountElement).text(addLike);
                            timelineData[i].liked = likeClass;
                            timelineData[i].likes = addLike;
                        }
                    }
                }
                await localforage.setItem("timelineData", timelineData).then(async function (data) {
                    createTimelineTemplate();
                    postFormValidation();
                });
            }); 
        });
    }

    function postFormValidation() {
        $(document).on('click', 'button[id^="save-post-btn"]',function() {
            $("#new-post-form").validate({
                errorElement: "span",
                rules : {
                    imageURL : {
                        required : true,
                        url : true
                    },
                    caption : {
                        required : true
                    }
                },
                messages : {
                    imageURL : {
                        required : "Please enter image URL.",
                        url : "Please enter valid URL."
                    },
                    caption : {
                        required : "Please enter caption."
                    },
                },
                submitHandler:function(form)
                {
                    addNewPost();
                    $('#new-post-modal').modal('hide');
                }
            })
        });
    }

    function addNewPost() {
        var timelineData = [];
        var url = $('#imageURL').val();
        var caption = $('#caption').val();
        localforage.getItem("timelineData").then(async function (result) {
            timelineData.push({
                "postId" : Math.floor(Math.random() * 1000),
                "user" : window.sessionStorage.getItem('name'),
                "pic" : url,
                "caption" : caption,
                "time" : new Date(),
                "likes" : 0,
                "comments" : 0,
                "share" : 0,
                "liked" : ""
            });

            result.forEach( prevData => {
                timelineData.push(prevData);
            });
            await localforage.setItem("timelineData", timelineData).then(async function (element) {
                await createTimelineTemplate();
                await window.profile().userProfileTab();
                await postFormValidation();
                $('#imageURL').val("");
                $('#caption').val("");
            });
        });
    }

    timelinePage.initialize = async function() {
        await createTimelineTemplate();
        await likeComShare();
        await postFormValidation();
    }

    return timelinePage;
}    