
#resource "google_cloud_run_service" "cloud_run_service" {
#  name     = var.service_name
#  location = var.region
#
#  template {
#    spec {
#      containers {
#        image = var.image
#      }
#    }
#  }
#
#  traffic {
#    percent         = 100
#    latest_revision = true
#  }
#}

#output "cloud_run_url" {
#  value = google_cloud_run_service.cloud_run_service.status[0].url
#}

