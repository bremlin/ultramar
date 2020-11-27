package ru.sssproject.godnoskopserver.requestmodel;

import javax.validation.constraints.NotNull;

public class RoleRequest {

    @NotNull
    private Long id;

    private Integer userId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
