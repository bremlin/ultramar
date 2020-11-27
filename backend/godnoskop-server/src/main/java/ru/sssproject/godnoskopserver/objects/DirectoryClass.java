package ru.sssproject.godnoskopserver.objects;

import java.sql.ResultSet;
import java.sql.SQLException;

public class DirectoryClass {

    private Integer id;

    private String name;
    private String shortName;

    public DirectoryClass(ResultSet resultSet) throws SQLException {
        this.id = resultSet.getInt("unit_id");
        this.name = resultSet.getString("unit_name");
        this.shortName = resultSet.getString("unit_code");
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

}
