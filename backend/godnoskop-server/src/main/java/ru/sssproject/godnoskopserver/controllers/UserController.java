package ru.sssproject.godnoskopserver.controllers;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.sssproject.godnoskopserver.objects.User;
import ru.sssproject.godnoskopserver.sql.*;

@RestController
public class UserController {

    @PostMapping("/getuserlist")
    public List<User> getUsers() {
        List<User> users = new ArrayList<>();
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Godnoskop)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM user");
            while (resultSet.next()) {
                User user = new User(resultSet);
                users.add(user);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return users;
    }

}
