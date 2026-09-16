    import { User } from './user.model';
    import { Changement } from './changement.model';
    import { StatutIncident } from './statutIncident.enum';
    import { Priorite } from './priorite.enum';
    import { EvenementIncident } from './evenementIncident.enum';

    export class Incident {
        id!: number;
        description!: string;
        impact!: string;
        categorie!: string;
        natureIncident!: string;
        dateCreation!: Date;
        dateResolution!: Date;
        echeance!: Date;
        historiqueActions!: string;
        statutIncident!: StatutIncident;
        priorite!: Priorite;
        evenementIncident!: EvenementIncident;
        fichier!: ArrayBuffer;
        archived!: boolean;
        user!: User;
        changements!: Changement[];
        affectedUsers!: [];
        filename:string;
        encodedfilename:string;
    }
