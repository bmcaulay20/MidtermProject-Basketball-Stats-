from pydantic import BaseModel


class Player(BaseModel):
    id: int
    name: str
    team: str
    points: float
    rebounds: float
    assists: float


class PlayerRequest(BaseModel):
    name: str
    team: str
    points: float
    rebounds: float
    assists: float