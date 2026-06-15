package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import com.makemytrip.makemytrip.repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private FlightRepository flightRepository;

    public Review createReview(Review review) {

        Review saved = reviewRepository.save(review);

        recalculateRatings(
                review.getTargetType(),
                review.getTargetId()
        );

        return saved;
    }

    public List<Review> getReviews(
            String targetType,
            String targetId,
            String sort
    ) {

        List<Review> reviews =
                reviewRepository.findByTargetTypeAndTargetIdAndRemovedFalse(
                        targetType,
                        targetId
                );

        if(sort == null)
            return reviews;

        switch (sort.toLowerCase()) {

            case "highest":
                reviews.sort(
                        Comparator.comparingInt(Review::getRating)
                                .reversed()
                );
                break;

            case "helpful":
                reviews.sort(
                        Comparator.comparingInt(Review::getHelpfulCount)
                                .reversed()
                );
                break;

            default:
                reviews.sort(
                        Comparator.comparing(Review::getCreatedAt)
                                .reversed()
                );
        }

        return reviews;
    }

    public Review addReply(
            String reviewId,
            Review.ReviewReply reply
    ) {

        Review review =
                reviewRepository.findById(reviewId)
                        .orElseThrow();

        review.getReplies().add(reply);

        return reviewRepository.save(review);
    }

    public Review markHelpful(String reviewId){

        Review review =
                reviewRepository.findById(reviewId)
                        .orElseThrow();

        review.setHelpfulCount(
                review.getHelpfulCount()+1
        );

        return reviewRepository.save(review);
    }

    public Review flagReview(
            String reviewId,
            String reason
    ){

        Review review =
                reviewRepository.findById(reviewId)
                        .orElseThrow();

        review.setFlagged(true);
        review.setFlagReason(reason);

        return reviewRepository.save(review);
    }

    public List<Review> getFlaggedReviews(){
        return reviewRepository.findByFlaggedTrue();
    }

    public Review removeReview(String reviewId){

        Review review =
                reviewRepository.findById(reviewId)
                        .orElseThrow();

        review.setRemoved(true);

        Review saved =
                reviewRepository.save(review);

        recalculateRatings(
                review.getTargetType(),
                review.getTargetId()
        );

        return saved;
    }

    public void recalculateRatings(
            String targetType,
            String targetId
    ){

        List<Review> reviews =
                reviewRepository.findByTargetTypeAndTargetIdAndRemovedFalse(
                        targetType,
                        targetId
                );

        double avg = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0);

        int count = reviews.size();

        if(targetType.equalsIgnoreCase("HOTEL")){

            Hotel hotel =
                    hotelRepository.findById(targetId)
                            .orElse(null);

            if(hotel != null){

                hotel.setAverageRating(avg);
                hotel.setReviewCount(count);

                hotelRepository.save(hotel);
            }
        }

        if(targetType.equalsIgnoreCase("FLIGHT")){

            Flight flight =
                    flightRepository.findById(targetId)
                            .orElse(null);

            if(flight != null){

                flight.setAverageRating(avg);
                flight.setReviewCount(count);

                flightRepository.save(flight);
            }
        }
    }
}