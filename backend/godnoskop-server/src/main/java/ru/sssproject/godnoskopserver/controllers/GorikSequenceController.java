package ru.sssproject.godnoskopserver.controllers;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.DateFormatSymbols;
import java.util.ArrayList;
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
        ArrayList<Integer> sequenceList = new ArrayList<>();


        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Godnoskop)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("select gsu.user_id, gsu.query, u.login, u.login as user_name " +
                    "from gorik_sequence_user as gsu " +
                    "left join \"user\" as u on gsu.user_id = u.id\n");
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

        sequenceList = new ArrayList<>(sequenceMap.keySet());
        Collections.sort(sequenceList);

        String[] months = new DateFormatSymbols().getMonths();
        System.out.println("tes");


        return done;
    }

    @PostMapping("/getgoriksequence")
    public List<GorikSequence> getGorikSequence() {
        List<GorikSequence> gorikSequences = new ArrayList<>();
        try (Connection connection = SqlConnector.ConnectDb(SqlConnector.DB.Godnoskop)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM user");
            while (resultSet.next()) {
                User user = new User(resultSet);
//                users.add(user);
            }
            statement.close();
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return gorikSequences;
    }
}
