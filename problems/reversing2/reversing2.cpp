#include <stdio.h>
#include <iostream>
#include <string>

using namespace std;

int a, b;

string decode(string input) {
	int i = 0;
	int pos = b;
	string output = "";

	for (i = 0; i < input.length(); i++) {
		output += input.at(pos);
		pos += a;
		pos %= input.length();
	}

	return output;
}

int main() {

	cout << "> ";
	cin >> a;
	cout << "> ";
	cin >> b;

	string flag = "aararShgoho biprrmup  pd0aomirwish ear lcoextoentit ey'kltiosr.'g get Vsose e'dt  llcsnhhf u  sxlerfhler e aSt.stht  ooe  ";

	cout << decode(flag) << endl;

	return 0;
}
