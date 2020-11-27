package ru.sssproject.godnoskopserver.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.sssproject.godnoskopserver.objects.Role;
import ru.sssproject.godnoskopserver.objects.User;
import ru.sssproject.godnoskopserver.requestmodel.RoleRequest;
import ru.sssproject.godnoskopserver.requestmodel.UserRequest;
import ru.sssproject.godnoskopserver.sql.SqlConnector;

import javax.validation.Valid;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@RestController
public class AuthController {

    @PostMapping("/auth")
    public User getAuth(@Valid @RequestBody UserRequest request) {
        Integer userId = null;
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM " +
                    "canLogin('" + request.getLogin() +
                    "', '" + request.getPassword() + "')");
            while (resultSet.next()) {
                userId = resultSet.getInt(1);
            }

            resultSet = statement.executeQuery("SELECT * FROM " +
                    "getuserbyid(" + userId + ")");
            while (resultSet.next()) {
                return new User(userId, resultSet);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @PostMapping("/getrole")
    public List<Role> getRole(@Valid @RequestBody RoleRequest request) {
        List<Role> roleList = new ArrayList<>();
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM " +
                    "getrolebyuserid('" + request.getId() + "')");
            while (resultSet.next()) {
                Array array = resultSet.getArray(1);
                Integer[] intArray = (Integer[]) array.getArray();
                for (Integer integer : intArray) {
                    roleList.add(new Role(integer));
                }
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return roleList;
    }
}