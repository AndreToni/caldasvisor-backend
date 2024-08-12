import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Location {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    zipCode: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column({type: 'decimal', precision: 10, scale: 8, nullable: true})
    lat: number;
    
    @Column({type: 'decimal', precision: 10, scale: 8, nullable: true})
    lng: number;

    @Column('varchar', { length: 400 })
    description: string;

    @Column({nullable: true})
    admissionFee: boolean;

    @Column({type: 'simple-array', nullable: true})
    images: Array<string>;
}
