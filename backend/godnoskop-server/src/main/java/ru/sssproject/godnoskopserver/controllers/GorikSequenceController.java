package ru.sssproject.godnoskopserver.controllers;

import java.sql.Connection;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.DateFormatSymbols;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.sssproject.godnoskopserver.objects.User;
import ru.sssproject.godnoskopserver.objects.dashbords.GorikSequence;
import ru.sssproject.godnoskopserver.requestmodel.SequenceRequest;
import ru.sssproject.godnoskopserver.sql.SqlConnector;

@RestController
public class GorikSequenceController {

    @PostMapping("/createMonthSequence")
    public boolean createMonthSequence(@Valid @RequestBody SequenceRequest request) {
        boolean done = false;

        System.out.println("looog");

        Integer month = request.getMonth();
        Integer year = request.getYear();


        String tableName = "\"gorik_sequence\"";

        HashMap<Integer, GorikSequence> gorikSequenceHashMap = new HashMap<>();
        HashMap<Integer, Integer> sequenceMap = new HashMap<>();
        ArrayList<Integer> sequenceList;


        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Godnoskop)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("select gsu.user_id, gsu.query, u.login, ui.user_name as user_name " +
                    "from gorik_sequence_user as gsu " +
                    "left join \"user\" as u on gsu.user_id = u.id\n" +
                    "left join \"user_info\" as ui on gsu.user_id = ui.user_id");
            while (resultSet.next()) {
                GorikSequence gs = new GorikSequence(resultSet);
                sequenceMap.put(resultSet.getInt("query"), resultSet.getInt("user_id"));
                gorikSequenceHashMap.put(gs.getUserId(), gs);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        Integer query = 2;

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.YEAR, year);
        calendar.set(Calendar.MONTH, month);

        for (int i = 1; i <= (calendar.getActualMaximum(Calendar.DAY_OF_MONTH) + 1); i++) {
            Calendar newCalendar = Calendar.getInstance();
            newCalendar.set(Calendar.YEAR, year);
            newCalendar.set(Calendar.MONTH, month);
            newCalendar.set(Calendar.DAY_OF_MONTH, i);

            GorikSequence gorikSequence = new GorikSequence();
            gorikSequence.setGorikDate(new Date(newCalendar.getTime().getTime()));
            gorikSequence.setUserId(sequenceMap.get(query++));
            gorikSequence.setUserName(gorikSequenceHashMap.get(gorikSequence.getUserId()).getUserName());
            gorikSequence.save();
            if (query > 5) query = 1;
        }
        return done;
    }

    @PostMapping("/getgoriksequence")
    public List<GorikSequence> getGorikSequence() {
        List<GorikSequence> gorikSequences = new ArrayList<>();
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Godnoskop)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM gorik_sequence");
            while (resultSet.next()) {
                GorikSequence gorikSequence = new GorikSequence(resultSet);
                gorikSequences.add(gorikSequence);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return gorikSequences;
    }

//    @PostMapping("/whoisgoriktoday")
//    public User getWhoisGorikToday() {
//        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Godnoskop)) {
//            Statement statement = connection.createStatement();
//            ResultSet resultSet = statement.executeQuery("SELECT * FROM gorik_sequence");
//            while (resultSet.next()) {
//                GorikSequence gorikSequence = new GorikSequence(resultSet);
//                gorikSequences.add(gorikSequence);
//            }
//            statement.close();
//            resultSet.close();
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
//        return gorikSequences;
//    }
}
