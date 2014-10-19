#include <stdio.h>
#include <iostream>
#include <string>

using namespace std;

int main() {
	string flag = "eeeeeeeeeeeeeEeesy_ctf";
	string input;

	cout << "Enter the password to continue.\n> ";

	cin >> input;

	if (flag.compare(input) == 0) {
		cout << "Yay, you got the right flag!" << endl;
	}
	else {
		cout << "Darn, you didn't get the right flag." << endl;
	}

	system("pause");
	return 0;
}