package com.makemytrip.makemytrip.services;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.Users.Booking;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.UserRepository;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookingService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    public Booking bookFlight(String userId,String flightId,int seats,double price){
        Optional<Users> usersOptional =userRepository.findById(userId);
        Optional<Flight> flightOptional =flightRepository.findById(flightId);
        if(usersOptional.isPresent() && flightOptional.isPresent()){
            Users user=usersOptional.get();
            Flight flight=flightOptional.get();
            if(flight.getAvailableSeats() >= seats){
                flight.setAvailableSeats(flight.getAvailableSeats()- seats);
                flightRepository.save(flight);

                Booking booking=new Booking();
                booking.setType("Flight");
                booking.setBookingId(UUID.randomUUID().toString());

                booking.setBookingTime(LocalDateTime.now());

                booking.setQuantity(seats);
                booking.setTotalPrice(price);

                booking.setBookingStatus("ACTIVE");
                booking.setRefundAmount(0);
                booking.setRefundStatus("NA");
                booking.setCancellationReason(null);
                booking.setCancellationTime(null);
                user.getBookings().add(booking);
                userRepository.save(user);
                return booking;
            }else {
                throw new RuntimeException("Not enough seats available");
            }
        }
        throw new RuntimeException("User or flight not found");
    }
    public Booking bookhotel(String userId,String hotelId,int rooms,double price){
        Optional<Users> usersOptional =userRepository.findById(userId);
        Optional<Hotel> hotelOptional = hotelRepository.findById(hotelId);
        if(usersOptional.isPresent() && hotelOptional.isPresent()){
            Users user=usersOptional.get();
            Hotel hotel=hotelOptional.get();
            if(hotel.getAvailableRooms() >= rooms){
                hotel.setAvailableRooms(hotel.getAvailableRooms()- rooms);
                hotelRepository.save(hotel);

                Booking booking=new Booking();
                booking.setType("Hotel");
                booking.setBookingId(UUID.randomUUID().toString());

                booking.setBookingTime(LocalDateTime.now());

                booking.setQuantity(rooms);
                booking.setTotalPrice(price);

                booking.setBookingStatus("ACTIVE");
                booking.setRefundAmount(0);
                booking.setRefundStatus("NA");
                booking.setCancellationReason(null);
                booking.setCancellationTime(null);
                user.getBookings().add(booking);
                userRepository.save(user);
                return booking;
            }else {
                throw new RuntimeException("Not enough rooms available");
            }
        }
        throw new RuntimeException("User or flight not found");
    }
    
    public Booking cancelBooking(
        String userId,
        String bookingId,
        String reason
    ) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        for (Booking booking : user.getBookings()) {

            if (booking.getBookingId().equals(bookingId)
                    && !"CANCELLED".equals(
                            booking.getBookingStatus())) {

                Duration duration =
                        Duration.between(
                                booking.getBookingTime(),
                                LocalDateTime.now());

                double refundPercentage;

                if (duration.toHours() <= 24) {
                    refundPercentage = 0.50;
                } else {
                    refundPercentage = 0.25;
                }

                double refundAmount =
                        booking.getTotalPrice()
                                * refundPercentage;

                booking.setBookingStatus("CANCELLED");

                booking.setCancellationReason(reason);

                booking.setCancellationTime(
                        LocalDateTime.now());

                booking.setRefundAmount(refundAmount);

                booking.setRefundStatus("PENDING");

                userRepository.save(user);

                return booking;
            }
        }

        throw new RuntimeException(
                "Booking not found");
    }

    public Booking updateRefundStatus(
        String userId,
        String bookingId,
        String status
    ) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        for (Booking booking : user.getBookings()) {

            if (booking.getBookingId().equals(bookingId)) {

                booking.setRefundStatus(status);

                userRepository.save(user);

                return booking;
            }
        }

        throw new RuntimeException(
                "Booking not found");
    }
}