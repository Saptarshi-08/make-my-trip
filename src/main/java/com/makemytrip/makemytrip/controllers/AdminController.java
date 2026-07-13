package com.makemytrip.makemytrip.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.UserRepository;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import com.makemytrip.makemytrip.models.Hotel.RoomType;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private FlightRepository flightRepository;

    @GetMapping("/users")
    public ResponseEntity<List<Users>> getallusers(){
        List<Users> users=userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    
    @PostMapping("/flight")
    public Flight addflight(@RequestBody Flight flight) {

        // Default aircraft layout (30 rows × 6 seats = 180 seats)
        flight.setSeatRows(30);
        flight.setSeatColumns(6);

        // Initially no seats are booked
        flight.setBookedSeats(new ArrayList<>());

        // Automatically calculate available seats
        flight.setAvailableSeats(
                flight.getSeatRows() * flight.getSeatColumns()
        );

        return flightRepository.save(flight);
    }

    @PostMapping("/hotel")
    public Hotel addhotel(@RequestBody Hotel hotel) {
        double minPrice = hotel.getRoomTypes()
                .stream()
                .mapToDouble(RoomType::getPrice)
                .min()
                .orElse(0);

        hotel.setPricePerNight(minPrice);
        return hotelRepository.save(hotel);
    }

    @PutMapping("flight/{id}")
    public ResponseEntity<Flight> editflight(@PathVariable String id, @RequestBody Flight updatedFlight){
        Optional<Flight> flightOptional=flightRepository.findById(id);
        if(flightOptional.isPresent()){
            Flight flight = flightOptional.get();
            flight.setFlightName(updatedFlight.getFlightName());
            flight.setFrom(updatedFlight.getFrom());
            flight.setTo(updatedFlight.getTo());
            flight.setDepartureTime(updatedFlight.getDepartureTime());
            flight.setArrivalTime(updatedFlight.getArrivalTime());
            flight.setPrice(updatedFlight.getPrice());
            // Aircraft layout is fixed
            flight.setSeatRows(30);
            flight.setSeatColumns(6);

            // Recalculate available seats
            flight.setAvailableSeats(
                    (30 * 6) - flight.getBookedSeats().size()
            );
            flightRepository.save(flight);
            return  ResponseEntity.ok(flight);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("hotel/{id}")
    public ResponseEntity<Hotel> editHotel(
            @PathVariable String id,
            @RequestBody Hotel updatedHotel) {

        Optional<Hotel> hotelOptional = hotelRepository.findById(id);

        if (hotelOptional.isPresent()) {

            Hotel hotel = hotelOptional.get();

            hotel.setHotelName(updatedHotel.getHotelName());
            hotel.setLocation(updatedHotel.getLocation());
            double minPrice = updatedHotel.getRoomTypes()
                    .stream()
                    .mapToDouble(RoomType::getPrice)
                    .min()
                    .orElse(0);

            hotel.setPricePerNight(minPrice);
            hotel.setAmenities(updatedHotel.getAmenities());
            hotel.setRoomTypes(updatedHotel.getRoomTypes());

            hotelRepository.save(hotel);

            return ResponseEntity.ok(hotel);
        }

        return ResponseEntity.notFound().build();
    }
}