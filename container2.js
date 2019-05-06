var config = {
    apiKey: "AIzaSyAJ-het3sEyXSt9OAABCH2FQya18NIiu4U",
    authDomain: "cs374-tutorial-85bcc.firebaseapp.com",
    databaseURL: "https://cs374-tutorial-85bcc.firebaseio.com",
    projectId: "cs374-tutorial-85bcc",
    storageBucket: "cs374-tutorial-85bcc.appspot.com",
    messagingSenderId: "882137519768"
};
firebase.initializeApp(config);

//Global variables

// 각 event 형식
// [Subject,[Month,Date],[start,end],locationN,explanation,link,numofinterests]
//     0		  1			  2			 3		   4		 5		   6

var eventtimeSet = new Set(); 
var eventList = []; // event들로 구성됨.
var eventkeylist = []; // firebase 안 event들의 key들로 구성됨. (고유 번호라고 생각하면 됩니다)
var timeSelectedList = []; // select된 event들로 구성됨.
var idchecked = false; // 로그인에 성공하면 true
var myID = "None"; // 로그인에 성공하면 id 저장
var myInterest = []; // 로그인에 성공하면 interest불러옴. key로 구성됨.
var todayList = [];
var tomorrowList = [];
var eventtimeSet = new Set();

//timetable
//timetable hover
$('.timet').hover(function() {
		if(($this).data('canhover')){
			$(this).addClass('hover');
			}
    }, function() {
		$(this).removeClass('hover');
    }
);

//timetable click
$('.timet').on('click', function(){
	var timeid = $(this).attr('id');
	var dis = 20+timeid*50;
  if($('.today').hasClass('active1')){
  	if($(this).data('canclick')){
  		if($(this).data('clicked')){
  			$('#today_btn').click()
  			// timeSelectedList = eventList.slice();
        timeSelectedList = todayList.slice();
  			addpin(collectlocation(timeSelectedList));
  		} else {
        $('#content').empty();
  			if($('#time-ctrl').data('havescroll')){
  				$('#today_btn').click();
  				$('#time-ctrl').append("<span id='scrollBar' class='scroll' style='left:"+dis+"px;'></span>");
  				$('#time-ctrl').data('havescroll', true);
  				$(this).data('clicked', true);
  			} else {
  				$('#time-ctrl').append("<span id='scrollBar' class='scroll' style='left:"+dis+"px;'></span>");
  				$('#time-ctrl').data('havescroll', true);
  				$(this).data('clicked', true);
  			}
  			timeSelectedList = []
  			for (var i =0;i < todayList.length;i++){
  				currentEvent = todayList[i];
  				if (currentEvent[2][0].slice(0,2)*1 == timeid*1 + 8){
  					timeSelectedList.push(currentEvent);
  				}
  			};
  			addpin(collectlocation(timeSelectedList));
  		};
  	}
  }
  else{
    if($(this).data('canclick')){
  		if($(this).data('clicked')){
  			$('#tomor_btn').click()
  			// timeSelectedList = eventList.slice();
        timeSelectedList = tomorrowList.slice();
  			addpin(collectlocation(timeSelectedList));
  		} else {
        $('#content').empty();
  			if($('#time-ctrl').data('havescroll')){
  				$('#tomor_btn').click();
  				$('#time-ctrl').append("<span id='scrollBar' class='scroll' style='left:"+dis+"px;'></span>");
  				$('#time-ctrl').data('havescroll', true);
  				$(this).data('clicked', true);
  			} else {
  				$('#time-ctrl').append("<span id='scrollBar' class='scroll' style='left:"+dis+"px;'></span>");
  				$('#time-ctrl').data('havescroll', true);
  				$(this).data('clicked', true);
  			}
  			timeSelectedList = []
  			for (var i =0;i < tomorrowList.length;i++){
  				currentEvent = tomorrowList[i];
  				if (currentEvent[2][0].slice(0,2)*1 == timeid*1 + 8){
  					timeSelectedList.push(currentEvent);
  				}
  			};
  			addpin(collectlocation(timeSelectedList));
  		};
  	}
  }
});

