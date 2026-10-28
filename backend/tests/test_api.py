from tests.conftest import TWO_SUM

MISSING_ID = "507f1f77bcf86cd799439011"


def test_root(client):
    assert client.get("/").json() == {"message": "Interview Prep Tracker API"}


def test_create_returns_question_with_id_and_defaults(created):
    assert len(created["id"]) == 24
    assert created["title"] == "Two Sum"
    assert created["status"] == "Not Started"
    assert created["solution"] is None


def test_create_requires_title(client):
    question = {key: value for key, value in TWO_SUM.items() if key != "title"}

    assert client.post("/questions", json=question).status_code == 422


def test_list_returns_created_questions(client, created):
    assert [question["id"] for question in client.get("/questions").json()] == [created["id"]]


def test_marking_solved_sets_date_solved(client, created):
    updated = client.put(f"/questions/{created['id']}", json={"status": "Solved"}).json()

    assert updated["status"] == "Solved"
    assert updated["date_solved"] is not None


def test_update_with_unchanged_values_still_succeeds(client, created):
    response = client.put(f"/questions/{created['id']}", json={"title": "Two Sum"})

    assert response.status_code == 200


def test_update_missing_question_returns_404(client):
    assert client.put(f"/questions/{MISSING_ID}", json={"title": "x"}).status_code == 404


def test_invalid_id_returns_400(client):
    assert client.put("/questions/not-an-id", json={"title": "x"}).status_code == 400
    assert client.delete("/questions/not-an-id").status_code == 400


def test_delete_removes_question(client, created):
    assert client.delete(f"/questions/{created['id']}").status_code == 200
    assert client.delete(f"/questions/{created['id']}").status_code == 404
    assert client.get("/questions").json() == []


def test_stats_group_by_status_category_and_difficulty(client, created):
    client.put(f"/questions/{created['id']}", json={"status": "Solved"})
    client.post("/questions", json={**TWO_SUM, "title": "3Sum", "difficulty": "Medium"})

    stats = client.get("/stats").json()

    assert (stats["total"], stats["solved"], stats["not_started"]) == (2, 1, 1)
    assert stats["by_category"] == [{"category": "Array", "count": 2}]
    assert sorted(group["difficulty"] for group in stats["by_difficulty"]) == ["Easy", "Medium"]
