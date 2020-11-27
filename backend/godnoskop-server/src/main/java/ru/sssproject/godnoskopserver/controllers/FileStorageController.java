package ru.sssproject.godnoskopserver.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.sssproject.godnoskopserver.objects.UltraFile;
import ru.sssproject.godnoskopserver.requestmodel.FileRequest;
import ru.sssproject.godnoskopserver.sql.SqlConnector;

import javax.validation.Valid;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@RestController
public class FileStorageController {

    @PostMapping("/getmedia")
    public List<UltraFile> getMedia(@Valid @RequestBody FileRequest request) {
        System.out.println("getmedia: ");
        System.out.println("type: " + request.getType());
        List<UltraFile> ultraFileList = new ArrayList<>();
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM " +
                    "getdocsforparentbytypewithauthorastext(" + null + ", '" + request.getType() + "')");
            setFileData(ultraFileList, statement, resultSet, request.getType());

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ultraFileList;
    }

    @PostMapping("/getfilesfortree")
    public List<UltraFile> getFiles(@Valid @RequestBody FileRequest request) {
        List<UltraFile> ultraFileList = new ArrayList<>();
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM " +
                    "getdocsforparentbytypewithauthorastext(" + request.getParentId() + ", 'doc')");
            setFileData(ultraFileList, statement, resultSet, null);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ultraFileList;
    }

    private void setFileData(List<UltraFile> ultraFileList, Statement statement, ResultSet resultSet, String type) throws SQLException {
        while (resultSet.next()) {
            UltraFile ultraFile = new UltraFile();
            ultraFile.setId(resultSet.getLong("doc_id"));
            ultraFile.setDocName(resultSet.getString("doc_name"));
            ultraFile.setFileName(resultSet.getString("file_name"));
            ultraFile.setOrigName(resultSet.getString("orig_filename"));
            ultraFile.setUploadDate(resultSet.getDate("upload_date"));
            ultraFile.setAuthor(resultSet.getString("doc_author"));
            ultraFile.setFile(!resultSet.getBoolean("is_folder"));
            ultraFile.setType(type);
            try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
                Statement stat = connection.createStatement();
                ResultSet rs = stat.executeQuery("SELECT * FROM " +
                        "doc_attr_object_getobjectidbydocid(" + ultraFile.getId() + ")");
                while (rs.next()) {
                    ultraFile.setBuildingId(rs.getInt(1));
                }
                rs.close();
                stat.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
            ultraFileList.add(ultraFile);
        }
        statement.close();
        resultSet.close();
    }

    @PostMapping("/getrootfortree")
    public List<UltraFile> getRoot() {
        List<UltraFile> ultraFileList = new ArrayList<>();
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM " +
                    "getdocsforparentbytypewithauthorastext(" + null + ", 'doc')");
            setFileData(ultraFileList, statement, resultSet, null);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ultraFileList;
    }

    @PostMapping("/addfolder")
    public Integer addFolder(@Valid @RequestBody FileRequest request) {
        Integer id = null;
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            String query = "SELECT * FROM " +
                    "adddoc(" + request.getParentId() + ", " +
                    "'" + request.getName() + "', " +
                    true + ", " +
                    "'" + request.getName() + "', " +
                    null + ", " +
                    "'doc', " +
                    request.getUserId() + ")";
            System.out.println("addfolder: " + query);
            ResultSet resultSet = statement.executeQuery(query);
            while (resultSet.next()) {
                id = resultSet.getInt(1);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return id;
    }

    @PostMapping("/removefolder")
    public void removeFolder(@Valid @RequestBody FileRequest request) {
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            String query = "SELECT * FROM " +
                    "deldocwithcilds(" + request.getId() + ")";
            System.out.println("removedocs: " + query);
            ResultSet resultSet = statement.executeQuery(query);
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}