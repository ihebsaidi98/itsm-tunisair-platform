import { StatutProbleme } from './statutProbleme.enum';
import { Priorite } from './priorite.enum';
import {User} from "./user.model";

export class Probleme {
    id!: number;
    description!: string;
    impact!: string;
    statutProbleme!: StatutProbleme;
    priorite!: Priorite;
    dateCreation!: Date;
    dateResolution!: Date;
    fichier!: ArrayBuffer;
    affectedUsers!: [];
    user:User
    filename:string;
    encodedfilename:string;
    archived:boolean;
}
