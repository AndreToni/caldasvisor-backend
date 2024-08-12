import { Location } from "src/entities/location.entity";
import { OpeningHour } from "src/modules/opening-hours/entities/opening-hour.entity";
import { Ticket } from "src/modules/tickets/entities/ticket.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Event extends Location {
    @Column({nullable: true})
    sponsors: string;

    @OneToMany(() => Ticket, ticket => ticket.event)
    tickets: Ticket[];

    @OneToMany(() => OpeningHour, openingHours => openingHours.event)
    openingHours: OpeningHour[];

    @ManyToOne(() => User, user => user.events, {nullable: false, onDelete: 'CASCADE'})
    organizer: User;
}
