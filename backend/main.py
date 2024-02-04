from typing import List
import fastapi as _fastapi
import fastapi.security as _security
import sqlalchemy.orm as _orm
import services as _services, schemas as _schemas, models as _models

app = _fastapi.FastAPI()

channel_id = "2309020"
read_api_key = "https://api.thingspeak.com/channels/2309020/feeds.json?results=1"

@app.post("/api/users")
async def create_user(user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        raise _fastapi.HTTPException(status_code=400, detail="Email already in use")

    user = await _services.create_user(user, db)

    return await _services.create_token(user)

@app.post("/api/token")
async def generate_token(form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    user = await _services.authUser(form_data.username, form_data.password, db)
    if not user:
        raise _fastapi.HTTPException(status_code=401, detail="Invalid Credentials")
    return await _services.create_token(user)

@app.get("/api/users/me", response_model=_schemas.User)
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user 
# ---------------------------------------------------------------------------------------------------------------------------------------------------------

@app.post("/api/trips", response_model=_schemas.Trips)
async def create_trips(trip: _schemas.Trips, user: _schemas.User = _fastapi.Depends(_services.get_current_user), db: _orm.Session = _fastapi.Depends(_services.get_db),):
    return await _services.create_trips(user=user, trip=trip, db=db)

@app.get("/api/trips", response_model=List[_schemas.Trips])
async def get_trips(user: _schemas.User = _fastapi.Depends(_services.get_current_user), db: _orm.Session = _fastapi.Depends(_services.get_db),):
    return await _services.get_trips(user=user, db=db)

@app.get("/api/trips/total", response_model= int )
async def get_total_trips(user: _schemas.User = _fastapi.Depends(_services.get_current_user), db: _orm.Session = _fastapi.Depends(_services.get_db),):
    return await _services.get_total_trips(user=user, db=db)

# ---------------------------------------------------------------------------------------------------------------------------------------------------------

@app.post("/api/locs", response_model=_schemas.Locations)
async def create_wares( ware: _schemas.Locations, db: _orm.Session = _fastapi.Depends(_services.get_db),):
    return await _services.create_locs(db=db, ware=ware)

@app.get("/api/locs", response_model=List[_schemas.Locations])
async def get_locs(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_locs( db=db)

# ---------------------------------------------------------------------------------------------------------------------------------------------------------

@app.post("/api/devices", response_model=_schemas.Devices)
async def create_devices( device: _schemas.Devices, trip: _schemas.Trips, user: _schemas.User = _fastapi.Depends(_services.get_current_user), db: _orm.Session = _fastapi.Depends(_services.get_db),):
    return await _services.create_devices(user=user, db=db, device=device, trip=trip)

@app.get("/api/devices", response_model=List[_schemas.Devices])
async def get_devices(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_all_items(db, model=_models.Devices)

# ---------------------------------------------------------------------------------------------------------------------------------------------------------

@app.post("/api/assets", response_model=_schemas.Assets)
async def create_assets( asset: _schemas.Assets, trip: _schemas.Trips, user: _schemas.User = _fastapi.Depends(_services.get_current_user), db: _orm.Session = _fastapi.Depends(_services.get_db),):
    return await _services.create_assets(user=user, db=db, asset=asset, trip=trip)

@app.get("/api/assets", response_model=List[_schemas.Assets])
async def get_assets(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_all_items(db, _models.Assets)
# ---------------------------------------------------------------------------------------------------------------------------------------------------------

@app.post("/api/sensors", response_model=_schemas.Sensors)
async def create_sensors(device: _schemas.Devices, sens: _schemas.Sensors, db: _orm.Session = _fastapi.Depends(_services.get_db),):
    return _services.create_sensors(channel_id=channel_id, read_api_key=read_api_key, db=db, device=device, sens=sens)

@app.get("/api/sensors", response_model=List[_schemas.Sensors])
async def get_assets(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_all_items(db, _models.Sensors)

# ---------------------------------------------------------------------------------------------------------------------------------------------------------

@app.post("/api/alarms", response_model=_schemas.Alarms)
async def create_alarms( device: _schemas.Devices,sens: _schemas.Sensors, alarm: _schemas.Alarms, db: _orm.Session = _fastapi.Depends(_services.get_db),):
    return await _services.create_alarms( db=db, device=device, sens=sens, alarm=alarm)

@app.get("/api/alarms", response_model=List[_schemas.Alarms])
async def get_alarms(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_all_items(db, _models.Alarms)

@app.get("/api/alarms/total", response_model=int)
async def get_total_alarms(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_total_alarms(db, _models.Alarms)

# ---------------------------------------------------------------------------------------------------------------------------------------------------------

@app.get("/api/trips/{trip_id}", status_code=200)
async def get_trip( trip_id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_item(item_id=trip_id, db=db, item_model=_models.Trips,item_id_attr=_models.Trips.tripID)

@app.get("/api/locs/{loc_id}", status_code=200)
async def get_ware(loc_id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_item(item_id=loc_id, db=db, item_model=_models.Locations,item_id_attr=_models.Locations.locID)

@app.get("/api/devices/{device_id}", status_code=200)
async def get_device(device_id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_item(item_id=device_id, db=db, item_model=_models.Devices,item_id_attr=_models.Devices.deviceID)

@app.get("/api/assets/{asset_id}", status_code=200)
async def get_asset(asset_id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_item(item_id=asset_id, db=db, item_model=_models.Assets,item_id_attr=_models.Assets.assetID)

@app.get("/api/sensors/{entry_id}", status_code=200)
async def get_entry(entry_id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_item(item_id=entry_id, db=db, item_model=_models.Sensors,item_id_attr=_models.Sensors.entryID)

@app.get("/api/alarms/{alarm_id}", status_code=200)
async def get_alarm(alarm_id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_item(item_id=alarm_id, db=db, item_model=_models.Alarms,item_id_attr=_models.Alarms.alarmID)

# ---------------------------------------------------------------------------------------------------------------------------------------------------------

@app.delete("/api/trips/{trip_id}", status_code=204)
async def delete_trip( trip_id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.delete_item(item_id=trip_id, db=db, item_model=_models.Trips,item_id_attr=_models.Trips.tripID)

@app.delete("/api/locs/{ware_id}", status_code=204)
async def delete_ware(ware_id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.delete_item(item_id=ware_id, db=db, item_model=_models.Locations,item_id_attr=_models.Locations.locID)

@app.delete("/api/devices/{device_id}", status_code=204)
async def delete_device(device_id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.delete_item(item_id=device_id, db=db, item_model=_models.Devices,item_id_attr=_models.Devices.deviceID)

@app.delete("/api/assets/{asset_id}", status_code=204)
async def delete_asset(asset_id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.delete_item(item_id=asset_id, db=db, item_model=_models.Assets,item_id_attr=_models.Assets.assetID)

@app.delete("/api/sensors/{entry_id}", status_code=204)
async def delete_entry(entry_id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.delete_item(item_id=entry_id, db=db, item_model=_models.Sensors,item_id_attr=_models.Sensors.entryID)

@app.delete("/api/alarms/{alarm_id}", status_code=204)
async def delete_alarm(alarm_id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.delete_item(item_id=alarm_id, db=db, item_model=_models.Alarms,item_id_attr=_models.Alarms.alarmID)

# ---------------------------------------------------------------------------------------------------------------------------------------------------------

@app.get("/api")
async def root():
    return {"message": "Awesome CCM Application"}

