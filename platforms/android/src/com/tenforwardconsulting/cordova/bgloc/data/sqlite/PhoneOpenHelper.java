package com.tenforwardconsulting.cordova.bgloc.data.sqlite;


import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

public class PhoneOpenHelper extends SQLiteOpenHelper {
    private static final String DATABASE_NAME = "goblob.db";
    private static final int DATABASE_VERSION = 1;
    public static final String LOCATION_TABLE_NAME = "profile_table";
    private static final String LOCATION_TABLE_COLUMNS = 
        " id INTEGER PRIMARY KEY AUTOINCREMENT," +
        " profile_name TEXT," +
        " profile_status TEXT";
    private static final String LOCATION_TABLE_CREATE =
        "CREATE TABLE" + LOCATION_TABLE_NAME + " (" +
        LOCATION_TABLE_COLUMNS +
        ");";


        PhoneOpenHelper(Context context) {
            super(context, DATABASE_NAME, null, DATABASE_VERSION);
            //3rd argument to be passed is CursorFactory instance
        }

        // Creating Tables
        @Override
        public void onCreate(SQLiteDatabase db) {
            db.execSQL(LOCATION_TABLE_CREATE);
        }

        // Upgrading database
        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

        }


}