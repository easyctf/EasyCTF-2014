#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>

int main(int argc, char **argv){
    printf(argv[1]);
    gid_t gid = getegid();
    setresgid(gid, gid, gid);
    system("/bin/pwd");
    return 0;
}
