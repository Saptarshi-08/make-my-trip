package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.dto.RecommendationDTO;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import com.makemytrip.makemytrip.repositories.UserRepository;
import com.makemytrip.makemytrip.dto.RecommendationFeedbackRequest;
import com.makemytrip.makemytrip.models.RecommendationFeedback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.makemytrip.makemytrip.models.DestinationCategory;
import java.util.*;
import java.time.LocalDateTime;

@Service
public class RecommendationServices {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    public List<RecommendationDTO> getRecommendations(String userId){

        Users user = userRepository.findById(userId).orElse(null);

        if(user == null){
            return new ArrayList<>();
        }

        List<RecommendationDTO> recommendations = new ArrayList<>();

        try {
            recommendFromHistory(user, recommendations);
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            recommendFromPreferences(user, recommendations);
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            recommendCollaborative(user, recommendations);
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            recommendTrending(user, recommendations);
        } catch (Exception e) {
            e.printStackTrace();
        }

        removeDuplicates(recommendations);

        applyFeedbackScores(user, recommendations);

        sortRecommendations(recommendations);

        List<RecommendationDTO> finalRecommendations = new ArrayList<>();
        Set<String> algorithmsAdded = new HashSet<>();
        for (RecommendationDTO dto : recommendations) {

            if (finalRecommendations.size() == 3)
                break;

            if (!algorithmsAdded.contains(dto.getAlgorithm())) {

                finalRecommendations.add(dto);
                algorithmsAdded.add(dto.getAlgorithm());

            }
        }
        for (RecommendationDTO dto : recommendations) {

            if (finalRecommendations.size() == 3)
                break;

            if (!finalRecommendations.contains(dto)) {
                finalRecommendations.add(dto);
            }
        }
        return finalRecommendations;

    }

    private void recommendFromHistory(
        Users user,
        List<RecommendationDTO> recommendations){

        if(user.getBookings()==null || user.getBookings().isEmpty()){
            return;
        }

        Map<DestinationCategory,Integer> categoryCount = new HashMap<>();

        Set<String> visitedFlights = new HashSet<>();

        Set<String> visitedHotels = new HashSet<>();

        for(Users.Booking booking : user.getBookings()){

            if ("CANCELLED".equals(booking.getBookingStatus())) {
                continue;
            }

            if(booking.getFlightId()!=null){

                Optional<Flight> flight =
                        flightRepository.findById(booking.getFlightId());

                if(flight.isPresent()){

                    DestinationCategory category =
                            flight.get().getDestinationCategory();

                    if(category!=null){

                        categoryCount.put(
                                category,
                                categoryCount.getOrDefault(category,0)+1
                        );

                        visitedFlights.add(flight.get().getId());

                    }

                }

            }

        }
        for(Users.Booking booking : user.getBookings()){

            if ("CANCELLED".equals(booking.getBookingStatus())) {
                continue;
            }

            if(booking.getHotelId()!=null){

                Optional<Hotel> hotel =
                        hotelRepository.findById(booking.getHotelId());

                if(hotel.isPresent()){

                    DestinationCategory category =
                            hotel.get().getDestinationCategory();

                    if(category!=null){

                        categoryCount.put(
                                category,
                                categoryCount.getOrDefault(category,0)+1
                        );

                        visitedHotels.add(hotel.get().getId());

                    }

                }

            }

        }
        if(categoryCount.isEmpty()){
            return;
        }
        DestinationCategory favouriteCategory =

            Collections.max(
                    categoryCount.entrySet(),
                    Map.Entry.comparingByValue()
            ).getKey();

        List<Hotel> hotels = hotelRepository.findAll();

        for(Hotel hotel : hotels){

            if(hotel.getDestinationCategory()!=favouriteCategory){
                continue;
            }

            if(visitedHotels.contains(hotel.getId())){
                continue;
            }

            RecommendationDTO dto = new RecommendationDTO();

            dto.setRecommendationId(hotel.getId());

            dto.setActionId(hotel.getId());

            dto.setType("HOTEL");

            dto.setTitle(hotel.getHotelName());

            dto.setDestination(hotel.getLocation());

            dto.setCategory(favouriteCategory.name());

            dto.setAlgorithm("History Based");

            dto.setReason(
                    "You frequently book "
                            + favouriteCategory.name().toLowerCase()
                            + " destinations."
            );

            dto.setPrice(hotel.getCurrentPricePerNight());

            dto.setRating(hotel.getAverageRating());

            dto.setScore(80);

            dto.setConfidence(90);

            recommendations.add(dto);

        }
        List<Flight> flights = flightRepository.findAll();

        for(Flight flight : flights){

            if(flight.getDestinationCategory()!=favouriteCategory){
                continue;
            }

            if(visitedFlights.contains(flight.getId())){
                continue;
            }

            RecommendationDTO dto = new RecommendationDTO();

            dto.setRecommendationId(flight.getId());

            dto.setActionId(flight.getId());

            dto.setType("FLIGHT");

            dto.setTitle(flight.getFlightName());

            dto.setDestination(flight.getTo());

            dto.setCategory(favouriteCategory.name());

            dto.setAlgorithm("History Based");

            dto.setReason(
                    "Based on your previous "
                            + favouriteCategory.name().toLowerCase()
                            + " trips."
            );

            dto.setPrice(flight.getCurrentPrice());

            dto.setRating(flight.getAverageRating());

            dto.setScore(75);

            dto.setConfidence(88);

            recommendations.add(dto);

        }

    }

