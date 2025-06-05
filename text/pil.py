"""Create a PNG image for a given text.

    Inspired by https://code-maven.com/create-images-with-python-pil-pillow
    and Al Sweigart's "Automate Boring Stuff with Python", Chapter 17. Further
    links used:
    - https://automatetheboringstuff.com/chapter17/
    - https://www.tutorialspoint.com/python3/number_sqrt.htm
    - https://stackoverflow.com/questions/704152/how-can-i-convert-a-character-to-a-integer-in-python-and-viceversa
"""
import math
from PIL import Image


"""
    PSEUDO-CODE:

    1. raw = read_file('input.txt')
    2. no_stops = remove_stop_words(raw)
    3. tokens = tokenize(no_stops)
       lemma = nltk.wordnet.WordNetLemmatizer()
    4. for token in tokens:
            append.lemmatized = lemma.lemmatize('leaves')
    5. turn every lemmatized token into a k-lenght array of pixels depending on the number of characters in the token. Append 0s if the length of the token is not multiple of 3.
    6. compute n x n size for the image, append [0,0,0] to fill up the pixel array so I get a square 
"""






# write a function to cut the text to x * x * 3
"""compute image dimension."""
def get_img_dim(text):
    num_pixels = len(text) / 3
    width = num_pixels / 10
    height = num_pixels / width
    npix = width * height
    print(width)
    print(height)
    print(num_pixels)


text = "Password security on the UNIX (a trademark of Bell Laboratories) time-sharing system is provided by a collection of programs whose elaborate and strange design is the outgrowth of many years of experience with earlier versions. To help develop a secure system, we have had a continuing competition to devise new ways to attack the security of the system (the bad guy) and, at the same time, to devise new techniques to resist the new attacks (the good guy). This competition has been in the same vein as the competition of long standing between manufacturers of armor plate and those of armor-piercing shells. For this reason, the description that follows will trace the history of the password system rather than simply presenting the program in its current state. In this way, the reasons for the design will be made clearer, as the design cannot be understood without also understanding the potential attacks."



num_pixels = math.ceil(len(text) / 3)
height = width = int(math.ceil(math.sqrt(num_pixels)))
print("[*] w = {0}, h = {1}".format(width, height))

expected_len = width * height * 3
if len(text) < expected_len:
    text = text.ljust(expected_len, '\0')

#get_img_dim(text)

im = Image.new('RGBA', (width, height))

i = 0

for x in range(width):
    for y in range(height):
        print("{0} - {1} - {2}".format(i, i+1, i+2))
        print("{0} - {1}".format(text[i], ord(text[i])))
        print("{0} - {1}".format(text[i+1], ord(text[i+1])))
        print("{0} - {1}".format(text[i+2], ord(text[i+2])))
        # im.putpixel((x, y), (210, 210, 210))
        im.putpixel((x, y), (ord(text[i]), ord(text[i+1]), ord(text[i+2])))
        i = i + 3

im.save('putPixel.png')
