package ru.ibcon.ultramarserver.objects;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Building extends DirectoryClass{

    public Building(ResultSet resultSet) throws SQLException {
        super(resultSet);
    }
}