#THE MEANEST GUESSING GAME EVER
import random#since my server has no randomness I'll just have to us random instead of os.urandom which isn't even implemented, still, I'm sure random good enough
flag="You_will_have_to_hax_the_real_version_to_get_this"
random_secret=random.random()
#now all you have to do is type in my secret, good luck
data = raw_input("What is your guess? ")
try:
  if float(data)==random_secret:
    print flag
  else:
    print "NOPE"
except:
  print "NOPE"
  #hmmm... their data can't be converted to a float, thats bad