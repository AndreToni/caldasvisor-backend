import { hashSync } from "bcrypt";
import { TypeUser } from "src/enums/type-user.enum";
import { Event } from "src/modules/events/entities/event.entity";
import { Token } from "src/modules/tokens/entities/token.entity";
import { TouristAttraction } from "src/modules/tourist-attractions/entities/tourist-attraction.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({type: 'simple-enum', enum: TypeUser, default: TypeUser.customer})
    type: TypeUser;

    @Column({default: false})
    active: boolean;

    @Column({nullable: true})
    companyName: string;

    @Column({nullable: true})
    companyDocument: string;

    @Column({nullable: true})
    cep: string;

    @Column({nullable: true})
    state: string;

    @Column({nullable: true})
    city: string;

    @Column({nullable: true})
    address: string;

    @OneToMany(() => Token, token => token.user)
    tokens: Token[]

    @OneToMany(() => Event, event => event.organizer)
    events: [];

    @OneToMany(() => TouristAttraction, touristAttractions => touristAttractions.organizer)
    touristAttractions: TouristAttraction[];

    @BeforeInsert()
    hashPassword() {
        this.password = hashSync(this.password, 10);
    }
}
