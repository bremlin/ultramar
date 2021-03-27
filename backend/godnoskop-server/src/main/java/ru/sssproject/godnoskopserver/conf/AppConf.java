package ru.sssproject.godnoskopserver.conf;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AppConf implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200",
                        "http://localhost:8080",
                        "http://godnoskop.sssproject.ru/",
                        "http://godnoskop.sssproject.ru:4200",
                        "http://godnoskop.sssproject.ru:8080/")
//                        "http://f.ibcon.ru:4200",
//                        "http://app.sssproject.ru:8080/")
                .allowedMethods("GET", "POST");
    }
}