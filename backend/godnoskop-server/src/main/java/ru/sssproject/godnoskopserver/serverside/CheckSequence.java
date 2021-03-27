package ru.sssproject.godnoskopserver.serverside;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CheckSequence {

    @Scheduled(fixedRate = 3000)
    public void schedule() {
        System.out.println("test schedule");
    }
}
