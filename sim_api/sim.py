"""
Simulator API
Caleb Cheng 23/08/21
pull sample sound data from two different distributions
To use
  - pip install requirements.txt
  - cd sim_api
  - uvicorn sim:app --reload
"""
import datetime

import hashlib
import json
import time
import numpy as np
from typing import Optional
from db import SessionLocal, engine
import models


############

import random
import time
SECONDS_IN_A_DAY = 86400
count =0
# Quiet room is 30dBA to 50dBA

def sound_generator(input,count,saved_random):
    if(input == "quietRoom"):
        loud_bang = random.randint(1, 10000)
        if(saved_random == 0):
            randomLenOfBang = random.randint(0,300)
            # Say a 0.1% chance of there being a painful noise 
            # and noise has a random generated time to last
            # not safe for any period of time
        if(loud_bang >= (9996) or (count >0 and count <= saved_random +1)):
            count += 1
            if(saved_random == 0):
                saved_random = randomLenOfBang
            randomValue = random.random()
            if(randomValue<0.3):
                line = round(random.uniform(90, 110),1)
            elif(randomValue<0.6):
                line = round(random.uniform(50, 90),1)
            elif(randomValue<0.9):
                line = round(random.uniform(110, 130),1)
            else:
                line = round(random.uniform(110, 150),1)
        else:
            line = round(random.uniform(30.0, 50.0),1) 
            count =0
            saved_random = 0

    return line,count,saved_random


######
models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Every second, for each RoomSensorId, fetch some random data.

room_sensors = db.query(models.RoomSensor).all()
saved_random = 0

timeStampPopulate  = 1633536060 #= 1/10/2021 00:01
while True:
    for rs in room_sensors:
        #print(rs.RoomID, rs.SensorID)
        # same sensor should return same data
        hash = hashlib.sha1(f"{rs.SensorID}".encode())
        phase = int(hash.hexdigest()[:4], 16)
        
        datadb,count,saved_random = sound_generator("quietRoom",count,saved_random)
        data = {
            "dB":datadb,
            "pitch": round(100 * np.sin(2*np.pi/(60*3) + int(time.time()) + phase), 3)
        }
        
        timeStamp = int(time.time())
        print(timeStamp)
        # Hour:Minute:Seconds string format
        #timeString = ""
        now = datetime.datetime.now()
        timeString = str(now.day)+"-"+str(now.month)+"-"+ str(now.year)+"-"+str(now.hour) +":"+ str(now.minute) +":"+ str(now.second)
        print(timeString)
        
        timeStampPopulate = timeStamp

        if(timeStampPopulate  != timeStamp):
            timeStampPopulate = populateFrom
            timeStampPopulate  +=1

        else:
            timeStampPopulate = timeStamp
  
       # print("THE TIME STAMP",newTimeStamp)
        #print(timeStampPopulate)
        newSample = models.Sample(rs.ID, timeString, 1, json.dumps(data))
        db.add(newSample)
        db.commit()
        if(timeStampPopulate == timeStamp):
            print("reached")
            time.sleep(1)

    

'''
from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from datetime import datetime

app = FastAPI()


@app.get("/{room_id}/{sensor_id}/")
def sin_sensor(room_id: int, sensor_id: int):
    # Get hash room_id and sensor_id to generate phase shift
    hash = hashlib.sha1(f"{room_id}_{sensor_id}".encode())
    # Take first 2 bytes of hash
    phase = int(hash.hexdigest()[:4], 16)
    return {"dB": 50*np.sin((2*np.pi/(60)) * time.time() + phase) + 100, "pitch": 100*np.sin(2*np.pi/(60*3) * time.time()+phase) + 1000}


@app.get("/{room_id}/{sensor_id}/n")
def norm_sensor(room_id: int, sensor_id: int):
    return {"dB": np.random.normal(loc=100, scale=20), "pitch": np.random.normal(loc=1000, scale=200)}



@app.get("/{room_id}")
def room_day(room_id: int):
    with open("sample.csv") as file:
        readings = []
        day = []
        for i, x in enumerate(file):
            if i > 0: 
                row = list(map(float, x.strip().split(",")[1:]))
                
                if not day: day.append(datetime.fromtimestamp(row[0]).strftime("%Y-%m-%d"))
                
                row[0] = datetime.fromtimestamp(row[0]).strftime("%H:%M")
                readings.append(row)

    readings = list(zip(*readings))
    labels = list(readings[0])
    data = list(readings[1])
    return {"labels": labels, "data": data, "day": day}


doc = """Usage:
/{room_id}/{sensor_id}/ (Default)
- Returns {dB: , pitch: )
- dB
    - Sine wave
    - Period of 1 minute
    - centered around 100dB
    - amplitude of 50s
- pitch:
    - Sine wave
    - Period of 3 minute
    - centered around 1000Hz
    - amplitude of 100Hz
/{room_id}/{sensor_id}/n
- Returns {dB: , pitch: )
- dB
    - Normal distribution
    - centered around 100db
    - s.d of 20
- pitch
    - Normal distribution
    - centered around 1000Hz
    - s.d. of 200Hz
- dB in decibels
- pitch in Hz
"""
'''
@app.get("/", response_class=PlainTextResponse)
def main():
    return doc