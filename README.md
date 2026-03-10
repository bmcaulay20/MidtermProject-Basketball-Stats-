# MidtermProject-Basketball-Stats-
Makes a table where you can add and edit stats from made up players. 
This table can be used to input real player stats, make up stats, or input your own stats if you play pickup basketball.

#main.py code:
from typing import Annotated

from fastapi import APIRouter, FastAPI, HTTPException, Path

from fastapi.responses import FileResponse

from fastapi.staticfiles import StaticFiles

from app_routes import app_router

app = FastAPI(title="Todo Items App", version="1.0.0")


@app.get("/")
async def home():
    return FileResponse("./frontend/index.html")


app.include_router(app_router, tags=["basketballstats"], prefix="/basketballstats")

basketballtodo.py code:
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

app_routes.py code:
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

app.mount("/", StaticFiles(directory="frontend"), name="static")

style.css code:

  /*Global*/

body {
    background: #eef1f5;
    font-family: "Inter", sans-serif;
    padding-top: 30px;
    color: #2d3748;
}

/* Centered app container */
#app-box {
    max-width: 850px;
    margin: 0 auto;
    background: #ffffff;
    padding: 30px 35px;
    border-radius: 14px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
}

/* Title */
#app-box h2 {
    font-weight: 700;
    font-size: 28px;
    margin-bottom: 15px;
    text-align: center;
    color: #1a202c;
}

   /*Buttons*/

button {
    font-weight: 600;
    border-radius: 8px !important;
    padding: 10px 18px !important;
    font-size: 15px;
    letter-spacing: 0.3px;
}

/* Primary action (Add, Update) */
.btn-primary,
.btn-warning {
    background-color: #2563eb !important;   /* bright blue */
    border: none !important;
    color: white !important;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    transition: 0.2s ease;
}

.btn-primary:hover,
.btn-warning:hover {
    background-color: #1e4fcf !important;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
}

/* Secondary action (Close) */
.btn-secondary {
    background-color: #e2e8f0 !important;   /* soft gray */
    color: #1a202c !important;
    border: none !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-secondary:hover {
    background-color: #cbd5e0 !important;
}

/* Add spacing between modal buttons */
.modal-footer button {
    margin-left: 8px;
}

   /*Table*/

.table {
    border-radius: 10px;
    overflow: hidden;
    background: white;
}

.table thead {
    background: #4a5568;
    color: white;
}

.table-striped tbody tr:nth-child(odd) {
    background: #f7fafc;
}

.table-striped tbody tr:hover {
    background: #edf2f7;
}

/* Make sure modals never appear until triggered */
.modal {
    display: none;
}

/* Bootstrap will override display:none when opened */
.modal.show {
    display: block;
}

/* Prevent overlapping content */
.modal-dialog {
    margin-top: 80px;
}

/* Clean, readable modal header */
.modal-header {
    background: #f8fafc;
    color: #1a202c;
    border-bottom: 1px solid #e2e8f0;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.modal-title {
    font-size: 20px;
    font-weight: 700;
}

/* Modal body spacing */
.modal-body {
    padding: 20px 24px;
}

/* Modal footer */
.modal-footer {
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    padding-bottom: 5px;
    padding-top: 5px;
}
/* Form controls */
.form-control {
    border-radius: 6px;
    padding: 10px;
    border: 1px solid #cbd5e0;
}

.form-control:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74,144,226,0.2);
}

.form-label {
    font-weight: 600;
    color: #2d3748;
}

/* Error messages */
#msg, #msgEdit {
    font-size: 14px;
    margin-top: 5px;
    color: #e53e3e;
}

/* Responsive adjustments */
@media (max-width: 600px) {
    #app-box {
        padding: 20px;
    }

    #openNewModal {
        width: 100%;
    }
}

