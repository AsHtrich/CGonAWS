import functools
import fastapi as _fastapi
import fastapi.security as _security
import datetime as _dt
import sqlalchemy.orm as _orm
import passlib.hash as _hash
import database as _database, models as _models, schemas as _schemas
import jwt as _jwt
import thingspeak
import json
from sqlalchemy import func


oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")
JWT_SECRET = "myjwtsecret"

def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)

def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_user_by_email(email: str, db: _orm.Session):
    return db.query(_models.Users).filter(_models.Users.email == email).first()

async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    user_obj = _models.Users(email=user.email, hashed_password=_hash.bcrypt.hash(user.hashed_password))
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj

async def authUser(email:str, password: str, db: _orm.Session):
    user = await get_user_by_email(db=db, email=email)

    if not user:
        return False
    if not user.verify_password(password):
        return False
    return user

async def create_token(user: _models.Users):
    user_obj = _schemas.User.model_validate(user)

    token = _jwt.encode(user_obj.model_dump(), JWT_SECRET)

    return dict(access_token = token, token_type="bearer")

async def get_current_user(db: _orm.Session= _fastapi.Depends(get_db), token: str= _fastapi.Depends(oauth2schema)):
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user= db.query(_models.Users).get(payload["uid"])
    except:
        raise _fastapi.HTTPException(status_code=401, detail="Invalid Email or Password")
    
    return _schemas.User.model_validate(user)
# ---------------------------------------------------------------------------------------------------------------------------------------------------------

async def create_trips(trip: _schemas.Trips, user: _schemas.User, db: _orm.Session):
    existing_trip = db.query(_models.Trips).filter(_models.Trips.tripID == trip.tripID).first()
    if existing_trip:
        raise _fastapi.HTTPException(status_code=400, detail="Duplicate tripID")
    
    existing_driver = db.query(_models.Trips).filter(_models.Trips.driverID == trip.driverID).first()
    if existing_driver:
        raise _fastapi.HTTPException(status_code=400, detail="Driver assigned to another trip!")
    
    trip_obj = _models.Trips(
        tripID=trip.tripID, driverID=trip.driverID, driverNO=trip.driverNO, src=trip.src, srcLoc=trip.srcLoc, dest=trip.dest, destLoc=trip.destLoc, uid=user.uid
    )
    db.add(trip_obj)
    db.commit()
    db.refresh(trip_obj)
    return trip_obj

async def get_trips(user: _schemas.User, db: _orm.Session):
    allTrips = db.query(_models.Trips).filter_by(uid=user.uid)
    return list(map(_schemas.Trips.model_validate, allTrips))

async def get_total_trips(user: _schemas.User, db: _orm.Session):
    allTrips = db.query(_models.Trips).filter_by(uid=user.uid)
    return len(list(map(_schemas.Trips.model_validate, allTrips)))

# ---------------------------------------------------------------------------------------------------------------------------------------------------------

async def create_locs(ware: _schemas.Locations, db: _orm.Session):
    
    loc_obj = _models.Locations(
        locID=ware.locID, ownerID=ware.ownerID, ownerNO=ware.ownerNO, locLoc=ware.locLoc
    )
    db.add(loc_obj)
    db.commit()
    db.refresh(loc_obj)
    return loc_obj

async def get_locs(db: _orm.Session):
    alllocs = db.query(_models.Locations).all()
    return list(map(_schemas.Locations.model_validate, alllocs))
# ---------------------------------------------------------------------------------------------------------------------------------------------------------

async def create_devices(trip: _schemas.Trips, device: _schemas.Devices, user: _schemas.User, db: _orm.Session):
    
    existing_device = db.query(_models.Devices).filter(_models.Devices.deviceID == device.deviceID).first()
    if existing_device:
        raise _fastapi.HTTPException(status_code=400, detail="Duplicate deviceID")
    
    existing_trip = db.query(_models.Devices).filter(_models.Devices.tripID == device.tripID).first() 
    if existing_trip:
        raise _fastapi.HTTPException(status_code=400, detail="tripID already assigned to another device")
    
    trip_obj = db.query(_models.Trips).filter(_models.Trips.tripID == trip.tripID).first() 
    if not trip_obj:
        raise _fastapi.HTTPException(status_code=400, detail="Invalid tripID")
    
    device_obj = _models.Devices(
        deviceID=device.deviceID, status=device.status, deviceName=device.deviceName, tripID=trip.tripID
    )
    db.add(device_obj)
    db.commit()
    db.refresh(device_obj)
    return device_obj
# ---------------------------------------------------------------------------------------------------------------------------------------------------------

async def create_assets(trip: _schemas.Trips, asset: _schemas.Assets, user: _schemas.User, db: _orm.Session):
    
    existing_asset = db.query(_models.Assets).filter(_models.Assets.assetID == asset.assetID).first()
    if existing_asset:
        raise _fastapi.HTTPException(status_code=400, detail="Duplicate assetID")
    
    existing_trip = db.query(_models.Assets).filter(_models.Assets.tripID == asset.tripID).first() 
    if existing_trip:
        raise _fastapi.HTTPException(status_code=400, detail="tripID already assigned to another asset")
    
    trip_obj = db.query(_models.Trips).filter(_models.Trips.tripID == trip.tripID).first() 
    if not trip_obj:
        raise _fastapi.HTTPException(status_code=400, detail="Invalid tripID")
    
    asset_obj = _models.Assets(assetID=asset.assetID, src=asset.src, assetName=asset.assetName, assetType=asset.assetType, tripID=trip.tripID)
    db.add(asset_obj)
    db.commit()
    db.refresh(asset_obj)
    return asset_obj
# ---------------------------------------------------------------------------------------------------------------------------------------------------------

