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
	
	} else {
		$(this).data('clicked', true);
		$('#time-ctrl').append("<span id='scrollBar"+dis+"' class='scroll' style='left:"+dis+"px;'></span>");
	};
});


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
})