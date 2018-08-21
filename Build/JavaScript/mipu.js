var $currentaddress = "uploads/youngforyou.gp5";
var $currentusername;
var $collectstatus = false;
var $theaction;
var $collectsongs = new Array();

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null;
}

$(".closebutton").click(function () {
    $(".floatarea").hide();
});

$(".a-upload").on("change", "input[type='file']", function () {
    var filePath = $(this).val();
    if (filePath.indexOf("gp4") != -1 || filePath.indexOf("gp5") != -1 || filePath.indexOf("gp3") != -1) {
        $(".fileerrorTip").html("").hide();
        var arr = filePath.split('\\');
        var fileName = arr[arr.length - 1];
        $(".showFileName").html(fileName);
    } else {
        $(".showFileName").html("");
        bootoast({
            message: '请上传后缀为.gp4或.gp5格式的乐谱文件',
            type: 'danger',
            position: 'top-center',
            timeout: 1
        });
        // $(".fileerrorTip").html("请上传后缀为.gp4或.gp5格式的乐谱文件").show();
        return false
    }
})

function contains(address) {
    $("#collectpic").attr("src", "pics/collect.png");
    for (var i = 0; i < $collectsongs.length; i++) {
        if ($collectsongs[i].address === address) {
            $("#collectpic").attr("src", "pics/collected.png");
        }
    }
};
$("#collectpic").click(function () {
    if ($("#loginstatus").attr("data") == "loged") {
        if ($("#collectpic").attr("src") === "pics/collect.png") {
            $("#collectpic").attr("src", "pics/collected.png");
            $theaction = true;
        } else {
            $("#collectpic").attr("src", "pics/collect.png");
            $theaction = false;
        }
        ;
        (function () {
            $.ajax({
                type: "post",
                url: "php/collect.php",
                dataType: "json",
                data: {username: $currentusername, tabaddress: $currentaddress, action: $theaction},
                success: function (feedbackdata) {
                }
            });
            $.ajax({
                type: "post",
                url: "php/collectinfo.php",
                dataType: "json",
                data: {username: $currentusername},
                success: function (feedback) {
                    $collectsongs = feedback;
                    $("#mycollectlist").find("li").remove();
                    for (var j = 0; j < feedback.length; j++) {
                        $("#mycollectlist").append("<li class='collectlist-li' data='" + feedback[j].address + "'>" + feedback[j].name + "&nbsp;-&nbsp;" + feedback[j].singer + "</li>");
                    }
                    ;
                }
            });
        })()
    } else {
        bootoast({
            message: '请先登录',
            type: 'danger',
            position: 'top-center',
            timeout: 1
        });
    }
});