    private void recommendFromPreferences(
        Users user,
        List<RecommendationDTO> recommendations){

        String preferredRoom = user.getPreferredRoomType();

        if(preferredRoom != null && !preferredRoom.isBlank()){

            List<Hotel> hotels = hotelRepository.findAll();

            for(Hotel hotel : hotels){

                boolean matched = false;

                if (hotel.getRoomTypes() == null) {
                    continue;
                }
                for(Hotel.RoomType room : hotel.getRoomTypes()){

                    if(preferredRoom.equalsIgnoreCase(room.getType())){

                        matched = true;
                        break;

                    }

                }

                if(!matched){
                    continue;
                }

                RecommendationDTO dto = new RecommendationDTO();

                dto.setRecommendationId(hotel.getId());

                dto.setActionId(hotel.getId());

                dto.setType("HOTEL");

                dto.setTitle(hotel.getHotelName());

                dto.setDestination(hotel.getLocation());
                
                if (hotel.getDestinationCategory() == null) {
                    continue;
                }

                dto.setCategory(
                        hotel.getDestinationCategory().name()
                );

                dto.setAlgorithm("Preference Based");

                dto.setReason(
                        "Matches your preferred room type ("
                                + preferredRoom
                                + ")."
                );

                double hotelPrice =
                        hotel.getCurrentPricePerNight()>0
                                ? hotel.getCurrentPricePerNight()
                                : hotel.getPricePerNight();

                dto.setPrice(hotelPrice);

                dto.setRating(hotel.getAverageRating());

                dto.setScore(60);

                dto.setConfidence(80);

                recommendations.add(dto);

            }

        }

        String preferredSeat = user.getPreferredSeatType();

        if(preferredSeat != null && !preferredSeat.isBlank()){

            List<Flight> flights = flightRepository.findAll();

            for(Flight flight : flights){

                RecommendationDTO dto = new RecommendationDTO();

                dto.setRecommendationId(flight.getId());

                dto.setActionId(flight.getId());

                dto.setType("FLIGHT");

                dto.setTitle(flight.getFlightName());

                dto.setDestination(flight.getTo());

                if (flight.getDestinationCategory() == null) {
                    continue;
                }

                dto.setCategory(
                        flight.getDestinationCategory().name()
                );

                dto.setAlgorithm("Preference Based");

                dto.setReason(
                        "Recommended because you prefer "
                                + preferredSeat
                                + " seats."
                );

                double flightPrice =
                        flight.getCurrentPrice()>0
                                ? flight.getCurrentPrice()
                                : flight.getPrice();

                dto.setPrice(flightPrice);

                dto.setRating(flight.getAverageRating());

                dto.setScore(55);

                dto.setConfidence(75);

                recommendations.add(dto);

            }

        }

    }

