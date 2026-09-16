package tn.tunisair.workfow;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.statemachine.config.EnableStateMachine;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableStateMachine
public class WorkfowApplication {

	public static void main(String[] args) {
		SpringApplication.run(WorkfowApplication.class, args);
	}

}
