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