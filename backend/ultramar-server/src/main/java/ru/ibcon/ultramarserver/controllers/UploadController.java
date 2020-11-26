package ru.ibcon.ultramarserver.controllers;

import org.apache.commons.io.IOUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.ibcon.ultramarserver.objects.UltraFile;
import ru.ibcon.ultramarserver.objects.User;
import ru.ibcon.ultramarserver.requestmodel.FileRequest;
import ru.ibcon.ultramarserver.sql.SqlConnector;

import java.util.Arrays;
import java.util.Base64;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@RestController
public class UploadController {

    private static String UPLOADED_FOLDER = "C://Users//s_shmakov//Desktop//Upload//";
    private static String DOWNLOAD_FOLDER = "C:\\Users\\s_shmakov\\Desktop\\Upload\\";
//    private static String UPLOADED_FOLDER = "D://Upload//";
//    private static String DOWNLOAD_FOLDER = "D:\\Upload\\";

    private static String PHOTO = "photo";
    private static String VIDEO = "video";

    @GetMapping("/")
    public String index() {
        return "upload";
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public void singleFileUpload(@RequestParam("file") MultipartFile file,
                                 @RequestParam("parentId") Integer parentId,
                                 @RequestParam("name") String name,
                                 @RequestParam("userId") Integer userId) {

        System.out.println("parentId: " + parentId);
        System.out.println("name: " + name);
        System.out.println("userId: " + userId);
        System.out.println("file: " + file.getOriginalFilename());

        int id;
        UltraFile ultraFile = new UltraFile();
        ultraFile.setParentid(Long.valueOf(parentId));
        ultraFile.setDocName(name);
        ultraFile.setOrigName(file.getOriginalFilename());

        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            String query = "SELECT * FROM " +
                    "adddoc(" + ultraFile.getParentid() + ", " +
                    "'" + ultraFile.getDocName() + "', " +
                    false + ", " +
                    "'" + ultraFile.getOrigName() + "', " +
                    null + ", " +
                    "'doc', " +
                    userId + ")";
            System.out.println("adddocument: " + query);
            ResultSet resultSet = statement.executeQuery(query);
            while (resultSet.next()) {
                id = resultSet.getInt(1);
                ultraFile.setId((long) id);
            }

            resultSet = statement.executeQuery("SELECT * FROM " +
                    "getdocfilenamesbyid(" + ultraFile.getId() + ")");
            while (resultSet.next()) {
                ultraFile.setFile(true);
                ultraFile.setFileName(resultSet.getString("file_name"));
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        try {
            byte[] bytes = file.getBytes();
            Path path = Paths.get(UPLOADED_FOLDER + ultraFile.getFileName());
            Files.write(path, bytes);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @PostMapping(value = "/download", produces = MediaType.IMAGE_JPEG_VALUE)
    public @ResponseBody byte[] getFile(@Valid @RequestBody FileRequest request, HttpServletResponse response) throws IOException {
        UltraFile ultraFile = new UltraFile();

        System.out.println("id: " + request.getId());

        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM " +
                    "getdocfilenamesbyid(" + request.getId() + ")");
            while (resultSet.next()) {
                ultraFile.setFile(true);
                ultraFile.setOrigName(resultSet.getString("orig_file_name"));
                ultraFile.setFileName(resultSet.getString("file_name"));
            }

            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        System.out.println("download file:");
        System.out.println("orig_file_name: " + ultraFile.getOrigName());
        System.out.println("file_name: " + ultraFile.getFileName());

        File file = new File(DOWNLOAD_FOLDER + ultraFile.getFileName());
        System.out.println("download file: " + DOWNLOAD_FOLDER + ultraFile.getFileName());
        response.setContentType("application/x-msdownload");
        response.setHeader("Content-disposition", "attachment; filename=" + ultraFile.getOrigName());
        if (!file.exists()) {
            throw new RuntimeException("File not found");
        }
        InputStream resource = null;
        try {
            resource = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        return IOUtils.toByteArray(resource);
    }

    @PostMapping(value = "/downloadvideo", produces = MediaType.IMAGE_JPEG_VALUE)
    public @ResponseBody String getVideo(@Valid @RequestBody FileRequest request) throws IOException {
        UltraFile ultraFile = new UltraFile();

        System.out.println("id: " + request.getId());

        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM " +
                    "getdocfilenamesbyid(" + request.getId() + ")");
            while (resultSet.next()) {
                ultraFile.setFile(true);
                ultraFile.setOrigName(resultSet.getString("orig_file_name"));
                ultraFile.setFileName(resultSet.getString("file_name"));
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        System.out.println("download file:");
        System.out.println("orig_file_name: " + ultraFile.getOrigName());
        System.out.println("file_name: " + ultraFile.getFileName());

        File file = new File(DOWNLOAD_FOLDER + ultraFile.getFileName());
        System.out.println("download file: " + DOWNLOAD_FOLDER + ultraFile.getFileName());
        if (!file.exists()) {
            throw new RuntimeException("File not found");
        }

        FileInputStream fileInputStreamReader = new FileInputStream(file);
        StringBuilder sb = new StringBuilder();
        Base64.Encoder encoder = java.util.Base64.getEncoder();
        int bufferSize = 3 * 1024;
        byte[] bytes = new byte[bufferSize];
        int readSize = 0;

        while ((readSize = fileInputStreamReader.read(bytes)) == bufferSize) {
            sb.append(encoder.encodeToString(bytes));
        }

        if (readSize > 0) {
            bytes = Arrays.copyOf(bytes, readSize);
            sb.append(encoder.encodeToString(bytes) );
        }

        String encodedBase64  = sb.toString();
        return encodedBase64;
    }

//    @GetMapping("/videobyterange")
//    public void home(@RequestParam(value = "name") String name, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//
//        request.setAttribute(MyResourceHttpRequestHandler.ATTR_FILE, MP4_FILE);
//        handler.handleRequest(request, response);
//    }

    // does not support byte-range requests
    @GetMapping(path = "/videoonepiece", produces = "video/mp4")
    public FileSystemResource plain(@RequestParam(value = "id") Integer id) {

        UltraFile ultraFile = new UltraFile();

        System.out.println("id: " + id);

        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM " +
                    "getdocfilenamesbyid(" + id + ")");
            while (resultSet.next()) {
                ultraFile.setFile(true);
                ultraFile.setOrigName(resultSet.getString("orig_file_name"));
                ultraFile.setFileName(resultSet.getString("file_name"));
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        System.out.println("download file:");
        System.out.println("orig_file_name: " + ultraFile.getOrigName());
        System.out.println("file_name: " + ultraFile.getFileName());

        File file = new File(DOWNLOAD_FOLDER + ultraFile.getFileName());
        System.out.println("download file: " + DOWNLOAD_FOLDER + ultraFile.getFileName());
        if (!file.exists()) {
            throw new RuntimeException("File not found");
        }

        return new FileSystemResource(file);
    }

    @PostMapping(value = "/uploadmedia", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Integer videoUpload(@RequestParam("file") MultipartFile file,
                               @RequestParam("name") String name,
                               @RequestParam("type") String type,
                               @RequestParam("userId") Integer userId,
                               @RequestParam("buildingId") Integer buildingId) {
        int id = -1;

        System.out.println("name: " + name);
        System.out.println("userId: " + userId);
        System.out.println("type: " + type);
        System.out.println("file: " + file.getOriginalFilename());
        System.out.println("builingId: " + buildingId);

        if (!type.equals(VIDEO) && !type.equals(PHOTO)) {
            System.out.println("wrongType");
            return id;
        }

        UltraFile ultraFile = new UltraFile();
        ultraFile.setDocName(name);
        ultraFile.setOrigName(file.getOriginalFilename());

        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Ultramar)) {
            Statement statement = connection.createStatement();
            String query = "SELECT * FROM " +
                    "adddocfileinroot('" + ultraFile.getDocName() + "', " +
                    "'" + ultraFile.getOrigName() + "', " +
                    "'" + type + "', " +
                    userId + ")";
            System.out.println("adddocument: " + query);
            ResultSet resultSet = statement.executeQuery(query);
            while (resultSet.next()) {
                id = resultSet.getInt(1);
                ultraFile.setId((long) id);
            }

            resultSet = statement.executeQuery("SELECT * FROM " +
                    "getdocfilenamesbyid(" + ultraFile.getId() + ")");
            while (resultSet.next()) {
                ultraFile.setFile(true);
                ultraFile.setFileName(resultSet.getString("file_name"));
            }

            resultSet = statement.executeQuery("SELECT * FROM " +
                    "doc_attr_object_add(" + ultraFile.getId() + ", " + buildingId + ")");
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        try {
            byte[] bytes = file.getBytes();
            Path path = Paths.get(UPLOADED_FOLDER + ultraFile.getFileName());
            Files.write(path, bytes);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return id;
    }

    @PostMapping("/getrelation")
    public List<User> getRelation() {
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
}