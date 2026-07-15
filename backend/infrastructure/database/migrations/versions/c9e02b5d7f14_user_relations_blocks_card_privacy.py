"""user relations, blocked users, card privacy

The user_relation and blocked_user models landed without a migration - this
creates their tables, plus the user.card_is_private flag for profile cards.

Revision ID: c9e02b5d7f14
Revises: a41c77d20e58
Create Date: 2026-07-15 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'c9e02b5d7f14'
down_revision: Union[str, Sequence[str], None] = 'a41c77d20e58'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('user_relation',
    sa.Column('status', sa.Enum('REQUESTED', 'ACCEPTED', name='userrelationstatus'), nullable=False),
    sa.Column('user_id_one', sa.UUID(), nullable=False),
    sa.Column('user_id_two', sa.UUID(), nullable=False),
    sa.Column('requested_by_id', sa.UUID(), nullable=False),
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    sa.CheckConstraint('requested_by_id = user_id_one OR requested_by_id = user_id_two', name='ck_user_relation_requester_is_party'),
    sa.CheckConstraint('user_id_one < user_id_two', name='ck_user_relation_pair_order'),
    sa.ForeignKeyConstraint(['requested_by_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['user_id_one'], ['user.id'], ),
    sa.ForeignKeyConstraint(['user_id_two'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_id_one', 'user_id_two', name='uq_user_relation_pair')
    )
    op.create_table('blocked_user',
    sa.Column('user_id', sa.UUID(), nullable=False),
    sa.Column('target_user_id', sa.UUID(), nullable=False),
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    sa.CheckConstraint('user_id != target_user_id', name='ck_blocked_user_not_self'),
    sa.ForeignKeyConstraint(['target_user_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_id', 'target_user_id', name='uq_blocked_user_pair')
    )
    op.add_column('user', sa.Column('card_is_private', sa.Boolean(), nullable=False, server_default=sa.false()))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('user', 'card_is_private')
    op.drop_table('blocked_user')
    op.drop_table('user_relation')
    sa.Enum(name='userrelationstatus').drop(op.get_bind(), checkfirst=True)