async def create_alarms(alarm: _schemas.Alarms, sens: _schemas.Sensors, device:_schemas.Devices,  db: _orm.Session):
    
    existing_alarm = db.query(_models.Alarms).filter(_models.Alarms.alarmID == alarm.alarmID).first()
    if existing_alarm:
        raise _fastapi.HTTPException(status_code=400, detail="Duplicate alarmID")
    
    alarm_obj = db.query(_models.Alarms).filter(
    (_models.Alarms.alarmID == alarm.alarmID) & (_models.Alarms.timestamp == alarm.timestamp)).first()
    if alarm_obj is not None:
        raise _fastapi.HTTPException(status_code=400, detail="Entry with the same timestamp and alarmID already exists")

    sensor_obj = db.query(_models.Sensors).filter(_models.Sensors.entryID == sens.entryID).first() 
    if not sensor_obj:
        raise _fastapi.HTTPException(status_code=400, detail="Invalid entryID")
    
    device_obj = db.query(_models.Devices).filter(_models.Devices.deviceID == device.deviceID).first() 
    if not device_obj:
        raise _fastapi.HTTPException(status_code=400, detail="Invalid deviceID")
    alarm_obj = _models.Alarms( entryID=alarm.entryID, alarmID=alarm.alarmID, desc=alarm.desc, deviceID=alarm.deviceID, timestamp=alarm.timestamp)
    db.add(alarm_obj)
    db.commit()
    db.refresh(alarm_obj)
    return alarm_obj
# ---------------------------------------------------------------------------------------------------------------------------------------------------------

async def get_all_items(db: _orm.Session, model: _models._database.Base):
    all_items = db.query(model).all()
    return list(all_items)

async def get_total_alarms(db: _orm.Session, model: _models._database.Base):
    all_items = db.query(model).all()
    return len(list(all_items))

#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#


async def _item_selector(item_id, db, item_model, item_id_attr):
    item = (db.query(item_model).filter(item_id_attr == item_id).first())

    if item is None:
        raise _fastapi.HTTPException(status_code=400, detail=f"{item_model.__name__} does not exist")
    return item

async def get_item(item_id, db, item_model, item_id_attr):
    item = await _item_selector(item_id, db, item_model, item_id_attr)

    return item
# ---------------------------------------------------------------------------------------------------------------------------------------------------------

async def delete_item(item_id, db, item_model, item_id_attr):
    item = await _item_selector(item_id, db, item_model, item_id_attr)

    db.delete(item)
    db.commit()
# ---------------------------------------------------------------------------------------------------------------------------------------------------------
max_alarm_id = 0 
# ---------------------------------------------------------------------------------------------------------------------------------------------------------

def create_sensors(channel_id: int, read_api_key: str, db: _orm.Session, device: _schemas.Devices, sens: _schemas.Sensors ):
    # Connect to ThingSpeak
    channel = thingspeak.Channel(id=channel_id, api_key=read_api_key)

    # Retrieve data from ThingSpeak
    data = channel.get()

    # Parse the JSON response
    parsed_data = json.loads(data)
    
    # Extract the feeds
    feeds = parsed_data['feeds']
    
    max_alarm_id = db.query(func.max(_models.Alarms.alarmID)).scalar() or 0
    for senso in feeds:
        print(senso)
        entry_id = int(senso['entry_id'])
        timestamp = _dt.datetime.strptime(senso['created_at'], "%Y-%m-%dT%H:%M:%SZ")
        temperature = float(senso['field1'])
        print(senso['field2'])
        humidity = senso['field2']
        pressure = round(float(senso['field3'])/101325.0 , 4)
        light = 100
        shock = 100
        latitude = 100
        longitude = 100
        deviceID = 666

        if float(senso['field1']) > 34:
            max_alarm_id += 1 
            alarm_obj = _models.Alarms(
                alarmID=max_alarm_id,
                entryID=int(senso['entry_id']), 
                desc="Exceeded Threshold for Temperature" , 
                deviceID= 666, 
                timestamp=_dt.datetime.strptime(senso['created_at'], "%Y-%m-%dT%H:%M:%SZ"),
                )
            db.add(alarm_obj)
        db.commit()

        if float(senso['field2']) > 90:
            max_alarm_id += 1 
            alarm_obj = _models.Alarms(
                alarmID=max_alarm_id,
                entryID=int(senso['entry_id']), 
                desc="Exceeded Threshold for Humidity" , 
                deviceID= 666, 
                timestamp=_dt.datetime.strptime(senso['created_at'], "%Y-%m-%dT%H:%M:%SZ"),
                )
            db.add(alarm_obj)
        db.commit()

        if float(senso['field3']) > 1.001:
            max_alarm_id += 1 
            alarm_obj = _models.Alarms(
                alarmID=max_alarm_id,
                entryID=int(senso['entry_id']), 
                desc="Exceeded Threshold for Pressure" , 
                deviceID= 666, 
                timestamp=_dt.datetime.strptime(senso['created_at'], "%Y-%m-%dT%H:%M:%SZ"),
                )
            db.add(alarm_obj)
        db.commit()

        

        # Check if the data already exists in the database (based on entryID and timestamp)
        sensor_obj = db.query(_models.Sensors).filter(
            (_models.Sensors.entryID == entry_id) & (_models.Sensors.timestamp == timestamp)
        ).first()

        if sensor_obj is None:
            sens_obj = _models.Sensors(
                entryID=entry_id,
                timestamp=timestamp,
                temperature=temperature,
                pressure=pressure,
                humidity=humidity,
                light=light,
                shock=shock,
                latitude=latitude,
                longitude=longitude,
                deviceID= deviceID
            )
            db.add(sens_obj)
    
    db.commit()
    db.refresh(sens_obj)
    return sens_obj