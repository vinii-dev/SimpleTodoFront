export interface TodoItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
}

export interface TodoItemCreate {
  title: string;
  description: string;
}

export interface TodoItemUpdate {
  title: string;
  description: string;
}

export interface TodoItemPatch {
  isCompleted: boolean;
}
