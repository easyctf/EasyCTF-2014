from random import randint;

file = open("create_shell_users.sh", "w");
file2 = open("delete_shell_users.sh", "w");

names = [];

def gen_name():
	name = randint(100000, 1000000);
	while (name in names):
		name = randint(100000, 1000000);
	names.append(name);
	return "user" + str(name);

for i in range(1500):
	name = gen_name();
	pwd = str(randint(1000000, 10000000));

	s = name + ":" + pwd + ":" + ":" + "easyctf_users" + ":" + name + ":" + "/home_users/" + name + ":" + "/bin/bash";

	file.write("%s\n"%s);

	s = "userdel ";
	s += "-rf ";
	s += name;

	file2.write("%s\n"%s);

file.close();
file2.close();
print "done";