exports.grade = function(team, key, callback) {
	var flag = "QRs_r_2D_baRcoDEz";
	if (typeof key === "string" && key.toLowerCase().indexOf(flag.toLowerCase()) != -1) {
		callback({
			correct: true,
			message: "Nice job!"
		});
	} else {
		callback({
			correct: false,
			message: "Hm... try again."
		});
	}
};

// 794477.627260174

function checkRandomConfusion(doubleVal)
{
	if(typeof doubleVal === 'number'&&doubleVal!==0)
	{
		var tbuf=new ArrayBuffer(16);
		var dblArr=new Float64Array(tbuf),flArr=new Float32Array(tbuf);
		dblArr[0]=doubleVal;
		return flArr[0]===flArr[1];
	}else{
		return false;
	}
}
