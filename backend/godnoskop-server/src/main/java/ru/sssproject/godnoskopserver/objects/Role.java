package ru.sssproject.godnoskopserver.objects;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Role extends ResponseObject{

    private Long id;
    private String name;

    public Role(long id) {
        this.id = id;
    }

    public Role(ResultSet resultSet) throws SQLException {
        this.id = resultSet.getLong("role_id");
        this.name = resultSet.getString("role_name");
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}