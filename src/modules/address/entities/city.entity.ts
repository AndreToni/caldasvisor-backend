import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Address } from "./address.entity";
import { State } from "./state.entity";

@Entity()
export class City {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ibgeId: number;
    
    @Column()
    apiId: number;

    @Column()
	name: string;

    @ManyToOne(() => State, state => state.cities, {nullable: false, onDelete: 'CASCADE'})
    state: State;
    
    @OneToMany(() => Address, address => address.city)
    addresses: Address[];
}