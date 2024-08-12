import { DayOfWeek } from "src/enums/day-week.enum";
import { Location } from "src/entities/location.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TouristAttraction } from "src/modules/tourist-attractions/entities/tourist-attraction.entity";
import { Event } from "src/modules/events/entities/event.entity";

@Entity()
export class OpeningHour {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'simple-enum', enum: DayOfWeek})
    dayOfWeek: DayOfWeek;

    @Column({type: 'datetime', nullable: true})
    date: Date;

    @Column({nullable: true})
    description: string;

    @Column('time')
    startTime: string;

    @Column('time')
    endTime: string;

    @ManyToOne(() => TouristAttraction, (touristAttraction) => touristAttraction.openingHours, {onDelete: 'CASCADE'})
    touristAttraction: TouristAttraction;
    
    @ManyToOne(() => Event, event => event.openingHours, {onDelete: 'CASCADE'})
    event: Event;
}
