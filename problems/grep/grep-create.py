from random import randint;

k = randint(1, 999);

for i in range(1000):
	n = randint(10000000, 100000000);
	f = open("grep/" + str(n), "w");
	f.write("%s\n" % ("yep!" if i == k else "nope!"));

print k;
print "done.";

