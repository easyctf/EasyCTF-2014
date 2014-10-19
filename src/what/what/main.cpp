#include <iostream>
#include <fstream>

using namespace std;

int main(int argc, char* argv[]) {
	if (argc != 2) {
		cout << "Usage: " << argv[0] << " <filename>" << endl;
	}
	else {
		cout << "Reading from " << argv[1] << "..." << endl;

		ifstream in(argv[1]);
		char* buf = new char[128];

		in.get(buf[0]);
		char* header = new char[int(buf[0])];

		in.get(header, int(buf[0]) + 1);

		in.get(buf[0]);
		char* hash = new char[int(buf[0])];

		in.get(hash, int(buf[0]) + 1);
		printf("%02X %02X %02X %02X", hash[28], hash[29], hash[30], hash[31]);

		// char* contents = new char[int(buf[0])];

		cout << int(buf[0]);
	}

	cout << endl;

	system("pause");

	return 0;
}