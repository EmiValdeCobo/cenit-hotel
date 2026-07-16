"""Agregar columna activado a la tabla descuento (módulo Extras)

Revision ID: 0001_add_activado_descuento
Revises:
Create Date: 2026-07-15

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "0001_add_activado_descuento"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "descuento",
        sa.Column("activado", sa.Boolean(), nullable=False, server_default="true"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("descuento", "activado")
