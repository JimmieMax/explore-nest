import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'channel' })
export class CatsEntity {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'channel_name' })
  name: string;
}
