import random
import string

from app.models.status_enum import ProjectStatus

def random_lower_string() -> str:
    return "".join(random.choices(string.ascii_lowercase, k=32))

def random_project_status() -> ProjectStatus:
    return random.choice(list(ProjectStatus))