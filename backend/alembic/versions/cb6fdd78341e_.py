"""empty message

Revision ID: cb6fdd78341e
Revises: b072d57f3633
Create Date: 2025-05-13 20:28:46.067005

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = 'cb6fdd78341e'
down_revision: Union[str, None] = 'b072d57f3633'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('orders', sa.Column('payment_date', sa.DATE(), nullable=True))
    op.alter_column('orders', 'updated_date',
               existing_type=sa.DATE(),
               nullable=True)
    op.alter_column('orders', 'start_price',
               existing_type=mysql.DECIMAL(precision=10, scale=2),
               nullable=True)
    op.alter_column('orders', 'final_price',
               existing_type=mysql.DECIMAL(precision=10, scale=2),
               nullable=True)
    op.alter_column('orders', 'start_date',
               existing_type=sa.DATE(),
               nullable=True)
    op.alter_column('orders', 'end_date',
               existing_type=sa.DATE(),
               nullable=True)
    op.drop_column('orders', 'payement_date')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('orders', sa.Column('payement_date', sa.DATE(), nullable=False))
    op.alter_column('orders', 'end_date',
               existing_type=sa.DATE(),
               nullable=False)
    op.alter_column('orders', 'start_date',
               existing_type=sa.DATE(),
               nullable=False)
    op.alter_column('orders', 'final_price',
               existing_type=mysql.DECIMAL(precision=10, scale=2),
               nullable=False)
    op.alter_column('orders', 'start_price',
               existing_type=mysql.DECIMAL(precision=10, scale=2),
               nullable=False)
    op.alter_column('orders', 'updated_date',
               existing_type=sa.DATE(),
               nullable=False)
    op.drop_column('orders', 'payment_date')
    # ### end Alembic commands ###
