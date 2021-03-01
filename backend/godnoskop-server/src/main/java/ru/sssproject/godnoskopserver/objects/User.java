package ru.sssproject.godnoskopserver.objects;

import java.sql.ResultSet;
import java.sql.SQLException;

public class User extends ResponseObject{

    private Integer id;

    private String login;
    private String password;
    private String name;

    public User(Integer id, String login) {
        this.id = id;
        this.login = login;
        this.name = login;

    }

    public User(ResultSet rs) throws SQLException {
        this.id = rs.getInt("id");
        this.login = rs.getString("login");
        this.name = rs.getString("user_name");
    }

    public User(Integer id, ResultSet rs) throws SQLException {
        this.id = id;
        this.login = rs.getString("login");
        this.name = rs.getString("name");
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
