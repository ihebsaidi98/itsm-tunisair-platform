package tn.tunisair.workfow.Config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI springShopOpenAPI() {
        return new OpenAPI()
                .info(infoAPI());

    }

    public Info infoAPI() {
        return new Info().title("Examen spring")
                .description("Iheb Saidi")
                .contact(contactAPI());
    }

    public Contact contactAPI() {
        return new Contact().name("Iheb Saidi")
                .email("saidi.iheb@esprit.tn");
    }






    @Bean
    public GroupedOpenApi utilisateurPublicApi() {
        return GroupedOpenApi.builder()
                .group("personne management API")
                .pathsToMatch("/incident/**") //tbadel hedhi 3la 7asb l request mapping mte3k
                .pathsToExclude("**")
                .build();
    }



}