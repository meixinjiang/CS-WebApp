var drop = "False";
var urlsDict = {
	Courses: "http://redsox.tcs.auckland.ac.nz/ups/UniProxService.svc/courses",
	People: "http://redsox.tcs.auckland.ac.nz/ups/UniProxService.svc/people",
	News: "http://redsox.tcs.auckland.ac.nz/ups/UniProxService.svc/news",
	Notices: "http://redsox.tcs.auckland.ac.nz/ups/UniProxService.svc/notices",
	GuestBook: "http://redsox.tcs.auckland.ac.nz/ups/UniProxService.svc/htmlcomments"
};

window.onload = function(){
	var page = localStorage.getItem('page');
	if (page == null){
		showPage("Home");
	}
	else{
		showPage(page);
	}
}

function showNoPages() {
	document.getElementById("Home").style.display = "none";
	document.getElementById("Courses").style.display = "none";
	document.getElementById("People").style.display = "none";
	document.getElementById("News").style.display = "none";
	document.getElementById("Notices").style.display = "none";
	document.getElementById("GuestBook").style.display = "none";
}

function showPage(id){
	if (id != "Home") {
		getPageData(urlsDict[id]);
		document.getElementById("menu1").style.display = "block";

	}
	else {
		document.getElementById("menu1").style.display = "none";
		document.getElementById("dropdown").style.display = "none";
		drop = "False";
	}

    showNoPages();
    document.getElementById(id).style.display = "block";
    localStorage.setItem('page', id);
}

function getPageData(url){
	xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.setRequestHeader("Accept", "application/json;charset=UTF-8");
	xhr.onload = function(){
		if (url == urlsDict.GuestBook) {document.getElementById("showComments").innerHTML = xhr.responseText;}
		var resp = JSON.parse(xhr.responseText);
		if (url == urlsDict.Courses) {showCourses(resp.courses.coursePaperSection);}
		else if (url == urlsDict.News || url == urlsDict.Notices) {showNewsNotices(resp, url);}
		else if (url == urlsDict.People) {showPeople(resp.list);}
	}
	xhr.send(null);
}

function dropdown(){
	if (drop == "False"){
		drop = "True";
		document.getElementById("dropdown").style.display = "inline";
		document.getElementById("menu").style.backgroundColor = "#00477D";
		document.getElementById("menu").style.color = "white";
	}
	
	else{
		drop = "False";
		document.getElementById("dropdown").style.display = "none";
		document.getElementById("menu").style.backgroundColor = "#0B1E2C";
		document.getElementById("menu").style.color = "#5FA8DD";
	}
	
}

function closeMenu(){
	drop = "False";
	document.getElementById("dropdown").style.display = "none";
	document.getElementById("menu").style.backgroundColor = "#0B1E2C";
	document.getElementById("menu").style.color = "#5FA8DD";
}

function showPeople(peopleList){
	var tableContent = "";
	for (var i = 0; i < peopleList.length; ++i){
		var photoUrl = "user.png"
		if (peopleList[i]["imageId"] != null){
			photoUrl = "https://unidirectory.auckland.ac.nz/people/imageraw/" + peopleList[i]["profileUrl"][1] + "/" + peopleList[i]["imageId"] + "/small"; 
		}
		
		tableContent += "<tr>";
		tableContent += "<td rowspan=2 width='100px'><img src=" + photoUrl + " id='people'></td>";
		tableContent += "<td>" + peopleList[i]["names"][0] + "</td>";
		tableContent += "<td>";
		tableContent += "<a href=https://unidirectory.auckland.ac.nz/people/vcard/" + peopleList[i]["profileUrl"][1] + " class='unicode'>&#128100</a>"
		tableContent += "<a href=mailto:" + peopleList[i]["emailAddresses"][0] + " class='unicode'>&#128231;</a>"

		if (peopleList[i]["extn"] != null){
			tableContent += "<a href=tel:" + peopleList[i]["extn"] + " class='unicode'>&#x260E;</a>"
		}

		tableContent += "</td>";
		tableContent += "</tr><tr>";
		tableContent += "<td colspan=2 class='bottom'>" + peopleList[i]["jobtitles"] + "</td>";
		tableContent += "</tr>";		
	}
	document.getElementById("showPeople").innerHTML = tableContent;	
}

function showNewsNotices(newsNoticeList, url){
	var tableContent = "";
	for (var i = 0; i < newsNoticeList.length; ++i){
		tableContent += "<tr>";
		tableContent += "<td class='top'><a href=" + newsNoticeList[i]["linkField"] + ">"
		tableContent += newsNoticeList[i]["titleField"] + "</a></td>";
		tableContent += "<td class='top'>" + newsNoticeList[i]["pubDateField"] + "</td>";
		tableContent += "</tr><tr>";
		tableContent += "<td colspan=2 class='bottom'>" + newsNoticeList[i]["descriptionField"] + "</td>";
		tableContent += "</tr>";
	}
	if (url == urlsDict.News){
		document.getElementById("showNews").innerHTML = tableContent;	
	}
	else{
		document.getElementById("showNotices").innerHTML = tableContent;
	}
}

function showCourses(courseList){
	var tableContent = "";
	for (var i = 0; i < courseList.length; ++i) {
		prerequisites = "";

		if (courseList[i]["prerequisite"] != null){
			if (typeof courseList[i]["prerequisite"] == 'string' || courseList[i]["prerequisite"] instanceof String){
				prerequisites = courseList[i]["prerequisite"];
			}
			else{

				for (var j = 0; j < courseList[i]["prerequisite"].length; j++){
					prerequisites += courseList[i]["prerequisite"][j] + "; ";
				}
			}
		}
		
		tableContent += "<tr>";
		tableContent += "<td class='top'>" + courseList[i]["subject"]["courseA"] + "</td>";
		tableContent += "<td class='top'>" + courseList[i]["title"] + "</td>";
		tableContent += "<td class='top'>" + courseList[i]["subject"]["points"] + "</td>";
		tableContent += "</tr><tr>";
		tableContent += "<td colspan=3>" + courseList[i]["description"] + "</td>";
		tableContent += "</tr><tr>";
		tableContent += "<td colspan=3 class='bottom'>" + prerequisites + "</td>";
		tableContent += "</tr>";
	}

	document.getElementById("showCourses").innerHTML = tableContent;
}

function addComment(){
	var message = document.getElementById("message").value;
	var name = document.getElementById("yourName").value;
	if (message != "" && name != ""){
		var xhr = new XMLHttpRequest();
		var uri = "http://redsox.tcs.auckland.ac.nz/ups/UniProxService.svc/comment?name=" + name;
		xhr.open("POST", uri, true);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.onload = function(){
			document.getElementById("message").value = "";
			document.getElementById("yourName").value = "";
			showPage("GuestBook");
		}
		xhr.send(JSON.stringify(message));
	}
}


