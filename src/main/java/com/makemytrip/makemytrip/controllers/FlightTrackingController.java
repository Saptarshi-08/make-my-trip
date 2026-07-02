package com.makemytrip.makemytrip.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.services.FlightStatusService;

@RestController
@RequestMapping("/tracking")
@CrossOrigin(origins = "*")
public class FlightTrackingController {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private FlightStatusService flightStatusService;

    @GetMapping("/{flightId}")
    public Flight getFlightStatus(
            @PathVariable String flightId
    ) {

        Flight flight = flightRepository
                .findById(flightId)
                .orElseThrow(() ->
                        new RuntimeException("Flight not found"));

        return flightStatusService.generateLiveStatus(flight);
    }
}