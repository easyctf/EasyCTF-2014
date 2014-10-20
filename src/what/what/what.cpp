#include<iostream>
#include<stdio.h>
#include<fstream>

using namespace std;

int main(int argc, char* argv[]) {

	// printf("hei, world!\n");
	// printf("%d args found. first arg is %s\n", argc, argv[0]);

	if (argc != 2) {
		cout << "Usage: what <filename>" << endl;
	}
	else {
		cout << "Filename provided: " << argv[1] << endl;

		ifstream input(argv[1]);

		if (!input.is_open()) {
			cout << "File doesn't exist!" << endl;
		}
		else {
			cout << "File exists!" << endl;
		}
	}

	system("pause");
	return 0;

}