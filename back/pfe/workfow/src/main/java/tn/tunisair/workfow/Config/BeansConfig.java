package tn.tunisair.workfow.Config;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import tn.tunisair.workfow.Entities.EvenementIncident;
import tn.tunisair.workfow.Entities.Incident;
import tn.tunisair.workfow.Entities.StatutIncident;
import org.springframework.statemachine.action.Action;
import tn.tunisair.workfow.Repositories.IncidentRepository;
import java.util.Date;

import static org.hibernate.query.sqm.tree.SqmNode.log;


@Configuration
@RequiredArgsConstructor
@Slf4j

public class BeansConfig {


    private final UserDetailsService userDetailsService;




    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {return new BCryptPasswordEncoder();
    }

    @Configuration
    public class AppConfig {
        @Value("${upload.directory}")
        private String uploadDir;

        @Bean
        public String uploadDirBean() {
            return uploadDir;
        }
    }

}
