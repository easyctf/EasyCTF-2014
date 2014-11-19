(function() {
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
					html += "<div class='panel panel-default'><div class='panel-body "+permission+"' id='gid_"+g['gid']+"'>"+g['name']+"<div class='close remove-group-button'>&times;</div></div></div>";
				}
			}
			$("#group_membership_table").html(html);
			return $(".remove-group-button").click(function(event) {
				return leave_group($(this).parent());
			});
		});
	};

	window.leave_group = function(div) {
		console.dir(div);
	}
}).call(this);