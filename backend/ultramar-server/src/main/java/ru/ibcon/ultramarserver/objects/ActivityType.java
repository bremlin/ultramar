package ru.ibcon.ultramarserver.objects;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ActivityType extends DirectoryClass {

    public ActivityType(ResultSet resultSet) throws SQLException {
        super(resultSet);
    }

}