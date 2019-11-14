#!/usr/bin/env python
# coding: utf-8

# In[2]:


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


# In[3]:


dirpath = './handwrittenData.csv'


# In[4]:


# def load_file(idx):
#     img = cv2.imread(dirpath + idx,0)
# #     print(idx)
#     y_label = int(idx[6:8],16)
#     asci = y_label
#     if(asci>=65 and asci<=90):
#         asci -= 55
#     elif(asci>=97 and asci<=122):
#         asci -= 61
#     elif(asci >=48 and asci <=57):
#         asci -= 48
        
# #     print(y_label)
#     return img,asci


# In[ ]:


# class MyDataset(Dataset):
#     def __init__(self):
#         self.data_files = os.listdir(dirpath)

#     def __getitem__(self, idx):
#         x_label,y_label = load_file(self.data_files[idx])
# #         if x_label is None:
# #             print(idx)
#         return x_label,y_label

#     def __len__(self):
#         return len(self.data_files)


# In[ ]:





# In[7]:


# full_dataset = MyDataset()
# train_size = int(0.8 * 731668)
# test_size = 731668 - train_size 
# leng = [train_size,test_size]
# train_dataset, test_dataset = torch.utils.data.random_split(full_dataset,leng)


# In[95]:


# train_set = MyDataset() # there is only one file in train_files, i.e. train_files = ["foo_1"]
# train_loader = DataLoader(dataset=train_dataset,batch_size=2,shuffle=True,num_workers=8)


# In[96]:


# test_set = MyDataset() # there is only one file in train_files, i.e. train_files = ["foo_1"]
# test_loader = DataLoader(dataset=test_dataset,batch_size=2,shuffle=True,num_workers=8)


# In[4]:


class CapitalAlpha(Dataset):
    def __init__(self):
        xy = np.loadtxt("handwrittenData.csv",delimiter=",",dtype=np.float32)
        self.len = xy.shape[0]
        self.x_data = torch.from_numpy(xy[:,1:])
        self.y_data = torch.from_numpy(xy[:,[0]])
        
    def __getitem__(self,index):
        x_data = self.x_data[index].reshape(1,28,28)
        return x_data,self.y_data[index]
    
    def __len__(self):
        return self.len


# In[6]:


dataset = CapitalAlpha()
# train_loader = DataLoader(dataset = dataset,batch_size = 32,shuffle= True,num_workers = 2)


# In[16]:


len(dataset)


# In[17]:


train_size = int(0.8 * len(dataset))
test_size = len(dataset) - train_size 
leng = [train_size,test_size]
train_dataset, test_dataset = torch.utils.data.random_split(dataset,leng)


# In[28]:


# train_set = CapitalAlpha() # there is only one file in train_files, i.e. train_files = ["foo_1"]
train_loader = DataLoader(dataset=train_dataset,batch_size=1024,shuffle=True,num_workers=8)
test_loader = DataLoader(dataset=test_dataset,batch_size=1024,shuffle=True,num_workers=8)


# In[29]:


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# In[30]:


device


# In[31]:


class Net(nn.Module):    
    def __init__(self):
        super(Net,self).__init__()
        self.conv1 = nn.Conv2d(1,10,kernel_size = 5)
        self.conv2 = nn.Conv2d(10,20,kernel_size = 5)
        self.mp = nn.MaxPool2d(2)
        self.fc = nn.Linear(320,26)

    def forward(self,x):
        in_size = x.size(0)
        x = F.relu(self.mp(self.conv1(x)))
        x = F.relu(self.mp(self.conv2(x)))
        x = x.view(in_size,-1)
        x = self.fc(x)
        return F.log_softmax(x)


# In[32]:


model = Net().to(device)
optimizer = optim.Adam(model.parameters(),lr = 1e-2)
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, 'min',verbose=True,patience=5)


# In[37]:


def train(epoch):
    epoch_train_loss = []
    for batch_idx,(data,label) in enumerate(train_loader):
#         print(data.shape)
#         break
        data = torch.FloatTensor(data.float()).to(device)
        size = data.shape[0]
        data = data.reshape(size,1,28,28)
#         print(data.shape)
#         break
        label = torch.FloatTensor(label.float()).to(device)
        label = label.reshape(size)
        optimizer.zero_grad()
        predicted = model(data)
        output = nn.CrossEntropyLoss()
#         print(label.shape,predicted.shape)
        loss = output(predicted, label.long())
        epoch_train_loss.append(loss.item())
        loss.backward()
        optimizer.step()
        print('batches done',batch_idx,end='\r')
        
    sys.stdout.write('\n epoch {} train_loss {}'.format(epoch,np.mean(epoch_train_loss)))
    return np.mean(epoch_train_loss)

        


# In[38]:


#make test dataset then run 


# In[39]:


def test(epoch):
    epoch_test_loss = []
    for batch_idx,(data,label) in enumerate(test_loader):
        data = torch.FloatTensor(data.float()).to(device)
        size = data.shape[0]
        data = data.reshape(data.shape[0],1,28,28)
#         print(label.shape)
        label = torch.FloatTensor(label.float()).to(device)
        label = label.reshape(size)
        optimizer.zero_grad()
        predicted = model(data)
        output = nn.CrossEntropyLoss()
        loss = output(predicted, label.long())
        epoch_test_loss.append(loss.item())
#         loss.backward()
#         optimizer.step()
#         print('batches done',batch_idx,end='\r')
        
    
    sys.stdout.write('\n epoch {} test_loss {}'.format(epoch,np.mean(epoch_test_loss)))
    return np.mean(epoch_test_loss)

        


# In[40]:


for i in range(100):
    train_loss = train(i)
    test_loss = test(i)
    scheduler.step(test_loss)
    torch.save(model,'mymodel.pt')


# In[ ]:





# In[ ]:




