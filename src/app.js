const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.send(repositories).json();
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepositorie = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepositorie);

  response.send(newRepositorie).json();
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if (!id) {
    response.status(400).json({ message: "You need to enter a repository ID" });
  }

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    response.status(400).json({ message: "Project not found!" });
  }

  const updatedRepo = {
    ...repositories[repoIndex],
    title,
    url,
    techs,
  };

  repositories[repoIndex] = updatedRepo;

  response.json(updatedRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    response.status(400).json({ message: "Project not found!" });
  }

  repositories.splice(repoIndex, 1);
  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    response.status(400).json({ message: "Project not found!" });
  }

  const repoUpdated = {
    ...repositories[repoIndex],
    likes: repositories[repoIndex].likes + 1,
  };

  repositories[repoIndex] = repoUpdated;

  response.json(repoUpdated);
});

module.exports = app;
