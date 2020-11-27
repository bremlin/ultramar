package ru.sssproject.godnoskopserver.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
public class MainRESTController {

    private HashMap<Integer, String> testMap = new HashMap<>();

    @RequestMapping(value = "/testrest", //
    method = RequestMethod.GET, //
    produces = {MediaType.APPLICATION_JSON_VALUE, //
            MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public List<String> getTest() {
        List<String> list = new ArrayList<>();
        list.add("Test");
        list.add("12");
        list.add("Яблочко");
        return list;
    }

    @RequestMapping(value = "/testrest/{testId}", //
            method = RequestMethod.GET, //
            produces = { MediaType.APPLICATION_JSON_VALUE, //
                    MediaType.APPLICATION_XML_VALUE })
    @ResponseBody
    public String getEmployee(@PathVariable("testId") Integer testId) {
        HashMap<Integer, String> testingMap = new HashMap<>();
        testingMap.put(0, "Ого");
        testingMap.put(1, "Ага");
        testingMap.put(2, "Яблоко");
        testingMap.put(3, "12");
        return testingMap.get(testId);
    }
}