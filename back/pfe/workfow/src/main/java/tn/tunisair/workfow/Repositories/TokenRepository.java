package tn.tunisair.workfow.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.tunisair.workfow.Entities.Token;
import tn.tunisair.workfow.Entities.User;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token,Long> {
    Optional<Token> findByToken(String token);

    List<Token> findByUser(User user);
}
