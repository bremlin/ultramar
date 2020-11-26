package ru.ibcon.ultramarserver.controllers;

import java.io.File;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import ru.ibcon.ultramarserver.utils.MyResourceHttpRequestHandler;

@Controller
public class HomeController {
	@Autowired
	private MyResourceHttpRequestHandler handler;
	private final static File MP4_FILE = new File("C:\\Users\\s_shmakov\\Desktop\\f0d85.mp4");

	// supports byte-range requests
	@GetMapping("/byterange")
	public void byterange( HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		request.setAttribute(MyResourceHttpRequestHandler.ATTR_FILE, MP4_FILE);
		handler.handleRequest(request, response);
	}
}
