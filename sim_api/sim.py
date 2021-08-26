"""
Simulator API
Caleb Cheng 23/08/21
pull sample sound data from two different distributions
To use
  - pip install -r requirements.txt
  - cd sim_api
  - uvicorn sim:app --reload
"""

import random
import hashlib
import time
import numpy as np
from typing import Optional
from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

@app.get("/", response_class=PlainTextResponse)
def main():
    
    return doc
