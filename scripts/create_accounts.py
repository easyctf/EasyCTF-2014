import subprocess;

filename = "accounts.csv";
with open(filename,  'r') as csvfile:
	accounts = csvfile.read().split("\n");
	for row in accounts:
		data = row.split(",");
		if len(data)==3:
			u = data[0];
			p = data[1];
			h = data[2];
			# print h + ":" + p;

			subprocess.call("mkdir %s" % h, shell=True);	
			subprocess.call("useradd --home %s --gid easyctf_users --shell /bin/bash %s" % (h, u), shell=True);
			subprocess.call("echo '%s:%s' | chpasswd" % (u, p), shell=True);
	
			# subprocess.call(['useradd', '-m' , '-s' + '/bin/bash','-c' + row[0] + row[1] ,  row[2]])
			# subprocess.call('echo ' + row[2] +":" + row[3] + " | " + "chpasswd",  shell=True )
