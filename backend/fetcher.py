"""fetcher.py
Caleb Cheng
24/08/2021

The purpose of this module is to provide a generic class that 
can pull data off a SPECIFIC wireless sound meter in a SPECIFIC room.

The generic class is then implemented for the sim_api wireless sensor simulator
"""

import requests
import time
from threading import Thread


"""
LevelFetcher is a generic interface for fetching data from a web server using requests
Period
    - Successive time between calls in seconds
Url
    - endpoint location
    - default = 127.0.0.1:8000    
"""
class LevelFetcher(Thread):
    def __init__(self, callback, to_fetch, period, url):
        Thread.__init__(self)
        self.daemon = True
        self.period = period
        self.running = False
        self.callback = callback
        self.to_fetch = to_fetch
        self.url = url
        self.session = requests.session()
    
    """
    returns a single dictionary {db, pitch} for a specific sensor 
    """
    
    def fetch(self, sensor_id, room_id):
        pass
        
    """
    will fetch sensors in to_fetch periodically

    callback
        - function that handles the response
        - response is a list [{db, pitch}]
    to_fetch
        - A list of tuples (sensor_id, room_id)
    """
    def run(self):
        self.running = True
        while self.running:
            result = []
            for sid, rid in self.to_fetch:
                data = self.fetch(sid, rid)
                data['sensor_id'] = sid
                data['room_id'] = rid
                result.append(data)
                
            self.callback(result)
            time.sleep(self.period)
        
    def stop(self):
        self.running = False
            
class FakeFetcher(LevelFetcher):
    def fetch(self, sensor_id, room_id):
        r = self.session.get(f"{self.url}/{room_id}/{sensor_id}/")
        return r.json()

