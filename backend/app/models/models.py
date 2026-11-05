from typing import Optional
import datetime
import decimal
import enum

from sqlalchemy import DECIMAL, DateTime, Enum, ForeignKeyConstraint, Index, String, text
from sqlalchemy.dialects.mysql import INTEGER
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class Users(Base):
    __tablename__ = 'users'
    __table_args__ = (
        Index('email', 'email', unique=True),
        Index('username', 'username', unique=True)
    )

    id: Mapped[int] = mapped_column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    transactions: Mapped[list['Transactions']] = relationship('Transactions', back_populates='user')


class Transactions(Base):
    __tablename__ = 'transactions'
    __table_args__ = (
        ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE', name='transactions_ibfk_1'),
        Index('transactions_index_0', 'user_id', 'transaction_date')
    )

    id: Mapped[int] = mapped_column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(INTEGER(unsigned=True), nullable=False)
    amount: Mapped[decimal.Decimal] = mapped_column(DECIMAL(12, 2), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    transaction_date: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    description: Mapped[Optional[str]] = mapped_column(String(255))

    user: Mapped['Users'] = relationship('Users', back_populates='transactions')
