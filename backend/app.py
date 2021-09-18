from typing import Optional
import json
import time
from fastapi import FastAPI
from db import engine
import models
from sqlmodel import Field, SQLModel, Session, select
from fastapi.middleware.cors import CORSMiddleware

SQLModel.metadata.create_all(engine)

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

'''
This function should return the amount of sound in a room
over a specific time period. 
'''
@app.get("/room/{room_id}/")
def query_room(room_id: int, start_time: int = time.time() - 5 * 60, end_time: int = time.time()):
    with Session(engine) as session:
        Room = session.exec(select(models.Room).where(models.Room.ID == room_id)).one()
        ret = []
        for rs in Room.RoomSensors:
            rs_series = {"SensorID": rs.SensorB.ID, "SensorName":rs.SensorB.Name}
            rs_series["x"] = [x.Timestamp for x in rs.Samples]
            #rs_series["x"] = [x.Timestamp for x in rs.Samples if start_time <= x.Timestamp <= end_time]
            data = [json.loads(x.MeasurementsJSON) for x in rs.Samples]
            rs_series["dB"] = [x['dB'] for x in data]
            rs_series["pitch"] = [x["pitch"] for x in data]
            ret.append(rs_series)
        return ret


'''
This function should return the amount of sound exposed to a single officer
Over a specific time period. 
'''
@app.get("/officer/{officer_id}/")
def query_officer(officer_id: int, start_time: int = time.time() - 5 * 60, end_time: int = time.time()):
    with Session(engine) as session:
        Officer = session.exec(select(models.Officer).where(models.Officer.ID == officer_id)).one()
        print(Officer)
        MovementEvents = session.exec(select(models.MovementEvent).where(models.MovementEvent.OfficerID == officer_id)).all()
        print(MovementEvents)
        return MovementEvents
        # return MovementEvents
        
 
@app.get("/sensor/{sensor_id}/")
def query_sensor(room_id: int, start_time: int, end_time: int):
    with Session(engine) as session:
        roomSensors = session.exec(select(models.RoomSensor).where(models.RoomSensor.RoomID == room_id)).all()
        return [x.Samples for x in roomSensors]