package tn.tunisair.workfow.Auth;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.tunisair.workfow.Config.JwtUtil;
import tn.tunisair.workfow.Email.EmailService;
import tn.tunisair.workfow.Email.EmailTemplateName;
import tn.tunisair.workfow.Entities.RoleUser;
import tn.tunisair.workfow.Entities.Token;
import tn.tunisair.workfow.Entities.User;
import tn.tunisair.workfow.Repositories.TokenRepository;
import tn.tunisair.workfow.Repositories.UserRepository;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final EmailService emailService;
    private final TokenRepository tokenRepository;

    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;
    @Value("${application.mailing.frontend.recovery-url}")
    private String recoveryUrl;

    @Autowired
    private JwtUtil jwtUtil;



    public void register(RegistrationRequest request) throws MessagingException {
        try {
            var user = tn.tunisair.workfow.Entities.User.builder()
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .accountLocked(false)
                    .enabled(false)
                    .role(RoleUser.valueOf(request.getRole()))
                    .build();
            userRepository.save(user);
            sendValidationEmail(user);
        } catch (Exception ex) {
            // Log or handle the exception appropriately
            ex.printStackTrace();
            throw new MessagingException("Error occurred during user registration", ex);
        }
    }

    private void sendValidationEmail(User user) throws MessagingException {
        try {
            var newToken = generateAndSaveActivationToken(user);
            emailService.sendEmail(
                    user.getEmail(),
                    user.fullName(),
                    EmailTemplateName.ACTIVATE_ACCOUNT,
                    activationUrl,
                    newToken,
                    "Account activation",
                    0L
            );
        } catch (Exception ex) {
            // Log or handle the exception appropriately
            ex.printStackTrace();
            throw new MessagingException("Error occurred while sending validation email", ex);
        }
    }

    public void sendRecoveryEmail(String mail) throws MessagingException {
        try {
            User user = userRepository.findByEmail(mail).orElse(null);
            if(user!= null){
                var newToken = generateAndSaveActivationToken(user);
                emailService.sendEmail(
                        mail,
                        user.fullName(),
                        EmailTemplateName.RECOVER_ACCOUNT,
                        recoveryUrl,
                        newToken,
                        "Account Recovery",
                        0L
                );
            }

        } catch (Exception ex) {
            // Log or handle the exception appropriately
            ex.printStackTrace();
            throw new MessagingException("Error occurred while sending validation email", ex);
        }
    }

    private String generateAndSaveActivationToken(User user) {
        try {
            String generatedToken = generateActivationCode(6);
            var token = Token.builder()
                    .token(generatedToken)
                    .createdAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusMinutes(15))
                    .user(user)
                    .build();
            tokenRepository.save(token);
            return generatedToken;
        } catch (Exception ex) {
            // Log or handle the exception appropriately
            ex.printStackTrace();
            throw ex;
        }
    }

    private String generateActivationCode(int length) {
        try {
            String characters = "0123456789";
            StringBuilder codeBuilder = new StringBuilder();
            SecureRandom secureRandom = new SecureRandom();
            for (int i = 0; i < length; i++) {
                int randomIndex = secureRandom.nextInt(characters.length());
                codeBuilder.append(characters.charAt(randomIndex));
            }
            return codeBuilder.toString();
        } catch (Exception ex) {
            // Log or handle the exception appropriately
            ex.printStackTrace();
            throw ex;
        }
    }

    public String activateAccount(String code) {
        try {
            var token = tokenRepository.findByToken(code).orElse(null);

            if(token == null){
                return "Invalid token";
            }

            if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
                return "Token expired";
            }

            token.getUser().setEnabled(true);
            token.setValidatedAt(LocalDateTime.now());

            userRepository.save(token.getUser());
            return "Success";
        } catch (Exception ex) {
            ex.printStackTrace();
            throw ex;
        }
    }

    public Boolean changePasswordAfterActivation(String code, String newPassword) {
        try {
            var token = tokenRepository.findByToken(code).orElse(null);
            if(token == null){
                return false;
            }
            if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
                return false;
            }

            User user = token.getUser();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);


            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            throw ex;
        }
    }

    public Map<String, Object> login(LoginRequest request) {
        try {

            Map<String, Object> response = new HashMap<>();
            Optional<User> user = userRepository.findByEmail(request.getEmail());

            if(user.isEmpty()){
                response.put("message", "User not found");
                return response;
            }
            if(!user.get().isEnabled()){
                response.put("message", "Account not activated");
                return response;
            }

            if (!passwordEncoder.matches(request.getPassword(), String.valueOf(user.get().getPassword()))) {
                response.put("message", "Invalid password");
                return response;
            }

            String token = jwtUtil.generateToken(user);

            response.put("id", user.get().getId());
            response.put("email", user.get().getEmail());
            response.put("firstname", user.get().getFirstname());
            response.put("lastname", user.get().getLastname());
            response.put("role", user.get().getRole());
            response.put("token", token);

            return response;

        } catch (Exception ex) {
            ex.printStackTrace();
            throw ex;
        }
    }
}
