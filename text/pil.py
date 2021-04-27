"""Create a PNG image for a given text.

    Inspired by https://code-maven.com/create-images-with-python-pil-pillow
    and Al Sweigart's "Automate Boring Stuff with Python", Chapter 17
    https://automatetheboringstuff.com/chapter17/
    https://www.tutorialspoint.com/python3/number_sqrt.htm
    https://stackoverflow.com/questions/704152/how-can-i-convert-a-character-to-a-integer-in-python-and-viceversa
"""

from PIL import Image, ImageColor
import math


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
#    print(num_pixels * 3)
#    print(len(text))

#img = Image.new('RGB', (60, 30), color = 'red')
#img.save('pil_red.png')

#img = Image.new('RGB', (60, 30), color = (73, 109, 137))
#img.save('pil_color.png')

text = "Password security on the UNIX (a trademark of Bell Laboratories) time-sharing system is provided by a collection of programs whose elaborate and strange design is the outgrowth of many years of experience with earlier versions. To help develop a secure system, we have had a continuing competition to devise new ways to attack the security of the system (the bad guy) and, at the same time, to devise new techniques to resist the new attacks (the good guy). This competition has been in the same vein as the competition of long standing between manufacturers of armor plate and those of armor-piercing shells. For this reason, the description that follows will trace the history of the password system rather than simply presenting the program in its current state. In this way, the reasons for the design will be made clearer, as the design cannot be understood without also understanding the potential attacks."

test_text = 64 * 'h' + 64 * 'e' + 64 * 'l' + 64 * 'l' + 64 * 'o' + 64 * 'w' + 64 * 'o' + 64 * 'r' + 64 * 'l' + 64 * 'd' 

#height = int(math.sqrt(len(test_text))) / 3
height = int(math.sqrt(len(text))) / 3
width = height
print("[*] w = {0}, h = {1}".format(width, height))

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


im = Image.new('RGBA', (100, 100))
im.getpixel((0, 0))

for x in range(100):
    for y in range(50):
        im.putpixel((x, y), (210, 210, 210))

for x in range(100):
    for y in range(50, 100):
        im.putpixel((x, y), ImageColor.getcolor('darkgray', 'RGBA'))

print(im.getpixel((0, 0)))
print(im.getpixel((0, 50)))




print(ord('h'))
print(ord('e'))
print(ord('l'))
print(ord('l'))
print(ord('o'))

#im.save('putPixel.png')