from datetime import date
from typing import Literal

from pydantic import BaseModel


TaskPriority = Literal[
    "high",
    "medium",
    "low",
]


TaskState = Literal[
    "▶️",
    "⏳",
    "🚧",
]


class Task(BaseModel):

    text: str
    path: str
    line: int

    completed: bool

    priority: TaskPriority | None = None
    deadline: date | None = None

    task_state: TaskState | None = None

    waiting_for: str | None = None
    waiting_since: date | None = None
    follow_up: date | None = None

    blocked_by: str | None = None