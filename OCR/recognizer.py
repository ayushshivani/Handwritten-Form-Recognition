import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import cv2
import numpy as np
from scipy.misc import imsave, imread, imresize
from matplotlib import pyplot as plt
import numpy as np
import argparse
from keras.models import model_from_yaml
import re
import base64
import pickle

IMAGE_DIRECTORY = './Labelled'
OUTPUT_DIRECTORY = './ERROR'

def load_model(bin_dir):
    ''' Load model from .yaml and the weights from .h5

        Arguments:
            bin_dir: The directory of the bin (normally bin/)

        Returns:
            Loaded model from file
    '''

    # load YAML and create model
    yaml_file = open('%s/model.yaml' % bin_dir, 'r')
    loaded_model_yaml = yaml_file.read()
    yaml_file.close()
    model = model_from_yaml(loaded_model_yaml)

    # load weights into new model
    model.load_weights('%s/model.h5' % bin_dir)
    return model

def predict(img,model,mapping):
    ''' Called when user presses the predict button.
        Processes the canvas and handles the image.
        Passes the loaded image into the neural network and it makes
        class prediction.
    '''
    # read parsed image
    # img = imread(source)

    if(isBlank(img)):
        prediction = " "
    else:
        img = process(img)

        img = imresize(img,(28,28))
        img = img.reshape(1,28,28,1)
        img = img.astype('float32')
        img /= 255

        # Predict from model
        out = model.predict(img)

        # Generate response
        try:
            prediction = chr(mapping[(int(np.argmax(out, axis=1)[0]))])
        except:
            prediction = 'ERROR'

    return prediction

def process(img):
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = np.invert(img)
    # show(img,'original')

    # CENTERING OF IMAGE
    for i in range(img.shape[0]):
        for j in range(img.shape[1]):
            if img[i][j] < 8:
                img[i][j]=0
    # show(img,'edited')
    
    fimg = cv2.morphologyEx(img, cv2.MORPH_OPEN, np.ones((5, 5), dtype=np.uint8)) # Perform noise filtering
    # show(img,'noiseremoved')
    coords = cv2.findNonZero(fimg) # Find all non-zero points (text)
    x, y, w, h = cv2.boundingRect(coords) # Find minimum spanning bounding box
    if(w>0 and h>0):
        img = img[y:y+h, x:x+w] # Crop the image - note we do this on the original image
    # show(img,'cropped')

    ## ENHANCING OF IMAGE
    img = cv2.equalizeHist(img)
    # show(img,'enhanced')

    img = broadcast(img)
    # show(img,'Broadcasted')

    ret2,img = cv2.threshold(img,0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)

    return img

def broadcast(img):
    height, width = img.shape
    x = height+2 if height > width else width+2
    y = height+2 if height > width else width+2
    square= np.zeros((x,y), np.uint8)
    square[int((y-height)/2):int(y-(y-height)/2), int((x-width)/2):int(x-(x-width)/2)] = img
    return square

def isBlank(img):
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = np.invert(img)

    for i in range(img.shape[0]):
        for j in range(img.shape[1]):
            if img[i][j] < 8:
                img[i][j]=0

    img = img[ int(img.shape[0]/3): int(2*img.shape[0]/3), int(img.shape[1]/3): int(2*img.shape[1]/3)]
    sd = np.std(img)
    return (sd <= 10)

def main():
    model = load_model('bin')
    mapping = pickle.load(open('%s/mapping.p' % 'bin', 'rb'))
    total = 0
    correct = 0
    for fn in os.listdir(IMAGE_DIRECTORY):
        total+=1
        print(fn)
        filename = os.path.join(IMAGE_DIRECTORY, fn)
        img = imread(filename)
        pr = predict(img,model,mapping)
        if(pr == fn.split()[0]):
            correct+=1
        else:
            img = imread(filename)
            imsave(OUTPUT_DIRECTORY+'/'+fn[:-4]+' '+pr+'.png', img)
    print("ACCURACY :: ",correct/total*100)

model = load_model('./OCR/bin')
model._make_predict_function()
mapping = pickle.load(open('%s/mapping.p' % './OCR/bin', 'rb'))
