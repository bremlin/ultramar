package ru.ibcon.ultramarserver.objects;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UnitOM extends DirectoryClass{

    public UnitOM(ResultSet resultSet) throws SQLException {
        super(resultSet);
    }
}