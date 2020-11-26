package ru.ibcon.ultramarserver.conf;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AppConf implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200",
                        "http://192.168.3.132:8088",
                        "http://f.ibcon.ru:8080",
                        "http://f.ibcon.ru:4200",
                        "http://f.ibcon.ru")
                .allowedMethods("GET", "POST");
    }
}