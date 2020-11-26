package ru.ibcon.ultramarserver.sql;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class SqlConnector {

    public static Connection ConnectDb(DB type) {
        try {
            Class.forName("org.postgresql.Driver");

            switch (type) {
                case Ultramar:
                    return DriverManager.getConnection("jdbc:postgresql://" + "192.168.1.190:5432/umdb", "umpu", "HxLj309A2HCO");
//            return DriverManager.getConnection("jdbc:postgresql://" + "f.ibcon.ru:1971/umdb", "umpu", "HxLj309A2HCO");
            }
            return null;
        } catch (ClassNotFoundException | SQLException ex) {
            System.out.println("wrong connection");
            return null;
        }
    }

    public enum DB {
        Ultramar
    }
}