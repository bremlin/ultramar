package ru.ibcon.ultramarserver.objects.reports;

import java.sql.Date;

public class InvestReportObject extends ReportBase {

    private Integer id;
    private Integer parentId;

    private String name;

    private Date pStart;
    private Date pEnd;
    private Date fStart;
    private Date fEnd;

    private Double pvTotal;
    private Double pvPlan;
    private Double pvFact;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getpStart() {
        return simpleDateFormat.format(pStart);
    }

    public void setpStart(Date pStart) {
        this.pStart = pStart;
    }

    public String getpEnd() {
        return simpleDateFormat.format(pEnd);
    }

    public void setpEnd(Date pEnd) {
        this.pEnd = pEnd;
    }

    public String getfStart() {
        return simpleDateFormat.format(fStart);
    }

    public void setfStart(Date fStart) {
        this.fStart = fStart;
    }

    public String getfEnd() {
        return simpleDateFormat.format(fEnd);
    }

    public void setfEnd(Date fEnd) {
        this.fEnd = fEnd;
    }

    public Double getPvTotal() {
        return round(pvTotal, 2);
    }

    public void setPvTotal(Double pvTotal) {
        this.pvTotal = pvTotal;
    }

    public Double getPvPlan() {
        return round(pvPlan, 2);
    }

    public void setPvPlan(Double pvPlan) {
        this.pvPlan = pvPlan;
    }

    public Double getPvFact() {
        return round(pvFact, 2);
    }

    public void setPvFact(Double pvFact) {
        this.pvFact = pvFact;
    }
}
