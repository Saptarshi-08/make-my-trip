package com.makemytrip.makemytrip.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.RecommendationFeedback;
import com.makemytrip.makemytrip.services.UserServices;
import com.makemytrip.makemytrip.services.RecommendationServices;
import com.makemytrip.makemytrip.dto.RecommendationFeedbackRequest;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserServices userServices;

    @Autowired
    private RecommendationServices recommendationServices;

    @PostMapping("/login")
    public Users login(@RequestParam String email,@RequestParam String password){
        return userServices.login(email,password);
    }
    @PostMapping("/signup")
    public ResponseEntity<Users> signup(@RequestBody Users user){
        return ResponseEntity.ok(userServices.signup(user));
    }
    @GetMapping("/email")
    public ResponseEntity<Users> getuserbyemail(@RequestParam String email){
        Users user = userServices.getUserByEmail(email);
        if(user != null){
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
    @PostMapping("/edit")
    public Users editprofile(@RequestParam String id ,@RequestBody Users updatedUser){
        return userServices.editprofile(id,updatedUser);
    }

    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<?> getRecommendations(
            @PathVariable String userId){

        return ResponseEntity.ok(
                recommendationServices.getRecommendations(userId)
        );

    }

    @PostMapping("/recommendation-feedback")
    public ResponseEntity<?> recommendationFeedback(
            @RequestBody RecommendationFeedbackRequest request){

        recommendationServices.saveFeedback(request);

        return ResponseEntity.ok("Feedback Saved");

    }
}