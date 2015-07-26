package com.tenforwardconsulting.cordova.bgloc.data.sqlite;


import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

public class PhoneOpenHelper extends SQLiteOpenHelper{
    private static final String SQLITE_DATABASE_NAME = "goblob.db";
    private static final int DATABASE_VERSION = 1;
    public static final String LOCATION_TABLE_NAME = "profile_table";
    private static final String LOCATION_TABLE_COLUMNS = 
        " id INTEGER PRIMARY KEY AUTOINCREMENT," +
        " profile_name TEXT," +
        " profile_status TEXT";
    private static final String LOCATION_TABLE_CREATE =
        "CREATE TABLE IF NOT EXIST" + LOCATION_TABLE_NAME + " (" +
        LOCATION_TABLE_COLUMNS +
        ");";

    private Connection conn;
    private Statement stm;


    public PhoneOpenHelper(Context context) {
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
            // Drop older table if existed
            db.execSQL("DROP TABLE IF EXISTS " + LOCATION_TABLE_NAME);

            // Create tables again
            onCreate(db);
        }

        public String getProfileName() {
                String profile_name;
                String selectQuery = "SELECT  * FROM " + LOCATION_TABLE_NAME;

                SQLiteDatabase db = this.getWritableDatabase();
                Cursor cursor = db.rawQuery(selectQuery, null);

                if (cursor.moveToFirst()) {
                       profile_name = cursor.getString(1);
                }


                return profile_name;
            }
}