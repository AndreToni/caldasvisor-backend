import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { City } from "./city.entity";
import { State } from "./state.entity";

type Location = {
    lat: number;
    lng: number;
}

@Entity()
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    nation: string;

    @ManyToOne(() => State, state => state.addresses, {eager: true})
    state: State;

    @ManyToOne(() => City, city => city.addresses, {eager: true})
    city: City;

    @Column({ nullable: true })
    route: string;

    @Column({ nullable: true })
    number: string;
    
    @Column({ nullable: true })
    number_string: string;

    @Column({ nullable: true })
    zipcode: string;
    
    @Column({ nullable: true })
    complement: string;

    @Column({ nullable: true })
    place_id: string;

    @Column({ nullable: true })
    formatted_address: string;

    @Column({ type: 'simple-json', nullable: true })
    location: Location;
}