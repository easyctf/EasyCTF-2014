#include <stdio.h>                                                               
#include <stdlib.h>                                                              
#include <fcntl.h>                                                               
                                                                                 
int main(int argc, char **argv){                                                 
    char* cmd = "/bin/pwd";                                                      
    printf(argv[1]);                                                             
    gid_t gid = getegid();                                                       
    setresgid(gid, gid, gid);                                                    
    system(cmd);                                                                 
    return 0;                                                                    
}      