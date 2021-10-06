
$.fn.ntwEvents=function(d){console.log("ntwEvent Requires datepicker.css bootstrap-datepicker.js  jquery-1.7.min.js bootstrap.min.css ");
var Datasource=new eventDataSource();
 var parentDiv=$(this);
 var unique=parentDiv.attr('class')?parentDiv.attr('class'):parentDiv.attr('id');
function EventHtml(Events){
var eventHtml="";
var items=Events;
if(items== null || items=="" || items.Length==0)
return "<span class='noEvents'>"+Resources.Events.NoEvents+"</span>";
for(var i=0;i<items.length;i++)
{
var eventDate=new Date(items[i].StartDate);
eventHtml+="<div class='eventwrapper col-xs-6'><div class='eventTitle'><a href='"+d.detailsUrl+items[i].Id+"'>"+items[i].Title+"</a></div><div class='eventDescription'>"+items[i].Description+"</div><div class='eventDate'>"+newDate.getDate()+"<span class='EventsuperscriptDate'>"+nth(newDate.getDate())+"</span><span class='eventmonth'>"+getMonthName(newDate.getMonth())+"</span><span class='eventyear'>"+newDate.getFullYear()+"</span></div><div class='eventBlue'></div></div>";
}
return eventHtml;
}
function  drawSecondColumn(e){
e.find(".EventCalendar").append('<div id="eventSecondCol" class="col-xs-9"></div>');
}
function  drawMonthlySecondColumn(e){
e.find("#eventSecondCol").html('<div id="daysInMonth" ></div><div class="eventsContainer MonthlyEvent"><div class="clear"></div></div>');
}
function drawFirstColumn(e){
e.find(".EventCalendar").html('<div class="col-xs-2 selectorcontainer"><div class="btn small " id="dp4" data-date-format="yyyy-mm-dd" data-date="2012-02-20"><div class="ntwselectDate" ><span id="month"></span></br><span id="date"></span><span id="year"></span></div></div> <ul class="eventTypeList"><li class="DailyEvent">'+Resources.Method.Daily+' </li><li class="WeeklyEvent">'+Resources.Method.Weekly+' </li><li class="MonthlyEvent">'+Resources.Method.Monthly+' </li><li class="AgendaEvent">'+Resources.Method.Agenda+' </li></ul></div>');
}
function drawEventCalendar(e,width,viewAll){
if(viewAll){
e.css("width",width);
e.append('<div clas="CalanderHeader"><div class="CalendarTitle">'+Resources.Events.CalendarTitle+'</div><div class="viewAllEvents"><a href="'+viewAll+'">'+Resources.Events.ViewAll+'</a></div></div><div class="EventCalendar" style="width:'+width+'"></div>');
}
else{
e.append('<div class="EventCalendar" style="width:'+width+'"></div>');
}
} 
function daysInMonth(anyDateInMonth) {
if(anyDateInMonth!=""){
    return new Date(anyDateInMonth.getYear(), 
                    anyDateInMonth.getMonth()+1, 
                    0).getDate();
					}}
					
function drawDays(newDate){
var days=daysInMonth(newDate);
var daysContent="";
for(var i=1;i<=days;i++)
{
if(Datasource.hasEventDate(d,new Date(newDate.getFullYear(),newDate.getMonth(),i)))
{
daysContent+="<input  class='ntwday_rdbtn' type='radio' name='"+unique+"type' value='"+new Date(newDate.getFullYear(),newDate.getMonth(),i)+"' id='rd"+unique+"_"+i+"'/><label class='eventday hasevent' for='rd"+unique+"_"+i+"'>"+i+"</label>";
}else{
daysContent+="<input  class='ntwday_rdbtn' type='radio'  name='"+unique+"type' value='"+new Date(newDate.getFullYear(),newDate.getMonth(),i)+"' id='rd"+unique+"_"+i+"'/><label class='eventday' for='rd"+unique+"_"+i+"'>"+i+"</label>";

}
}
 return daysContent;

}

function nth(d) {
  if(d>3 && d<21) return 'th'; 
  switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}
function getDayName( day)
{ var dayNames = new Array(Resources.Days.Sunday,Resources.Days.Monday,Resources.Days.Tuesday,Resources.Days.Wednesday,Resources.Days.Thursday,Resources.Days.Friday,Resources.Days.Saturday);

return dayNames[day];
}
function getMonthName( month)
{
var monthNames = new Array(Resources.Months.January,Resources.Months.February,Resources.Months.March,Resources.Months.April,Resources.Months.May,Resources.Months.June,Resources.Months.July,Resources.Months.August,Resources.Months.September,Resources.Months.October,Resources.Months.November,Resources.Months.December);

return monthNames[month];

}
var newDate="";
function init(s){
newDate= new Date();
s.find('.MonthlyEvent').click();
s.find('#month').text(getMonthName(newDate.getMonth()));
s.find('#date').html(newDate.getDate()+"<span class='superscriptDate'>"+nth(newDate.getDate())+"</span>");
s.find('#year').text(newDate.getFullYear());

}
drawEventCalendar($(this),d.width,d.viewAllUrl);
drawFirstColumn($(this));
drawSecondColumn($(this));
$(this).find('#dp4').datepicker({
    format: 'mm/dd/yyyy',
    startDate: 'today'
})
				.on('changeDate', function(ev){
					newDate = new Date(ev.date)
					$(this).find('#month').text(getMonthName(newDate.getMonth()));
					$(this).find('#date').html(newDate.getDate()+"<span class='superscriptDate'>"+nth(newDate.getDate())+"</span>");
					$(this).find('#year').text(newDate.getFullYear());
				    $(this).datepicker('hide');
					$(this).parent().parent().find('.DailyEvent').click();
				});
$(this).find('.MonthlyEvent').click(function(){
$(this).siblings().removeClass("selected");
$(this).addClass("selected");
drawMonthlySecondColumn(parentDiv);
var daysContent= drawDays(newDate);
parentDiv.find('#daysInMonth').html(daysContent);
var Events=Datasource.getEventsByMonth(d,newDate);
parentDiv.find(".eventsContainer").html(EventHtml(Events));
parentDiv.find(".ntwday_rdbtn").change(function(e){
    
	var Events=Datasource.getEventsByDate(d,new Date(this.value));
parentDiv.find(".eventsContainer").html(EventHtml(Events));
});

})
//Weekly Events
function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day -1; // adjust when day is sunday
  return new Date(d.setDate(diff));
}
function drawWeekDays(newDate){
var Monday=getMonday(newDate);
var temp=Monday;
var daysContent="";
for(var i=0;i<=6;i++)
{
daysContent+="<input  class='ntwday_dayBtn' type='radio'  name='"+unique+"Weekly' value='"+new Date(temp.setDate(temp.getDate()+1))+"' id='rd"+unique+i+"'/><label class='dayBtn' for='rd"+unique+i+"'>"+getDayName(i)+"</label>";

}
 return daysContent;

}
function  drawWeeklySecondColumn(e){
e.find("#eventSecondCol").html('<div id="weekDays" ></div><div class="eventsContainer WeeklyEvent"><div class="clear"></div></div>');
}
$(this).find('.WeeklyEvent').click(function(){
//draw week days
//get Events in current week 
$(this).siblings().removeClass("selected");
$(this).addClass("selected");
drawWeeklySecondColumn(parentDiv);
var daysContent= drawWeekDays(newDate);
parentDiv.find('#weekDays').html(daysContent);
var Events=Datasource.getEventsByMonth(d,newDate);
parentDiv.find(".eventsContainer").html(EventHtml(Events));
parentDiv.find(".ntwday_dayBtn").change(function(e){
    
	var Events=Datasource.getEventsByDate(d,new Date(this.value));
parentDiv.find(".eventsContainer").html(EventHtml(Events));
});
parentDiv.find(".ntwday_dayBtn:eq(0)").click();
})
$(this).find('.DailyEvent').click(function(){
$(this).siblings().removeClass("selected");
$(this).addClass("selected");
function  drawDailySecondColumn(e){
e.find("#eventSecondCol").html('<div class="eventsContainer DailyEvent"><div class="clear"></div></div>');
}

// draw btn currentmonth, Next Month,Up coming
// get events according to the above
drawDailySecondColumn(parentDiv);
var Events=Datasource.getEventsByDate(d,newDate);
parentDiv.find(".eventsContainer").html(EventHtml(Events));



})
$(this).find('.AgendaEvent').click(function(){
//related method
$(this).siblings().removeClass("selected");
$(this).addClass("selected");
function drawAbtns(newDate){

var temp=new Date();
var daysContent="";

daysContent+="<input  class='ntwday_dayBtn' type='radio'  name='"+unique+"Agenda' method='current' value='"+new Date(temp)+"' id='rd"+1+"'/><label class='dayBtn' for='rd"+1+"'>"+Resources.Agenda.Current+"</label>";

daysContent+="<input  class='ntwday_dayBtn' type='radio'  name='"+unique+"Agenda' method='next' value='"+new Date(temp.setMonth(temp.getMonth()+1))+"' id='rd"+2+"'/><label class='dayBtn' for='rd"+2+"'>"+Resources.Agenda.Next+"</label>";

daysContent+="<input  class='ntwday_dayBtn' type='radio'  name='"+unique+"Agenda' method='upcoming' value='"+new Date(temp.setMonth(temp.getMonth()+1))+"' id='rd"+3+"'/><label class='dayBtn' for='rd"+3+"'>"+Resources.Agenda.UpComing+"</label>";
 return daysContent;

}
function  drawAgendaSecondColumn(e){
e.find("#eventSecondCol").html('<div id="Abtns" ></div><div class="eventsContainer AgendaEvent"><div class="clear"></div></div>');
}

// draw btn currentmonth, Next Month,Up coming
// get events according to the above
drawAgendaSecondColumn(parentDiv);
var daysContent= drawAbtns(newDate);
parentDiv.find('#Abtns').html(daysContent);
var Events=Datasource.getEventsByMonth(d,newDate);
parentDiv.find(".eventsContainer").html(EventHtml(Events));
parentDiv.find(".ntwday_dayBtn").change(function(e){
    var method=$(this).attr("method");
	var value=this.value;
	var Events="";
	if(method=="current")
	{
	 Events=Datasource.getEventsByMonth(d,new Date(value));
	}
	if(method=="next")
	{
	 Events=Datasource.getEventsByMonth(d,new Date(value));
	}
	if(method=="upcoming")
	{
	 Events=Datasource.getUpcomingEvents(d,new Date(value));
	}
	
parentDiv.find(".eventsContainer").html(EventHtml(Events));
});
parentDiv.find(".ntwday_dayBtn:eq(0)").click();

})


init($(this))
}