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
// [Subject,[Month,Date],[start,end],locationN,explanation,link,[view,share],reservat,gifttyep]
//     0		  1			  2			 3		   4		 5		  6		 	7		  8
//ex ["Four Idiots Project Showcase",[6,4],["16:00","16:30"],"E11","All free events are ready for you!","http://~~",100,"Null",0]
//reservation 이 필요없으면 Null, 필요하면 링크가 들어있습니다.
//8 : gifttype은 0일때 음식, 1일때 물건, 2일때 둘다입니다.

var eventtimeSet = new Set();
var eventList = []; // event들로 구성됨.
var eventkeylist = []; // firebase 안 event들의 key들로 구성됨. (고유 번호라고 생각하면 됩니다)
var timeSelectedList = []; // select된 event들로 구성됨.
var idchecked = false; // 로그인에 성공하면 true
var myID = "None"; // 로그인에 성공하면 id 저장
var myInterest = []; // 로그인에 성공하면 interest불러옴. key로 구성됨.
var todayList = [];
var tomorrowList = [];
var remainderList = [];
var eventtimeSet = new Set();
var dateoffset = 0;
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
var sun_on_tomor = true;
var sun_on_today = false;

//timetable
//timetable hover
$('.timet').hover(function() {
		if($(this).data('canhover')){
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

/*//login
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

function deleteInterests(index){
	eventList[index][6] -= 1;
	myInterest.splice(index,1);
	firebase.database().ref("/4idiots/" + eventkeylist[index] + "/value/6/").set(eventList[index][6]);
	firebase.database().ref("/4idiotslogin/" + myID + "/Interests/").set(myInterest);
}


$(".sbmitbtn").on('click',function(){
	login();
});*/

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
	//sunny_moving();
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


// //accordian
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



//Dictionaries for event showing

var locationDict = {
	"N13-1" : "Chang Young Shin Student Center",
	"E11" : "Chang-ui Gwan",
	"E9" : "Academic Cultural Complex",
	"W8" : "Educational Support Building",
  "N1" : "Kim Beang-Ho KIM Sam-Youl ITC Building",
  "E15" : "Auditorium",
  "E6" : "Natural Science B/D",
  "W1" : "Applied Engineering B/D",
  "N13" : "Tae Wul Gwan",
  "E3" : "Information & Electronics B/D"

};

var locationDict_KR = {
	"N13-1" : "장영신 학생회관",
	"E11" : "항의학습관",
	"E9" : "중앙도서관 학술문화관",
	"W8" : "W8",
  "N1" : "Kim Beang-Ho KIM Sam-Youl ITC Building",
  "E15" : "대강당",
  "E6" : "자연과학동",
  "W1" : "응용공학동",
  "N13" : "태울관",
  "E3" : "전자정보동"
};

var coordinateDict = {
	"N13-1" : ["390","165"],
	"E11" : ["410","255"],
	"E9" : ["400","290"],
	"W8" : ["285","260"],
  "N1" : ["610","160"],
  "E15" : ["455","220"],
  "E6" : ["500","280"],
  "W1" : ["250","410"],
  "N13" : ["370","165"],
  "E3" : ["510","350"]
};
var imageDict = {
	0 : '<img class = "hamburger" src="./image/beef.png">',
	1 : '<img class = "gift" src="./image/gift.png">',
	2 : '<img class = "hamburger" src="./image/beef.png"><img class = "gift" src="./image/gift.png">'
};


//pin on the map start
function addpin(list){
$('.pins').children().remove();
b="'./image/pin1.png'";
c="'./image/pin2.png'";
d="Off";
e="pinbutton";
  for (var i=0; i<list.length ; i++){
    a="'"+list[i]+"'";
    // $('<area shape="circle" id="N13-1" target="_blank"  coords="290,220,20" href="https://www.naver.com" />').appendTo(".campusmap");
    $('<img  class = "pin" id="' + list[i] +'" src="./image/pin1.png"' + 'onmouseover="this.src='+c+
    ';" onmouseout="this.src='+b+';"' +
    'style="position: absolute; left:' + coordinateDict[list[i]][0] + 'px; top:' + coordinateDict[list[i]][1] +'px;  width:30px; heigth:50px"' +
    'onclick="onoroff('+a+')" value="Off" />').appendTo(".pins");
  }
  $('.pin').animate({marginTop: "-12px"},600,"",function(){
		$(this).animate({marginTop:"0px"},600,"", function(){
			//moving_pin(this);
		});
	});
}

function onoroff(id){
  currentValue= document.getElementById(id).value;
  if(currentValue== "On"){
    $('#content').empty();
    // $('.pins').children()[0].value="Off";
    document.getElementById(id).value="Off";
    document.getElementById(id).onmouseout = function() { this.src='./image/pin1.png'; };
    // document.getElementById(id).setAttribute( "onmouseout", "this.src='./image/redpin2.png';" );
  }
  else{
    showDetail(id);
    for(var i=0;i<$('.pins').children().length;i++){
      $('.pins').children()[i].value="Off";
      document.getElementById($('.pins').children()[i].id).onmouseout = function() { this.src='./image/pin1.png'; };
      document.getElementById($('.pins').children()[i].id).src='./image/pin1.png';
      // document.getElementById($('.pins').children()[i].id).setAttribute( "onmouseout", "this.src='./image/redpin2.png';" );
    }
    document.getElementById(id).value="On";
    document.getElementById(id).onmouseout = function() { this.src='./image/pin3.png'; };
    // document.getElementById(id).setAttribute( "onmouseout", "this.src='./image/blackpin.png';" );
  }
}

function pincolor(id){
  var currentValue = document.getElementById(id);
   if(currentValue){
     currentValue2= document.getElementById(id).value;
     if(currentValue== "On"){
       return "'./image/pin3.png'";
     }
     else{
       return "'./image/pin1.png'";
     }
   }
   else{
     return "'./image/pin1.png'";
   }
}

function collectlocation(list){
  var a=[];
  if (list.length == 0){
  	return a;
  }
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


//today and Tomorrow
$(".radio-button").click(function(){
  $(".radio-button").removeClass("active1");
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
      $('#'+j).css('color','black');
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

function readData(){ //데이터 로드 from firebase
	firebase.database().ref('/4idiots/').once('value',function(snapshot){
		var myValue = snapshot.val();
		eventkeylist = Object.keys(myValue);
		var today = Date.parse('2019/05/28/09:00:00');
		//var today = Date.now();
		for (var i =0; i<eventkeylist.length;i++){
			var event = myValue[eventkeylist[i]].value;
			var eventsec = Date.parse('2019/' +
				String(event[1][0]).padStart(2,'0') + '/' +
				String(event[1][1]).padStart(2,'0') + '/' +
				event[2][1] + ':00');
			var eventdatesec = Date.parse('2019/' +
				String(event[1][0]).padStart(2,'0') + '/' +
				String(event[1][1]).padStart(2,'0') + '/00:00:00');
			if (today >= eventsec){
				//여기에서 firebase에서 지우는것도 고려
				continue;
			}
			else if (today >= eventdatesec - 86400000){
				if (today >= eventdatesec){
					todayList.push(event);
				}
				else{
					tomorrowList.push(event);
				}
			}
			eventList.push(event);
			remainderList.push(event);
		}
		loadComplete();
	})
}

function showDetail(event){
	$("#content").empty();
	for(var i=0;i<timeSelectedList.length;i++){
		if(event == timeSelectedList[i][3]){
			$("#content")
			.append($('<button class="accordion" id="accordion'+i+'">'+timeSelectedList[i][0]+imageDict[timeSelectedList[i][8]]+'</button>'))
			.append($('<div class="panel" id="panel'+i+'"></div>'));

			$("#panel"+i)
			.append($('<br><p id = "subjectName">' + timeSelectedList[i][0] + '<br>'))
			.append($('<p style="font-weight:bold">').html("When?"))
			.append($('<p id = "detailTime">').html(timeSelectedList[i][1][0] + " / "
			+ timeSelectedList[i][1][1] + "  " + timeSelectedList[i][2][0] + " ~ " + timeSelectedList[i][2][1]))
			.append($('<p style="font-weight:bold">').html("Where?"))
			.append($('<p id = "locNum">').html('( ' + timeSelectedList[i][3] + ' )  ' + locationDict[timeSelectedList[i][3]]))
			.append($('<p style="font-weight:bold">').html("What?"))
			.append($('<p id = "reward">').html(timeSelectedList[i][4]))
			.append($('<a id = "detailLink" href="' + timeSelectedList[i][5] + '">').html("Link"))
			//.append($('<div class="heart" style="color:red;"><i class="fas fa-heart"></i>'+timeSelectedList[i][6]+'</div>'));
			.append($('<a id="kakao-link-btn'+i+'" class="kakaolink" href="javascript:sendLink('+"'"+event+"'"+');"><img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"/></a>'));

			$("#accordion"+i).bind("click", function() {
				this.classList.toggle("active");
				var panel = this.nextElementSibling;
				if (panel.style.display === "block") {
					panel.style.display = "none";
					addViewcount(eventtoindex(timeSelectedList[i]));
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

function moving_pin(pin){
	$(pin).animate({marginTop: "-12px"},600,"",function(){
		$(this).animate({marginTop:"0px"},600,"", function(){
			//moving_pin(this);
		});
	});
}

$(document).on("click",".pin",function(){
	moving_pin(this);
});

//팝업창
// [Subject,[Month,Date],[start,end],locationN,explanation,link,numofinterests,reservat]
//     0		  1			  2			 3		   4		 5		   6		  7
function popupContents(list){
	var nlist = [];
	for(var i=0;i<list.length;i++){
		if(list[i][7]!= "Null") {
			nlist.push(list[i])
		}
	}

	if (nlist.length == 0){
		$(".modal_left_body").empty();
		$(".modal_right").empty();
		$(".modal_left_body").append($('<p>').html("There are no events"));
		return
	}
	$(".modal_left_body").empty();
	$(".modal_right").empty();

	for(var i=0;i<nlist.length;i++){
			$(".modal_left_body")
			.append($('<button class="prereserve" style="margin-bottom:2px" id="prereserve'+i+'">'+nlist[i][0]+'<img class = "hamburger" src="./image/beef.png"></button>'));


			$("#prereserve"+i).bind('click', function(){
				$(".modal_right").empty();
				var k = Number($(this).attr('id').slice(-1));
				$(".modal_right")
				.append($('<br><p id = "subjectName">' + nlist[k][0] + '<br>'))
				.append($('<p style="font-weight:bold">').html("When?"))
				.append($('<p id = "detailTime">').html(nlist[k][1][0] + " / "
				+ nlist[k][1][1] + "  " + nlist[k][2][0] + " ~ " + nlist[k][2][1]))
				.append($('<p style="font-weight:bold">').html("Where?"))
				.append($('<p id = "locNum">').html('( ' + nlist[k][3] + ' )  ' + locationDict[nlist[k][3]]))
				.append($('<p style="font-weight:bold">').html("What?"))
				.append($('<p id = "reward">').html(nlist[k][4]))
				.append($('<a id = "detailLink" href="' + nlist[k][5] + '">').html("Detail info"))
				.append($('<a id = "preLink" class="preReg" href="'+ nlist[k][7] + '">').html("Pre-Registration"))
			});

	}

	$(".modal_right")
				.append($('<br><p id = "subjectName">' + nlist[0][0] + '<br>'))
				.append($('<p style="font-weight:bold">').html("When?"))
				.append($('<p id = "detailTime">').html(nlist[0][1][0] + " / "
				+ nlist[0][1][1] + "  " + nlist[0][2][0] + " ~ " + nlist[0][2][1]))
				.append($('<p style="font-weight:bold">').html("Where?"))
				.append($('<p id = "locNum">').html('( ' + nlist[0][3] + ' )  ' + locationDict[nlist[0][3]]))
				.append($('<p style="font-weight:bold">').html("What?"))
				.append($('<p id = "reward">').html(nlist[0][4]))
				.append($('<a id = "detailLink" href="' + nlist[0][5] + '">').html("Detail info"))
				.append($('<a id = "preLink" class="preReg" href="'+ nlist[0][7] + '">').html("Pre-Registration"));
}


// 	for(var j=0;j<5;j++){
// 		var now = new Date(Date.now() + 86400000 * (2 + j));
// 		console.log(now);
//     $('#modal'+j).text((now.getMonth()+1).toString()+'/'+now.getDate().toString());
// 	}


$(".glyphicon-chevron-left").on('click',function(){
	dateoffset-=1;
	var current = new Date(Date.now() + 86400000 * dateoffset);
	$(".dates").html((monthNames[current.getMonth()]) + ' ' + current.getDate());
	if (dateoffset == 0){
		$(".glyphicon-chevron-left").prop('disabled',true);
		popupContents(todayList);
	}
	else if (dateoffset == 1){
		popupContents(tomorrowList);
	}
	else{
		var objectList = [];
		for (var i = 0; i<eventList.length;i++){
			if (current.getMonth()+1 == eventList[i][1][0] && current.getDate() == eventList[i][1][1]){
				objectList.push(eventList[i]);
			}
		};
		popupContents(objectList);
	}
});

$(".glyphicon-chevron-right").on('click',function(){
	dateoffset+=1;
	var current = new Date(Date.now() + 86400000 * dateoffset);
	$(".dates").html((monthNames[current.getMonth()]) + ' ' + current.getDate());

	if (dateoffset == 1){
		popupContents(tomorrowList);
		$(".glyphicon-chevron-left").prop('disabled',false)
	}
	else{
		var objectList = [];
		for (var i = 0; i<eventList.length;i++){
			if (current.getMonth()+1 == eventList[i][1][0] && current.getDate() == eventList[i][1][1]){
				objectList.push(eventList[i]);
			}
		};
		popupContents(objectList);
	}
});

// for(var j=0;j<5;j++){
//   var modalbtn = document.getElementById("modal"+j);

//   modalbtn.onclick = function() {
//     $(".modal_right").empty();
//     var now = new Date(Date.now() + 86400000 * (2 + Number(this.value)));
//     for(var i=0;i<eventList.length;i++){
//       if(now.getMonth()+1 == eventList[i][1][0] && now.getDate() == eventList[i][1][1]){
//         console.log(i);
//         $(".modal_right")
//           .append($('<div class="modalpanel" id="modalpanel'+i+'"></div>'));
//         $("#modalpanel"+i)
//           .append($('<br><p id = "subjectName">' + eventList[i][0] + '<br>'))
//           .append($('<p>').html("When?"))
//           .append($('<p id = "detailTime">').html(eventList[i][1][0] + " / "
//           + eventList[i][1][1] + "  " + eventList[i][2][0] + " ~ " + eventList[i][2][1]))
//           .append($('<br>').html("Where?"))
//           .append($('<p id = "locNum">').html('( ' + eventList[i][3] + ' )  ' + locationDict[eventList[i][3]]))
//           .append($('<br><p id = "reward">').html(eventList[i][4]))
//           .append($('<a id = "detailLink" href="' + eventList[i][5] + '">').html("Link"))
//       }
//     }
//   }
// }

// 	for(var j=0;j<5;j++){
// 	 var modalbtn = document.getElementById("modal"+j);

// 	 modalbtn.onclick = function() {
// 	   $(".modal_right").empty();
// 	   var now = new Date(Date.now() + 86400000 * (2 + Number(this.value)));
// 	   for(var i=0;i<eventList.length;i++){
// 	     if(now.getMonth()+1 == eventList[i][1][0] && now.getDate() == eventList[i][1][1]){
// 	       console.log(i);
// 	       $(".modal_right")
// 	         .append($('<div class="modalpanel" id="modalpanel'+i+'"></div>'));
// 	       $("#modalpanel"+i)
// 	         .append($('<br><p id = "subjectNameun">' + eventList[i][0] + '<br>'))
// 	         .append($('<p>').html("When?"))
// 	         .append($('<p id = "detailTime">').html(eventList[i][1][0] + " / "
// 	         + eventList[i][1][1] + "  " + eventList[i][2][0] + " ~ " + eventList[i][2][1]))
// 	         .append($('<br>').html("Where?"))
// 	         .append($('<p id = "locNum">').html('( ' + eventList[i][3] + ' )  ' + locationDict[eventList[i][3]]))
// 	         .append($('<br><p id = "reward">').html(eventList[i][4]))
// 	         .append($('<a id = "detailLink" href="' + eventList[i][5] + '">').html("Link"))
// 	     }
// 	   }
// 	  }
// 	}

function sunny_moving(){
	$('.black').css('z-index',99);
	$('.black').animate({
			opacity: "0.7"
		},1200);
	$('#sunny').animate({
			marginLeft:"-300px", marginTop:"-30px", opacity:"0"
	},900,"", function(){
		$('#moon').animate({
			marginLeft: "-300px", marginTop:"30px", opacity:"0"
		},900,"", function(){
			$("#sunny").animate({
				marginLeft:"50px",marginTop:"0px"
			},function(){
				$('.black').animate({
					opacity: "0"
		}		,900);
				$("#sunny").animate({
					marginLeft:"0px", opacity:"1"
				},900,function(){
					$('.black').css('z-index',-10);
					$("#moon").animate({
						marginLeft:"0px",marginTop:"0px"
					},function(){
						$("#moon").animate({
							opacity:"1"
						});
						$('.pin').animate({marginTop: "-12px"},600,"",function(){
							$(this).animate({marginTop:"0px"},600,"", function(){
								//moving_pin(this);
							});
						});
					});
				});
			});
		});
	});
}

function sunny_today(){
	$('#sunny').animate({
		marginLeft:"50px", opacity:"0"
	},900);
	$('.black').css('z-index',99);
	$('.black').animate({
		opacity:"0.7"
	},1300);
	$("#moon").animate({
		opacity:"0"
	},function(){
		$("#moon").animate({
			marginLeft:"-300px",marginTop:"30px"
		});
		$("#sunny").animate({
			marginLeft:"-300px",marginTop:"-30px"
		},function(){
			$("#moon").animate({
				marginLeft:"0px",marginTop:"0px",opacity:"1"
			},900,"",function(){
				$("#sunny").animate({
					marginLeft:"0px",marginTop:"0px", opacity:"1"
				},900);
				$('.black').animate({
					opacity:"0"
				},900,"",function(){
					$('.black').css('z-index',-10);
					$('.pin').animate({marginTop: "-12px"},600,"",function(){
						$(this).animate({marginTop:"0px"},600,"", function(){
							//moving_pin(this);
						});
					});
				});
			});
		});
	});
}


function sun_moving(){
	$('#sunny').animate({
		marginLeft:"20px",marginTop:"10px",opacity:"0.1"},1200,"",function(){
		$(this).animate({marginLeft:"0px",marginTop:"0px" ,opacity:"0.9"},1200,"",function(){
			sun_moving();
		});
	});
}

$('#tomor_btn').click(function(){
	if (sun_on_tomor == true){
		sunny_moving();
	}
	sun_on_tomor = false;
	sun_on_today = true;
});

$('#today_btn').click(function(){
	if(sun_on_today == true){
		sunny_today();
	}
	sun_on_today = false;
	sun_on_tomor = true;
});

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("go_calendar");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
		modal.style.display = "block";
		var current = new Date(Date.now());
		$(".dates").html((monthNames[current.getMonth()]) + ' ' + current.getDate());
		popupContents(todayList);
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
		modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
		if (event.target == modal) {
				modal.style.display = "none";
		}
}


$(document).on('click','.heart', function(){
	if ("rgb(128, 128, 128)" == $(this).css("color")){
		$(this).css("color","red");
	}
	else{
		$(this).css("color","gray");
	}
});

$( document ).ready(function(){
	readData();
	kakao_share();
	//sun_moving();

	//moving_pin();
});



  //<![CDATA[
    // // 사용할 앱의 JavaScript 키를 설정해 주세요.
    Kakao.init('c53ea5317cc7bf239ff6cd3c0f941e8d');
    // // 카카오링크 버튼을 생성합니다. 처음 한번만 호출하면 됩니다.

function kakao_share() {
	for(var i=0;i<timeSelectedList.length;i++){
Kakao.Link.createDefaultButton({
      container: '#kakao-link-btn'+i,
      objectType: 'location',
      address: '카이스트 '+timeSelectedList[i][3],
      addressTitle: locationDict[timeSelectedList[i][3]],
      content: {
        title: timeSelectedList[i][0],
        description: timeSelectedList[i][4],
        imageUrl: '/image/logo.PNG',
        link: {
          mobileWebUrl: '"'+timeSelectedList[i][5]+'"',
          webUrl: '"'+timeSelectedList[i][5]+'"'
        }
      },
      social: {
        likeCount: 286,
        commentCount: 45,
        sharedCount: 845
      },
      buttons: [
        {
          title: '웹으로 보기',
          link: {
            mobileWebUrl: '"'+timeSelectedList[i][5]+'"',
            webUrl: '"'+timeSelectedList[i][5]+'"'
          }
        }
      ]
    });
	};
}
    function sendLink(event) {
    	for(var i=0;i<timeSelectedList.length;i++){
		if(event == timeSelectedList[i][3]){
			console.log('"'+timeSelectedList[i][5]+'"');
      Kakao.Link.sendDefault({
        objectType: 'location',
        address: '카이스트 ' + locationDict_KR[timeSelectedList[i][3]],
        addressTitle: locationDict[timeSelectedList[i][3]],
        content: {
          title: timeSelectedList[i][0],
          description: timeSelectedList[i][4] +"    " + timeSelectedList[i][5],
          imageUrl: '/image/logo.PNG',
          link: {
            mobileWebUrl: '"'+timeSelectedList[i][5]+'"',
            webUrl: '"'+timeSelectedList[i][5]+'"'
          }
        },
        social: {
          likeCount: 286,
          commentCount: 45,
          sharedCount: 845
        },
        buttons: [
          {
            title: '행사 더보기',
            link: {
              mobileWebUrl:"https://fouridiot.github.io/container2.html",
              webUrl: "https://fouridiot.github.io/container2.html"
            }
          }
        ]
      });
	  }
	}
    }
  //]]>


function addViewcount(index){
	eventList[index][6][0] += 1;
	myInterest.push(eventkeylist[index]);
	firebase.database().ref("/4idiots/" + eventkeylist[index] + "/value/6/0/").set(eventList[index][6][0]);
	firebase.database().ref("/4idiotslogin/" + myID + "/Interests/").set(myInterest);
}
function addSharecount(index){
	eventList[index][6][1] += 1;
	myInterest.push(eventkeylist[index]);
	firebase.database().ref("/4idiots/" + eventkeylist[index] + "/value/6/1/").set(eventList[index][6][1]);
	firebase.database().ref("/4idiotslogin/" + myID + "/Interests/").set(myInterest);
}
function eventtoindex(event){
	for (var i=0; i<eventList.length; i++){
		if (eventList[i] == event){
			return i;
		}
	};
}