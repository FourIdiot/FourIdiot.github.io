var config = {
    apiKey: "AIzaSyAJ-het3sEyXSt9OAABCH2FQya18NIiu4U",
    authDomain: "cs374-tutorial-85bcc.firebaseapp.com",
    databaseURL: "https://cs374-tutorial-85bcc.firebaseio.com",
    projectId: "cs374-tutorial-85bcc",
    storageBucket: "cs374-tutorial-85bcc.appspot.com",
    messagingSenderId: "882137519768"
};
firebase.initializeApp(config);

// [Subject,[Month,Date],[start,end],locationN,explanation,link]
//     0		  1			  2			 3		   4		 5
var eventList = [];
var locationDict = {
	"N13" : "Tae-ul Gwan",
	"E11" : "Chang-ui Gwan"
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
