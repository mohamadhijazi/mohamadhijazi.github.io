var eventDataSource=(function(){


var data='[{"Id":"1","StartDate":"6/3/2015","EndDate":"8/3/2015","Title":"Event1","Description":"Event1 Description"},{"Id":"2","StartDate":"6/3/2015","EndDate":"8/3/2015","Title":"Event1.1","Description":"Event1 .1Description"},{"Id":"3","StartDate":"6/6/2015","EndDate":"8/3/2015","Title":"Event2","Description":"Event2 Description"},{"Id":"4","StartDate":"6/8/2015","EndDate":"8/3/2015","Title":"Event3","Description":"Event3 Description"},{"Id":"5","StartDate":"6/9/2015","EndDate":"8/3/2015","Title":"Event4","Description":"Event3 Description"},{"Id":"6","StartDate":"7/8/2015","EndDate":"8/3/2015","Title":"Event5","Description":"Event4 Description"},{"Id":"7","StartDate":"7/8/2016","EndDate":"8/3/2015","Title":"Event5","Description":"Event4 Description"}]';
//data=$.parseJSON(data);
var result="";var ajaxresult=[];
 $.ajax({
            url: 'csv/eventslist.csv',
            global: false,
            
            async: false, //blocks window close
            success: function(d12) {ajaxresult=d12;}
        });
//var csvResult=convertCVS("csv/eventslist.csv","string");
var csvResult=convertCVS(ajaxresult,"string");
data=csvResult.data;
function getEventsByDate(d,date)
{
if(d.options)
{
//ajax
$.getJSON(d.options.getEventsByDate, function( data ) {return data;})

}
else{
 result= JSLINQ(d.data).Where(function(item){ var selectedDate=new Date(date); var startDate= new Date(item.StartDate); return startDate== selectedDate; });//date.toLocaleDateString()
return result.items;
}

}



function getEventsByWeek(d, date)
{
if(d.options)
{
//ajax
$.getJSON(d.options.getEventsByWeek, function( data ) {return data;})
}
else{
 result= JSLINQ(d.data).Where(function(item){ return item.StartDate == date; });
 return result.items;

}
}



function getEventsByMonth(d,date)
{
if(d.options)
{
//ajax
$.getJSON(d.options.getEventsByMonth, function( data ) {return data;})
}
else{
 result= JSLINQ(d.data).Where(function(item){var startDate= new Date(item.StartDate); return startDate.getMonth() == date.getMonth() &&startDate.getFullYear() == date.getFullYear(); });
 return result.items;

}
}
function getUpcomingEvents(d,date)
{
if(d.options)
{
//ajax
$.getJSON(d.options.getUpcomingEvents, function( data ) {return data;})
}
else{
 result= JSLINQ(d.data).Where(function(item){var startDate= new Date(item.StartDate); return startDate >= date; });
 return result.items;

}
}

function getEventsByYear(d, date)
{
if(d.options)
{
//ajax
$.getJSON(d.options.getEventsByYear, function( data ) {return data;})
}
else{
 result= JSLINQ(d.data).Where(function(item){ return item.getFullYear() == date.getFullYear(); });
 return result.items;

}
}


function hasEventDate(d,date)
{
return getEventsByDate(d,date).length!=0?true:false;
}


return {data:data,
getEventsByDate:getEventsByDate,
getEventsByWeek: getEventsByWeek,
getEventsByMonth:getEventsByMonth,
getUpcomingEvents: getUpcomingEvents,
hasEventDate: hasEventDate,

getEventsByYear:getEventsByYear,
}
})