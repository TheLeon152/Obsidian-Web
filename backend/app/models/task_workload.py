from typing import Literal

from pydantic import BaseModel


WorkloadLevel = Literal[
    "Niedrig",
    "Moderat",
    "Hoch",
    "Sehr hoch",
]


class TaskWorkload(BaseModel):

    days: int

    deadline_count: int
    high_priority_count: int

    waiting_count: int
    blocked_count: int

    level: WorkloadLevel
    score: int