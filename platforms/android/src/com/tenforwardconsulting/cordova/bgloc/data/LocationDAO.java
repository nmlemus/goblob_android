package com.tenforwardconsulting.cordova.bgloc.data;

import java.util.Date;

public interface LocationDAO {
    public String getPhone();
    public Location[] getAllLocations();
    public boolean persistLocation(Location l);
    public void deleteLocation(Location l);
    public String dateToString(Date date);
}
