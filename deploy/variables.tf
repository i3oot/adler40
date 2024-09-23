variable "project_id" {
  type = string
  description = "The GCP project ID"
}

variable "region" {
  type    = string
  default = "us-central1"
}

variable "service_name" {
  type        = string
  description = "Cloud Run service name"
}

variable "image" {
  type        = string
  description = "The Docker image to deploy to Cloud Run"
}

variable "repo_name" {
  type        = string
  description = "The name of the Artifact Registry repository"
}

variable "atlas_public_key" {
  description = "Public API key to authenticate to Atlas"
  type        = string
}

variable "atlas_private_key" {
  description = "Private API key to authenticate to Atlas"
  type        = string
}

variable "atlas_region" {
  description = "Region of the database instance"
  type        = string
}

