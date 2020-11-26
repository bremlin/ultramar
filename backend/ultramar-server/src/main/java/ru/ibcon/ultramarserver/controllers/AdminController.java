package ru.ibcon.ultramarserver.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.ibcon.ultramarserver.objects.*;
import ru.ibcon.ultramarserver.requestmodel.DirectoryRequest;
import ru.ibcon.ultramarserver.requestmodel.RoleRequest;
import ru.ibcon.ultramarserver.requestmodel.UserRequest;
import ru.ibcon.ultramarserver.sql.SqlConnector;

import javax.validation.Valid;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@RestController
public class AdminController {

    @PostMapping("/getusers")
    public List<User> getUsers() {
        List<User> users = new ArrayList<>();
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM getusersexwithflags()");
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

    @PostMapping("/getroles")
    public List<Role> getRoles() {
        List<Role> roles = new ArrayList<>();
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM getroles()");
            while (resultSet.next()) {
                Role role = new Role(resultSet);
                roles.add(role);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return roles;
    }

    @PostMapping("/getactivitytypes")
    public List<ActivityType> getActivityTypes() {
        //TODO при появлении функции добавить её
        List<ActivityType> types = new ArrayList<>();
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM getroles()");
            while (resultSet.next()) {
                ActivityType activityType = new ActivityType(resultSet);
                types.add(activityType);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return types;
    }

    @PostMapping("/getbuildings")
    public List<Building> getBuildings() {
        List<Building> buildings = new ArrayList<>();
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM ref_objects_get()");
            while (resultSet.next()) {
                Building building = new Building(resultSet);
                buildings.add(building);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return buildings;
    }

    @PostMapping("/addbuilding")
    public Integer addBuilding(@Valid @RequestBody DirectoryRequest request) {
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM " +
                    "ref_object_add('" + request.getCode() +
                    "', '" + request.getName() + "')");
            while (resultSet.next()) {
                return resultSet.getInt(1);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @PostMapping("/delbuilding")
    public Boolean removeBuilding(@Valid @RequestBody DirectoryRequest request) {
        System.out.println("delbuilding: ");
        System.out.println("id: ");
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM ref_object_delbyid(" + request.getId() + ")");
            while (resultSet.next()) {
                return resultSet.getBoolean(1);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @PostMapping("/getunitom")
    public List<UnitOM> getUnitsOM() {
        //todo при появлении функции добавить её
        List<UnitOM> unitOMS = new ArrayList<>();
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM getroles()");
            while (resultSet.next()) {
                UnitOM unitOM = new UnitOM(resultSet);
                unitOMS.add(unitOM);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return unitOMS;
    }

    @PostMapping("/setrole")
    public Integer setRole(@Valid @RequestBody RoleRequest request) {
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM " +
                    "addroleuser(" + request.getUserId() + ", " +
                    request.getId() + ")");
            while (resultSet.next()) {
                return resultSet.getInt(1);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @PostMapping("/delroleuser")
    public Boolean removeRoleUser(@Valid @RequestBody RoleRequest request) {
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM " +
                    "delroleuser(" + request.getUserId() + ", " +
                    request.getId() + ")");
            while (resultSet.next()) {
                return resultSet.getBoolean(1);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @PostMapping("/deluser")
    public boolean delUser(@Valid @RequestBody UserRequest request) {
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM " + "deluser(" + request.getId() + ")");
            while (resultSet.next()) {
                return resultSet.getBoolean(1);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @PostMapping("/adduser")
    public Integer addUser(@Valid @RequestBody UserRequest request) {
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM " +
                    "adduser('" + request.getLogin() + "', " +
                    "'" + request.getUserName() + "', " +
                    "'" + request.getUserSurName() + "', " +
                    request.isFirstFlag() + ")");
            while (resultSet.next()) {
                return resultSet.getInt(1);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @PostMapping("/updateuser")
    public boolean updateUser(@Valid @RequestBody UserRequest request) {
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM " +
                    "updateuser(" + request.getId() + ", " +
                    "'" + request.getLogin() + "', " +
                    "'" + request.getUserName() + "', " +
                    "'" + request.getUserSurName() + "', " +
                    request.isFirstFlag() + ")");
            while (resultSet.next()) {
                return resultSet.getBoolean(1);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @PostMapping("/setpassword")
    public boolean setPassword(@Valid @RequestBody UserRequest request) {
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM " +
                    "userchangepassword(" + request.getId() + ", " +
                    "'" + request.getPassword() + "')");
            while (resultSet.next()) {
                return resultSet.getBoolean(1);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}