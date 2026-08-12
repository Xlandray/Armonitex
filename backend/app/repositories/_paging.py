from __future__ import annotations

from collections.abc import Sequence
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute
from sqlalchemy.sql.elements import ColumnElement


async def paginate[ModelT](
    session: AsyncSession,
    model: type[ModelT],
    *,
    conditions: Sequence[ColumnElement[bool]] = (),
    order_by: Sequence[Any] = (),
    options: Sequence[Any] = (),
    offset: int,
    limit: int,
) -> tuple[list[ModelT], int]:
    """One page of ``model`` plus the total row count under the same conditions.

    The count runs against the model directly rather than a subquery, so eager
    loading passed via ``options`` never leaks into the counting query.
    """
    statement = (
        select(model)
        .where(*conditions)
        .options(*options)
        .order_by(*order_by)
        .offset(offset)
        .limit(limit)
    )
    rows = await session.execute(statement)
    total = await session.scalar(select(func.count()).select_from(model).where(*conditions))
    return list(rows.scalars()), total or 0


def sort_clause(
    columns: dict[str, InstrumentedAttribute[Any]], sort: str
) -> tuple[Any, ...]:
    """Map a sort key ("title" ascending, "-title" descending) onto ORDER BY.

    The route layer constrains ``sort`` with a ``Literal``, so every value that
    reaches here is already valid; an unknown key means that ``Literal`` and this
    column map drifted apart, and raising is the correct response.
    """
    descending = sort.startswith("-")
    column = columns[sort.removeprefix("-")]
    return (column.desc() if descending else column.asc(),)
