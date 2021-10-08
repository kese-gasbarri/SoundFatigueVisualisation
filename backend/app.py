from models import MovementEvent
from typing import Optional
import json
import time
from fastapi import FastAPI, Request
from db import engine
import models
from sqlmodel import Field, SQLModel, Session, select, update
from fastapi.middleware.cors import CORSMiddleware
from operator import add

from datetime import date
import datetime

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

SECONDS_IN_A_DAY = 86400
'''
This function should return the amount of sound in a room
over a specific time period. 
'''
@app.get("/room/{room_id}/")
def query_room(room_id: int, start_time: Optional[int] = None, end_time: Optional[int] = None):
    with Session(engine) as session:
        current_day = date.today()
        d1 = current_day.strftime("%d/%m/%Y")
        ts = datetime.datetime.strptime(d1, "%d/%m/%Y").timestamp()
        if not start_time:
            # Show 
            start_time = ts
            #start_time = time.time() - 5*60
        if not end_time:
            end_time = time.time()

        RoomSensors = session.exec(select(models.RoomSensor).where(models.RoomSensor.RoomID == room_id)).all()
        ret = []

        Room = session.exec(select(models.Room).where(models.Room.ID == room_id)).one()
        max_db = Room.MaxDB
        max_pitch = Room.MaxPitch

        for rs in RoomSensors:
            rs_series = {"SensorID": rs.SensorB.ID, "SensorName":rs.SensorB.Name}
            valid_samples = session.exec(select(models.Sample).where(
                models.Sample.RoomSensorID == rs.ID,
                models.Sample.Timestamp,
                models.Sample.Timestamp
            )).all()
            rs_series["x"] = [x.Timestamp for x in valid_samples]
            #rs_series["x"] = [x.Timestamp for x in rs.Samples if start_time <= x.Timestamp <= end_time]
            data = [json.loads(x.MeasurementsJSON) for x in valid_samples]
            rs_series["dB"] = [x['dB'] for x in data]
            rs_series["pitch"] = [x["pitch"] for x in data]
            ret.append(rs_series)

            session.commit()
        
        return ret

'''
This function should return the amount of sound in a room
for the specified date
'''
@app.get("/room/{room_id}/{input_date}")
def query_room(room_id: int, start_time: Optional[int] = None, end_time: Optional[int] = None,input_date:Optional[str] =None):
    with Session(engine) as session:
        
        ####For time string
        
        if(str(input_date[0])=='0'):
            
            input_date_string = str(input_date[1:])
        else:
            input_date_string = str(input_date)
        
        ts = datetime.datetime.strptime(input_date, "%d-%m-%Y").timestamp()
        
        if not start_time:
            # Show 
            start_time = ts
            #start_time = time.time() - 5*60
        if not end_time:
            end_time = ts + SECONDS_IN_A_DAY
            

        RoomSensors = session.exec(select(models.RoomSensor).where(models.RoomSensor.RoomID == room_id)).all()
        ret = []

        Room = session.exec(select(models.Room).where(models.Room.ID == room_id)).one()
        max_db = Room.MaxDB
        max_pitch = Room.MaxPitch

        for rs in RoomSensors:
            rs_series = {"SensorID": rs.SensorB.ID, "SensorName":rs.SensorB.Name}
            valid_samples = session.exec(select(models.Sample).where(
                models.Sample.RoomSensorID == rs.ID,
                models.Sample.Timestamp,
                models.Sample.Timestamp
            )).all()
            #time.strftime("%H:%M:%S", time.gmtime(timeStampPopulate))
            #rs_series["x"] = [time.strftime('%H:%M:%S',time.gmtime(x.Timestamp)) for x in valid_samples]
            for x in rs.Samples:
                print(x.Timestamp)

            rs_series["x"] = [x.Timestamp for x in rs.Samples if x.Timestamp[0:9]== input_date_string]
            #rs_series["x"] = [x.Timestamp for x in valid_samples]
            print(len(rs_series['x']))
            if(len(rs_series['x']) !=0):
                data = [json.loads(x.MeasurementsJSON) for x in valid_samples]
                rs_series["dB"] = [x['dB'] for x in data]
                rs_series["pitch"] = [x["pitch"] for x in data]
            else:
                data = [json.loads(x.MeasurementsJSON) for x in valid_samples]
                rs_series["dB"] = []
                rs_series["pitch"] = []
            ret.append(rs_series)

            session.commit()
        
        return ret

