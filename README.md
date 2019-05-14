# FourIdiot.github.io

At first, if our javascript's document is ready, it calls readData function which reads several data of free events from our firebase,  
sorting the data by time and making todayLIst and tomorrowList.  
Then, if the loading process is completed, the readData function calls loadComplete function. After that,  
loadComplete activates the two function : timeevent and addpin.  
The function named timeevent takes the list of events and enable time bar's button by their start time.  
A small red point will be added for each enabled button and the button can be hovered and clickable.  
If the button is clicked, it generates timeSelectedList which contains the sorted events by the time.  
The function named addpin takes the list of buildings like "N1". Then, it makes pin on our map by refering to our dictionaries.  
For each pins, if we click the pins, a new sorted list besed on the location is passed to showDetail function, finally showing details of events.  
For others, functions like onoroff and pincolor literally deals with pins' attributes, and  the function popupContents is just for pre-registration popup.  
