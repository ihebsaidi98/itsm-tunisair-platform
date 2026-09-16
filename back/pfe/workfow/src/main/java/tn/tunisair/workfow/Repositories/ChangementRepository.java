package tn.tunisair.workfow.Repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.tunisair.workfow.Entities.Changement;

import java.util.List;

@Repository
public interface ChangementRepository extends JpaRepository<Changement, Integer> {
    List<Changement> findByResponsableId(Integer userId);

}