    private void recommendCollaborative(
        Users user,
        List<RecommendationDTO> recommendations) {

        List<Users> allUsers = userRepository.findAll();

        Map<DestinationCategory, Integer> collaborativeScore = new HashMap<>();

        Set<DestinationCategory> currentUserCategories = new HashSet<>();

        if (user.getBookings() != null) {

            for (Users.Booking booking : user.getBookings()) {

                if (booking.getFlightId() != null) {

                    Optional<Flight> flight = flightRepository.findById(booking.getFlightId());

                    if (flight.isPresent() && flight.get().getDestinationCategory() != null) {
                        currentUserCategories.add(flight.get().getDestinationCategory());
                    }
                }

                if (booking.getHotelId() != null) {

                    Optional<Hotel> hotel = hotelRepository.findById(booking.getHotelId());

                    if (hotel.isPresent() && hotel.get().getDestinationCategory() != null) {
                        currentUserCategories.add(hotel.get().getDestinationCategory());
                    }
                }
            }
        }

        for (Users otherUser : allUsers) {

            if (otherUser.getId().equals(user.getId())) {
                continue;
            }

            if (otherUser.getBookings() == null || otherUser.getBookings().isEmpty()) {
                continue;
            }

            Set<DestinationCategory> otherUserCategories = new HashSet<>();

            for (Users.Booking booking : otherUser.getBookings()) {

                if (booking.getFlightId() != null) {

                    Optional<Flight> flight = flightRepository.findById(booking.getFlightId());

                    if (flight.isPresent() && flight.get().getDestinationCategory() != null) {
                        otherUserCategories.add(flight.get().getDestinationCategory());
                    }
                }

                if (booking.getHotelId() != null) {

                    Optional<Hotel> hotel = hotelRepository.findById(booking.getHotelId());

                    if (hotel.isPresent() && hotel.get().getDestinationCategory() != null) {
                        otherUserCategories.add(hotel.get().getDestinationCategory());
                    }
                }
            }

            int commonCategories = 0;

            for (DestinationCategory category : currentUserCategories) {

                if (otherUserCategories.contains(category)) {
                    commonCategories++;
                }
            }

            if (commonCategories == 0) {
                continue;
            }

            for (DestinationCategory category : otherUserCategories) {

                if (currentUserCategories.contains(category)) {
                    continue;
                }

                collaborativeScore.put(
                        category,
                        collaborativeScore.getOrDefault(category, 0) + commonCategories
                );
            }
        }

        if (collaborativeScore.isEmpty()) {
            return;
        }

        DestinationCategory bestCategory =
                Collections.max(
                        collaborativeScore.entrySet(),
                        Map.Entry.comparingByValue()
                ).getKey();

        for (Hotel hotel : hotelRepository.findAll()) {

            if (hotel.getDestinationCategory() != bestCategory) {
                continue;
            }

            RecommendationDTO dto = new RecommendationDTO();

            dto.setRecommendationId(hotel.getId());
            dto.setActionId(hotel.getId());
            dto.setType("HOTEL");
            dto.setTitle(hotel.getHotelName());
            dto.setDestination(hotel.getLocation());
            dto.setCategory(bestCategory.name());
            dto.setAlgorithm("Collaborative Filtering");
            dto.setReason("Users with booking patterns similar to yours also booked this hotel.");
            dto.setPrice(hotel.getCurrentPricePerNight() > 0 ?
                    hotel.getCurrentPricePerNight() :
                    hotel.getPricePerNight());
            dto.setRating(hotel.getAverageRating());
            dto.setScore(70);
            dto.setConfidence(85);

            recommendations.add(dto);
        }

        for (Flight flight : flightRepository.findAll()) {

            if (flight.getDestinationCategory() != bestCategory) {
                continue;
            }

            RecommendationDTO dto = new RecommendationDTO();

            dto.setRecommendationId(flight.getId());
            dto.setActionId(flight.getId());
            dto.setType("FLIGHT");
            dto.setTitle(flight.getFlightName());
            dto.setDestination(flight.getTo());
            dto.setCategory(bestCategory.name());
            dto.setAlgorithm("Collaborative Filtering");
            dto.setReason("Travellers with interests similar to yours also booked this flight.");
            dto.setPrice(flight.getCurrentPrice() > 0 ?
                    flight.getCurrentPrice() :
                    flight.getPrice());
            dto.setRating(flight.getAverageRating());
            dto.setScore(65);
            dto.setConfidence(82);

            recommendations.add(dto);
        }
    }

    private void recommendTrending(
        Users user,
        List<RecommendationDTO> recommendations) {

        List<Hotel> hotels = hotelRepository.findAll();

        hotels.sort((a, b) ->
                Double.compare(b.getAverageRating(), a.getAverageRating()));

        int hotelCount = 0;

        for (Hotel hotel : hotels) {

            if (hotelCount == 3)
                break;

            RecommendationDTO dto = new RecommendationDTO();

            dto.setRecommendationId(hotel.getId());
            dto.setActionId(hotel.getId());
            dto.setType("HOTEL");
            dto.setTitle(hotel.getHotelName());
            dto.setDestination(hotel.getLocation());

            if (hotel.getDestinationCategory() != null)
                dto.setCategory(hotel.getDestinationCategory().name());

            dto.setAlgorithm("Trending");
            dto.setReason("Popular among travellers recently.");
            dto.setPrice(
                    hotel.getCurrentPricePerNight() > 0
                            ? hotel.getCurrentPricePerNight()
                            : hotel.getPricePerNight()
            );
            dto.setRating(hotel.getAverageRating());
            dto.setScore(40);
            dto.setConfidence(65);

            recommendations.add(dto);

            hotelCount++;
        }

        List<Flight> flights = flightRepository.findAll();

        flights.sort((a, b) ->
                Double.compare(b.getAverageRating(), a.getAverageRating()));

        int flightCount = 0;

        for (Flight flight : flights) {

            if (flightCount == 3)
                break;

            RecommendationDTO dto = new RecommendationDTO();

            dto.setRecommendationId(flight.getId());
            dto.setActionId(flight.getId());
            dto.setType("FLIGHT");
            dto.setTitle(flight.getFlightName());
            dto.setDestination(flight.getTo());

            if (flight.getDestinationCategory() != null)
                dto.setCategory(flight.getDestinationCategory().name());

            dto.setAlgorithm("Trending");
            dto.setReason("Currently a popular choice among travellers.");
            dto.setPrice(
                    flight.getCurrentPrice() > 0
                            ? flight.getCurrentPrice()
                            : flight.getPrice()
            );
            dto.setRating(flight.getAverageRating());
            dto.setScore(35);
            dto.setConfidence(60);

            recommendations.add(dto);

            flightCount++;
        }
    }

