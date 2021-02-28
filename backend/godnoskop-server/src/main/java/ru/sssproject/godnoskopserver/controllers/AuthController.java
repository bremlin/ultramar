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
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Godnoskop)) {
            Statement statement = connection.createStatement();
            String tableName = "\"user\"";
            String query = String.format("select id from %s where login = '%s' and pass = md5('%s')",
                    tableName, request.getLogin(), request.getPassword());
            ResultSet resultSet = statement.executeQuery(query);
            while (resultSet.next()) {
                userId = resultSet.getInt(1);
                return new User(userId, request.getLogin());
            }

//            String getUserQuery = String.format("select * from %s where id = %s", tableName, userId);
//            resultSet = statement.executeQuery(getUserQuery);
//            while (resultSet.next()) {
//                return new User(userId, resultSet);
//            }
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
        String tableName = "\"user_roles\"";
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Godnoskop)) {
            Statement statement = connection.createStatement();
            String query = String.format("SELECT role_id from %s where user_id = %s", tableName, request.getId());
            ResultSet resultSet = statement.executeQuery(query);
            while (resultSet.next()) {
                roleList.add(new Role(resultSet.getInt(1)));
            }
            for (Role role : roleList) {
                System.out.println("role: " + role.getId());
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return roleList;
    }
}