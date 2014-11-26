filename = "accounts.csv";
with open(filename,  'r') as csvfile:
	accounts = csvfile.read().split("\n");
	for row in accounts:
		data = row.split(",");
		u = data[0];
		p = data[1];
		h = data[2];
		# print h + ":" + p;

		subprocess.call([
			"useradd",
			"--home" + h
		]);

		# subprocess.call(['useradd', '-m' , '-s' + '/bin/bash','-c' + row[0] + row[1] ,  row[2]])
		# subprocess.call('echo ' + row[2] +":" + row[3] + " | " + "chpasswd",  shell=True )