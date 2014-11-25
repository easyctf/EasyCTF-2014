#include <stdio.h>
#include <windows.h>

/*

           \             _______             /
            \           |       |           /
             \  .-.     | [RPF] |     .-.  /
              |/   \   /|       |\   /   \|
             /      '-' |      O| '-'      \
            /           |       |           \
           /            |_______|            \

		Who Stole the Door?
	A CTF Problem by Carter Feldman - http://carterf.com

*/


typedef int (*twochainz)(int,int);

double secretMsg[]={413.414948585843, 1283.2157170912346, 707.3101508815096, 90.66225194628507, 0.020494840424672176, 370.1943200327902, 390.80366492952726, 356.2080307501442, 414.79166008755413, 661.9663038614038, 76.03193140164613, 355.81672335190314, 68.0544392589381, 857.9620161197133, 597.7776012537205, 1062.9713561810959, 292.86378134329937, 576.2648443320188, 66.47262278138645, 993.6235986962487, 553.055548408059, 966.0332229673166, 797.2419973384289, 518.4181275677099, 894.1346820046, 255.09806296537735, 503.00335556417747, 58.139560562523535, 870.7733129023483, 485.6031401171731, 822.5126761016662, 651.9091611795947, 457.6602821097245, 769.3388642013525, 0.012691520068288968, 0.01253246404930214, 620.377306784838};

unsigned short roundVal(double v)
{
	return (unsigned short)(v+0.5);
}

twochainz generateFlagFunc(double seed)
{
	int len=sizeof(secretMsg)/4;
	unsigned short * buf=(unsigned short *)malloc(len+1);
	buf[len+1]=0;
	for(int i=0;i<len/2;i++)
	{
		buf[i]=(unsigned short)(roundVal(secretMsg[i]*seed-1));
		seed+=1.0;
	}
	DWORD trashBin;
	VirtualProtect(buf,len+1,PAGE_EXECUTE_READWRITE,&trashBin);
	return (twochainz)buf;
}

int main()
{
	printf("--- DOOR! DOOR! WHO STOLE THE DOOR? ---\n");
	printf("In order to identify who stole the door, please enter the secret key below \n\nSecret key: ");
	double secretKey;
	scanf("%lf",&secretKey);
	
	twochainz flagFunc=generateFlagFunc(secretKey);
	
	printf("Good detective work, your flag is: %d_%d\n",flagFunc(4407091,(int)(137.0*(secretKey)/15.2)),flagFunc(1992,197));
	return 0;
}