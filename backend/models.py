import datetime as _dt
import sqlalchemy as _sql
import passlib.hash as _hash
import database as _database

class Users(_database.Base):
    __tablename__ = "users"
    uid = _sql.Column(_sql.Integer, primary_key=True, index=True)
    email = _sql.Column(_sql.String, index=True)
    hashed_password = _sql.Column(_sql.Integer)

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.hashed_password)
    
class Trips(_database.Base):
    __tablename__ = "trips"
    tripID = _sql.Column(_sql.String, unique=True, primary_key=True, index=True)
    uid = _sql.Column(_sql.Integer, _sql.ForeignKey("users.uid"), index=True)
    driverID = _sql.Column(_sql.Integer, unique=True, index=True)
    driverNO = _sql.Column(_sql.String, unique=True, index=True)
    srcLoc = _sql.Column(_sql.String)
    src = _sql.Column(_sql.String)
    destLoc = _sql.Column(_sql.String)
    dest = _sql.Column(_sql.String)
    

class Locations(_database.Base):
    __tablename__ = "locations"
    locID = _sql.Column(_sql.Integer, primary_key=True, index=True)
    ownerID = _sql.Column(_sql.Integer, index=True)
    ownerNO = _sql.Column(_sql.String, index=True)
    locLoc = _sql.Column(_sql.String)

class Assets(_database.Base):
    __tablename__ = "assets"
    assetID = _sql.Column(_sql.Integer, primary_key=True, index=True)
    tripID = _sql.Column(_sql.Integer, _sql.ForeignKey("trips.tripID"), index=True)
    assetName = _sql.Column(_sql.String)
    assetType = _sql.Column(_sql.String)
    src = _sql.Column(_sql.String)

class Devices(_database.Base):
    __tablename__ = "devices"
    deviceID = _sql.Column(_sql.Integer, unique=True, primary_key=True, index=True)
    tripID = _sql.Column(_sql.Integer, _sql.ForeignKey("trips.tripID"), index=True)
    deviceName = _sql.Column(_sql.String)
    status = _sql.Column(_sql.String)

class Sensors(_database.Base):
    __tablename__ = "sensors"
    entryID = _sql.Column(_sql.Integer, primary_key=True)
    timestamp = _sql.Column(_sql.DateTime, default=_dt.datetime.utcnow, primary_key=True)
    deviceID = _sql.Column(_sql.Integer, _sql.ForeignKey("devices.deviceID"))
    temperature = _sql.Column(_sql.Float)
    humidity = _sql.Column(_sql.Float)
    pressure = _sql.Column(_sql.Float)
    light = _sql.Column(_sql.Float)
    shock = _sql.Column(_sql.Float)
    latitude = _sql.Column(_sql.String)
    longitude = _sql.Column(_sql.String)

class Alarms(_database.Base):
    __tablename__ = "alarms"
    alarmID = _sql.Column(_sql.Integer, unique=True, primary_key=True)
    deviceID = _sql.Column(_sql.Integer, _sql.ForeignKey("devices.deviceID"),  index=True)
    entryID = _sql.Column(_sql.Integer, _sql.ForeignKey("sensors.entryID"),  index=True)
    desc = _sql.Column(_sql.String)
    timestamp = _sql.Column(_sql.DateTime, default=_dt.datetime.utcnow, primary_key=True)