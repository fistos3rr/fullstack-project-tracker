from enum import StrEnum, auto

class ProjectStatus(StrEnum):
    PLANNED = auto()
    ACTIVE = auto()
    COMPLETED = auto()