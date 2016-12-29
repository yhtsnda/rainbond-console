$(function () {
    //打开新增端口号窗口
    $(".openAdd").on("click",function(){
        $(".addPort").css({"display":"table-row"});
    });
    $(".add_port").onblur(function(){
        var portNum = parseInt($(".add_port").val());
        if( portNum>1024 && portNum<65536 )
        {
            $(this).parents('tr').find('p.checkTip').css({"display":"none"});
        }
        else{
            $(this).parents('tr').find('p.checkTip').css({"display":"block"});
        }
    })
    //确定添加端口号
    $(".add").on("click",function(){
        var portNum = parseInt($(".add_port").val());
        if( portNum>1024 && portNum<65536 )
        {
            var addOnoff = true;
            var portLen = $(".portNum").length;
            for( var i = 0; i<portLen; i++ )
            {
                if( portNum == $(".portNum").eq(i).html() )
                {
                    addOnoff = false;
                    break;
                }
            }
            if( addOnoff )
            {
                var arr = ['HTTP','非HTTP'];
                var oTr = '<tr><td><a href="javascript:void(0);" class="portNum edit-port fn-tips" data-tips="源码中无 Dockerfile 文件时，默认开启服务端口为5000，请勿随意更改。如果当前应用为多端口应用，请根据您编码中定义的端口自行添加。">'+$(".add_port").val()+'</a></td>';
                if( $("#addInner").prop("checked") == true )
                {
                    oTr += '<td><div class="checkbox fn-tips" data-tips="打开对外服务，其他应用即可访问当前应用。"><input class="checkDetail" type="checkbox" name="" value="" id="'+$(".add_port").val()+'inner" checked="true" /><label class="check-bg" for="'+$(".add_port").val()+'inner"></label></div></td>';
                }
                else{
                    oTr += '<td><div class="checkbox fn-tips" data-tips="打开对外服务，其他应用即可访问当前应用。"><input class="checkDetail" type="checkbox" name="" value="" id="'+$(".add_port").val()+'inner" /><label class="check-bg" for="'+$(".add_port").val()+'inner"></label></div></td>';
                }
                if( $("#addOuter").prop("checked") == true )
                {
                    oTr += '<td><div class="checkbox fn-tips" data-tips="打开外部访问，用户即可通过互联网访问当前应用。"><input class="checkDetail" type="checkbox" name="" value="" id="'+$(".add_port").val()+'outer" checked="true" /><label class="check-bg" for="'+$(".add_port").val()+'outer"></label></div></td>';
                }
                else{
                    oTr += '<td><div class="checkbox fn-tips" data-tips="打开外部访问，用户即可通过互联网访问当前应用。"><input class="checkDetail" type="checkbox" name="" value="" id="'+$(".add_port").val()+'outer" /><label class="check-bg" for="'+$(".add_port").val()+'outer"></label></div></td>';
                }
                oTr += '<td><select class="fn-tips" data-tips="如果允许用户通过互联网采用HTTP协议访问当前应用，请选择HTTP。" data-port-http="'+$(".add_port").val()+'http">';
                for( var i = 0; i < 2; i++ )
                {
                    if( $('.add_http').val() == arr[i] )
                    {
                        oTr += '<option selected="selected">'+arr[i]+'</option>';
                    }
                    else{
                        oTr += '<option>'+arr[i]+'</option>';
                    }
                }
                oTr += '</select></td>';
                oTr += '<td><img class="rubbish" src="/static/www/images/rubbish.png"/></td></tr>';
                $(oTr).appendTo(".port");
                $(".addPort").css({"display":"none"});
                delPort();
                editPort();
                tip();
                //detail();
                //checkDetail();
            }
            else{
                swal("端口号冲突～～");
            }
        }
        else{
            $(this).parents('tr').find('p.checkTip').css({"display":"block"});
        }
        $(".add_port").val("");
    });
    //取消端口号的添加
    $(".noAdd").on("click",function(){
        $(".addPort").css({"display":"none"});
    });
    delPort();
    //删除端口号与环境变量
    function delPort(){
        $("img.rubbish").off("click");
        $("img.rubbish").on("click",function(){
            $(this).parents("tr").remove();
        })
    }
    delLi();
    //删除依赖与目录
    function delLi(){
        $("img.delLi").off("click");
        $("img.delLi").on("click",function(){
            $(this).parents("li").remove();
        })
    }
    //修改端口号
    editPort();
    function editPort(){
        $('.edit-port').editable({
            type: 'text',
            pk: 1,
            success: function (data) {
                //window.location.reload();
            },
            error: function (data) {
                msg = data.responseText;
                res = $.parseJSON(msg);
                showMessage(res.info);
            },
            ajaxOptions: {
                beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
                    settings.data += '&action=change_port';
                },
            }
        });
    }
    //显示添加环境变量内容
    $(".openAddEnviroment").on("click",function(){
        $(".addContent").css({"display":"table-row"});
    });
    $(".enviroKey").onblur(function(){
        var variableReg = /^[A-Z][A-Z0-9_]*$/;
        if( variableReg.test($(".enviroKey").val()) )
        {
            $(this).parent().find("p.checkTip").css({"display":"none"});
        }
        else{
            $(this).parent().find("p.checkTip").css({"display":"block"});
        }
    });
    $(".addEnviroment").on("click",function(){
        if( $(".enviroKey").val() && $(".enviroValue").val() )
        {
            var len = $(".enviromentKey").length;
            var onOff = true;
            for( var i = 0; i<len; i++ )
            {
                if( $(".enviroKey").val() == $(".enviromentKey")[i].innerHTML ){
                    swal("变量名冲突～～");
                    onOff = false;
                    break;
                }
            }
            if( onOff )
            {
                var variableReg = /^[A-Z][A-Z0-9_]*$/;
                if( variableReg.test($(".enviroKey").val()) )
                {
                    var str = '<tr><td><a href="javascript:void(0);" class="enviromentName edit-port enviromentKey key'+(len+1)+'">'+$(".enviroName").val()+'</a></td>';
                    str += '<td><a href="javascript:void(0);" class="edit-port enviromentKey key'+(len+1)+'">'+$(".enviroKey").val()+'</a></td>';
                    str += '<td><a href="javascript:void(0);" class="edit-port enviromentValue value'+(len+1)+'">'+$(".enviroValue").val()+'</a></td>';
                    str += '<td><img class="rubbish" src="/static/www/images/rubbish.png"/></td></tr>';
                    $(str).appendTo(".enviroment");
                    $(".enviroName").val('');
                    $(".enviroKey").val('');
                    $(".enviroValue").val('');
                    $(".addContent").css({"display":"none"});
                    delPort();
                    editPort();
                }
                else{
                    swal("变量名由大写字母开头，可以加入数字～～");
                }
            }
        }
        else{
            console.log(2);
        }
    });
    $(".noAddEnviroment").on("click",function(){
        $(".addContent").css({"display":"none"});
        $(".enviroKey").val('');
        $(".enviroValue").val('');
    });

    //关闭弹出层
    $("button.cancel").on("click",function(){
        $(".layer-body-bg").css({"display":"none"});
    });
    $(".del").on("click",function(){
        $(".layer-body-bg").css({"display":"none"});
    });
    $(".sureAddDepend").on("click",function(){
        var len = $(".depend input").length;
        for( var i = 0; i<len; i++ )
        {
            if( $(".depend input")[i].checked )
            {
                var appNameLen = $("a.appName").length;
                var onOff = true;
                for( var j = 0; j<appNameLen; j++ )
                {
                    if( $("a.appName")[j].innerHTML == $(".depend input")[i].getAttribute("data-action") )
                    {
                        onOff = false;
                        break;
                    }
                }
                if( onOff )
                {
                    var str = '';
                    str += '<li><a href="javascript:void(0);" data-serviceId="'+$(".depend input")[i].getAttribute("data-serviceId")+'" class="appName">'+$(".depend input")[i].getAttribute("data-action")+'</a>';
                    str += '<img src="/static/www/images/rubbish.png" class="delLi"/></li>';
                    $(str).appendTo(".applicationName");
                    delLi();
                    appMes();
                }
            }
        }
        $(".layer-body-bg").css({"display":"none"});
    });

    //新设持久化目录
    $(".addCata").on("click",function(){
        $("p.catalogue").css({"display":"block"});
    })
    $(".catalogueContent").onblur(function(){
        if( $(".catalogueContent").val() )
        {
            $(this).parent().find(".checkTip").css({"display":"none"});
        }
        else{
            $(this).parent().find(".checkTip").css({"display":"block"});
        }
    })
    $(".addCatalogue").on("click",function(){
        if( $(".catalogueContent").val() )
        {
            var service_name = $("#service_name").val();
            var str = '<li><a href="javascript:void(0);"  class="path_name add_pathName">'+service_name+'</a>';
            str += '<em>/app/'+$(".catalogueContent").val()+'</em>';
            str += '<img src="/static/www/images/rubbish.png" class="delLi"/></li>';
            $(str).appendTo(".fileBlock ul.clearfix");
            $("p.catalogue").css({"display":"none"});
            $(".catalogueContent").val("");
            delLi();
        }
        else{
            swal("请输入目录～～");
        }
    });
    $(".noAddCatalogue").on("click",function(){
        $("p.catalogue").css({"display":"none"});
    });

    $(".submit").on("click",function(){
        var portLen = $("tbody.port tr").length;
        var portArr = [];
        var service_alias = $("#service_alias").val();
        for( var i = 0; i<portLen; i++ )
        {
            var port_json = {};
            var container_port = $("tbody.port tr").eq(i).find("td").eq(0).children("a").html();
            port_json["container_port"] = container_port
            port_json["protocol"] = $("tbody.port tr").eq(i).find("td").eq(1).children("select").val();
            if( port_json["protocol"] == 'HTTP' )
            {
                port_json["protocol"] = 'http';
            }
            else{
                port_json["protocol"] = 'stream';
            }
            port_json["is_inner_service"] = $("tbody.port tr").eq(i).find("td").eq(2).find("input").prop("checked")?1:0;
            port_json["is_outer_service"] = $("tbody.port tr").eq(i).find("td").eq(3).find("input").prop("checked")?1:0;
            port_json["port_alias"] = service_alias.toUpperCase()+container_port;
            portArr[i] = port_json;
        }
        //console.log(JSON.stringify(portArr));

        var appNameLen = $(".appName").length;
        var appNameArr = [];
        for( var n = 0; n<appNameLen; n++ )
        {
            appNameArr.push($(".appName").eq(n).attr("data-serviceid"))
        }
        console.log(appNameArr);

        var appLen = $(".add_pathName").length;
        var appArr = [];
        for( var j = 0; j<appLen; j++ )
        {
            var app_json = {};
            app_json["volume_name"] = $("#service_name").val();
            app_json["volume_path"] = $(".add_pathName").eq(j).parent().children("em").html();
            appArr[j] = app_json;
        }
        //console.log(JSON.stringify(appArr));

        var enviromentLen = $(".enviromentName").length;
        var enviromentArr = [];
        for( var k = 0; k<enviromentLen; k++ )
        {
            var enviroment_json = {};
            enviroment_json["name"] = $("tbody.enviroment tr").eq(k).find("td").eq(0).children("a").html();
            enviroment_json["attr_name"] = $("tbody.enviroment tr").eq(k).find("td").eq(1).children("a").html();
            enviroment_json["attr_value"] = $("tbody.enviroment tr").eq(k).find("td").eq(2).children("a").html();
            enviromentArr[k] = enviroment_json;
        }
        //console.log(JSON.stringify(enviromentArr));

        var otherAppNameLen = $(".otherAppName").length;
        var otherAppNameArr = [];
        for( var m = 0; m<otherAppNameLen; m++ )
        {
            var otherAppName_json = {};
            otherAppName_json["name"] = $(".otherAppName").eq(m).html();
            otherAppName_json["path"] = $(".otherAppName").eq(m).parent().children("em").html();
            otherAppName_json["otherName"] = $(".otherAppName").eq(m).attr("data-otherName");
            otherAppNameArr[m] = otherAppName_json;
        }

        var service_config = {
            "port_list" : JSON.stringify(portArr),
            "env_list" : JSON.stringify(enviromentArr),
            "volume_list" : JSON.stringify(appArr),
            "mnt_list" : JSON.stringify(otherAppNameArr),
            "depend_list" : JSON.stringify(appNameArr)
        }
        console.log(service_config);
        var service_alias = $("#service_alias").val();
        var tenantName = $("#tenantName").val();

        $.ajax({
            type : "post",
            url : "/apps/" + tenantName + "/"+ service_alias + "/app-setting/",
            data : service_config,
            cache : false,
            beforeSend : function(xhr, settings) {
                var csrftoken = $.cookie('csrftoken');
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success : function(msg) {
                if (msg["status"] == "success") {
                    window.location.href = "/apps/" + tenantName + "/"+ service_alias + "/app-language/"
                }else{
                    swal("配置失败")
                }
            },
            error : function() {
                swal("系统异常,请重试");
                $("#BtnFirst").attr('disabled', false);
            }
        });
        
        console.log(service_config);
    });

    //打开弹出层，选择服务依赖
    $(".addDepend").on("click",function(){
        var marleft = $("#main-content").attr("style");
        if(marleft){
            var arrleft = marleft.split(":");
           if(arrleft[1] == " 210px;"){
                $(".layer-body-bg").css({"left":"-210px;"});
            }else{
                $(".layer-body-bg").css({"left":"0px;"});
            } 
        }else{
            $(".layer-body-bg").css({"left":"-210px;"});
        }
        $(".applicationMes").css({"display":"none"});
        $(".otherApp").css({"display":"none"});
        $(".depend").css({"display":"block"});
        $(".layer-body-bg").css({"display":"block"});
    })
    //依赖应用相关信息
    appMes();
    function appMes(){
        $(".appname").off('click');
        $(".appName").on("click",function(){
            var service_id = $(this).attr("data-serviceId");
            console.log(service_id);
            getServiceInfo(service_id);
            var marleft = $("#main-content").attr("style");
            if(marleft){
                var arrleft = marleft.split(":");
               if(arrleft[1] == " 210px;"){
                    $(".layer-body-bg").css({"left":"-210px;"});
                }else{
                    $(".layer-body-bg").css({"left":"0px;"});
                } 
            }else{
                $(".layer-body-bg").css({"left":"-210px;"});
            }
            $(".applicationMes").css({"display":"block"});
            $(".otherApp").css({"display":"none"});
            $(".depend").css({"display":"none"});
            $(".layer-body-bg").css({"display":"block"});
        });
    }
    function getServiceInfo(service_id){
        var tenant_name = $("#tenantName").val();
        $.ajax({
            type : "post",
            url : "/ajax/" + tenant_name  + "/create/dep-info",
            data : {
                service_id : service_id
            },
            cache : false,
            beforeSend : function(xhr, settings) {
                var csrftoken = $.cookie('csrftoken');
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success : function(msg) {
                if(msg.ok){
                    var env_map = msg.obj;
                    var info_div = '<div class="port_info"><p class="layer-tit-lit">应用相关信息</p>';
                    for (var port in env_map){
                        var envs = env_map[port];
                        if( port != -1 )
                        {
                            info_div += '<ul class="clearfix"><li>应用:'+tenant_name+'</li>';
                            info_div += '<li>容器端口:'+port+'</li><li>端口别名:'+envs[0].port_alias+'</li>'
                            info_div += '</ul><p>修改端口别名，会引起对内服务变量名的改变，请记得修改代码中正在使用的变量名。</p>'
                            info_div += '<p class="layer-tit-lit">对内服务环境变量</p><p>其他服务可以直接使用环境变量值访问当前服务。如果想使用环境变量访问，必须指明两个服务之间的依赖关系。</p>';
                            info_div += '<table class="tab-box lit"><thead><tr><th>环境变量</th><th>值</th><th>说明</th></tr></thead><tbody>';
                            var len = envs.length;
                            for( var i = 0; i<len; i++ ){
                                info_div += '<tr><td>'+envs[i].attr_name+'</td>';
                                info_div += '<td>'+envs[i].attr_value+'</td>';
                                info_div += '<td>'+envs[i].name+'</td>'
                                info_div += '</tr>'
                            }
                            info_div += '</tbody></table>'
                        }
                    }
                    var extra_info = env_map[-1];
                    if (typeof(extra_info)!='undefined' || extra_info !=null){
                        info_div += '<table class="tab-box lit"><tbody>';
                        for (var i = 0; i< extra_info.length;i++){
                            info_div += '<tr><td>'+extra_info[i].attr_name+'</td>';
                            info_div += '<td>'+extra_info[i].attr_value+'</td>';
                            info_div += '<td>'+extra_info[i].name+'</td>'
                            info_div += '</tr>'
                        }
                        info_div += '</tbody></table>'
                    }
                    info_div += '</div>';
                    $(info_div).appendTo('.appendDiv');
                    
                }else{
                    swal(msg.info);
                }
            },
            error : function() {
                swal("系统异常,请重试");
            }
        });
    }

    //挂载其他应用持久化目录
    $(".addOtherApp").on("click",function(){
        var marleft = $("#main-content").attr("style");
        if(marleft){
            var arrleft = marleft.split(":");
           if(arrleft[1] == " 210px;"){
                $(".layer-body-bg").css({"left":"-210px;"});
            }else{
                $(".layer-body-bg").css({"left":"0px;"});
            } 
        }else{
            $(".layer-body-bg").css({"left":"-210px;"});
        }
        $(".applicationMes").css({"display":"none"});
        $(".depend").css({"display":"none"});
        $(".otherApp").css({"display":"block"});
        $(".layer-body-bg").css({"display":"block"});
    });

    //挂载其他应用服务
    $(".sureAddOther").on("click",function(){
        var len = $("input.addOther").length;
        for( var i = 0; i<len; i++ )
        {
            if( $("input.addOther").eq(i).is(":checked") )
            {
                var length = $(".otherAppName").length;
                var onOff = true;
                for( var j = 0; j<length; j++ )
                {
                    if( $("input.addOther").eq(i).attr("data-otherName") == $(".otherAppName").eq(j).attr("data-otherName") )
                    {
                        onOff = false;
                        break;
                    }
                }
                if( onOff )
                {
                    var str = '<li><a href="javascript:void(0);"  class="path_name otherAppName" data-otherName="'+$("input.addOther").eq(i).attr("data-otherName")+'">'+$("input.addOther").eq(i).attr("data-name")+'</a>';
                    str += '<em>'+$("input.addOther").eq(i).attr("data-path")+'</em>';
                    str += '<img src="/static/www/images/rubbish.png" class="delLi"/></li>';
                    $(str).appendTo(".fileBlock ul.clearfix");
                    $(".applicationMes").css({"display":"none"});
                    $(".layer-body-bg").css({"display":"none"});
                    delLi();
                }
            }
        }
        $(".applicationMes").css({"display":"none"});
        $(".layer-body-bg").css({"display":"none"});
    });

       ////tips
    tip();
    function tip(){
        $(".fn-tips").mouseover(function(){
            var tips = $(this).attr("data-tips");
            var pos = $(this).attr("data-position");
            var x = $(this).offset().left;
            var y = $(this).offset().top;
            var oDiv='<div class="tips-box"><p><span>'+ tips +'</span><cite></cite></p></div>';
            $("body").append(oDiv);
            var oDivheight = $(".tips-box").height();
            var oDivwidth = $(".tips-box").width();
            var othiswid = $(this).width();
            var othisheight = $(this).height();
            if(pos){
                if(pos == "top"){
                    //
                    $(".tips-box").css({"top":y-oDivheight -25});
                    if(oDivwidth > othiswid){
                        $(".tips-box").css({"left":x-(oDivwidth-othiswid)/2});
                    }else if(oDivwidth < othiswid){
                        $(".tips-box").css({"left":x + (othiswid - oDivwidth)/2});
                    }else{
                        $(".tips-box").css({"left":x});
                    }
                    $(".tips-box").find("cite").addClass("top");
                    //
                }else if(pos == "bottom"){
                    //
                    $(".tips-box").css({"top":y + othisheight + 25});
                    if(oDivwidth > othiswid){
                        $(".tips-box").css({"left":x-(oDivwidth-othiswid)/2});
                    }else if(oDivwidth < othiswid){
                        $(".tips-box").css({"left":x + (othiswid - oDivwidth)/2});
                    }else{
                        $(".tips-box").css({"left":x});
                    }
                    $(".tips-box").find("cite").addClass("bottom");
                    //
                }else if(pos == "left"){
                    $(".tips-box").css({"top":y+5,"left":x-othiswid-5});
                    $(".tips-box").find("cite").addClass("left");
                }else if(pos == "right"){
                    $(".tips-box").css({"top":y+5,"left":x+othiswid+5});
                    $(".tips-box").find("cite").addClass("right");
                }else{
                    //
                    $(".tips-box").css({"top":y-oDivheight -25});
                    if(oDivwidth > othiswid){
                        $(".tips-box").css({"left":x-(oDivwidth-othiswid)/2});
                    }else if(oDivwidth < othiswid){
                        $(".tips-box").css({"left":x + (othiswid - oDivwidth)/2});
                    }else{
                        $(".tips-box").css({"left":x});
                    }
                    $(".tips-box").find("cite").addClass("top");
                    //
                }
            }else{
                //
                $(".tips-box").css({"top":y-oDivheight -25});
                if(oDivwidth > othiswid){
                    $(".tips-box").css({"left":x-(oDivwidth-othiswid)/2});
                }else if(oDivwidth < othiswid){
                    $(".tips-box").css({"left":x + (othiswid - oDivwidth)/2});
                }else{
                    $(".tips-box").css({"left":x});
                }
                $(".tips-box").find("cite").addClass("top");
                //
            }

        });
        $(".fn-tips").mouseout(function(){
            $(".tips-box").remove();
        });
        ////tips end
    }



    //对内、对外服务详情
    //detail();
    //function detail(){
    //    $("span.portDetail").off("click");
    //    $("span.portDetail").on("click",function(){
    //        if( $(this).hasClass("innerDetail") && $(this).hasClass("portDetail") )
    //        {
    //            console.log("对内详情");
    //
    //            var title = '对内服务环境变量';
    //
    //
    //
    //            $(".visit").css({"display":"block"});
    //            $(".applicationMes").css({"display":"none"});
    //            $(".otherApp").css({"display":"none"});
    //            $(".depend").css({"display":"none"});
    //            $(".layer-body-bg").css({"display":"block"});
    //        }
    //        else if( $(this).hasClass("outerDetail") && $(this).hasClass("portDetail") )
    //        {
    //            console.log("对外详情");
    //
    //            var title = '外部访问';
    //
    //            $(".visit").css({"display":"block"});
    //            $(".applicationMes").css({"display":"none"});
    //            $(".otherApp").css({"display":"none"});
    //            $(".depend").css({"display":"none"});
    //            $(".layer-body-bg").css({"display":"block"});
    //        }
    //    })
    //}
    //checkDetail();
    //function checkDetail(){
    //    $("input.checkDetail").off("click");
    //    $("input.checkDetail").on("click",function(){
    //        if( $(this).parent().find("span").hasClass("portDetail") )
    //        {
    //            $(this).parent().find("span").addClass("portDisable");
    //            $(this).parent().find("span").removeClass("portDetail");
    //        }
    //        else if( $(this).parent().find("span").hasClass("portDisable") )
    //        {
    //            $(this).parent().find("span").addClass("portDetail");
    //            $(this).parent().find("span").removeClass("portDisable");
    //        }
    //        detail();
    //    });
    //    detail();
    //}
});