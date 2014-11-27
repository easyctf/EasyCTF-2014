(function() {
	window.load_account_info = function() {
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "/api/account/info"
		}).done(function(data) {
			if (data.success == 1) {
				$("#account-name").val(data.name);
				$("#account-email").val(data.email);
				$("#account-school").val(data.school);
			} else {
				// why
			}
		});
	}

	window.load_group_memberships = function() {
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "/api/groups",
		}).done(function(data) {
			// console.dir(data);
			var html = "";
			if (data.length === 0) {
				html += "You are not a member of any groups.";
			} else {
				for(var i=0; i<data.length; i++) {
					var g = data[i];
					var permission;
					if (g['owner'] === true) {
						permission = "owner";
					} else {
						permission = "member";
					}
					html += "<div class='panel panel-default col-lg-8 col-lg-offset-2'><div class='panel-body "+permission+"' id='gid_"+g['gid']+"'>"+g['name']+"<div class='close remove-group-button'>&times;</div></div></div>";
				}
			}
			$("#group_membership_table").html(html);
			return $(".remove-group-button").click(function(event) {
				return leave_group($(this).parent());
			});
		});
	};

	window.updateInfo = function() {
		$("[id^=account-]").attr("disabled", "disabled");
		$.ajax({
			url: "/api/account/update",
			type: "POST",
			dataType: "json",
			data: {
				teamname: $("#account-name").val(),
				school: $("#account-school").val(),
				password: $("#account-password").val(),
				confirm: $("#account-confirm").val(),
			}
		}).done(function(data) {
			console.dir(data);
			if (data.success !== 1) {
				$("#update_msg").hide().html("<div class='alert alert-danger'>" + data.message + "</div>").slideDown("normal");
				setTimeout(function() {
					return $("#update_msg").slideUp("normal", function() {
						return $("#update_msg").html("").show();
					});
				}, 2000);
				$("[id^=account-]").removeAttr("disabled");
			} else {
				$("#update_msg").hide().html("<div class='alert alert-success'>" + data.message + "</div>").slideDown("normal");
				return setTimeout(function() {
					return $("#update_msg").slideUp("normal", function() {
						$("#update_msg").html("").show();
						window.location.reload(true);
					});
				}, 2000);
			}
		});
	};

	window.leave_group = function(div) {
		console.dir(div);
	}
}).call(this);