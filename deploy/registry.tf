resource "google_artifact_registry_repository" "registry" {
  provider = google
  location = var.region
  repository_id = var.repo_name

  description = "A Docker container registry for Adler40"
  format = "DOCKER"
}
