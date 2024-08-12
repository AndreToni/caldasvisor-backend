import { TypeTicket } from "src/enums/type-ticket.enum";
import { Location } from "src/entities/location.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TouristAttraction } from "src/modules/tourist-attractions/entities/tourist-attraction.entity";
import { Event } from "src/modules/events/entities/event.entity";

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'simple-enum', enum: TypeTicket})
    type: TypeTicket;

    @Column('decimal')
    value: string;
    
    @Column({nullable: true})
    link: string;

    @ManyToOne(() => TouristAttraction, touristAttraction => touristAttraction.tickets, {onDelete: 'CASCADE'})
    touristAttraction: TouristAttraction;
    
    @ManyToOne(() => Event, event => event.tickets, {onDelete: 'CASCADE'})
    event: Event;
}
