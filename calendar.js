var config = {
    apiKey: "AIzaSyAJ-het3sEyXSt9OAABCH2FQya18NIiu4U",
    authDomain: "cs374-tutorial-85bcc.firebaseapp.com",
    databaseURL: "https://cs374-tutorial-85bcc.firebaseio.com",
    projectId: "cs374-tutorial-85bcc",
    storageBucket: "cs374-tutorial-85bcc.appspot.com",
    messagingSenderId: "882137519768"
};
firebase.initializeApp(config);

//global variables
var keylist;
var eventList = [];
var timeSelectedList = [];
var myinterestlist = [];
var locationDict = {
	"N13-1" : "Shin-hak Gwan",
	"E11" : "Chang-ui Gwan",
	"E9" : "Academic Cultural Complex",
	"W8" : "Educational Support Building"
};

$(document).on('click','.heart', function(){
	console.log($(this).css("color"))
	if ("rgb(128, 128, 128)" == $(this).css("color")){
		$(this).css("color","red")
		$(this).parent().parent().attr('id');
		//addInterest();
	} else{
		$(this).css("color","gray")
		//deleteInterest();
	}
});

function readData_calendar(){
	firebase.database().ref('/4idiots/').once('value',function(snapshot){
		var myValue = snapshot.val();
		keylist = Object.keys(myValue);
		for (var i =0; i<keylist.length;i++){
				var event = myValue[keylist[i]].value;
				var date = event[1];
				var date_id = String(date[1]);
				var info = '<div class="event" id="'+event[0]+'">'
					info += '<div class="event-desc">'
					info += event[0]+'<br>@'+event[3]+'<br>'+event[4]
					info += '</div>'
					info += '<div class="event-time">'+event[2][0]+'~'+event[2][1]
					info += '<div class="heart" style="color:gray;"><i class="fas fa-heart"></i></div>'
					info += '</div></div>'
					// if(myinterestlist.includes(event)){
					// 	info += '<div class="heart" style="color:red;"><i class="fas fa-heart"></i></div>'
					// 	info += '</div></div>'
					// } else{
					// 	info += '<div class="heart" style="color:gray;"><i class="fas fa-heart"></i></div>'
					// 	info += '</div></div>'
					// }
					console.log(info)
				//document.getElementById(date_id).innerHTML = info;
				$('#'+date_id).append(info);
		}
	});
}

function loadComplete(){
  	timeSelectedList = eventList.slice();
  
}
function readData(){
	firebase.database().ref('/4idiots/').once('value',function(snapshot){
		var myValue = snapshot.val();
		var keylist = Object.keys(myValue);
		for (var i =0; i<keylist.length;i++){
			eventList.push(myValue[keylist[i]].value);
		}
		loadComplete();
	})
}

function showDetail_date(event){
  $("#content").empty();
  for(var i=0;i<timeSelectedList.length;i++){
    if(event == timeSelectedList[i][1][1]){
			$("#content").append($('<div class="contentbox" id="contentbox'+i+'"></div>'));
			$("#contentbox"+i)
    	.append($('<br><p id = "subjectName">' + timeSelectedList[i][0] + '<br>'))
    	.append($('<p>').html("When?"))
    	.append($('<p id = "detailTime">').html(timeSelectedList[i][1][0] + " / "
      + timeSelectedList[i][1][1] + "  " + timeSelectedList[i][2][0] + " ~ " + timeSelectedList[i][2][1]))
    	.append($('<br>').html("Where?"))
    	.append($('<p id = "locNum">').html('( ' + timeSelectedList[i][3] + ' )  ' + locationDict[timeSelectedList[i][3]]))
    	.append($('<br><p id = "reward">').html(timeSelectedList[i][4]))
    	.append($('<a id = "detailLink" href="' + timeSelectedList[i][5] + '">').html("Link"));
    }
  }

}

$(document).on('click', '.day' ,function(){
	var date = $(this).children('.date').text();
	console.log(date);
	showDetail_date(date);
})

$( document ).ready(function(){
	readData();
	readData_calendar();

})
