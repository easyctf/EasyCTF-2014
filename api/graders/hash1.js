function hash1 (n)
{
    var str = "";
	var ret = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	for(var i=0; i<n.length; i++) 
	{
		ret[i%16] += n.charCodeAt(i);
	}
	for(var i = 0;i<16;i++)
    {
        str+=String.fromCharCode(ret[i]%26+97)
    }
    return str;
}
exports.grade = function(team, key, callback) {
	if (typeof key === "string" && hash1(key).indexOf(hash1("xxxXXX_nobody123will123evar123know234this345flag_XXXxxx")) != -1) {
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