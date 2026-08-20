from datetime import date, timedelta

from app.models.task import Task
from app.models.task_workload import TaskWorkload

from app.services.vault_indexer import VaultIndexer


class TaskService:

    def __init__(
        self,
        vault_indexer: VaultIndexer,
    ):
        self.vault_indexer = vault_indexer


    def get_all_tasks(self) -> list[Task]:

        index = self.vault_indexer.get_index()

        tasks: list[Task] = []

        for note in index.values():
            tasks.extend(note.tasks)

        return tasks


    def get_open_tasks(self) -> list[Task]:

        return [
            task
            for task in self.get_all_tasks()
            if not task.completed
        ]


    def get_today_tasks(
        self,
        today: date | None = None,
    ) -> list[Task]:

        if today is None:
            today = date.today()

        tasks = [
            task
            for task in self.get_open_tasks()
            if task.deadline == today
        ]

        return self._sort_by_priority(
            tasks
        )


    def get_upcoming_tasks(
        self,
        days: int = 7,
        today: date | None = None,
    ) -> list[Task]:

        if today is None:
            today = date.today()

        horizon = (
            today
            + timedelta(days=days)
        )

        tasks = [
            task
            for task in self.get_open_tasks()
            if (
                task.deadline is not None
                and today < task.deadline <= horizon
            )
        ]

        return sorted(
            tasks,
            key=lambda task: (
                task.deadline,
                self._priority_value(
                    task.priority
                ),
            ),
        )


    def get_next_tasks(
        self,
        limit: int = 10,
    ) -> list[Task]:

        tasks = self.get_open_tasks()

        tasks.sort(
            key=self._next_task_sort_key
        )

        return tasks[:limit]


    def get_waiting_tasks(self) -> list[Task]:

        tasks = [
            task
            for task in self.get_open_tasks()
            if task.task_state == "⏳"
        ]

        return sorted(
            tasks,
            key=self._follow_up_sort_key,
        )


    def get_blocked_tasks(self) -> list[Task]:

        return [
            task
            for task in self.get_open_tasks()
            if task.task_state == "🚧"
        ]


    def _sort_by_priority(
        self,
        tasks: list[Task],
    ) -> list[Task]:

        return sorted(
            tasks,
            key=lambda task:
                self._priority_value(
                    task.priority
                ),
        )


    def _priority_value(
        self,
        priority: str | None,
    ) -> int:

        return {
            "high": 1,
            "medium": 2,
            "low": 3,
        }.get(priority, 99)


    def _next_task_sort_key(
        self,
        task: Task,
    ) -> tuple:

        deadline_value = (
            task.deadline
            if task.deadline is not None
            else date.max
        )

        return (
            deadline_value,
            self._priority_value(
                task.priority
            ),
        )


    def _follow_up_sort_key(
        self,
        task: Task,
    ) -> date:

        if task.follow_up is None:
            return date.max

        return task.follow_up


    def get_workload(
        self,
        days: int = 7,
        today: date | None = None,
    ) -> TaskWorkload:

        if today is None:
            today = date.today()

        upcoming = self.get_upcoming_tasks(
            days=days,
            today=today,
        )

        waiting = [
            task
            for task in self.get_open_tasks()
            if task.task_state == "⏳"
        ]

        blocked = [
            task
            for task in self.get_open_tasks()
            if task.task_state == "🚧"
        ]

        deadline_count = len(upcoming)

        high_priority_count = sum(
            1
            for task in upcoming
            if task.priority == "high"
        )

        waiting_count = len(waiting)
        blocked_count = len(blocked)


        if deadline_count <= 2:

            level = "Niedrig"
            score = 2

        elif deadline_count <= 4:

            level = "Moderat"
            score = 5

        elif deadline_count <= 6:

            level = "Hoch"
            score = 8

        else:

            level = "Sehr hoch"
            score = 10


        return TaskWorkload(
            days=days,

            deadline_count=deadline_count,
            high_priority_count=high_priority_count,

            waiting_count=waiting_count,
            blocked_count=blocked_count,

            level=level,
            score=score,
        )