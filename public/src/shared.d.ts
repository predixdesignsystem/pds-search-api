interface Result {
  label: string;
  value: string;
  detail?: string;
  type?: string;
  /** Created time in seconds since epoch */
  created: number;
  /** An anonymous animal identifier to show for the user */
  animal?: AnonAnimal;
}

interface AnonAnimal {
  name: string;
  color: string;
}