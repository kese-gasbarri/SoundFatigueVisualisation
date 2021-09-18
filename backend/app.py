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

 
@app.get("/sensor/{sensor_id}/")
def query_sensor(room_id: int, start_time: int, end_time: int):
    with Session(engine) as session:
        roomSensors = session.exec(select(models.RoomSensor).where(models.RoomSensor.RoomID == room_id)).all()
        return [x.Samples for x in roomSensors]