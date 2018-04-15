var content=$("#content");
var width=content.width();
var height=content.height();
//var sw=Swipe();
//云和太阳动画

//开门关门的控制
function dooraction(left,right,time){
		var doorleft=$(".left");
	    var doorright=$(".right");
		var dfd=$.Deferred();
		var count=2;
		function count1(){
            if(count==1){
            	dfd.resolve();
            	return;
            }
            count--;
		}
		doorleft.transit({left:left},time,count1);
		doorright.transit({right:right},time,count1);
		return dfd;
	}
function opendoor(){
		return dooraction('0%','0%',2000);
	}
function shutdoor(){
		return dooraction('-50%','-50%',2000);
	}
//开关灯
var lamp={
		page2another:$(".page2bg"),
		bright:function(){
			this.page2another.addClass("bright");
		},
		dark:function(){
			this.page2another.removeClass("bright");
		}
	}
//飞鸟的控制
var bird={
	elem:$(".bird"),
	fly:function(){
		this.elem.addClass("birdfly");
		this.elem.transition({right:width},15000,"linear");
	}
}
//女孩的位置控制
// var getValue = function(className) {
//         var $elem = $('' + className + '');
//             // 走路的路线坐标
//         return {
//             height: $elem.height(),
//             top: $elem.position().top
//         };
//     };
// console.log(getValue(".second"));
// var bridgeY = function() {
//         var data = getValue('.cbg2');
//         return data.top;
//     }();
// console.log($("#cbg2").position());
// var girl={
// 	elem:$(".girl"),
// 	offset:function(){
// 		this.elem.css({left:width/2,top:bridgeY -this.elem.height()});
// 	}
// }
// girl.offset();
//小男孩状态的控制
function boystate(){
    var boy=$("#boy");
	var getValues=function(className){
		var thing=$(''+className+'');
		var data={
			height:thing.height(),
			top:thing.position().top
		};
		return data;
	}
	var pathY=function(){
		var data1=getValues(".second");
		return data1.top+data1.height/2;
	}();
	bridgeY = function() {
        var data = getValues('.cbg2');
        return data.top;
    }();
    girl={
	elem:$(".girl"),
	offset:function(){
		this.elem.css({left:width/2,top:bridgeY -this.elem.height()});
	},
	rotate:function(){
		this.elem.addClass("girl-rotate");
	}
    }
	girl.offset();
	var boyh=boy.height();
	boy.css({top:pathY-boyh+25});
//开始走路
    function stopwalk(){
        boy.addClass("boystopwalk");
}
//停止走路
    function restorewalk(){
    	boy.removeClass("boystopwalk");
    }
//走路动作变化
    function move(){

    	boy.addClass("boywalk");
    }
//计算距离
    function calculatedist(direaction,proportion){
    	return (direaction=='x'?width:height)*proportion;
    }
    function setrun(option,runtime){
        var dfd=$.Deferred();
        restorewalk();
        boy.transition(option,runtime,'linear',function(){
        	dfd.resolve();
        });
        return dfd;
    }
    function startrun(time,disx,disy){
        var time1=time||3000;
        move();
        var d1=setrun({'left':disx,
                'top':disy?disy:undefined},time1);
        return d1;
    }
    function walktoshop(runtime){
        var dfd=$.Deferred();
        var door=$(".door");
        var offset=door.offset();
        instance=(offset.left+door.width()/2)-(boy.offset().left+boy.width()/2);
        var walkplay=setrun({transform:'translateX('+instance+'px),scale(0.3,0.3)',opacity:0.1},runtime);
        walkplay.done(function(){
        	opacity:0;
        	dfd.resolve();
        });
        return dfd;
    }
    function walkoutshop(runtime){
    	var dfd=$.Deferred();
    	restorewalk();
        var walkplay=setrun({transform:'translateX('+instance+'px),scale(1,1)',opacity:1},runtime);
        walkplay.done(function(){
        	dfd.resolve();
        });
        return dfd;
    }
    function takeflower(){
    	var dfd=$.Deferred();
    	setTimeout(function(){boy.addClass("boywithflowerwalk");
                    dfd.resolve();},1000)
    	return dfd;
    }
    return{
    	stop:function(){ stopwalk();},
    	getflower:function(){
    		return takeflower();
    	},
    	run:function(time,proportionx,proportiony){
    		var disx=calculatedist('x',proportionx);
    		var disy=calculatedist('y',proportiony);
    		return startrun(time,disx,disy);
    	},
    	toshop:function(runtime){return walktoshop(runtime);},
    	outshop:function(runtime){return walkoutshop(runtime);},
    	width:function(){return boy.width()},
    	origin:function(){
    		this.stop();
    		boy.removeClass("boywalk").addClass("boyOriginal");
    	},
    	rotate:function(){
    		restorewalk();
    		boy.addClass("boy-rotate")
    	}
    }
}
 //    $(".test").click(function(){
	// 	$("#boy").addClass("boywalk");
	// 	$("#boy").css({
	// 		left:$("#content").width()+'px',
	// 		transition:"all 10000ms linear"
	// 	});
	// });
//整体页面的控制
function Swipe(){
	var child=content.find(":first");
    var nodes=child.find("li");
    child.css({
	width:(nodes.length*width)+"px",
	height:height+"px"});
    for(var i=0;i<nodes.length;i++){
	var node=nodes.eq(i);
	node.css({
		width:width+'px',
		height:height+'px'
	});
    }
	var swipe={};
	swipe.scrollTo=function(proportion,speed){
		 var n=proportion*width;
         child.css({
         	transform:'translate3d(-'+n+'px,0px,0px)',
            transition:"all "+speed+"ms linear"
            // 'transition-timing-function' : 'linear',
            // 'transition-duration'        : speed + 'ms',
            // 'transform'                  : 'translate3d(-' + n + 'px,0px,0px)'
         });
         return this;   
	};
	return swipe;
}
$(function(){
	var cloud1=$(".cloud1");
    var cloud2=$(".cloud2");
    var sun=$(".sun");
    cloud1.addClass("cloud1state");
    cloud2.addClass("cloud2state");
    sun.addClass("sunstate");
    var sw=Swipe();
	var boymodule=boystate();
	boymodule.run(2000,0.5).then(function(){
		 sw.scrollTo(1,5000);
		 bird.fly();
	}).then(function(){
	     return	boymodule.run(5000,0.5);
	}).then(function(){
       	     boymodule.stop();
       }).then(function(){
       	     return  shutdoor();
       }).then(function(){
       	    lamp.bright();
        }).then(function(){
            return boymodule.toshop(2000);
        }).then(function(){
            return boymodule.getflower();
        }).then(function(){
            bird.fly();
        }).then(function(){
            return  boymodule.outshop(2000);
        }).then(function(){
            return opendoor();
        }).then(function(){
        	 lamp.dark();
         }).then(function(){
         	sw.scrollTo(2,5000);
         }).then(function(){
         	return  boymodule.run(5000,0.15);
         }).then(function(){
         	return boymodule.run(2000,0.25,(bridgeY-girl.elem.height())/height);
         }).then(function(){
         	return  boymodule.run(2500,(width/2-boymodule.width())/width);
         }).then(function(){
         	boymodule.origin();
         }).then(function(){
         	setTimeout(function(){
               girl.rotate();
               boymodule.rotate();
         	},1000)
         })
})