from fastapi import APIRouter, Query

from app.models.task import Task
from app.models.task_workload import TaskWorkload

from app.services.task_service import TaskService
from app.models.task_update import TaskUpdate
from app.services.task_write_service import TaskWriteService
from app.services.vault import vault_indexer


router = APIRouter(
    prefix="/api/v1/tasks",
    tags=["tasks"],
)


task_service = TaskService(
    vault_indexer
)

task_write_service = TaskWriteService(
    vault_indexer.vault_path
)


@router.get(
    "",
    response_model=list[Task],
)
def get_tasks() -> list[Task]:

    return task_service.get_open_tasks()


@router.get(
    "/today",
    response_model=list[Task],
)
def get_today_tasks() -> list[Task]:

    return task_service.get_today_tasks()


@router.get(
    "/upcoming",
    response_model=list[Task],
)
def get_upcoming_tasks(
    days: int = Query(
        default=7,
        ge=1,
        le=365,
    ),
) -> list[Task]:

    return task_service.get_upcoming_tasks(
        days
    )


@router.get(
    "/next",
    response_model=list[Task],
)
def get_next_tasks(
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
    ),
) -> list[Task]:

    return task_service.get_next_tasks(
        limit
    )


@router.get(
    "/waiting",
    response_model=list[Task],
)
def get_waiting_tasks() -> list[Task]:

    return task_service.get_waiting_tasks()


@router.get(
    "/blocked",
    response_model=list[Task],
)
def get_blocked_tasks() -> list[Task]:

    return task_service.get_blocked_tasks()


@router.get(
    "/workload",
    response_model=TaskWorkload,
)
def get_workload(
    days: int = Query(
        default=7,
        ge=1,
        le=365,
    ),
) -> TaskWorkload:

    return task_service.get_workload(
        days
    )


@router.patch(
    "",
    response_model=Task,
)
def update_task(
    update: TaskUpdate,
) -> Task:

    task_write_service.update_task(
        update
    )

    vault_indexer.build()

    tasks = (
        task_service.get_all_tasks()
    )

    for task in tasks:

        if (
            task.path == update.path
            and task.line == update.line
        ):
            return task

    raise ValueError(
        "Updated task could not be found."
    )