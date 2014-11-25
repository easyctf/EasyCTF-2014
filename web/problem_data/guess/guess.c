#include <stdio.h>
 
int main()
{
	printf("Welcome to the guessing game!\n");
	printf("Please enter your name: ");
	char * str=(char *)malloc(25);
	scanf("%20s",str);
	printf("\nHello, %s\nPlease enter in a float to guess: ",str);
	int bufA=(int)malloc(12);
	float * guess=(float *)bufA;
	float * answer=(float *)(bufA+4);
	*answer=(rand()%1000+1)/(float)(rand()%1005+1);
	scanf("%lf",guess);
	printf("\na: %f, b: %f\n",*answer, *guess);
	if(*answer/(*guess)==1.0)
	{
		printf("\nThe flag is '<flag hidden>'\n");
	}else{
		printf("\nSorry, that is not the secret number\n");
	}
	free(bufA);
	free(str);
}