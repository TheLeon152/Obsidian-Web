from pydantic import BaseModel


class TaskUpdate(BaseModel):
    path: str
    line: int
    completed: bool