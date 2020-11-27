package ru.sssproject.godnoskopserver.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.sssproject.godnoskopserver.objects.reports.InvestReportObject;
import ru.sssproject.godnoskopserver.objects.reports.ReportSumStructure;
import ru.sssproject.godnoskopserver.sql.SqlConnector;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@RestController
public class ReportController {

    @PostMapping("/getinvestreport")
    public List<InvestReportObject> getRows() {
        List<InvestReportObject> rows = new ArrayList<>();
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM rep_sumforinvest()");
            while (resultSet.next()) {
                InvestReportObject investReportObject = new InvestReportObject();
                investReportObject.setId(resultSet.getInt("row_id"));
                investReportObject.setParentId(resultSet.getInt("parent_id"));
                investReportObject.setName(resultSet.getString("name"));
                investReportObject.setpStart(resultSet.getDate("p_start"));
                investReportObject.setpEnd(resultSet.getDate("p_end"));
                investReportObject.setfStart(resultSet.getDate("f_start"));
                investReportObject.setfEnd(resultSet.getDate("f_end"));
                investReportObject.setPvTotal(resultSet.getDouble("pv_total"));
                investReportObject.setPvPlan(resultSet.getDouble("pv_plan"));
                investReportObject.setPvFact(resultSet.getDouble("pv_fact"));
                rows.add(investReportObject);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return rows;
    }

    @PostMapping("/getsumstructure")
    public List<ReportSumStructure> getSumStructureReport() {
        List<ReportSumStructure> rows = new ArrayList<>();
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM rep_sumonstruct()");
            while (resultSet.next()) {
                ReportSumStructure reportSumStructure = new ReportSumStructure();
                reportSumStructure.setId(resultSet.getInt("row_id"));
                reportSumStructure.setParentId(resultSet.getInt("parent_id"));
                reportSumStructure.setName(resultSet.getString("name"));
                reportSumStructure.setpStart(resultSet.getDate("p_start"));
                reportSumStructure.setpEnd(resultSet.getDate("p_end"));
                reportSumStructure.setfStart(resultSet.getDate("f_start"));
                reportSumStructure.setfEnd(resultSet.getDate("f_end"));
                reportSumStructure.setPvTotal(resultSet.getDouble("pv_total"));
                reportSumStructure.setPvPlan(resultSet.getDouble("pv_plan"));
                reportSumStructure.setPvFact(resultSet.getDouble("pv_fact"));
                reportSumStructure.setPvFactAccum(resultSet.getDouble("pv_fact_accum"));
                rows.add(reportSumStructure);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return rows;
    }
}