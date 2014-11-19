(function() {
	var editor = CodeMirror(document.getElementById("editor-container"), {
		mode: "python",
		theme: "eclipse",
		lineNumbers: true,
	});

	function escapeRegExp(string) {
		return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	}
	function replaceAll(string, find, replace) {
		return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
	}

	var outf = function(text) {
		var mypre = document.getElementById("output");
		mypre.innerHTML = mypre.innerHTML + text;
	}

	var builtinRead = function(x) {
		if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
				throw "File not found: '" + x + "'";
		return Sk.builtinFiles["files"][x];
	}

	var getArgs = function(ar) {
		console.dir(ar);
		var res = "[";
		for (var i=0;i<ar.length;i++) {
			if (i != 0) {
				res += ",";
			}
			console.log(i+" "+ar[i]+" "+typeof ar[i]);
			if ((typeof ar[i]) === "number") {
				res += ar[i];
			} else if ((typeof ar[i]) === "string") {
				res += '"' + ar[i] + '"';
			} else if (typeof ar[i] === "object" && ar[i][0]) {
				res += getArgs(ar[i]);
			} else {
				// fuck you 
			}
		}
		res += "]";
		return res;
	};

	window.runCode = function() {
		$("#output").html("");
		$("#flag").html("");

		// var program = document.getElementById("editor").outerHTML;
		// program = program.substring(198, program.lastIndexOf("</pre>"));
		var program = editor.getValue();

		console.log("Retrieving data...");
		$.ajax({
			url: "/api/ide/data",
			data: {
				problem: $("#problem").val(),
			},
			type: "POST",
			dataType: "json",
			success: function(content) {
				console.dir(content);
				console.log("Data retrieved.");
				var args = "args = ";
				args += getArgs(content);
				program = args + "\n" + program;
				// console.log(args);
				// console.log(program);

				var output = document.getElementById("output");

				Sk.canvas = "canvas";
				Sk.pre = output;
				Sk.configure({
					output: outf,
					read: builtinRead
				});

				console.log("Running program...");
				var start = new Date().getTime();
				try {
					var stuff = Sk.importMainWithBody("<stdin>", false, program);
					// console.log(stuff);
					eval(stuff);
				} catch (e) {
					$("#output").append("<div style='color:#F00;'>"+replaceAll(replaceAll(e.toString(),"<","&lt;"),">","&gt;")+"</div>");
					// alert(e.toString());
				}
				var end = new Date().getTime();
				var elapsed = end - start;
				console.log("Program ran in " + elapsed + "ms");

				console.log("Checking answer...");
				$.ajax({
					url: "/api/ide/check",
					data: {
						problem: $("#problem").val(),
						answer: $("#output").html(),
					},
					type: "POST",
					dataType: "json",
					success:function(content) {
						console.dir(content);
						if (content.status == 1) {
							$("#flag").html("<div class='alert alert-success'>"+content.message+"</div>");
						} else {
							$("#flag").html("<div class='alert alert-danger'>"+content.message+"</div>");
						}
						console.log("Answer retrieved.\n");
					},
				});

				$("#output-div").modal("show");
			}
		});
	};	
	$(document).ready(function() {
		var ctrl = false;
		$(document).keydown(function(e) {
			if (e.keyCode == 17) {
				ctrl = true;
			}
		});
		$(document).keyup(function(e) {
			if (e.keyCode == 13 && ctrl && editor.getValue().trim().length > 0) {
				runCode();
			} else if (e.keyCode == 17) {
				ctrl = false;
			}
		});
		$(".selectpicker").selectpicker();
	});
}).call(this);