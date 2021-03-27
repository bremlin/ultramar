package ru.sssproject.godnoskopserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.scheduling.annotation.EnableScheduling;
import ru.sssproject.godnoskopserver.serverside.CheckSequence;

@SpringBootApplication
@EnableScheduling
public class GondnoskopServerApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(GondnoskopServerApplication.class, args);
//        CheckSequence checkSequence = new CheckSequence();
//        checkSequence.schedule();
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(GondnoskopServerApplication.class);
    }

}