from datetime import datetime

from pydantic import BaseModel


class InboxNote(BaseModel):

    filename: str
    content: str


class InboxNoteSummary(BaseModel):

    filename: str
    modified_at: datetime | None = None


class CreateInboxNote(BaseModel):

    filename: str
    content: str


class UpdateInboxNote(BaseModel):

    content: str