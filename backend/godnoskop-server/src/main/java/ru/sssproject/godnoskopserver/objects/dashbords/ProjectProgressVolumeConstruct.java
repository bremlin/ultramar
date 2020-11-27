package ru.sssproject.godnoskopserver.objects.dashbords;

public class ProjectProgressVolumeConstruct extends DashBase {

    private String objectName;
    private String disciplineName;

    private Double factPercent;

    public String getObjectName() {
        return objectName;
    }

    public void setObjectName(String objectName) {
        this.objectName = objectName;
    }

    public String getDisciplineName() {
        return disciplineName;
    }

    public void setDisciplineName(String disciplineName) {
        this.disciplineName = disciplineName;
    }

    public Double getFactPercent() {
        return factPercent;
    }

    public void setFactPercent(Double factPercent) {
        this.factPercent = factPercent;
    }
}
