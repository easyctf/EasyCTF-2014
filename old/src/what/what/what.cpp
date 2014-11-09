//
// Written by Michael Zhang
// EasyCTF 2014
//

#include<iostream>
#include<stdio.h>
#include<fstream>
#include<string.h>

using namespace std;

char* process(char* file);

int main(int argc, char* argv[]) {

	// printf("hei, world!\n");
	// printf("%d args found. first arg is %s\n", argc, argv[0]);

	if (argc != 2) {
		cout << "Usage: what <filename>" << endl;
	}
	else {
		cout << "Filename provided: " << argv[1] << endl;

		char* result = process(argv[1]);
		cout << result << endl;
	}

	// system("pause");
	return 0;

}

char* process(char* file) {
	ifstream input(file);
	char* result;

	if (!input.is_open()) {
		strcpy(result, "File doesn't exist!");
		return result;
	}
	else {
		char buf[128];

		input.get(buf[0]);
		int headerLength = int(buf[0]);

		cout << "Header length: " << headerLength << endl;

		input.get(buf[headerLength]);
		
	}

	strcpy(result, "Successful (so far)");
	return result;
}
