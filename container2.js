var config = {
    apiKey: "AIzaSyAJ-het3sEyXSt9OAABCH2FQya18NIiu4U",
    authDomain: "cs374-tutorial-85bcc.firebaseapp.com",
    databaseURL: "https://cs374-tutorial-85bcc.firebaseio.com",
    projectId: "cs374-tutorial-85bcc",
    storageBucket: "cs374-tutorial-85bcc.appspot.com",
    messagingSenderId: "882137519768"
};
firebase.initializeApp(config);

//timetable
$('.timet').hover(function() {
    	$(this).addClass('hover');
    }, function() {
		$(this).removeClass('hover');
    }
);


// [Subject,[Month,Date],[start,end],locationN,explanation,link]
//     0		  1			  2			 3		   4		 5
var eventList = [];
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


//pin on the map start
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
	var subject = document.getElementById("subjectName");
	var location = document.getElementById("locNum");
	var reward = document.getElementById("reward");
	var time = document.getElementById("detailTime");
	subject.innerHTML = event[0];
	time.innerHTML = event[1][0] + " / " + event[1][1] + "  " + event[2][0] + " ~ " + event[2][1];
	location.innerHTML = "( " + event[3] + " )  " + locationDict[event[3]];
	reward.innerHTML = event[4];
	$("detailLink").attr("herf",event[5]);
}


$( document ).ready(function(){

});
