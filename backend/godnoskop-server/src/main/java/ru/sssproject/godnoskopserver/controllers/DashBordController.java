package ru.sssproject.godnoskopserver.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.sssproject.godnoskopserver.objects.dashbords.KeyProjectEventsDash;
import ru.sssproject.godnoskopserver.objects.dashbords.ProjectProgressVolumeConstruct;
import ru.sssproject.godnoskopserver.objects.dashbords.SmrProgressDash;
import ru.sssproject.godnoskopserver.sql.SqlConnector;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@RestController
public class DashBordController {

    @PostMapping("/getkeyprojectevents")
    public List<KeyProjectEventsDash> getKeyProjectEvents() {
        List<KeyProjectEventsDash> rows = new ArrayList<>();
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Godnoskop)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM widget_keyprojevents()");
            while (resultSet.next()) {
                KeyProjectEventsDash keyProjectEventsDash = new KeyProjectEventsDash();
                keyProjectEventsDash.setObjectName(resultSet.getString("obj_name"));
                keyProjectEventsDash.setTpStart(resultSet.getDate("tp_start"));
                keyProjectEventsDash.setTpEnd(resultSet.getDate("tp_end"));
                keyProjectEventsDash.setDateStart(resultSet.getDate("date_start"));
                keyProjectEventsDash.setDateEnd(resultSet.getDate("date_end"));
                keyProjectEventsDash.setDeviationStart(resultSet.getInt("deviation_start"));
                keyProjectEventsDash.setDeviationEnd(resultSet.getInt("deviation_end"));
                rows.add(keyProjectEventsDash);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return rows;
    }

    @PostMapping("/getsmrprogress")
    public List<SmrProgressDash> getSmrProgress() {
        List<SmrProgressDash> rows = new ArrayList<>();
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Godnoskop)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM widget_smrprogress()");
            while (resultSet.next()) {
                SmrProgressDash smrProgressDash = new SmrProgressDash();
                smrProgressDash.setObjectName(resultSet.getString("obj_name"));
                smrProgressDash.setPlanPercent(resultSet.getDouble("plan_perc"));
                smrProgressDash.setFactPercent(resultSet.getDouble("fact_perc"));
                smrProgressDash.setDeviationPercent(resultSet.getDouble("deviation_perc"));
                rows.add(smrProgressDash);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return rows;
    }

    @PostMapping("/getprojectprogressvolconstruct")
    public List<ProjectProgressVolumeConstruct> getProjectProgressVolumeConstruct() {
        List<ProjectProgressVolumeConstruct> rows = new ArrayList<>();
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Godnoskop)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM widget_projprogressvolconstruct()");
            while (resultSet.next()) {
                ProjectProgressVolumeConstruct projectProgressVolumeConstruct = new ProjectProgressVolumeConstruct();
                projectProgressVolumeConstruct.setObjectName(resultSet.getString("obj_name"));
                projectProgressVolumeConstruct.setDisciplineName(resultSet.getString("discipl_name"));
                projectProgressVolumeConstruct.setFactPercent(resultSet.getDouble("fact_perc"));
                rows.add(projectProgressVolumeConstruct);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return rows;
    }
}