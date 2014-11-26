from random import randint;

N = 800;

def gen(a, b):
	return randint(10**a, 10**b);

file = open("accounts.csv", "w");

for i in range(N):
	u = "user" + str(gen(4, 5));
	p = str(gen(6, 7));
	h = "/home/" + u;
	file.write("%s,%s,%s\n" % (u, p, h));

file.close();
