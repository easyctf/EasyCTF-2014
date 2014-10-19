#include <iostream>
#include <fstream>

using namespace std;

int main(int argc, char* argv[]) {
	if (argc != 2) {
		cout << "Usage: " << argv[0] << " <filename>" << endl;
	}
	else {
		ifstream file(argv[1]);
		if (!file.is_open()) {
			cout << "Could not open the file." << endl;
		}
		else {

		}
	}

	system("pause");

	return 0;
}