    private void removeDuplicates(
        List<RecommendationDTO> recommendations) {

        Map<String, RecommendationDTO> unique = new LinkedHashMap<>();

        for (RecommendationDTO recommendation : recommendations) {

            String key = recommendation.getType()
                    + "_"
                    + recommendation.getRecommendationId();

            if (!unique.containsKey(key)) {

                unique.put(key, recommendation);

            } else {

                RecommendationDTO existing = unique.get(key);

                if (recommendation.getScore() > existing.getScore()) {
                    unique.put(key, recommendation);
                }

            }
        }

        recommendations.clear();
        recommendations.addAll(unique.values());

    }

    private void applyFeedbackScores(
        Users user,
        List<RecommendationDTO> recommendations) {

        if (user.getRecommendationFeedback() == null ||
            user.getRecommendationFeedback().isEmpty()) {
            return;
        }

        Map<DestinationCategory, Integer> categoryScores = new HashMap<>();

        for (RecommendationFeedback feedback : user.getRecommendationFeedback()) {

            DestinationCategory category = null;

            if ("HOTEL".equals(feedback.getRecommendationType())) {

                Optional<Hotel> hotel =
                        hotelRepository.findById(feedback.getRecommendationId());

                if (hotel.isPresent()) {
                    category = hotel.get().getDestinationCategory();
                }

            } else if ("FLIGHT".equals(feedback.getRecommendationType())) {

                Optional<Flight> flight =
                        flightRepository.findById(feedback.getRecommendationId());

                if (flight.isPresent()) {
                    category = flight.get().getDestinationCategory();
                }
            }

            if (category == null)
                continue;

            int delta = feedback.isHelpful() ? 20 : -20;

            categoryScores.put(
                    category,
                    categoryScores.getOrDefault(category, 0) + delta
            );
        }

        for (RecommendationDTO dto : recommendations) {

            if (dto.getCategory() == null)
                continue;

            DestinationCategory category =
                    DestinationCategory.valueOf(dto.getCategory());

            if (categoryScores.containsKey(category)) {

                int score = dto.getScore() + categoryScores.get(category);

                score = Math.max(0, Math.min(score, 100));

                dto.setScore(score);

                dto.setReason(
                        dto.getReason()
                        + " Your previous feedback on similar destinations influenced this recommendation."
                );
            }
        }
    }

    private void sortRecommendations(
        List<RecommendationDTO> recommendations) {

        recommendations.sort((a, b) -> {

            if (b.getScore() != a.getScore()) {
                return Integer.compare(
                        b.getScore(),
                        a.getScore()
                );
            }

            return Integer.compare(
                    b.getConfidence(),
                    a.getConfidence()
            );

        });

    }

    public void saveFeedback(
        RecommendationFeedbackRequest request){

        Optional<Users> optionalUser =
                userRepository.findById(request.getUserId());

        if(optionalUser.isEmpty()){
            return;
        }

        Users user = optionalUser.get();

        RecommendationFeedback feedback =
                new RecommendationFeedback();

        feedback.setRecommendationId(
                request.getRecommendationId());

        feedback.setRecommendationType(
                request.getRecommendationType());

        feedback.setHelpful(
                request.isHelpful());

        feedback.setFeedbackTime(
                LocalDateTime.now());

        if(user.getRecommendationFeedback()==null){

            user.setRecommendationFeedback(
                    new ArrayList<>());

        }

        boolean updated = false;

        for (RecommendationFeedback old :
                user.getRecommendationFeedback()) {

            if (old.getRecommendationId().equals(feedback.getRecommendationId())
                    &&
                old.getRecommendationType().equals(feedback.getRecommendationType())) {

                old.setHelpful(feedback.isHelpful());
                old.setFeedbackTime(LocalDateTime.now());

                updated = true;
                break;
            }
        }

        if (!updated) {
            user.getRecommendationFeedback().add(feedback);
        }

        userRepository.save(user);

    }
}