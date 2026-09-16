package tn.tunisair.workfow.Auth;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(
            @RequestBody @Valid RegistrationRequest request
    ) throws MessagingException {
        service.register(request);
        return ResponseEntity.accepted().build();
    }

    @Operation(description = "Activate Account")
    @PostMapping("/activate-account/{code}")
    public ResponseEntity<Map<String, String>> activateAccount(@PathVariable String code) {
        String response = service.activateAccount(code);
        Map<String, String> jsonResponse = new HashMap<>();
        jsonResponse.put("message", response);
        return ResponseEntity.ok(jsonResponse);
    }


    @Operation(description = "Change password after activation")
    @PostMapping("/changepassword/{code}")
    public ResponseEntity<Map<String, Boolean>> changePasswordAfterActivation(@PathVariable String code, @RequestBody String password) {
        Boolean response = service.changePasswordAfterActivation(code, password);
        Map<String, Boolean> jsonResponse = new HashMap<>();
        jsonResponse.put("message", response);
        return ResponseEntity.ok(jsonResponse);
    }

    @Operation(description = "Login")
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        return service.login(request);
    }

    @Operation(description = "Login")
    @PostMapping("/recover-account")
    public void recoveraccount(@RequestBody String email) throws MessagingException {
         service.sendRecoveryEmail(email);
    }

}
