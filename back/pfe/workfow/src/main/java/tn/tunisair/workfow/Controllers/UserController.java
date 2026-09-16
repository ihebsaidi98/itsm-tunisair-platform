package tn.tunisair.workfow.Controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.tunisair.workfow.Entities.User;
import tn.tunisair.workfow.Services.UserService;

import java.util.List;


@CrossOrigin(origins = "http://localhost:4200")
@RestController
@AllArgsConstructor
@RequestMapping("/user")
@Tag(name = "Users Management")
public class UserController {

    private final UserService UserService;


    // Needs verification from admin role
    @Operation(description = "Find all users")
    @GetMapping("/list")
    public List<User> getAllUsers() {
        return UserService.findAllUsers();
    }

    @Operation(description = "Find a user by id")
    @GetMapping("/{id}")
    public User getUser(
            @PathVariable Long id
    ){
        return UserService.findById(id);
    }

    @Operation(description = "Find all issues assigned to a user")
    @GetMapping("/issues/{id}")
    public Object getIssues(@PathVariable Long id){
        return UserService.findAffecteIssues(id);
    }

    @Operation(description = "update user")
    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable Long id, @ModelAttribute User user){
        return UserService.updateUser(id, user);
    }

    @Operation(description = "delete user")
    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable Long id){
        UserService.deleteUser(id);
    }

    @Operation(description = "Change password")
    @PutMapping("/change-password")
    public User changePassword(@RequestBody User user){
        return UserService.ChangePassword(user);
    }


}