//login
function addIdData(id,pw){
	if (id != "Null"){
		var dat = firebase.database().ref("/4idiotslogin/");
		dat.once('value',function(snapshot){
			var myValue = snapshot.val();
			var keylist = Object.keys(myValue);
			for (var i =0; i<keylist.length; i++){
				var current = keylist[i];
				if (id == myValue[current].ID){
					alert("There already exist such ID!")
					return;
				}
				else{
					continue;
				}
			};
			dat.push()
			newID.set({
				ID : id,
				PW : pw
			});
		})

	}
	else{
		alert("invalid id form");
	}
}

function checkIdData(id,pw){
	firebase.database().ref("/4idiotslogin/").once('value',function(snapshot){
		var myValue = snapshot.val();
		var keylist = Object.keys(myValue);
		for (var i =0; i<keylist.length; i++){
			var current = keylist[i];
			console.log(myValue[current]);
			if (id == myValue[current].ID){
				if (pw == myValue[current].PW){
					idchecked = true;
					alert("login success!")
					myID = current;
					myInterst = myValue[current].Interests;
					console.log("hello, ",myID, "!!");
				}
				else{
					idchecked = false;
					alert("login failed! : Invalid PW")
				}
			}
			else{
				idchecked = false;
				alert("login failed! : NO such ID")
			}
		};
		document.getElementById("ID").value = "";
		document.getElementById("password").value = "";
	})
}

function login(){
	var currentid = document.getElementById("ID").value;
	var currentpw = document.getElementById("password").value;
	console.log(currentid,currentpw);
	checkIdData(currentid,currentpw);
}


function addInterests(index){
	eventList[index][6] += 1;
	myInterest.push(eventkeylist[index]);
	firebase.database().ref("/4idiots/" + eventkeylist[index] + "/value/6/").set(eventList[index][6]);
	firebase.database().ref("/4idiotslogin/" + myID + "/Interests/").set(myInterest);
}

function deleteInterests(index){
	eventList[index][6] -= 1;
	myInterest.splice(index,1);
	firebase.database().ref("/4idiots/" + eventkeylist[index] + "/value/6/").set(eventList[index][6]);
	firebase.database().ref("/4idiotslogin/" + myID + "/Interests/").set(myInterest);
}

$(".sbmitbtn").on('click',function(){
	login();
});

//Today Tomorrow button click
$("#today_btn").on('click', function(){
    $('#content').empty();
		$('#scrollBar').remove();
		$('#time-ctrl').data('havescroll', false);
		eventtimeSet.forEach(function(a){
			if($('#'+a).data('clicked')){
				$('#'+a).data('clicked',false);
			}
		});
    timeevent(todayList);
		timeSelectedList = todayList.slice();
		addpin(collectlocation(timeSelectedList));
});

$("#tomor_btn").on('click', function(){
    $('#content').empty();
		$('#scrollBar').remove();
		$('#time-ctrl').data('havescroll', false);
		eventtimeSet.forEach(function(a){
			if($('#'+a).data('clicked')){
				$('#'+a).data('clicked',false);
			}
		});
    timeevent(tomorrowList);
		timeSelectedList = tomorrowList.slice();
		addpin(collectlocation(timeSelectedList));
});

// //accordian test
var acc = document.getElementsByClassName("accordion");

for (var i = 0; i < acc.length; i++) {
	acc[i].addEventListener("click", function() {
     this.classList.toggle("active");
     var panel = this.nextElementSibling;
     if (panel.style.display === "block") {
       panel.style.display = "none";
     } else {
       panel.style.display = "block";
     }
   });
}



var locationDict = {
	"N13-1" : "Shin-hak Gwan",
	"E11" : "Chang-ui Gwan",
	"E9" : "Academic Cultural Complex",
	"W8" : "Educational Support Building"
};
var coordinateDict = {
	"N13-1" : ["225","150","20"],
	"E11" : ["258","240","20"],
	"E9" : ["237","275","20"],
	"W8" : ["145","250","20"]
};


