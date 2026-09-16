package tn.tunisair.workfow.Services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.tunisair.workfow.Entities.Incident;
import tn.tunisair.workfow.Entities.Probleme;
import tn.tunisair.workfow.Entities.Token;
import tn.tunisair.workfow.Entities.User;
import tn.tunisair.workfow.Interfaces.UserInterface;
import tn.tunisair.workfow.Repositories.TokenRepository;
import tn.tunisair.workfow.Repositories.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
@Slf4j
public class UserService implements UserInterface {
    private final UserRepository UserRepository;
    private final TokenRepository TokenRepository;
    private final PasswordEncoder passwordEncoder;
    public List<User> findAllUsers() {
        return UserRepository.findAll();
    }

    public User findById(Long id) {
        return UserRepository.findById(id).orElse(null);
    }

    @Override
    public Map<String, Object> findAffecteIssues(Long id) {
        User user = UserRepository.findById(id).orElse(null);
        if(user == null) {
            return null;
        }
        Map <String, Object> result = new HashMap<>();

        List<Probleme> Problemes = user.getAffcetedProblemes();
        result.put("Problemes", Problemes);
        List<Incident> Incidents = user.getAffcetedIncidents();
        result.put("Incidents", Incidents);

        System.out.println(result.get("Problemes"));

        return result;


    }

    public User updateUser(Long id, User user) {
        User userToUpdate = UserRepository.findById(id).orElse(null);
        if(userToUpdate == null) {
            return null;
        }
        userToUpdate.setFirstname(user.getFirstname());
        userToUpdate.setLastname(user.getLastname());
        userToUpdate.setEmail(user.getEmail());
        userToUpdate.setPassword(passwordEncoder.encode(user.getPassword()));
        userToUpdate.setRole(user.getRole());
        return UserRepository.save(userToUpdate);
    }

    public void deleteUser(Long id) {

        User user = UserRepository.findById(id).orElse(null);
        if(user == null) {
            return;
        }

        user.getAffcetedIncidents().forEach(incident -> {
            incident.getAffectedUsers().remove(user);
        });

        user.getAffcetedProblemes().forEach(probleme -> {
            probleme.getAffectedUsers().remove(user);
        });

        List<Token> tokens = TokenRepository.findByUser(user);

        TokenRepository.deleteAll(tokens);

        UserRepository.delete(user);

    }

    @Override
    public User ChangePassword(User user) {
        User userToUpdate = UserRepository.findById(user.getId()).orElse(null);
        if(userToUpdate == null) {
            return null;
        }
        userToUpdate.setPassword(passwordEncoder.encode(user.getPassword()));
        return UserRepository.save(userToUpdate);
    }
}
