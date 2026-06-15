package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/moderation")
@CrossOrigin("*")
public class ModerationController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/flagged")
    public List<Review> flaggedReviews(){

        return reviewService.getFlaggedReviews();
    }

    @PutMapping("/remove/{id}")
    public Review removeReview(
            @PathVariable String id
    ){

        return reviewService.removeReview(id);
    }
}