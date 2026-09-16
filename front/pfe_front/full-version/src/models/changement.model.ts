import { User } from './user.model';
import { Incident } from './incident.model';
import { StatutChangement } from './statutChangement.enum';
import { EvenementChangement } from './evenementChangement.enum';

export class Changement {
    id!: number;
    description!: string;
    statutChangement!: StatutChangement;
    evenementChangement!: EvenementChangement;
    dateCreation!: Date;
    dateDebutPrevu!: Date;
    dateFinPrevu!: Date;
    priorite!: string;
    categorie!: string;
    commentaire!: string;
    fichier!: ArrayBuffer;
    motif!: string;
    etapesMiseEnOeuvre!: string;
    actionsCorrectives!: string;
    evaluationRisques!: string;
    impactUtilisateurs!: string;
    historiqueModifications!: string;
    responsable!: User;
    incident!: Incident;
}
