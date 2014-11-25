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
