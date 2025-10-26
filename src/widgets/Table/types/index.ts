export interface TableColumn {
  title: string;
  field: string;
  type?: TypeCell;
  link?: string;
}

export type TypeCell = "image" | "link" | "duration";
