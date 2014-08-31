import numpy as np
import ImageGrab
import Image
import cv2
import time
import requests
import subprocess
import os
import glob
from images2gif import writeGif

cap = cv2.VideoCapture(0)

img = ImageGrab.grab((1200, 0, 1400, 20))
numpy1 = np.array(img.getdata(),dtype=np.uint8)\
    .reshape((img.size[1],img.size[0],3))

start = False;
recorded = False;
recording = False;
frames = []

startTime1 = time.time()
while(True):
    img =  ImageGrab.grab((1100, 0, 1300, 20))

    
    #num = cv2.absdiff(img, img2)
    numpy2 = numpy1
    numpy1 =   np.array(img.getdata(),dtype=np.uint8)\
    .reshape((img.size[1],img.size[0],3))

    #cv2.imwrite("img1.png", numpy1)
    #cv2.imwrite("img2.png", img2)

    #img = cv2.imread('img1.jpg')
    #img2 = cv2.imread('img2.jpg')
    
    change = cv2.absdiff(numpy1, numpy2).sum()
    print(str(change))
    
    time.sleep(.1);
    if change > 5000 and (time.time() - startTime1) > 10:
        start = True

    #topRight = printscreen_numpy[]
    final = numpy1
    #cv2.imshow('window',final)


        #if cv2.waitKey(5) & 0xFF == ord('r'):
            #print("r pressed")
            #start = True

    if cv2.waitKey(5) & 0xFF == ord('q'):
        print("destroy called")
        cv2.destroyAllWindows()
        break
        
        # Capture frame-by-frame
    ret, frame = cap.read()

        # Our operations on the frame come here
    colorFrame = cv2.cvtColor(frame, 0)

        # Display the resulting frame
        #cv2.imshow('frame',colorFrame)
    if start:
        print("starting...")
        startTime = time.time()
        start = False;
        recording = True;
    elif recording and (time.time() - startTime < 5):
        print("recording...")
        frames.append(colorFrame)
        recorded = True;
    elif recorded:
        #send frames here
        
        i = 0
        #writeGif("mygif.gif", frames, duration=3, dither=0)
        for x in frames:
            i += 1
            cv2.imwrite("C:\\Users\\Raymond\\Desktop\\temp\\img" + str(i) + ".jpg", x) 
        print('cd C:\\Program Files\\ImageMagick-6.8.9-Q8\\')
        os.chdir('C:\\Program Files\\ImageMagick-6.8.9-Q8\\')
        subprocess.call('convert -delay 10 -loop 0 C:/Users/Raymond/Desktop/temp/*.jpg C:/Users/Raymond/Desktop/temp/anim.gif', shell=True)


        url = 'http://104.131.25.90:8888'
        files = {'gif': open('C:\\Users\\Raymond\\Desktop\\temp\\anim.gif', 'rb')}
        r = requests.post(url, files=files)
        print(r.text)

        #subprocess.call('rm C:/Users/Raymond/Desktop/temp/ -r')
        #files = glob.glob('C:/Users/Raymond/Desktop/temp/*')
        #for f in files:
            #os.remove(f)
            
        frames[:] = []
        recorded = False

    

    
