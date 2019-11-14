#!/usr/bin/env python
# coding: utf-8

# In[8]:


from __future__ import print_function
from torch.utils.data import Dataset,DataLoader
import torch
import argparse
import torch.nn as nn
import torch.nn.functional as F 
import torch.optim as optim 
from torchvision import datasets , transforms
from torch.autograd import Variable
import csv
import numpy as np
import random
import sys,os
import cv2
import torch.optim.lr_scheduler


# In[200]:


dirpath = '/share1/rizwan.ali/images/'


# In[10]:


def load_file(idx):
    img = cv2.imread(dirpath + idx,0)
#     print(idx)
    y_label = int(idx[6:8],16)
    asci = y_label
    if(asci>=65 and asci<=90):
        asci -= 55
    elif(asci>=97 and asci<=122):
        asci -= 61
    elif(asci >=48 and asci <=57):
        asci -= 48
        
#     print(y_label)
    return img,asci


# In[127]:


class MyDataset(Dataset):
    def __init__(self):
        self.data_files = os.listdir(dirpath)

    def __getitem__(self, idx):
        x_label,y_label = load_file(self.data_files[idx])
#         if x_label is None:
#             print(idx)
        return x_label,y_label

    def __len__(self):
        return len(self.data_files)


# In[ ]:





# In[128]:


full_dataset = MyDataset()
train_size = int(0.8 * 731668)
test_size = 731668 - train_size 
leng = [train_size,test_size]
train_dataset, test_dataset = torch.utils.data.random_split(full_dataset,leng)


# In[129]:


train_set = MyDataset() # there is only one file in train_files, i.e. train_files = ["foo_1"]
train_loader = DataLoader(dataset=train_dataset,batch_size=1024,shuffle=True,num_workers=8)


# In[190]:


test_set = MyDataset() # there is only one file in train_files, i.e. train_files = ["foo_1"]
test_loader = DataLoader(dataset=test_dataset,batch_size=1024,shuffle=True,num_workers=8)


# In[173]:


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# In[132]:


device = "cpu"


# In[174]:


class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(1, 10, kernel_size=5).to('cuda')
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5).to(device)
        self.conv2_drop = nn.Dropout2d().to(device)
        self.fc1 = nn.Linear(16820, 5000).to(device)
        self.fc2 = nn.Linear(5000, 805).to(device)
        self.fc3 = nn.Linear(805, 62).to(device)
        

    def forward(self, x):
        x = F.relu(F.max_pool2d(self.conv1(x), 2))
        x = F.relu(F.max_pool2d(self.conv2_drop(self.conv2(x)), 2))
        x = x.view(x.size(0), -1)
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = F.dropout(x, training=self.training)
        x = self.fc3(x)
        return F.log_softmax(x)


# In[199]:


model = Net().to(device)
if torch.cuda.device_count() > 1:
#     print("Let's use", torch.cuda.device_count(), "GPUs!")
    # dim = 0 [30, xxx] -> [10, ...], [10, ...], [10, ...] on 3 GPUs
    model = nn.DataParallel(model)

optimizer = optim.Adam(model.parameters(),lr = 1e-2)
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, 'min',verbose=True,patience=5)


# In[180]:


def train(epoch):
    epoch_train_loss = []
    for batch_idx,(data,label) in enumerate(train_loader):
#         print(data.shape)
#         break
        data = torch.FloatTensor(data.float()).to(device)
        size = data.shape[0]
        data = data.reshape(size,1,128,128)
#         print(data.shape)
#         break
        label = torch.FloatTensor(label.float()).to(device)
        label = label.reshape(size)
        optimizer.zero_grad()
#         print(optimizer)
        predicted = model(data)
        output = nn.CrossEntropyLoss()
#         print(label.shape,predicted.shape)
        loss = output(predicted, label.long())
        epoch_train_loss.append(loss.item())
        loss.backward()
        optimizer.step()
#         print('batches done',batch_idx,end='\r')
#         break
    sys.stdout.write(' \n epoch {} train_loss {}'.format(epoch,np.mean(epoch_train_loss)))
    return np.mean(epoch_train_loss)

        


# In[181]:


#make test dataset then run 


# In[196]:


def test(epoch):
    epoch_test_loss = []
    acc = 0
    for batch_idx,(data,label) in enumerate(test_loader):
        data = torch.FloatTensor(data.float()).to(device)
        size = data.shape[0]
        data = data.reshape(data.shape[0],1,128,128)
#         print(label.shape)
        label = torch.FloatTensor(label.float()).to(device)
        label = label.reshape(size)
        optimizer.zero_grad()
        predicted = model(data)
#         print(predicted)
        output = nn.CrossEntropyLoss()
        loss = output(predicted, label.long())
        epoch_test_loss.append(loss.item())
#         pred  = predicted.data.max(1,keepdim = True)[1]
#         print(pred.shape)
#         print(tensor.numpy(pred).shape)
#         pred = pred.reshape(1024)
#         pred = tensor.numpy(pred)
#         pred  = np.argmax(pred,axis =0)
#         print(pred.shape)
#         _, pred = torch.max(predicted,1)
#         print(pred,label.long())
#         acc+=np.sum(pred==label.long())
#         break
#         loss.backward()
#         optimizer.step()
#         print('batches done',batch_idx,end='\r')
        
    
    sys.stdout.write(' \n epoch {} test_loss {} Acc {}'.format(epoch,np.mean(epoch_test_loss),acc/test_size))
    return np.mean(epoch_test_loss)

        


# In[198]:


for i in range(200):
    train_loss = train(i)
    test_loss = test(i)
    scheduler.step(test_loss)
    torch.save(model,'/share1/rizwan.ali/mymodel_simple.pt')


# In[ ]:





# In[ ]:




