var config = {
    apiKey: "AIzaSyAJ-het3sEyXSt9OAABCH2FQya18NIiu4U",
    authDomain: "cs374-tutorial-85bcc.firebaseapp.com",
    databaseURL: "https://cs374-tutorial-85bcc.firebaseio.com",
    projectId: "cs374-tutorial-85bcc",
    storageBucket: "cs374-tutorial-85bcc.appspot.com",
    messagingSenderId: "882137519768"
};
firebase.initializeApp(config);

var eventList = [];
var timeSelectedList = [];
//timetable
//timetable hover
$('.timet').hover(function() {
    	$(this).addClass('hover');
    }, function() {
		$(this).removeClass('hover');
    }
);

//timetable click
$('.timet').on('click', function(){
	var timeid = $(this).attr('id');
	var dis = 20+timeid*50;
	if($(this).data('clicked')){
		$(this).data('clicked', false);
		$('#scrollBar'+dis).remove();
		timeSelectedList = eventList.slice();
	} else {
		$(this).data('clicked', true);
		$('#time-ctrl').append("<span id='scrollBar"+dis+"' class='scroll' style='left:"+dis+"px;'></span>");
		timeSelectedList = []
		for (var i =0;i < eventList.length;i++){
			currentEvent = eventList[i];
			if (currentEvent[2][0].slice(0,2)*1 == timeid*1 + 8){
				timeSelectedList.push(currentEvent);
			}
		};
	};
});



// [Subject,[Month,Date],[start,end],locationN,explanation,link]
//     0		  1			  2			 3		   4		 5

var locationDict = {
	"N13-1" : "Shin-hak Gwan",
	"E11" : "Chang-ui Gwan",
	"E9" : "Academic Cultural Complex",
	"W8" : "Educational Support Building"
};
var coordinateDict = {
	"N13-1" : ["290","220","20"],
	"E11" : ["323","320","20"],
	"E9" : ["310","345","20"],
	"W8" : ["190","320","20"]
};



/*//pin on the map start
function addpin(list){
a="'http://naver.com'";
  for (var i=0; i<list.length ; i++){
    // $('<area shape="circle" id="N13-1" target="_blank"  coords="290,220,20" href="https://www.naver.com" />').appendTo(".campusmap");
    $('<div><img id="' + list[i] +'" src="./image/redpin2.png"' +
    'style="position: absolute; LEFT:' + coordinateDict[list[i]][0] + 'px; TOP:' + coordinateDict[list[i]][1] +'px;  WIDTH:30px; HEIGHT:50px"' +
    'onclick="window.location.href=' + a +'"/></div>').appendTo(".map");
  }
}
// var $map = $('<map name="mapmap">').appendTo('.campusmap');
// $('<area id="1" shape="rect" coords="75,300,125,400" onclick="writeDiv(this.id)" />').appendTo($map);
// $('<area id="2" shape="rect" coords="175,300,225,400" onclick="writeDiv(this.id)" />').appendTo($map);
// $('<area id="3" shape="rect" coords="275,300,325,400" onclick="writeDiv(this.id)" />').appendTo($map);


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

addpin(collectlocation(eventList));
//pin on the map end
*/


//timetable event 점찍기
function timeevent(){
	var eventtimeSet = new Set();
	for (var i =0;i < eventList.length;i++){
		currentEvent = eventList[i];
		var b = currentEvent[2][0].slice(0,2)*1-8;
		eventtimeSet.add(b);
	}
	eventtimeSet.forEach(function(a){
		var dist=33+a*50;
		$('.inner-wrap').append("<span id='event_time"+a+"' class='event_time' style='left:"+dist+"px;'></span>");
	});
	
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
		var keylist = Object.keys(myValue);
		for (var i =0; i<keylist.length;i++){
			eventList.push(myValue[keylist[i]].value);
		}
	});
}
function showDetail(event){
	$("#content")
		.append($('<br><p id = "subjectName">' + event[0] + '<br>'))
		.append($('<p>').html("When?"))
		.append($('<p id = "detailTime">').html(event[1][0] + " / " + event[1][1] + "  " + event[2][0] + " ~ " + event[2][1]))
		.append($('<br>').html("Where?"))
		.append($('<p id = "locNum">').html('( ' + event[3] + ' )  ' + locationDict[event[3]]))
		.append($('<br><p id = "reward">').html(event[4]))
		.append($('<a id = "detailLink" herf="' + event[5] + '">').html("Link"));
}


$( document ).ready(function(){
	readData();
	setTimeout(function(){
		timeevent();
	},1000)
})