//pin on the map start
function addpin(list){
$('.pins').children().remove();
b="'./image/redpin2.png'";
c="'./image/redpin1.png'";
d="Off";
e="pinbutton";
  for (var i=0; i<list.length ; i++){
    a="'"+list[i]+"'";
    // $('<area shape="circle" id="N13-1" target="_blank"  coords="290,220,20" href="https://www.naver.com" />').appendTo(".campusmap");
    $('<img  id="' + list[i] +'" src="./image/redpin2.png"' + 'onmouseover="this.src='+c+
    ';" onmouseout="this.src='+b+';"' +
    'style="position: absolute; left:' + coordinateDict[list[i]][0] + 'px; top:' + coordinateDict[list[i]][1] +'px;  width:30px; heigth:50px"' +
    'onclick="onoroff('+a+')" value="Off" />').appendTo(".pins");
  }
}

function onoroff(id){
  currentValue= document.getElementById(id).value;
  if(currentValue== "On"){
    $('#content').empty();
    // $('.pins').children()[0].value="Off";
    document.getElementById(id).value="Off";
    document.getElementById(id).onmouseout = function() { this.src='./image/redpin2.png'; };
    // document.getElementById(id).setAttribute( "onmouseout", "this.src='./image/redpin2.png';" );
  }
  else{
    showDetail(id);
    for(var i=0;i<$('.pins').children().length;i++){
      $('.pins').children()[i].value="Off";
      document.getElementById($('.pins').children()[i].id).onmouseout = function() { this.src='./image/redpin2.png'; };
      document.getElementById($('.pins').children()[i].id).src='./image/redpin2.png';
      // document.getElementById($('.pins').children()[i].id).setAttribute( "onmouseout", "this.src='./image/redpin2.png';" );
    }
    document.getElementById(id).value="On";
    document.getElementById(id).onmouseout = function() { this.src='./image/blackpin.png'; };
    // document.getElementById(id).setAttribute( "onmouseout", "this.src='./image/blackpin.png';" );
  }
}

function pincolor(id){
  var currentValue = document.getElementById(id);
   if(currentValue){
     currentValue2= document.getElementById(id).value;
     if(currentValue== "On"){
       return "'./image/blackpin.png'";
     }
     else{
       return "'./image/redpin2.png'";
     }
   }
   else{
     return "'./image/redpin2.png'";
   }
}

function collectlocation(list){
  var a=[];
  for (var i=0; i<list.length ; i++){
    a.push(list[i][3]);
  }
  a.sort();
  return removeoverlap(a);
}

function removeoverlap(list){
	var a=[];
  a.push(list[0]);
	for (var i=0 ; i<list.length-1 ; i++){
    	if (list[i] != list[i+1]){
        	a.push(list[i+1]);
        }
    }
  return a;
}
// addpin(collectlocation(eventList));
//pin on the map end

// 데이터 로드 완료시 실행되는 함수입니다!
function loadComplete(){
  timeSelectedList = todayList.slice();
	timeevent(todayList);
	addpin(collectlocation(todayList));
}
///////////////

//make dateList start
function makedateList(month,date){
  var a=[];
  for (var i=0;i<eventList.length;i++){
    if(month==eventList[i][1][0] && date==eventList[i][1][1]){
      a.push(eventList[i]);
    }
  }
  return a;
}
//make dateList end

//today and Tomorrow
$("button").click(function(){
  $("button").removeClass("active1");
  $(this).addClass("active1");
});


//timetable event 점찍기&click,hover 가능여부
function timeevent(list){
  eventtimeSet.clear();
  $('.timet').removeAttr("style");
  $('.inner-wrap').find('.event_time').remove();
  for (var i =0;i < list.length;i++){
    currentEvent = list[i];
    var b = currentEvent[2][0].slice(0,2)*1-8;
    eventtimeSet.add(b);
  }
  eventtimeSet.forEach(function(a){
    var dist=33+a*50;
    $('.inner-wrap').append("<span id='event_time"+a+"' class='event_time' style='left:"+dist+"px;'></span>");
	});
	for(j=0;j<16;j++){
		if(eventtimeSet.has(j)!=true){
			$('#'+j).css('color','gray');
			$('#'+j).data('canclick',false);
			$('#'+j).data('canhover',false);
		} else {
      $('#'+j).css('color','white');
			$('#'+j).data('canclick',true);
			$('#'+j).data('canhover',true);
		}
	}
}

