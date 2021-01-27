window.about = function() {
    var aboutPage = {};

    async function createAboutTemplate() {
        var template;
        var data;
        await localforage.getItem("aboutData").then(function (result) {
            data = {
                aboutData : result
            };
        });
        $.get("assets/mustache/about.mustache", function( ajaxData, status ) {
            template = ajaxData;
            if ( data ) processTemplate(template, data);
        }); 
    }

    function processTemplate(template, data) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#timeline-wrap').html(rendered);
    }

    async function saveBasicInfo() {
        var name = $('input[name="name"]').val();
        var gender = $('input[name="gender"]').val();
        var dob = $('input[name="dob"]').val();
        var maritalStatus = $('input[name="maritalStatus"]').val();
        var location = $('input[name="location"]').val();

        var aboutData = {};
        await localforage.getItem("aboutData").then(async function (data) {
            aboutData = data;
            aboutData['name'] = name;
            aboutData['gender'] = gender;
            aboutData['dob'] = dob;
            aboutData['maritalStatus'] = maritalStatus;
            aboutData['location'] = location;

            updateAboutData(aboutData);
        });
    }

    async function saveWorkInfo() {
        var profession = $('input[name="profession"]').val();
        var skills = $('input[name="skills"]').val();
        var jobs = $('input[name="jobs"]').val();

        var aboutData = {};
        await localforage.getItem("aboutData").then(async function (data) {
            aboutData = data;
            aboutData['profession'] = profession;
            aboutData['skills'] = skills;
            aboutData['jobs'] = jobs;

            updateAboutData(aboutData);
        });
    }

    async function updateAboutData(aboutData) {         
        await localforage.setItem("aboutData", aboutData).then(async function (result) {
            await createAboutTemplate();
            await window.navbar().initialize(); 
            await window.profile().userProfileTab();
        });
    }

    function editIcon() {
        var editable = 'editable';
        var visible = 'info-form-container';
        $(document).on('click', '#basic-info-edit', function() {
            $('.basic-info-label-values.basic-info').addClass(editable);
            $('#basic-info-form-wrap').removeClass(editable).addClass(visible);
        });
        $(document).on('click', '#work-info-edit', function() {
            $('.basic-info-label-values.work-info').addClass(editable);
            $('#work-info-form-wrap').removeClass(editable).addClass(visible);
        })
    }

    function basicInfoFormValidation() {
        $(document).on('click', 'button[id^="basic-info-sub"]',function() {
            $("#basic-info-form").validate({
                errorElement: "span",
                rules : {
                    name : {
                        required : true
                    },
                    gender : {
                        required : true
                    },
                    dob : {
                        required : true
                    },
                    maritalStatus : {
                        required : true
                    },
                    location : {
                        required : true
                    }
                },
                messages : {
                    name : {
                        required : "Please enter name."
                    },
                    gender : {
                        required : "Please enter gender."
                    },
                    dob : {
                        required : "Please enter date of birth."
                    },
                    maritalStatus : {
                        required : "Please enter marital status."
                    },
                    location : {
                        required : "Please enter location."
                    }
                },
                submitHandler:function(form)
                {
                    saveBasicInfo();
                    var editable = 'editable';
                    var visible = 'info-form-container';
                    $('.basic-info-label-values.basic-info').removeClass(editable);
                    $('#basic-info-form-wrap').addClass(editable).removeClass(visible);
                }
            })
        });
    }

    function workInfoFormValidation() {
        $(document).on('click', 'button[id^="work-info-sub"]',function() {
            $("#work-info-form").validate({
                errorElement: "span",
                rules : {
                    profession : {
                        required : true
                    },
                    skills : {
                        required : true
                    },
                    jobs : {
                        required : true
                    }
                },
                messages : {
                    profession : {
                        required : "Please enter profession."
                    },
                    skills : {
                        required : "Please enter skills."
                    },
                    jobs : {
                        required : "Please enter jobs."
                    }
                },
                submitHandler:function(form)
                {
                    saveWorkInfo();
                    var editable = 'editable';
                    var visible = 'info-form-container';
                    $('.basic-info-label-values.work-info').removeClass(editable);
                    $('#work-info-form-wrap').addClass(editable).removeClass(visible);
                }
            })
        });
    }

    aboutPage.initialize = function() {
        createAboutTemplate();
        editIcon();
        basicInfoFormValidation();
        workInfoFormValidation();
    }

    return aboutPage;
}    