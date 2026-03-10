from typing import Annotated

from fastapi import APIRouter, HTTPException, Path, status

from basketballtodo import Player, PlayerRequest


app_router = APIRouter()

app_list: list[Player] = []
global_id = 0


@app_router.get("")
async def get_all_players() -> list[Player]:
    return app_list


@app_router.post("", status_code=201)
async def create_new_player(player: PlayerRequest) -> Player:
    global global_id

    # Check if name already exists in the main list
    for p in app_list:
        if p.name.lower() == player.name.lower():
            raise HTTPException(
                status_code=400,
                detail=f"Player '{player.name}' already exists. Delete them first before adding again."
            )

    # Add new player normally
    global_id += 1
    new_player = Player(
        id=global_id,
        name=player.name,
        team=player.team,
        points=player.points,
        rebounds=player.rebounds,
        assists=player.assists,
    )

    app_list.append(new_player)
    return new_player


@app_router.put("/{id}")
async def edit_player_by_id(
    id: Annotated[int, Path(gt=0, le=1000)], player: PlayerRequest
) -> Player:
    for x in app_list:
        if x.id == id:
            x.name = player.name
            x.team = player.team
            x.points = player.points
            x.rebounds = player.rebounds
            x.assists = player.assists
            return x

    raise HTTPException(status_code=404, detail=f"Player with ID={id} is not found.")


@app_router.get("/{id}")
async def get_player_by_id(id: Annotated[int, Path(gt=0, le=1000)]) -> Player:
    for x in app_list:
        if x.id == id:
            return x

    raise HTTPException(status_code=404, detail=f"Player with ID={id} is not found.")


@app_router.delete("/{id}")
async def delete_player_by_id(
    id: Annotated[
        int,
        Path(
            gt=0,
            le=1000,
            title="This is the ID for the desired Player to be deleted",
        ),
    ],
) -> dict:
    for i in range(len(app_list)):
        p = app_list[i]
        if p.id == id:
            app_list.pop(i)
            return {"msg": f"The player with ID={id} is deleted."}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail=f"Player with ID={id} is not found."
    )