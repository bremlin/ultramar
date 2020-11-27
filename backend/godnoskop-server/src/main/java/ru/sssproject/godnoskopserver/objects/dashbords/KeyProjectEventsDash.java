package ru.sssproject.godnoskopserver.objects.dashbords;

import java.sql.Date;

public class KeyProjectEventsDash extends DashBase {

    private String objectName;

    private Date tpStart;
    private Date tpEnd;
    private Date dateStart;
    private Date dateEnd;

    private Integer deviationStart;
    private Integer deviationEnd;

    public String getObjectName() {
        return objectName;
    }

    public void setObjectName(String objectName) {
        this.objectName = objectName;
    }

    public String getTpStart() {
        return simpleDateFormat.format(tpStart);
    }

    public void setTpStart(Date tpStart) {
        this.tpStart = tpStart;
    }

    public String getTpEnd() {
        return simpleDateFormat.format(tpEnd);
    }

    public void setTpEnd(Date tpEnd) {
        this.tpEnd = tpEnd;
    }

    public String getDateStart() {
        return simpleDateFormat.format(dateStart);
    }

    public void setDateStart(Date dateStart) {
        this.dateStart = dateStart;
    }

    public String getDateEnd() {
        return simpleDateFormat.format(dateEnd);
    }

    public void setDateEnd(Date dateEnd) {
        this.dateEnd = dateEnd;
    }

    public Integer getDeviationStart() {
        return deviationStart;
    }

    public void setDeviationStart(Integer deviationStart) {
        this.deviationStart = deviationStart;
    }

    public Integer getDeviationEnd() {
        return deviationEnd;
    }

    public void setDeviationEnd(Integer deviationEnd) {
        this.deviationEnd = deviationEnd;
    }
}