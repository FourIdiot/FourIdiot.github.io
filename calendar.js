var config = {
    apiKey: "AIzaSyAJ-het3sEyXSt9OAABCH2FQya18NIiu4U",
    authDomain: "cs374-tutorial-85bcc.firebaseapp.com",
    databaseURL: "https://cs374-tutorial-85bcc.firebaseio.com",
    projectId: "cs374-tutorial-85bcc",
    storageBucket: "cs374-tutorial-85bcc.appspot.com",
    messagingSenderId: "882137519768"
};
firebase.initializeApp(config);

$(document).on('click','.heart', function(){
	console.log($(this).css("color"))
	if ("rgb(128, 128, 128)" == $(this).css("color")){
		$(this).css("color","red")
	}
	else{
		$(this).css("color","gray")
	}
	
})

function readData_calendar(){
	firebase.database().ref('/4idiots/').once('value',function(snapshot){
		var myValue = snapshot.val();
		var keylist = Object.keys(myValue);
		for (var i =0; i<keylist.length;i++){
			var event = myValue[keylist[i]].value;
			var date = event[1];
			var date_id = String(date[1]);
			var info = '<div class="event">'
		    info += '<div class="event-desc">'
		    info += event[0]+'<br>@'+event[3]+'<br>'+event[4]
		    info += '</div>'
		    info += '<div class="event-time">'+event[2][0]+'~'+event[2][1]
		    info += '<div class="heart" style="color:gray;"><i class="fas fa-heart"></i></div>'
		    info += '</div></div>'
		    console.log(info)
			//document.getElementById(date_id).innerHTML = info;
			$('#'+date_id).append(info);
		}
	});
}

$( document ).ready(function () {
	readData_calendar();
})
