package ru.sssproject.godnoskopserver.objects.dashbords;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.HashSet;
import ru.sssproject.godnoskopserver.objects.ResponseObject;

public class GorikSequence extends ResponseObject {

    private Integer id;
    private Integer userId;
    private Integer authorId;

    private boolean done;

    private Date gorikDate;
    private Timestamp created;

    private String userName;
    private String authorName;

    public GorikSequence(ResultSet rs) throws SQLException {
        HashSet<String> columns = new HashSet<>();
        for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
            columns.add(rs.getMetaData().getColumnName(i));
        }
        if (columns.contains("id")) {
            this.id = rs.getInt("id");
        }
        if (columns.contains("user_id")) {
            this.userId = rs.getInt("user_id");
        }
        if (columns.contains("author_id")) {
            this.authorId = rs.getInt("author_id");
        }
        if (columns.contains("done")) {
            this.done = rs.getBoolean("done");
        }
        if (columns.contains("gorik_date")) {
            this.gorikDate = rs.getDate("gorik_date");
        }
        if (columns.contains("created")) {
            this.created = rs.getTimestamp("created");
        }
        if (columns.contains("user_name")) {
            this.userName = rs.getString("user_name");
        }
        if (columns.contains("author_name")) {
            this.authorName = rs.getString("author_name");
        }
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Integer authorId) {
        this.authorId = authorId;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public Date getGorikDate() {
        return gorikDate;
    }

    public void setGorikDate(Date gorikDate) {
        this.gorikDate = gorikDate;
    }

    public Timestamp getCreated() {
        return created;
    }

    public void setCreated(Timestamp created) {
        this.created = created;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }
}
