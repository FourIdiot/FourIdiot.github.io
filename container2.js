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
	"N13-1" : "290,220,20",
	"E11" : "323,320,20",
	"E9" : "310,345,20",
	"W8" : "190,320,20"
};
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
	$("#detail content")
		.append($('<p id = "subjectName">' + event[0]) + '<br>')
		.append($('<p>When?'))
		.append($('<p id = "detailTime">' + event[1][0] + " / " + event[1][1] + "  " + event[2][0] + " ~ " + event[2][1]) + '<br>Where?<br>')
		.append($('<p id = "locNum">' + '( ' + event[3] + ' )  ' + locationDict[event[3]] + '<br>'))
		.append($('<p id = "reward"' + event[4] + '<br>'))
		.append($('<a id = "detailLink" herf="' + event[5] + '">Link'));
}


$( document ).ready(function(){
	readData();
})