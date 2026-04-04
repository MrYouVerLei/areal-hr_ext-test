export class ChangelogDto {
  date_time: string;
  object_type: string;
  field_name: string;
  old_value?: string;
  new_value?: string;
  user_id: number;
}