'''
This function should return the amount of sound exposed to a single officer
Over a specific time period. 
WIP
'''
@app.get("/officer/{officer_id}/")
def query_officer(officer_id: int, start_time: Optional[int] = None, end_time: Optional[int] = None):
    with Session(engine) as session:
        if not start_time:
            start_time = time.time() - 5*60
        if not end_time:
            end_time = time.time()
        Officer = session.exec(select(models.Officer).where(models.Officer.ID == officer_id)).one()
        MovementEvents = session.exec(select(models.MovementEvent).where(
            models.MovementEvent.OfficerID == officer_id,
            start_time < models.MovementEvent.Timestamp,
            end_time > models.MovementEvent.Timestamp
            )).all()

        if len(MovementEvents) < 1:
            return []

        # Calculate intersection of MovementEvents and Samples in that room
        timestamps = []
        dbs = []
        pitches = []
        e = MovementEvents[0]
        for e in MovementEvents:
            # we have changed room, so calculate sound exposure in cur_room
            # since enter_time til now
            # get the AVERAGE sound/pitch because there are multiple sensors in the room
            # assumption - data comes in every second
            RoomSensors = session.exec(select(models.RoomSensor).where(models.RoomSensor.RoomID == e.RoomID)).all()
            for rs in RoomSensors:
                valid_samples = session.exec(select(models.Sample).where(
                    models.Sample.RoomSensorID == rs.ID,
                    start_time <= models.Sample.Timestamp,
                    e.Timestamp >= models.Sample.Timestamp
                )).all()
                timestamps.extend([x.Timestamp for x in valid_samples])
                data = [json.loads(x.MeasurementsJSON) for x in valid_samples]
                dbs.extend([x['dB'] for x in data])
                pitches.extend([x['pitch'] for x in data])

            start_time = e.Timestamp

        # remove duplicates by taking averages
        for i, t in enumerate(timestamps):
            dups = [idx+i for idx, t1 in enumerate(timestamps[i+1:]) if t1 == t]
            if not dups:
                continue
            db_dups = []
            pitch_dups = []
            for dup in dups:
                db_dups.append(dbs[dup])
                pitch_dups.append(pitches[dup])
                del dbs[dup]
                del pitches[dup]
                del timestamps[dup]
            dbs[i] = sum(db_dups)/len(db_dups)
            pitches[i] = sum(pitch_dups)/len(pitch_dups)
        print(len(timestamps), len(dbs), len(pitches))
            
        rs_series = {"OfficerID": officer_id, "OfficerName":Officer.Name, 'x':timestamps, "dB":dbs, "pitches":pitches}
        return rs_series


@app.post("/set_notifications/{room_id}/")
async def query_update_nots(room_id: int, request: Request):
    data = await request.body()

    json_data = json.loads(data)

    max_db = json_data["MaxDB"]
    max_pitch = json_data["MaxPitch"]

    with Session(engine) as session:
        session.exec(update(models.Room).where(models.Room.ID == room_id).values(MaxDB=max_db, MaxPitch=max_pitch))
        session.commit()
    
# this show retrive a list of notifications that have not been marked as seen
@app.get("/notifications/")
def notification_queue(room_id: Optional[int]):
    with Session(engine) as session:
        if room_id:
            notifications = session.exec(select(models.Notification).where(
                models.Notification.RoomID == room_id,
                models.Notification.Seen == False
            )).all()
            return notifications
        else:
            notifications = session.exec(select(models.Notification).where(
                models.Notification.Seen == False
            )).all()
            return notifications

@app.post("/seen_notification/")
async def mark_as_seen(room_id: int, request: Request):
    data = await request.body()
    json_data = json.loads(data)
    rid = int(json_data["ID"])
    with Session(engine) as session:
        session.exec(update(models.Notification).where(models.Notification.ID == room_id).values(Seen=True))
        session.commit()
 
@app.get("/sensor/{sensor_id}/")
def query_sensor(room_id: int, start_time: int, end_time: int):
    with Session(engine) as session:
        roomSensors = session.exec(select(models.RoomSensor).where(models.RoomSensor.RoomID == room_id)).all()
        return [x.Samples for x in roomSensors]


@app.get("/notification_history/{room_id}/")
def query_nots(room_id: int, start_time: int = time.time() - 5 * 60, end_time: int = time.time()):
    with Session(engine) as session:
        Room = session.exec(select(models.Room).where(models.Room.ID == room_id)).one()
        ret = []

        max_db = Room.MaxDB
        max_pitch = Room.MaxPitch

        for rs in Room.RoomSensors:
            rs_series = {"SensorID": rs.SensorB.ID, "SensorName":rs.SensorB.Name}
            rs_series["notifications"] = []

            rs_series["max_db"] = max_db
            rs_series["max_pitch"] = max_pitch

            for item in rs.Samples:
                if json.loads(item.MeasurementsJSON)['dB'] > max_db and item.NotificationSeen:
                    rs_series["notifications"].append({"time": item.Timestamp, "msg": "High decibal warning"})
                
                if json.loads(item.MeasurementsJSON)['pitch'] > max_pitch and item.NotificationSeen:
                    rs_series["notifications"].append({"time": item.Timestamp, "msg": "High pitch warning"})


            ret.append(rs_series)
        return ret
