package ru.sssproject.godnoskopserver.objects;

import java.sql.ResultSet;
import java.sql.SQLException;

public class User extends ResponseObject{

    private Integer id;

    private String login;
    private String password;
    private String name;
    private String surname;

    private boolean firstFlag;

    public User(Integer id, String login) {
        this.id = id;
        this.login = login;
    }

    public User(ResultSet rs) throws SQLException {
        this.id = rs.getInt("user_id");
        this.login = rs.getString("user_login");
        this.name = rs.getString("user_name");
        this.surname = rs.getString("user_surname");
        this.firstFlag = rs.getBoolean("first_flag");
    }

    public User(Integer id, ResultSet rs) throws SQLException {
        this.id = id;
        this.login = rs.getString("user_login");
        this.name = rs.getString("user_name");
        this.surname = rs.getString("user_surname");
        this.firstFlag = rs.getBoolean("first_flag");
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

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public boolean isFirstFlag() {
        return firstFlag;
    }

    public void setFirstFlag(boolean firstFlag) {
        this.firstFlag = firstFlag;
    }
}
