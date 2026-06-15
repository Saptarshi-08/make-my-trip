package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/review")
@CrossOrigin("*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public Review createReview(
            @RequestBody Review review
    ){
        return reviewService.createReview(review);
    }

    @GetMapping("/{targetType}/{targetId}")
    public List<Review> getReviews(
            @PathVariable String targetType,
            @PathVariable String targetId,
            @RequestParam(required = false)
            String sort
    ){
        return reviewService.getReviews(
                targetType,
                targetId,
                sort
        );
    }

    @PostMapping("/{reviewId}/reply")
    public Review reply(
            @PathVariable String reviewId,
            @RequestBody Review.ReviewReply reply
    ){
        return reviewService.addReply(
                reviewId,
                reply
        );
    }

    @PostMapping("/{reviewId}/helpful")
    public Review helpful(
            @PathVariable String reviewId
    ){
        return reviewService.markHelpful(reviewId);
    }

    @PostMapping("/{reviewId}/flag")
    public Review flag(
            @PathVariable String reviewId,
            @RequestBody Map<String,String> body
    ){

        return reviewService.flagReview(
                reviewId,
                body.get("reason")
        );
    }
}