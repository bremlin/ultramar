package ru.sssproject.godnoskopserver.sql;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class SqlConnector {

    public static Connection ConnectDb(DB type) {
        try {
            Class.forName("org.postgresql.Driver");

            switch (type) {
                case Godnoskop:
                    return DriverManager.getConnection("jdbc:postgresql://" + "134.209.84.32:5432/gorik", "postgrebremlin", "prostome");
            }
            return null;
        } catch (ClassNotFoundException | SQLException ex) {
            System.out.println("wrong connection");
            return null;
        }
    }

    public enum DB {
        Godnoskop
    }
}