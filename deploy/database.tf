data "mongodbatlas_roles_org_id" "org" {
}

resource "mongodbatlas_project" "project" {
  name   = var.project_id
  org_id = data.mongodbatlas_roles_org_id.org.org_id
}

resource "mongodbatlas_serverless_instance" "db" {
  project_id   = mongodbatlas_project.project.id
  name         = "Adler40"

  provider_settings_backing_provider_name = "GCP"
  provider_settings_provider_name = "SERVERLESS"
  provider_settings_region_name = var.atlas_region
}

resource "random_string" "password" {
  length   = 24            # Length of the string
  special  = true         # Whether to include special characters
  upper    = true          # Include uppercase letters
  lower    = true          # Include lowercase letters
  numeric  = true          # Include numbers
}

resource "mongodbatlas_database_user" "app" {
  project_id         = mongodbatlas_project.project.id
  auth_database_name = "admin"
  username = "app"
  password = random_string.password.result
  roles {
    role_name     = "readWriteAnyDatabase"
    database_name = "admin"
  }
}

output "mongodb_connection_string" {
  value = mongodbatlas_serverless_instance.db.connection_strings_standard_srv
}