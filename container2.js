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
var eventList = [];
var timeSelectedList = [];
var eventtimeSet = new Set();

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
	if($(this).data('canclick')){
		if($(this).data('clicked')){
			$('#today_btn').click()
			timeSelectedList = eventList.slice();
			addpin(collectlocation(timeSelectedList));
		} else {
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
			for (var i =0;i < eventList.length;i++){
				currentEvent = eventList[i];
				if (currentEvent[2][0].slice(0,2)*1 == timeid*1 + 8){
					timeSelectedList.push(currentEvent);
				}
			};
			addpin(collectlocation(timeSelectedList));
		};
	}
});

//Today button click
$("#today_btn").on('click', function(){
		$('#scrollBar').remove()
		$('#time-ctrl').data('havescroll', false);
		eventtimeSet.forEach(function(a){
			if($('#'+a).data('clicked')){
				$('#'+a).data('clicked',false);
			}
		});
		timeSelectedList = eventList.slice();
		addpin(collectlocation(timeSelectedList));
});



// [Subject,[Month,Date],[start,end],locationN,explanation,link,numofinterests]
//     0		  1			  2			 3		   4		 5		   6

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
  for (var i=0; i<list.length ; i++){
    a="'"+list[i]+"'";
    // $('<area shape="circle" id="N13-1" target="_blank"  coords="290,220,20" href="https://www.naver.com" />').appendTo(".campusmap");
    $('<img id="' + list[i] +'" src="./image/redpin2.png"' + 'onmouseover="this.src='+c+';" onmouseout="this.src='+b+';"' +
    'style="position: absolute; LEFT:' + coordinateDict[list[i]][0] + 'px; TOP:' + coordinateDict[list[i]][1] +'px;  WIDTH:30px; HEIGHT:50px"' +
    'onclick="showDetail('+a+')"/>').appendTo(".pins");
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


//timetable event 점찍기&click,hover 가능여부
function timeevent(){
  for (var i =0;i < eventList.length;i++){
    currentEvent = eventList[i];
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
		var keylist = Object.keys(myValue);
		for (var i =0; i<keylist.length;i++){
			eventList.push(myValue[keylist[i]].value);
		}
	});
}
function showDetail(event){
  $("#content").empty();
  for(var i=0;i<timeSelectedList.length;i++){
    if(event == timeSelectedList[i][3]){
      $("#content")
    		.append($('<br><p id = "subjectName">' + timeSelectedList[i][0] + '<br>'))
    		.append($('<p>').html("When?"))
    		.append($('<p id = "detailTime">').html(timeSelectedList[i][1][0] + " / "
        + timeSelectedList[i][1][1] + "  " + timeSelectedList[i][2][0] + " ~ " + timeSelectedList[i][2][1]))
    		.append($('<br>').html("Where?"))
    		.append($('<p id = "locNum">').html('( ' + timeSelectedList[i][3] + ' )  ' + locationDict[timeSelectedList[i][3]]))
    		.append($('<br><p id = "reward">').html(timeSelectedList[i][4]))
    		.append($('<a id = "detailLink" herf="' + timeSelectedList[i][5] + '">').html("Link"));
    }
  }

}


$( document ).ready(function(){
	readData();
	setTimeout(function(){
    timeSelectedList = eventList.slice();
  addpin(collectlocation(eventList));
  timeevent();
},2000)

})
