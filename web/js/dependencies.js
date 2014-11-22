var tabsLI = [
	[ "problems", "Problems" ],
	[ "exec", "Python" ],
	[ "irc", "Chat" ],
	[ "shell", "Shell" ],
	[ "account", "Account" ],
	[ "logout", "Logout" ],
];

var tabsLIBefore = [
	[ "account", "Account" ],
	[ "logout", "Logout" ],
];

var tabsNLI = [
	[ "register", "Register" ],
	[ "login", "Login" ],
];

var tabsBoth = [
	[ "about", "About" ],
	[ "scoreboard", "Scoreboard" ],
	[ "sponsors", "Sponsors" ],
	[ "feedback", "Feedback" ],
];

function show_site_down_error() {
	// do something here later
}

function build_navbar (set) {
	var ohtml = "";
	switch (set) {
		case 0:
			for(var i=0; i<tabsLI.length; i++) {
				ohtml += "<li" + (window.location.href.indexOf(tabsLI[i][0]) != -1 ? " class='active'" : "")+" id='ts_"+tabsLI[i][0]+"'><a href='/"+tabsLI[i][0]+"'>"+tabsLI[i][1]+"</a></li>";
			}
			$("#nav-right")[0].innerHTML = ohtml;
			break;
		case 1:
			for(var i=0; i<tabsNLI.length; i++) {
				ohtml += "<li" + (window.location.href.indexOf(tabsNLI[i][0]) != -1 ? " class='active'" : "")+" id='ts_"+tabsNLI[i][0]+"'><a href='/"+tabsNLI[i][0]+"'>"+tabsNLI[i][1]+"</a></li>";
			}
			$("#nav-right")[0].innerHTML = ohtml;
			break;
		case 2:
			for(var i=0; i<tabsBoth.length; i++) {
				ohtml += "<li" + (window.location.href.indexOf(tabsBoth[i][0]) != -1 ? " class='active'" : "")+" id='ts_"+tabsBoth[i][0]+"'><a href='/"+tabsBoth[i][0]+"'>"+tabsBoth[i][1]+"</a></li>";
			}
			$("#nav-left")[0].innerHTML = ohtml;
			break;
		case 3:
			for(var i=0; i<tabsLIBefore.length; i++) {
				ohtml += "<li" + (window.location.href.indexOf(tabsLIBefore[i][0]) != -1 ? " class='active'" : "")+" id='ts_"+tabsLIBefore[i][0]+"'><a href='/"+tabsLIBefore[i][0]+"'>"+tabsLIBefore[i][1]+"</a></li>";
			}
			$("#nav-right")[0].innerHTML = ohtml;
			break;
		default:
			// fuck you
			break;
	}
}

function check_certs_link_necessary() {

}

function display_navbar () {
	var during = (new Date("November 29, 2014 19:00:00") < new Date());
	$.ajax({
		url: "/api/isadmin",
		method: "GET",
		dataType: "json"
	}).done(function(data) {
		var admin = data.success === 1;
		var full_navbar = during || admin;
		if (typeof(Storage) != "undefined") {
			if (sessionStorage.signInStatus == "loggedIn") {
				build_navbar(full_navbar ? 0 : 3);
				check_certs_link_necessary();
			} else if (sessionStorage.signInStatus == "notLoggedIn") {
				build_navbar(1);
			} else if (sessionStorage.signInStatus == "apiFail") {
				// gg
			} else {
				build_navbar(1);
			}
			$.ajax({
				type: "GET",
				url: "/api/isloggedin",
				cache: false,
			}).done(function(data) {
				if (data['success'] == 1 && sessionStorage.signInStatus != "loggedIn") {
					sessionStorage.signInStatus = "loggedIn";
					build_navbar(full_navbar ? 0 : 3);
					check_certs_link_necessary();
				} else if (data['success'] == 0 && sessionStorage.signInStatus != "notLoggedIn") {
					sessionStorage.signInStatus = "notLoggedIn";
					build_navbar(1);
				}
			}).fail(function() {
				if (sessionStorage.signInStatus != "apiFail") {
					sessionStorage.signInStatus = "apiFail";
					// gg
					show_site_down_error();
				}
			});
			build_navbar(2);
		} else {
			$.ajax({
				type: "GET",
				url: "/api/isloggedin",
				cache: false,
			}).done(function(data) {
				build_navbar(data['success'] == 1 ? (full_navbar ? 0 : 3) : 1);
			}).fail(function() {
				build_navbar(1);
				show_site_down_error();
			});
		}
	});
}

function load_footer() {
	$.ajax({
		type: "GET",
		cache: false,
		url: "dependencies/footer.html",
	}).done(function(data) {
		$("#footer").html(data);
	});
}

function handle_submit(prob_id) {
	$.ajax({
		type: "POST",
		cache: false,
		url: "/api/submit",
		dataType: "json",
		data: {
			pid: prob_id,
			key: $("#"+prob_id).val()
		}
	}).done(function(data) {
		console.dir(data);
		var prob_msg = $("#msg_" + prob_id);
		var alert_class = "";
		if (data.status == 0) {
			alert_class = "danger";
		} else if (data.status == 1) {
			alert_class = "success";
		}
		prob_msg.hide().html("<div class='alert alert-"+alert_class+"'>"+data.message+"</div>").slideDown();
		setTimeout(function() {
			prob_msg.slideUp("normal", function() {
				prob_msg.html("").show();
				if (data.status == 1) window.location.reload(true);
			});
		}, 2000);
	});
}

function redirect_if_not_logged_in() {
    $.ajax({
        type: "GET",
        url: "/api/isloggedin",
        cache: false
    }).done(function (data) {
		if (data['success'] == 0)
			window.location.href = '/login';
	}).fail(function () {
		window.location.href = '/';
	});
}