script.js code:
const API_URL = "/basketballstats";

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("player-body");
    const addBtn = document.getElementById("add-btn");
    const closeAddBtn = document.getElementById("close-add-modal");
    const closeEditBtn = document.getElementById("close-edit-modal");

    const msgAdd = document.getElementById("msg");
    const msgEdit = document.getElementById("msgEdit");

    // Clear add-player error when typing
    ["name", "team", "points", "rebounds", "assists"].forEach(id => {
        document.getElementById(id).addEventListener("input", () => {
            document.getElementById("msg").textContent = "";
        });
    });

    // Clear edit-player error when typing
    ["edit-name", "edit-team", "edit-points", "edit-rebounds", "edit-assists"].forEach(id => {
        document.getElementById(id).addEventListener("input", () => {
            document.getElementById("msgEdit").textContent = "";
        });
    });

    //Load Players
    async function loadPlayers() {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) {
                console.error("Failed to load players:", await res.text());
                return;
            }
            const players = await res.json();
            renderPlayers(players);
        } catch (err) {
            console.error("Error loading players:", err);
        }
    }

    function renderPlayers(players) {
        tableBody.innerHTML = "";
        players.forEach((p) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.name}</td>
                <td>${p.team}</td>
                <td>${p.points}</td>
                <td>${p.rebounds}</td>
                <td>${p.assists}</td>
                <td>
                    <button class="btn btn-warning btn-sm" data-action="edit" data-id="${p.id}">Edit</button>
                    <button class="btn btn-danger btn-sm" data-action="delete" data-id="${p.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    //Add Player
    addBtn.addEventListener("click", async () => {
        const name = document.getElementById("name").value.trim();
        const team = document.getElementById("team").value.trim();
        const points = parseFloat(document.getElementById("points").value);
        const rebounds = parseFloat(document.getElementById("rebounds").value);
        const assists = parseFloat(document.getElementById("assists").value);

        if (!name || !team || isNaN(points) || isNaN(rebounds) || isNaN(assists)) {
            msgAdd.textContent = "All fields must be filled out with valid values.";
            return;
        }

        msgAdd.textContent = "";

        const body = { name, team, points, rebounds, assists };

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                // clear inputs
                document.getElementById("name").value = "";
                document.getElementById("team").value = "";
                document.getElementById("points").value = "";
                document.getElementById("rebounds").value = "";
                document.getElementById("assists").value = "";

                closeAddBtn.click();
                await loadPlayers();
            } else {
                console.error("Failed to add player:", await res.text());
                msgAdd.textContent = "Failed to add player.";
            }
        } catch (err) {
            console.error("Error adding player:", err);
            msgAdd.textContent = "Error adding player.";
        }
    });

    // Table buttons
    tableBody.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if (!id) return;

        if (action === "edit") {
            openEdit(parseInt(id, 10));
        } else if (action === "delete") {
            deletePlayer(parseInt(id, 10));
        }
    });

    //Open Edit Modal
    async function openEdit(id) {
        msgEdit.textContent = "";

        try {
            const res = await fetch(`${API_URL}/${id}`);
            if (!res.ok) {
                console.error("Failed to fetch player:", await res.text());
                msgEdit.textContent = "Failed to load player.";
                return;
            }
            const player = await res.json();

            document.getElementById("edit-name").value = player.name ?? "";
            document.getElementById("edit-team").value = player.team ?? "";
            document.getElementById("edit-points").value = player.points ?? "";
            document.getElementById("edit-rebounds").value = player.rebounds ?? "";
            document.getElementById("edit-assists").value = player.assists ?? "";

            const modalEl = document.getElementById("modal-edit");
            const modal = new bootstrap.Modal(modalEl);
            modal.show();

            const editBtn = document.getElementById("edit-btn");
            editBtn.onclick = async () => {
                const body = {
                    name: document.getElementById("edit-name").value.trim(),
                    team: document.getElementById("edit-team").value.trim(),
                    points: parseFloat(document.getElementById("edit-points").value),
                    rebounds: parseFloat(document.getElementById("edit-rebounds").value),
                    assists: parseFloat(document.getElementById("edit-assists").value),
                };

                if (!body.name || !body.team || isNaN(body.points) || isNaN(body.rebounds) || isNaN(body.assists)) {
                    msgEdit.textContent = "All fields must be filled out with valid values.";
                    return;
                }

                try {
                    const res = await fetch(`${API_URL}/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                    });

                    if (res.ok) {
                        msgEdit.textContent = "";
                        closeEditBtn.click();
                        await loadPlayers();
                    } else {
                        console.error("Failed to update player:", await res.text());
                        msgEdit.textContent = "Failed to update player.";
                    }
                } catch (err) {
                    console.error("Error updating player:", err);
                    msgEdit.textContent = "Error updating player.";
                }
            };
        } catch (err) {
            console.error("Error loading player:", err);
            msgEdit.textContent = "Error loading player.";
        }
    }

    // Delete Player
    async function deletePlayer(id) {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!res.ok) {
                console.error("Failed to delete player:", await res.text());
            }
            await loadPlayers();
        } catch (err) {
            console.error("Error deleting player:", err);
        }
    }

    // initial load
    loadPlayers();
});
index.html code: 
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Basketball Player Stats</title>
        <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
            crossorigin="anonymous"
        />
        <link rel="stylesheet" href="style.css" />
        <link rel="icon" href="favicon.ico" type="image/x-icon" />
    </head>
    <body class ="py-4">
        <div class = "app mx-auto">
        </div>
        <div id="app-box">
            <h2>Basketball Player Stats</h2>

            <button
                id="openNewModal"
                data-bs-toggle="modal"
                data-bs-target="#modal-add"
            >
                Add New Player
            </button>

            <table class="table table-striped" id="player-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Team</th>
                        <th>Points</th>
                        <th>Rebounds</th>
                        <th>Assists</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="player-body"></tbody>
            </table>
        </div>
        <!-- Add Player Modal -->
        <div class="modal fade" id="modal-add" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"> Add Player</h5>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Name</label>
                            <input type="text" class="form-control" id="name" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Team</label>
                            <input type="text" class="form-control" id="team" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Points</label>
                            <input type="number" class="form-control" id="points" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Rebounds</label>
                            <input type="number" class="form-control" id="rebounds" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Assists</label>
                            <input type="number" class="form-control" id="assists" />
                        </div>
                        <div class="text-danger" id="msg"></div>
                        </div>
                        <div class="modal-footer">
                            <button id="close-add-modal" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button id="add-btn" type="button" class="btn btn-primary">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Edit Player Modal -->
        <div class="modal fade" id="modal-edit" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Player</h5>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Name</label>
                            <input type="text" class="form-control" id="edit-name" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Team</label>
                            <input type="text" class="form-control" id="edit-team" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Points</label>
                            <input type="number" class="form-control" id="edit-points" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Rebounds</label>
                            <input type="number" class="form-control" id="edit-rebounds" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Assists</label>
                            <input type="number" class="form-control" id="edit-assists" />
                        </div>
                        <div class="text-danger" id="msgEdit"></div>
                    </div>
                    <div class="modal-footer">
                        <button id="close-edit-modal" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button id="edit-btn" type="button" class="btn btn-warning">Update</button>
                    </div>
                </div>
            </div>
        </div>
        <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
            crossorigin="anonymous"
        ></script>
        <script src="script.js"></script>
    </body>
</html>


How the app opens:
<img width="1401" height="332" alt="image" src="https://github.com/user-attachments/assets/f0f22233-4eb2-46f4-b446-09101d5d8abf" />

Adding a player:
<img width="1697" height="957" alt="image" src="https://github.com/user-attachments/assets/b46203c7-4963-4f1b-96f4-3b35443f8d5c" />

Editing a player:
<img width="1670" height="964" alt="image" src="https://github.com/user-attachments/assets/b002c1a0-3be6-4fe0-a0c1-7e7fa622e324" />

Table with more elements:
<img width="1451" height="670" alt="image" src="https://github.com/user-attachments/assets/4367ed71-65f1-477c-a479-a2f9f11f9979" />