$("#ricotext").keyup(
    function () {
        $.ajax({
            type: "post",
            url: "php/search.php",
            dataType: "json",
            data: {search: $("#ricotext").val()},
            success: function (feedbackdata) {
                $("#searchresult").find("li").remove();
                for (var i = 0; i < feedbackdata.length; i++) {
                    $("#searchresult").append("<li class='searchresult-li' data='" + feedbackdata[i].address.replace(/'/g,"&apos;") + "'>" + feedbackdata[i].name + "&nbsp;-&nbsp;" + feedbackdata[i].singer + "</li>");
                }
                ;
                //处理搜索页面结果的点击
                $(".searchresult-li").click(function () {
                    $('#alphaTab').alphaTab('load', $(this).attr("data").replace(/&apos;/g,"'"));
                    contains($(this).attr("data"));
                    $("#playPausepic").attr("src", "pics/play.svg");
                    $("#songinfo1").html($(this));
                    $("#songinfo").html($(this));
                    $(".floatarea").hide();
                    $currentaddress = $(this).attr("data");
                    $.ajax({
                        type: "post",
                        url: "php/count.php",
                        dataType: "json",
                        data: {address: $(this).attr("data").replace(/&apos;/g,"'")},
                        success: function (feedbackdata) {
                        }
                    });
                });
            },
            error: function (feedbackdata) {
                $("#searchresult").find("li").remove();
            },
        })
    });
$(document).ready(function () {
    //获取登录状态
    if (getCookie('username') && getCookie('password')) {
        var user = getCookie('username');
        var psw = getCookie('password');
        $.ajax({
            type: "post",
            url: "php/login.php",
            dataType: "text",
            data: {username: user, password: psw},
            success: function (feedbackdata) {
                if (feedbackdata === "success") {
                    // $("#loginstatus").html("登录成功");
                    document.cookie = "username=" + user + ";max-age=7200";
                    document.cookie = "password=" + psw + ";max-age=7200";
                    $("#loginstatus").attr("data", "loged");
                    $("#leftbar-login").html(user);
                    $currentusername = user;
                    setTimeout("$('.floatarea').hide()", 200);
                } else {
                    // $("#loginstatus").html("登录失败")
                }
                ;
                $.ajax({
                    type: "post",
                    url: "php/collectinfo.php",
                    dataType: "json",
                    data: {username: $currentusername},
                    success: function (feedback) {
                        $collectsongs = feedback;
                        $("#mycollectlist").find("li").remove();
                        for (var j = 0; j < feedback.length; j++) {
                            $("#mycollectlist").append("<li class='collectlist-li' data='" + feedback[j].address.replace(/'/g,"&apos;") + "'>" + feedback[j].name + "&nbsp;-&nbsp;" + feedback[j].singer + "</li>");
                        }
                        ;
                        $(".collectlist-li").click(function () {
                            $('#alphaTab').alphaTab('load', $(this).attr("data").replace(/&apos;/g,"'"));
                            contains($(this).attr("data"));
                            $("#playPausepic").attr("src") == "pics/play.svg";
                            $currentaddress = $(this).attr("data");
                            $(".floatarea").hide();
                            $.ajax({
                                type: "post",
                                url: "php/count.php",
                                dataType: "json",
                                data: {address: $(this).attr("data").replace(/&apos;/g,"'")},
                                success: function (feedbackdata) {
                                }
                            });
                        });
                    }
                });
            }
        });
    }

    //获取排名
    $.ajax({
        type: "post",
        url: "php/ranking.php",
        data: {},
        dataType: "json",
        success: function (feedbackdata) {
            $("#rankinglist").find("li").remove();
            for (var i = 0; i < feedbackdata.length; i++) {
                let address = feedbackdata[i].address.replace(/'/g,"&apos;");
                $("#rankinglist").append("<li class='rankinglist-li' data='" + address + "'>" + feedbackdata[i].name + "&nbsp;-&nbsp;" + feedbackdata[i].singer + "</li>");
            }
            ;
            $(".rankinglist-li").click(function () {
                $('#alphaTab').alphaTab('load', $(this).attr("data").replace(/&apos;/g,"'"));
                $("#playPausepic").attr("src", "pics/play.svg");
                contains($(this).attr("data"));
                $(".floatarea").hide();
                $currentaddress = $(this).attr("data");
                console.log($(this).attr("data"));
                $.ajax({
                    type: "post",
                    url: "php/count.php",
                    dataType: "json",
                    data: {address: $(this).attr("data").replace(/&apos;/g,"'")},
                    success: function (feedbackdata) {
                    }
                });
            });
        }
    });
});

$("#upload-newtab-button").click(function () {
    if (($("#uploadname").val()) && ($("#uploadsinger").val()) && ($("#uploadfile").val())) {
        var data = new FormData();
        var fileobj = document.getElementById('uploadfile').files[0];

        data.append("name", $("#uploadname").val());
        data.append("singer", $("#uploadsinger").val());
        data.append("file", fileobj);

        $.ajax({
            url: 'php/upload.php',
            type: 'POST',
            data: data,
            dataType: 'text',
            cache: false,
            processData: false,
            contentType: false,
            success: function (feedbackdata) {
                bootoast({
                    message: '上传成功',
                    type: 'info',
                    position: 'top-center',
                    timeout: 1
                });
                // $("#uploadresulutinfo").html(feedbackdata);
            }
        })
    } else {
        bootoast({
            message: '请填写完整信息并上传指定格式的乐谱',
            type: 'danger',
            position: 'top-center',
            timeout: 1
        });
        // $("#uploadresulutinfo").html('请填写完整信息并上传指定格式的乐谱')
    }
});

$(function () {
    $("#loginbutton").click(function () {
        $.ajax({
            type: "post",
            url: "php/login.php",
            dataType: "text",
            data: {username: $("#usernameinput").val(), password: $("#passwordinput").val()},
            success: function (feedbackdata) {
                if (feedbackdata === "success") {
                    // $("#loginstatus").html("登录成功");
                    bootoast({
                        message: '登录成功',
                        type: 'info',
                        position: 'top-center',
                        timeout: 1
                    });
                    document.cookie = "username=" + $("#usernameinput").val() + ";max-age=7200";
                    document.cookie = "password=" + $("#passwordinput").val() + ";max-age=7200";
                    $("#loginstatus").attr("data", "loged");
                    $("#leftbar-login").html($("#usernameinput").val());
                    $currentusername = $("#usernameinput").val();
                    setTimeout("$('.floatarea').hide()", 200);
                } else {
                    // $("#loginstatus").html("登录失败")
                    bootoast({
                        message: '登录失败',
                        type: 'danger',
                        position: 'top-center',
                        timeout: 1
                    });
                }
                ;
                $.ajax({
                    type: "post",
                    url: "php/collectinfo.php",
                    dataType: "json",
                    data: {username: $currentusername},
                    success: function (feedback) {
                        $collectsongs = feedback;
                        $("#mycollectlist").find("li").remove();
                        for (var j = 0; j < feedback.length; j++) {
                            $("#mycollectlist").append("<li class='collectlist-li' data='" + feedback[j].address.replace(/'/g,"&apos;") + "'>" + feedback[j].name + "&nbsp;-&nbsp;" + feedback[j].singer + "</li>");
                        }
                        ;
                        $(".collectlist-li").click(function () {
                            $('#alphaTab').alphaTab('load', $(this).attr("data").replace(/&apos;/g,"'"));
                            contains($(this).attr("data"));
                            $("#playPausepic").attr("src") == "pics/play.svg";
                            $currentaddress = $(this).attr("data");
                            $(".floatarea").hide();
                            $.ajax({
                                type: "post",
                                url: "php/count.php",
                                dataType: "json",
                                data: {address: $(this).attr("data").replace(/&apos;/g,"'")},
                                success: function (feedbackdata) {
                                }
                            });
                        });
                    }
                });
            }
        });
    })
});
$(function () {
    $("#regbutton").click(function () {
        if ($("#usernamereg").val().length >= 1) {
            if ($("#passwordreg").val() === $("#passwordreg2").val()) {
                if ($("#passwordreg").val().length >= 6) {
                    $.ajax({
                        type: "post",
                        url: "php/register.php",
                        dataType: "text",
                        data: {username: $("#usernamereg").val(), password: $("#passwordreg").val()},
                        success: function (feedbackdata) {
                            $("#registerstatus").html(feedbackdata);
                        },
                    })
                } else {
                    // $("#registerstatus").html("错误：密码长度必须大于6位");
                    bootoast({
                        message: '错误：密码长度必须大于6位',
                        type: 'danger',
                        position: 'top-center',
                        timeout: 1
                    });
                }
            }
            else {
                // $("#registerstatus").html("错误：两次密码不一致");
                bootoast({
                    message: '错误：两次密码不一致',
                    type: 'danger',
                    position: 'top-center',
                    timeout: 1
                });
            }
        } else {
            bootoast({
                message: '错误：请输入用户名',
                type: 'danger',
                position: 'top-center',
                timeout: 1
            });
        }
    })
});

$("#stopbutton").click(function () {
    $("#playPausepic").attr("src", "pics/play.svg");
});
$(".dropdown-toggle1").on("click", function () {
    $(".dropdown-menu1").fadeToggle(50);
    $(".dropdown-menu2").fadeOut(50);
});

$(".dropdown-toggle2").on("click", function () {
    $(".dropdown-menu2").fadeToggle(50);
    $(".dropdown-menu1").fadeOut(50);
});
$(".dropdown-menu1").find('li').click(
    function () {
        $(".dropdown-menu1").fadeOut(50);
    }
);
$("#leftbar-search").click(function () {
    if ($("#float-search").css("display") == 'none') {
        $(".floatarea").fadeOut(50);
        $("#float-search").fadeIn(50);
        $("#ricotext").focus();
    } else {
        $(".floatarea").fadeOut(50);
    }
    ;
});
$("#leftbar-ranking").click(function () {
    if ($("#float-ranking").css("display") == 'none') {
        $(".floatarea").fadeOut(50);
        $("#float-ranking").fadeIn(50);
    } else {
        $(".floatarea").fadeOut(50);
    }
    ;
});
$("#leftbar-collect").click(function () {
    if ($("#float-collect").css("display") == 'none') {
        $(".floatarea").fadeOut(50);
        $("#float-collect").fadeIn(50);
    } else {
        $(".floatarea").fadeOut(50);
    }
    ;
});
$("#leftbar-upload").click(function () {
    if ($("#float-upload").css("display") == 'none') {
        $(".floatarea").fadeOut(50);
        $("#float-upload").fadeIn(50);
    } else {
        $(".floatarea").fadeOut(50);
    }
    ;
});
$("#leftbar-login").click(function () {
    if ($("#float-login").css("display") == 'none') {
        $(".floatarea").fadeOut(50);
        $("#float-login").fadeIn(50);
    } else {
        $(".floatarea").fadeOut(50);
    }
    ;
});
$("#registerbutton").click(function () {
    $("#float-login").toggle();
    $("#float-register").show();
});

$("#playPause").click(function () {
    if ($("#playPausepic").attr("src") == "pics/play.svg") {
        $("#playPausepic").attr("src", "pics/pause.svg");
    }
    else {
        $("#playPausepic").attr("src", "pics/play.svg");
    }
});

var at = $('#alphaTab');

$(document).keydown(function (e) {
    if (!e) {
        var e = window.event
    }
    ;
    if (e.keyCode == 32) {
        if (($("#float-upload").css('display') == 'none') && ($("#float-search").css('display') == 'none') && ($("#float-login").css('display') == 'none') && ($("#float-register").css('display') == 'none')) {
            $("#playPause").click();
            e.preventDefault()
        }
    }
});

$('.multiple_toggle').click(function () {
    $('#uploadfileform').hide();
    $('.multiple_toggle').hide();
    $('#multiple_uploadfileform').show();
    $('.single_toggle').show();
});

$('.single_toggle').click(function () {
    $('#uploadfileform').show();
    $('.single_toggle').hide();
    $('#multiple_uploadfileform').hide();
    $('.multiple_toggle').show();
});

$(".multiple_a-upload").on("change", function () {
    let files = $('#multiple_uploadfile')[0].files;
    for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
        if (files[i].name.indexOf("gp4") != -1 || files[i].name.indexOf("gp5") != -1 || files[i].name.indexOf("gp3") != -1) {
            $(".fileerrorTip").html("").hide();
            $(".multiple_showFileName").text(files[0].name + '等' + files.length + '个乐谱');
        } else {
            $(".multiple_showFileName").html("");
            bootoast({
                message: '请上传后缀为.gp4或.gp5格式的乐谱文件',
                type: 'danger',
                position: 'top-center',
                timeout: 1
            });
            return false
        }
    }

})
$("#multiple_upload-newtab-button").click(function () {
    if ($("#multiple_uploadfile").val()) {
        var files = $('#multiple_uploadfile')[0].files;
        for (let i = 0; i < files.length; i++) {
            if (files[i].name.indexOf("gp4") != -1 || files[i].name.indexOf("gp5") != -1 || files[i].name.indexOf("gp3") != -1) {
                let data = new FormData();
                let fileobj = $('#multiple_uploadfile')[0].files[i];
                console.log(fileobj);
                let singer = fileobj.name.split('-')[0].replace("'", "");
                let song = fileobj.name.split('-')[1].split('.')[0].replace("'", "");
                console.log(singer, song);
                data.append("name", song);
                data.append("singer", singer);
                data.append("file", fileobj);
                console.log(data)
                $.ajax({
                    url: 'php/upload.php',
                    type: 'POST',
                    data: data,
                    dataType: 'text',
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function (feedbackdata) {
                        bootoast({
                            message: feedbackdata,
                            type: 'info',
                            position: 'top-center',
                            timeout: 1
                        });
                    }
                })
            } else {
                bootoast({
                    message: '请按要求上传指定格式的乐谱',
                    type: 'danger',
                    position: 'top-center',
                    timeout: 1
                });
            }
        }
    } else {
        bootoast({
            message: '请按要求上传指定格式的乐谱',
            type: 'danger',
            position: 'top-center',
            timeout: 1
        });
    }
});