package ru.sssproject.godnoskopserver.objects.dashbords;

public class SmrProgressDash extends DashBase {

    private String objectName;

    private Double planPercent;
    private Double factPercent;
    private Double deviationPercent;

    public String getObjectName() {
        return objectName;
    }

    public void setObjectName(String objectName) {
        this.objectName = objectName;
    }

    public Double getPlanPercent() {
        return planPercent;
    }

    public void setPlanPercent(Double planPercent) {
        this.planPercent = planPercent;
    }

    public Double getFactPercent() {
        return factPercent;
    }

    public void setFactPercent(Double factPercent) {
        this.factPercent = factPercent;
    }

    public Double getDeviationPercent() {
        return deviationPercent;
    }

    public void setDeviationPercent(Double deviationPercent) {
        this.deviationPercent = deviationPercent;
    }
}
