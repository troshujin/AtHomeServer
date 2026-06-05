from infrastructure.database.models._base import Base


class User(Base):
    __tablename__: str = "users"
