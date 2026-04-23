from datetime import datetime, timezone
from typing import Any


def get_datetime() -> datetime:
    return datetime.now(timezone.utc)


def get_field_changes(
    old: dict[str, Any], new: dict[str, Any]
) -> list[dict[str, Any]] | None:
    exclude = {"id", "created_at", "updated_at"}
    changes = []

    all_keys = set(old.keys()) | set(new.keys())

    for key in all_keys:
        if key in exclude:
            continue
        old_val = old.get(key)
        new_val = new.get(key)

        if old_val != new_val:
            changes.append(
                {"field_name": key, "old_value": old_val, "new_value": new_val}
            )
    return changes
