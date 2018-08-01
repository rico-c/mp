var $currentaddress = "uploads/youngforyou.gp5";
    	var $currentusername;
    	var $collectstatus = false; 
    	var $theaction;
    	var $collectsongs = new Array();

    	$(".closebutton").click(function(){
    		$(".floatarea").hide();
    	});

    	$(".a-upload").on("change","input[type='file']",function(){
		    var filePath=$(this).val();
		    if(filePath.indexOf("gp4")!=-1 || filePath.indexOf("gp5")!=-1){
		        $(".fileerrorTip").html("").hide();
		        var arr=filePath.split('\\');
		        var fileName=arr[arr.length-1];
		        $(".showFileName").html(fileName);
		    }else{
		        $(".showFileName").html("");
		        $(".fileerrorTip").html("请上传后缀为.gp4或.gp5格式的乐谱文件").show();
		        return false 
		    }
		})

    	function contains(address) {  
    		$("#collectpic").attr("src","pics/collect.png");
		   	for(var i=0;i<$collectsongs.length;i++){
		   		if($collectsongs[i].address===address){
		   			$("#collectpic").attr("src","pics/collected.png");
		   		}
		   	}
		};
    	$("#collectpic").click(function(){
    		if($("#loginstatus").attr("data")=="loged"){
				if($("#collectpic").attr("src")==="pics/collect.png"){
					$("#collectpic").attr("src","pics/collected.png");
					$theaction=true;
				}else{
					$("#collectpic").attr("src","pics/collect.png");
					$theaction=false;
				};
	    		(function(){	
	    			// µã»÷ºóµÄº¯ÊýÖ´ÐÐÊÕ²Ø»òÈ¡ÏûµÄ¶¯×÷£¬Ò³ÃæË¢ÐÂÊ±ÐèÒªÖ´ÐÐÒ»´Î²éÑ¯
	    			$.ajax({ 
			          type:"post",
			          url:"php/collect.php",
			          dataType:"json",
			          data:{username:$currentusername,tabaddress:$currentaddress,action:$theaction},
			          success:function(feedbackdata){
			          }
			        });
			        $.ajax({ 
				          type:"post",
				          url:"php/collectinfo.php",
				          dataType:"json",
				          data:{username:$currentusername},
				          success:function(feedback)
				          {
				          	$collectsongs = feedback;
				          	console.log(feedback);
				          	$("#mycollectlist").find("li").remove();
				          	for(var j=0;j<feedback.length;j++){
				          		$("#mycollectlist").append("<li class='collectlist-li' data="+feedback[j].address+">"+feedback[j].name+"&nbsp;-&nbsp;"+feedback[j].singer+"</li>");
				          	};
				          }
				      });
		    	})()
		    }else{
		    	alert("请先登录")
		    }
    	});

    	// ËÑË÷ajax

	    $("#ricotext").keyup(
	    	function(){
				    	$.ajax({ //ºóÌ¨µ÷ÓÃphpÎÄ¼þ½øÐÐ²éÑ¯
				          type:"post",
				          url:"php/search.php",
				          dataType:"json",
				          data:{search:$("#ricotext").val()},
				          success:function(feedbackdata)
				            {	
				            	console.log(feedbackdata);
				            	$("#searchresult").find("li").remove(); 
					            for(var i=0;i<feedbackdata.length;i++){
					                $("#searchresult").append("<li class='searchresult-li' data="+feedbackdata[i].address+">"+feedbackdata[i].name+"&nbsp;-&nbsp;"+feedbackdata[i].singer+"</li>");
				          		};
				          		$(".searchresult-li").click(function(){
							 		 $('#alphaTab').alphaTab('load',$(this).attr("data"));
							 		 contains($(this).attr("data"));
							         $("#playPausepic").attr("src","pics/play.svg"); 
							         $("#songinfo1").html($(this));
							         $("#songinfo").html($(this));
							         $(".floatarea").hide();
							         $currentaddress=$(this).attr("data");
							         // µã»÷ºóÔö¼Óµã»÷Á¿¼¼Êõ
							         $.ajax({ //ºóÌ¨µ÷ÓÃphpÎÄ¼þ½øÐÐ²éÑ¯
								          type:"post",
								          url:"php/count.php",
								          dataType:"json",
								          data:{address:$(this).attr("data")},
								          success:function(feedbackdata){}
								     });
							 	});
				            },
				          error:function(feedbackdata)
				            {
				              $("#searchresult").find("li").remove();
				            },
				        })
	    });
	    // ÈÈ°ñajax
	    $(document).ready(function(){
	    	$.ajax({ //ºóÌ¨µ÷ÓÃphpÎÄ¼þ½øÐÐ²éÑ¯
	          type:"post",
	          url:"php/ranking.php",
	          data:{},
	          dataType:"json",
	          success:function(feedbackdata){
	          		console.log(feedbackdata);
	            	$("#rankinglist").find("li").remove(); 
		            for(var i=0;i<feedbackdata.length;i++){
		                $("#rankinglist").append("<li class='rankinglist-li' data="+feedbackdata[i].address+">"+feedbackdata[i].name+"&nbsp;-&nbsp;"+feedbackdata[i].singer+"</li>");
	          		};
	          		// $('#alphaTab').alphaTab('load',feedbackdata[0].address);
	          		$(".rankinglist-li").click(function(){
				 		console.log("liclicked");
				 		 $('#alphaTab').alphaTab('load',$(this).attr("data"));
				         $("#playPausepic").attr("src","pics/play.svg"); 
				         contains($(this).attr("data"));
				         $(".floatarea").hide();
				         $currentaddress=$(this).attr("data");
				         // µã»÷ºóÔö¼Óµã»÷Á¿¼¼Êõ
				         $.ajax({ //ºóÌ¨µ÷ÓÃphpÎÄ¼þ½øÐÐ²éÑ¯
					          type:"post",
					          url:"php/count.php",
					          dataType:"json",
					          data:{address:$(this).attr("data")},
					          success:function(feedbackdata)
					            {}
					     });
				 	});
	          }
	    	});
	    });
	    // ÉÏ´«ajax
	    $("#upload-newtab-button").click(function(){
	    	if(($("#uploadname").val())&&($("#uploadsinger").val())&&($("#uploadfile").val())){
			    var data = new FormData();
			    var fileobj = document.getElementById('uploadfile').files[0];

			    data.append("name",$("#uploadname").val());
			    data.append("singer",$("#uploadsinger").val());
			    data.append("file",fileobj);

		        $.ajax({
		            url: 'php/upload.php',
		            type: 'POST',
		            data: data,
		            dataType: 'text',
		            cache: false,
		            processData: false,
		            contentType: false,
		            success: function(feedbackdata){
		            	$("#uploadresulutinfo").html(feedbackdata);
		            }
		        })
		    }else{
		    	$("#uploadresulutinfo").html('请填写完整信息并上传指定格式的乐谱')
		    }
	    });

		// µÇÂ¼ajax
		$(function(){
		    $("#loginbutton").click(function(){ //
		        $.ajax({ //ºóÌ¨µ÷ÓÃphpÎÄ¼þ½øÐÐ²éÑ¯
		          type:"post",
		          url:"php/login.php",
		          dataType:"text",
		          data:{username:$("#usernameinput").val(),password:$("#passwordinput").val()},
		          success:function(feedbackdata)
		            {	
		              if(feedbackdata==="success"){
		              	$("#loginstatus").html("登录成功");
		              	$("#loginstatus").attr("data","loged");
		              	$("#leftbar-login").html($("#usernameinput").val());
		              	$currentusername = $("#usernameinput").val();
		              	setTimeout("$('.floatarea').hide()",200);
		              }else{
		              	$("#loginstatus").html("登录失败")
		              };
		              // µÇÂ½ºó»ñÈ¡¸ÃÓÃ»§µÄÊÕ²ØÁÐ±í
		              $.ajax({ 
				          type:"post",
				          url:"php/collectinfo.php",
				          dataType:"json",
				          data:{username:$currentusername},
				          success:function(feedback)
				          {
				          	$collectsongs = feedback;
				          	console.log(feedback);
				          	$("#mycollectlist").find("li").remove();
				          	for(var j=0;j<feedback.length;j++){
				          		$("#mycollectlist").append("<li class='collectlist-li' data="+feedback[j].address+">"+feedback[j].name+"&nbsp;-&nbsp;"+feedback[j].singer+"</li>");
				          	};
				          	$(".collectlist-li").click(function(){
						 		console.log("liclicked");
						 		 $('#alphaTab').alphaTab('load',$(this).attr("data"));
						 		 contains($(this).attr("data"));
						         $("#playPausepic").attr("src")=="pics/play.svg";   
						         $currentaddress=$(this).attr("data");
						         $(".floatarea").hide();
						         // µã»÷ºóÔö¼Óµã»÷Á¿¼¼Êõ
						         $.ajax({ //ºóÌ¨µ÷ÓÃphpÎÄ¼þ½øÐÐ²éÑ¯
							          type:"post",
							          url:"php/count.php",
							          dataType:"json",
							          data:{address:$(this).attr("data")},
							          success:function(feedbackdata)
							            {}
							     });
						 	});
				          }
				      });
		            }
		        });
		    })
	 	 });
		// ×¢²áajax
		$(function(){
		    $("#regbutton").click(function(){ 
		    	if($("#passwordreg").val()===$("#passwordreg2").val()){
		    		if($("#passwordreg").val().length>=6){
				        $.ajax({
					          type:"post",
					          url:"php/register.php",
					          dataType:"text",
					          data:{username:$("#usernamereg").val(),password:$("#passwordreg").val()},
					          success:function(feedbackdata){
					            $("#registerstatus").html(feedbackdata);
					            console.log(feedbackdata);
					            },
				        })
				    }else{
				    	$("#registerstatus").html("错误：密码长度必须大于6位");
				    }
			    }
			    else{
		        	$("#registerstatus").html("错误：两次密码不一致");
		        }
		    })
	 	});

	 	$("#stopbutton").click(function(){
	 		$("#playPausepic").attr("src","pics/play.svg"); 
	 	});
	    // ÀÖÆ÷¼°ËÙ¶È°´Å¥
	     $(".dropdown-toggle1").on("click", function(){
			$(".dropdown-menu1").fadeToggle(50);
			$(".dropdown-menu2").fadeOut(50);
		});

		$(".dropdown-toggle2").on("click", function(){
			$(".dropdown-menu2").fadeToggle(50);
			$(".dropdown-menu1").fadeOut(50);
		});
		$(".dropdown-menu1").find('li').click(
			function(){
				$(".dropdown-menu1").fadeOut(50);
			}
			);
		// ×ó²àÀ¸°´Å¥µ¯³ö
    	$("#leftbar-search").click(function(){
    		if($("#float-search").css("display")=='none'){
    			$(".floatarea").fadeOut(50);
		  		$("#float-search").fadeIn(50);
		  		$("#ricotext").focus();
    		}else{
    			$(".floatarea").fadeOut(50);
    		};
		  });
    	$("#leftbar-ranking").click(function(){
    		if($("#float-ranking").css("display")=='none'){
    			$(".floatarea").fadeOut(50);
		  		$("#float-ranking").fadeIn(50);
    		}else{
    			$(".floatarea").fadeOut(50);
    		};
		  });
    	$("#leftbar-collect").click(function(){
    		if($("#float-collect").css("display")=='none'){
    			$(".floatarea").fadeOut(50);
		  		$("#float-collect").fadeIn(50);
    		}else{
    			$(".floatarea").fadeOut(50);
    		};
		  });
    	$("#leftbar-upload").click(function(){
    		if($("#float-upload").css("display")=='none'){
    			$(".floatarea").fadeOut(50);
		  		$("#float-upload").fadeIn(50);
    		}else{
    			$(".floatarea").fadeOut(50);
    		};
		  });
    	$("#leftbar-login").click(function(){
    		if($("#float-login").css("display")=='none'){
    			$(".floatarea").fadeOut(50);
		  		$("#float-login").fadeIn(50);
    		}else{
    			$(".floatarea").fadeOut(50);
    		};
		  });
    	$("#registerbutton").click(function(){
		  $("#float-login").toggle();
		  $("#float-register").show();
		  });
	
    	// ²¥·Å°´Å¥
    	$("#playPause").click(function(){  
            if($("#playPausepic").attr("src")=="pics/play.svg")  
            {  
                $("#playPausepic").attr("src","pics/pause.svg");  
            }  
            else  
            {  
                $("#playPausepic").attr("src","pics/play.svg");  
            }   
        });  
       
        var at = $('#alphaTab');

        $(document).keydown(function(e){
		    if(!e) {var e = window.event}; 
			    if(e.keyCode==32){
			    	if(($("#float-upload").css('display')=='none')&&($("#float-search").css('display')=='none')&&($("#float-login").css('display')=='none')&&($("#float-register").css('display')=='none')){
			       		 $("#playPause").click();
			       		 e.preventDefault()
			   		 }
	    		}	
		 });