interface Result {
  label: string;
  value: string;
  detail?: string;
  type?: string;
  /** Created time in seconds since epoch */
  created: number;
}