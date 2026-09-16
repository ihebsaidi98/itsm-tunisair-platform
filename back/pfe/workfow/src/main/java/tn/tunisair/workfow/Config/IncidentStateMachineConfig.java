package tn.tunisair.workfow.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachineFactory;
import org.springframework.statemachine.config.StateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;
import org.springframework.statemachine.config.builders.StateMachineConfigurationConfigurer;
import org.springframework.statemachine.listener.StateMachineListenerAdapter;
import org.springframework.statemachine.state.State;
import tn.tunisair.workfow.Entities.StatutIncident;
import tn.tunisair.workfow.Entities.EvenementIncident;

@Configuration
@EnableStateMachineFactory
public class IncidentStateMachineConfig extends StateMachineConfigurerAdapter<StatutIncident, EvenementIncident> {

    @Override
    public void configure(StateMachineStateConfigurer<StatutIncident, EvenementIncident> states) throws Exception {
        states
                .withStates()
                .initial(StatutIncident.SIGNALE)
                .state(StatutIncident.EN_COURS)
                .state(StatutIncident.RESOLU);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<StatutIncident, EvenementIncident> transitions) throws Exception {
        transitions
                .withExternal().source(StatutIncident.SIGNALE).target(StatutIncident.EN_COURS).event(EvenementIncident.COMMENCER_TRAVAIL)
                .and()
                .withExternal().source(StatutIncident.EN_COURS).target(StatutIncident.RESOLU).event(EvenementIncident.RESOUDRE);
    }

    @Override
    public void configure(StateMachineConfigurationConfigurer<StatutIncident, EvenementIncident> config) throws Exception {
        config
                .withConfiguration()
                .autoStartup(true)
                .listener(listener());
    }

    @Bean
    public StateMachineListenerAdapter<StatutIncident, EvenementIncident> listener() {
        return new StateMachineListenerAdapter<StatutIncident, EvenementIncident>() {
            @Override
            public void stateChanged(State<StatutIncident, EvenementIncident> from, State<StatutIncident, EvenementIncident> to) {
                System.out.println("State changed from " + from + " to " + to);
            }
        };
    }
}