function writeData(l){
	//Just For Adding Events
	var newdata = firebase.database().ref('/4idiots/').push();
	newdata.set({
		value : l
	});
}

function readData(){
	firebase.database().ref('/4idiots/').once('value',function(snapshot){
		var myValue = snapshot.val();
		eventkeylist = Object.keys(myValue);
		for (var i =0; i<eventkeylist.length;i++){
			eventList.push(myValue[eventkeylist[i]].value);
      todayList=makedateList(5,22);
      tomorrowList=makedateList(5,23);
		}
		loadComplete();
	})
}

function showDetail(event){
	$("#content").empty();
	for(var i=0;i<timeSelectedList.length;i++){
		if(event == timeSelectedList[i][3]){
			$("#content")
			.append($('<button class="accordion" id="accordion'+i+'">'+timeSelectedList[i][0]+'</button>'))
			.append($('<div class="panel" id="panel'+i+'"></div>'));
			$("#panel"+i)
			.append($('<br><p id = "subjectName">' + timeSelectedList[i][0] + '<br>'))
			.append($('<p>').html("When?"))
			.append($('<p id = "detailTime">').html(timeSelectedList[i][1][0] + " / "
			+ timeSelectedList[i][1][1] + "  " + timeSelectedList[i][2][0] + " ~ " + timeSelectedList[i][2][1]))
			.append($('<br>').html("Where?"))
			.append($('<p id = "locNum">').html('( ' + timeSelectedList[i][3] + ' )  ' + locationDict[timeSelectedList[i][3]]))
			.append($('<br><p id = "reward">').html(timeSelectedList[i][4]))
			.append($('<a id = "detailLink" href="' + timeSelectedList[i][5] + '">').html("Link"))
			.append($('<div class="heart" style="color:red;"><i class="fas fa-heart"></i>'+timeSelectedList[i][6]+'</div>'));


			$("#accordion"+i).bind("click", function() {
				this.classList.toggle("active");
				var panel = this.nextElementSibling;
				if (panel.style.display === "block") {
					panel.style.display = "none";
				} else {
					panel.style.display = "block";
				}
			});

		}
	}
	// event 하나일 때 accordion 안할거면 아래 코드 이용 가능
	// } else {
	// 	console.log(3);
	// 	for(var i=0;i<timeSelectedList.length;i++){
	// 		if(event == timeSelectedList[i][3]){
	// 			$("#content").append($('<div class="contentbox" id="contentbox'+i+'"></div>'));
	// 			$("#contentbox"+i)
	// 			.append($('<br><p id = "subjectName">' + timeSelectedList[i][0] + '<br>'))
	// 			.append($('<p>').html("When?"))
	// 			.append($('<p id = "detailTime">').html(timeSelectedList[i][1][0] + " / "
	// 			+ timeSelectedList[i][1][1] + "  " + timeSelectedList[i][2][0] + " ~ " + timeSelectedList[i][2][1]))
	// 			.append($('<br>').html("Where?"))
	// 			.append($('<p id = "locNum">').html('( ' + timeSelectedList[i][3] + ' )  ' + locationDict[timeSelectedList[i][3]]))
	// 			.append($('<br><p id = "reward">').html(timeSelectedList[i][4]))
	// 			.append($('<a id = "detailLink" href="' + timeSelectedList[i][5] + '">').html("Link"));
	// 		}
	// 	}
}

$(document).on('click','.heart', function(){
	console.log($(this).css("color"))
	if ("rgb(128, 128, 128)" == $(this).css("color")){
		$(this).css("color","red")
	}
	else{
		$(this).css("color","gray")
	}

})

$( document ).ready(function(){
	readData();
});
